import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Configuration } from 'shared/interfaces'
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Confirm, Toast } from 'shared/alerts';


@Component({
  selector: 'app-configuration-system',
  templateUrl: './configuration-system.component.html',
  styleUrls: ['./configuration-system.component.scss']
})
export class ConfigurationSystemComponent implements OnInit {
  configuration: Configuration
  btn_color: string
  btn_color_back: string
  btn_color_outline: string
  btn_color_outline_back: string


  functions = {
    LoginBanner: (e: any) => {
      this.configuration.image_bannerlogin = e.target.result! as string
      this.resizeImage(this.configuration.image_bannerlogin)
    },
    SidebarLogo: (e: any) => {
      this.configuration.image_sidebarlogo = e.target.result! as string
      this.resizeImage(this.configuration.image_sidebarlogo)
    },
    HeaderLogo: (e: any) => {
      this.configuration.image_headerlogo = e.target.result! as string
      this.resizeImage(this.configuration.image_headerlogo)
    },
    LoginLogo: (e: any) => {
      this.configuration.image_login = e.target.result! as string
      this.resizeImage(this.configuration.image_login)
    },
    ReportLogo: (e: any) => {
      this.configuration.image_report = e.target.result! as string
      this.resizeImage(this.configuration.image_report)
    },
  }
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService
  ) {
    this.configuration = this.configurationService.configurationObject
    this.btn_color = this.configuration.primary_color
    this.btn_color_back = this.configuration.primary_color
    this.btn_color_outline = this.configuration.search_primary_color
    this.btn_color_outline_back = this.configuration.search_primary_color_back
  }

  ngOnInit(): void {
  }


  onFileSelected(e: any, type: 'LoginBanner' | 'SidebarLogo' | 'HeaderLogo' | 'LoginLogo' | 'ReportLogo') {
    const selectedImage = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.functions[type](e)

    };
    reader.readAsDataURL(selectedImage);
  }

  resizeImage(base64: string) {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const MAX_WIDTH = 1600;
      const MAX_HEIGHT = 1200;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/png');
      base64 = dataUrl
    };
  }

  save() {
    Confirm.fire({
      title: '¿Esta seguro que desea guardar la configuración?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then(result => {
      if (result.value) {
        this.configurationService.updateConfiguration(this.configuration).subscribe(response => {
          Toast.fire({
            icon: 'success',
            title: 'Configuración guardada correctamente',
          });
          localStorage.setItem('configuration', JSON.stringify(this.configuration))
        },
          error => {
            Toast.fire({
              icon: 'error',
              title: 'Error al guardar la configuración'
            });
          }
        )
      }
    })
  }

  cancel() {
    this.configuration = this.configurationService.configurationObject
  }

}
