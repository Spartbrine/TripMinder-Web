import { Injectable } from '@angular/core';
import { MessageService } from '../@pages/components/message/message.service';

@Injectable({
   providedIn: 'root'
})

export class ToastService {
   toastError = 'toastError.svg';
   toastSuccess = 'toastSuccess.svg';

   constructor(
      private notificationService: MessageService) {
   }

   public showNotification(
      type: 'success' | 'danger' | 'default' | 'warning',
      content: string,
      title: string,
      imageName?: string,
      duration = 3000
   ) {
      return this.notificationService.create(type, content, {
         Title: title,
         imgURL: imageName ? `assets/img/${imageName}` : `assets/img/${this.findImageToast(type)}`,
         Position: 'top-right',
         Style: 'circle',
         Duration: duration
      });
   }

   public removeNotification(id: string) {
      return this.notificationService.remove(id);
   }

   private findImageToast(type: 'success' | 'danger' | 'default' | 'warning') {
      switch (type) {
         case 'success':
            return 'toastSuccess.svg';
         case 'danger':
            return 'toastError.svg';
         case 'warning':
         case 'default':
            return 'loadingCECyTEC.svg';
      }
   }
}
