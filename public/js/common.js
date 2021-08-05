function pagereload(latencyms) {
  if (latencyms === undefined)
    window.location.reload();
  else
    setTimeout(function () { pagereload(undefined); }, latencyms);
}

function divreload(element, onready, latencyms) {
  if (latencyms === undefined)
    $('#' + element).load(window.location.href + ' #' + element + " > *", function () {
      if (onready)
        onready();
    });
  else
    setTimeout(function () { divreload(element, onready, undefined); }, latencyms);
}

// function showconfirmdialog(message, operation, onclick) {
//   Swal.fire({
//     title: 'Are you sure?',
//     text: message,
//     icon: 'question',
//     showCancelButton: true,
//     confirmButtonColor: 'red',
//     confirmButtonText: operation,
//   })
//     .then((result) => { if (result.value) onclick(result.value) });
// }

// function showconfirmdeletedialog(message, onclick) {
//   showconfirmdialog(message, "Delete", onclick);
// }

var elem = document.documentElement;
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})
const ToastSuccess = Toast.mixin({
  icon: 'success',
  timer: 1500,
})
const ToastError = Toast.mixin({ icon: 'error' })
const ToastWarning = Toast.mixin({ icon: 'warning' })
const ToastInfo = Toast.mixin({ icon: 'info' })

function initContextMenus(selector) {
  $(function () {
    $('body').on('contextmenu', selector, function (e) {
      $('.context-menu').hide();

      const menu = $(e.currentTarget).find('.context-menu')
      if (menu.length) {
        $(menu[0]).css({
          display: "block",
          left: e.offsetX,
          top: e.offsetY
        });
      }
      return false
    });
  })
}

if (window.jQuery)
  $(function () {
    $('html').click(function () {
      $('.context-menu').hide();
    });

    $('html').contextmenu(function () {
      $('.context-menu').hide();
      return false
    });
  })
