//SWEETALERT2
import Swal from 'sweetalert2';


export const successAlert = (text) => {
    Swal.fire({
        icon: 'success',
        title: `<p>${text}!</p>`,
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true
    });
}


export const errorAlert = (text, error) => {
    Swal.fire({
        icon: 'error',
        title: `<p>Can't ${text}!</p>`,
        text: `${error}`,
        confirmButtonText: 'Retry'
    });
}