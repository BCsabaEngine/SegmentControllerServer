var socket = null;

function socket_open() {
  socket = null;

  try {
    var wsproto = (location.protocol == 'https:') ? 'wss:' : 'ws:';
    socket = new WebSocket(wsproto + '//' + location.host + '/ws');

    socket.onopen = function (event) {
      setTimeout(function () { socket.send('hello') }, 75);
      if (window.jQuery)
        $('.ws-indicator').addClass('online');

      if (typeof ws_channels !== 'undefined')
        setTimeout(function () {
          for (const key of Object.keys(ws_channels))
            socket.send(JSON.stringify({ command: 'subscribe', channel: key }));
        }, 150);
    };

    socket.onclose = function (event) {
      if (window.jQuery)
        $('.ws-indicator').removeClass('online');
      setTimeout(function () { socket_open(); }, 5000);
    };

    var timeout = null;
    socket.onmessage = function (event) {
      try {
        json = JSON.tryParse(event.data);
        if (json)
          if (typeof ws_channels !== 'undefined')
            for (const [key, value] of Object.entries(ws_channels))
              if (key == json.channel)
                if (typeof value === 'function') {
                  delete json.channel;
                  setTimeout(function () { value(json); }, 1);
                }
      }
      catch (ex) { }
    };
  }
  catch (ex) { }
}

function socket_send(msg) {
  try {
    if (socket && socket.readyState == 1) {
      socket.send(msg);
      return true;
    }
  }
  catch (ex) { }

  return false;
}

$(function () { if ("WebSocket" in window) socket_open(); });
