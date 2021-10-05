const EventEmitter = require('events')
const dgram = require('dgram')
const cpp = require('./panels/cppConst')

// eslint-disable-next-line unicorn/numeric-separators-style
const UDP_PORT = 41016
const BROADCAST_IP = '255.255.255.255'
const BROADCAST_NODEID = 0xFF

class WifiHandler extends EventEmitter {
    transmitstat = {
        startDate: Date.now(),
        receiveCount: 0,
        receiveSize: 0,
        sendCount: 0,
        sendSize: 0,
        receiveCountPerMin() { return Math.round(this.receiveCount / ((Date.now() - this.startDate) / 1000) * 60) },
        receiveSizePerMin() { return Math.round(this.receiveSize / ((Date.now() - this.startDate) / 1000) * 60) },
    }
    getStat() { return this.transmitstat }

    sendLivePacketToAll() {
        setImmediate(() => this.emit('reset'))
        const buffer = Buffer.alloc(cpp.SrvCom_Sys_Control_WiFi_LivePacket.getSize())
        cpp.SrvCom_Sys_Control_WiFi_LivePacket.encode(buffer, 0,
            {
                address: 0,
                command: cpp.SRVCOM_SYS_CONTROL_WIFI_LIVEPACKET,
            })
        this.send(BROADCAST_NODEID, null, buffer)
        logger.debug('[WiFi] Live packet sent')
    }

    client = null
    async send(toNode, ip, data) {

        if (!toNode) toNode = BROADCAST_NODEID

        if (!this.client || !this.client.maxUsage) {
            this.client = dgram.createSocket('udp4')
            if (!ip)
                this.client.bind(() => this.client.setBroadcast(true))

            this.client.maxUsage = 5
            this.client.registerUse = function () { --this.maxUsage }.bind(this.client)
        }

        const udpPacket = Buffer.concat([
            Buffer.from('Segm'),
            Buffer.from([0]),
            Buffer.from([toNode]),
            Buffer.from([data.length]),
            data,
        ])

        await this.client.send(
            udpPacket, 0, udpPacket.length,
            UDP_PORT,
            ip ? ip : BROADCAST_IP,
            () => {
                this.client.registerUse()

                if (cmdline['debug-wifi']) {
                    let bvalue = []
                    for (const value of data)
                        bvalue.push(value.toString(16))
                    logger.debug(`[WiFi] Data sent to IP:${ip ? ip : BROADCAST_IP} to:${toNode} data:${bvalue}`)
                }
            }
        )
    }

    server = null
    StartServer() {
        this.server = dgram.createSocket('udp4')

        this.server.on('close', function () {
            logger.debug('[WiFi] Server closed')
            this.server = null
        }.bind(this))

        this.server.on('error', function (error) {
            logger.debug('[WiFi] Server error: ' + error)
            this.server.close()
        }.bind(this))

        this.server.on('listening', function () {
            var address = this.server.address()
            logger.debug(`[WiFi] Server started on port ${address.address}:${address.port}`)

            setTimeout(function () {
                this.sendLivePacketToAll()
            }.bind(this), 2000)
        }.bind(this))

        this.server.on('message', function (message, info) {

            if (message.length < 7) {
                logger.debug(`[WiFi] Invalid packet size (${message.length}) from ${info.address}`)
                return
            }

            const header = message.toString('utf8', 0, 4)
            if (header !== 'Segm') {
                logger.debug(`[WiFi] Invalid packet header (${header}) from ${info.address}`)
                return
            }

            const from = message.readUInt8(4)
            const to = message.readUInt8(5)
            const size = message.readUInt8(6)
            if (message.length < 7 + size) {
                logger.debug(`[WiFi] Invalid packet size (${message.length} < ${7 + size}) from ${info.address}`)
                return
            }

            const data = message.slice(7, 7 + size)

            this.transmitstat.receiveCount += 1
            this.transmitstat.receiveSize += data.length

            if (cmdline['debug-wifi']) {
                let bvalue = []
                for (const value of data)
                    bvalue.push(value.toString(16))
                logger.debug(`[WiFi] Data IP:${info.address} from:${from} to:${to} data:${bvalue}`)
            }

            this.emit('receive', from, info.address, data)
        }.bind(this))

        this.server.bind(UDP_PORT)
    }
}

const wifihandler = new WifiHandler()

if (config.wifi.enabled) {
    wifihandler.StartServer()

    setInterval(() => {
        if (!wifihandler.server)
            wifihandler.StartServer()
    }, 1000)
}

module.exports = wifihandler
