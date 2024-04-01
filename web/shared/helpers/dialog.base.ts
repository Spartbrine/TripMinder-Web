import { MatDialogRef } from '@angular/material/dialog';
import { Confirm } from 'shared/alerts';

export abstract class DialogBase {
  constructor(private dialog: MatDialogRef<any>) {}

  public onCancel(confirm: boolean = true) {
    if (confirm) {
      const messagetitle = '¿Esta usted seguro?';
      const messagetext = 'Los datos se perderán con esta acción';
      const confirmBtnText = 'Aceptar';
      const cancelBtnText = 'Cancelar';
      Confirm.fire({
        title: messagetitle,
        text: messagetext,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: confirmBtnText,
        cancelButtonText: cancelBtnText,
        reverseButtons: true,
      }).then(result => {
        if (result.value) {
          this.dialog.close();
        }
      });
    } else {
      this.dialog.close();
    }
  }
}
