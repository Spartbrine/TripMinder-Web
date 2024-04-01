import { Component, OnInit } from '@angular/core';
import { timeInterval } from 'rxjs/operators';
import { Confirm } from 'shared/alerts';
//import { Simpatizante } from 'shared/interfaces';
import { AuthenticationService } from 'shared/services/authentication.service';
import * as XLSX from 'xlsx';
export interface SimpatizanteToImport {
  NOMBRE: string;
  PRIMER_APELLIDO: string;
  SEGUNDO_APELLIDO: string;
  SEXO: string;
  CLAVE_ELECTOR: string;
  CODIGO_POSTAL: number;
  WHATSAPP: string;
  TELEFONO_OTRO: string;
  CALLE: string;
  NUM_EXT: string;
  NUM_INT: string;
  COLONIA: string;
  POBLACION: string;
  NIVEL_MAXIMO_DE_ESTUDIOS: string;
  CLASIFICACION: string;
  TAMAÑO_DE_PLAYERA: string;
  APODO: string;
  FACEBOOK: string;
  INSTAGRAM: string;
  TWITTER: string;
  STATUS: number;

}
@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  loadingFile: boolean;
  status: string;
  importNumber: number;
  loading: boolean;
  totalImports: number;
  arrayBuffer: ArrayBuffer;
  vMessageButton: string;
  spreadsheetKeys: string[];
  simpatizantesToShow: SimpatizanteToImport[];
  constructor(
    
    public auth: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.status = 'loading';
    this.loadingFile = true;
    this.loading = false;
  }

  loadFile(selected: any) {
    this.importNumber = 0;
    this.loadingFile = true;
    try {
      const fileReader = new FileReader();
      fileReader.onload = ((e) => {
        this.arrayBuffer = fileReader.result as ArrayBuffer;
        const data = new Uint8Array(this.arrayBuffer);
        const arr = new Array();
        for (let index = 0; index != data.length; index++) {
          arr[index] = String.fromCharCode(data[index]);
        }
        const bstr = arr.join('');
        const workbook = XLSX.read(bstr, { type: 'binary' });
        console.log(workbook.SheetNames);
        if (workbook.SheetNames.length == 1) {
          this.spreadsheetKeys = workbook.SheetNames;
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          this.simpatizantesToShow = XLSX.utils.sheet_to_json(
            worksheet, {
              raw: false,
              defval: null,
              blankrows: false,
              dateNF: 'dd/mm/yyyy'
            }) as SimpatizanteToImport[];
          this.loadingFile = false;

          this.simpatizantesToShow.forEach(sp => {
            sp.STATUS = 1;
            // try {
            //   this.service.list({
            //     NOMBRE: sp.NOMBRE,
            //     APELLIDO_PATERNO: sp.PRIMER_APELLIDO,
            //     APELLIDO_MATERNO: sp.SEGUNDO_APELLIDO
            //   }).subscribe(lst => {
            //     if (lst.entities.length > 0) {
            //       sp.STATUS = 3;
            //     } else {
            //       sp.STATUS = 2;
            //     }
            //     this.importNumber++;
            //   });
            // } catch (error) {
            //   Confirm.fire(error);
            //   console.log(error);
            // }
          });
          this.loading = true;
        }
      });
      fileReader.readAsArrayBuffer(selected.file.originFileObj);
      this.vMessageButton = 'Verificar estudiantes a importar';
    } catch (error) {
      console.log(error);
      this.loadingFile = false;
      Confirm.fire('Error', 'Hubo un error al leer el archivo', 'error');
    }
  }
  get isImportable() {
    if (this.simpatizantesToShow && this.simpatizantesToShow.length !== this.importNumber) return true;
    return false;
  }

  import() {
    this.totalImports = 0;
    this.simpatizantesToShow.forEach(simpatizante => {
      if (simpatizante.STATUS == 2)
      {
        // this.service.store(this.tosimpatizante(simpatizante)).subscribe(simp => {
        //   this.totalImports++;
        // });
      }
    });
  }

  tosimpatizante(simpatizante: SimpatizanteToImport) {
    const user = this.auth.currentUserValue;
    // const response: Simpatizante = {Id: '',
    //   user_name: user,
    //   session_id: 'import',
    //   origen: 'import',
    //   timestamp: new Date().toISOString(),
    //   NOMBRE: simpatizante.NOMBRE,
    //   APELLIDO_PATERNO: simpatizante.PRIMER_APELLIDO,
    //   APELLIDO_MATERNO: simpatizante.SEGUNDO_APELLIDO,
    //   SEXO: simpatizante.SEXO,
    //   CLAVE_ELECTOR: simpatizante.CLAVE_ELECTOR,
    //   CODIGO_POSTAL: simpatizante.CODIGO_POSTAL,
    //   celular: simpatizante.WHATSAPP,
    //   telefono: simpatizante.TELEFONO_OTRO,
    //   CALLE: simpatizante.CALLE,
    //   NUM_EXTERIOR: simpatizante.NUM_EXT,
    //   NUM_INTERIOR: simpatizante.NUM_INT,
    //   COLONIA: simpatizante.COLONIA,
    //   IdPoblacion: simpatizante.POBLACION,
    //   maximoEstudios: simpatizante.NIVEL_MAXIMO_DE_ESTUDIOS,
    //   clasificacion: simpatizante.CLASIFICACION,
    //   playera: simpatizante.TAMAÑO_DE_PLAYERA,
    //   apodo: simpatizante.APODO,
    //   facebook: simpatizante.FACEBOOK,
    //   instagram: simpatizante.INSTAGRAM,
    //   twitter: simpatizante.TWITTER
    // };
    //return response;

  }
}
