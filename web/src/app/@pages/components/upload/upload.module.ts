import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ProgressModule } from '../progress/progress.module';
import { pgUploadBtnComponent } from './upload-btn.component';
import { pgUploadListComponent } from './upload-list.component';
import { pgUploadComponent } from './upload.component';

@NgModule({
  imports: [CommonModule, FormsModule, TooltipModule, ProgressModule],
  declarations: [pgUploadComponent, pgUploadBtnComponent, pgUploadListComponent],
  exports: [pgUploadComponent]
})
// eslint-disable-next-line @typescript-eslint/naming-convention
export class pgUploadModule {}
