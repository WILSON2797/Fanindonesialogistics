// SweetAlert2 helper methods shared among admin components
export const swal = {
  success(title = 'Berhasil!', text = '') {
    return window.Swal.fire({
      icon: 'success',
      title,
      text,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: false,
      customClass: { popup: 'swal-popup' }
    });
  },
  error(title = 'Gagal!', text = '') {
    return window.Swal.fire({
      icon: 'error',
      title,
      text: text || 'Terjadi kesalahan. Silakan coba lagi.',
      confirmButtonText: 'Tutup',
      confirmButtonColor: 'var(--primary, #2563eb)',
      customClass: { popup: 'swal-popup' }
    });
  },
  confirm(title = 'Yakin?', text = 'Data akan dihapus secara permanen.') {
    return window.Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: 'var(--primary, #2563eb)',
      reverseButtons: true,
      customClass: { popup: 'swal-popup' }
    });
  },
  loading(title = 'Memproses...', text = 'Sedang mengunggah data, mohon tunggu.') {
    return window.Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        window.Swal.showLoading();
      },
      customClass: { popup: 'swal-popup' }
    });
  }
};
