import Swal from 'sweetalert2';

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

export const Confirm = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-danger',
    cancelButton: 'btn btn-default mr-2'
  },
  buttonsStyling: false,
  showCancelButton: true,
  confirmButtonText: 'Confirmar',
  cancelButtonText: 'Cancelar',
  reverseButtons: true
});


export const SwalAlert = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-light-primary',
    cancelButton: 'btn btn-light-danger'
  },
  buttonsStyling: false
});
