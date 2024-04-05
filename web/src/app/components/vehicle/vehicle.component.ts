import { Component, OnInit, Inject, NgModule } from '@angular/core';
import { DialogBase } from 'shared/helpers/dialog.base';
import { Catalog, FilterOption } from 'shared/helpers/catalog';
import {
  User,
  DialogData,
  FilterParams,
  TransportType,
  Vehicle,
  Configuration,
} from 'shared/interfaces';
import { AuthenticationService } from 'shared/services/authentication.service';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { TransportTypeService } from 'src/app/services/transport-type.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { Profile } from 'shared/constants';
import jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ConfigurationService } from 'src/app/services/configuration.service'
@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent
  extends Catalog<Vehicle, VehicleDialogComponent>
  implements OnInit {
  params: FilterParams<Vehicle>;
  filterOptions: FilterOption<Vehicle>[];
  selectedOption: keyof Vehicle | any;
  transportTypes: TransportType[];
  declare configuration: Configuration
  constructor(
    public service: VehicleService,
    public auth: AuthenticationService,
    public transportTypeService: TransportTypeService,
    public dialog: MatDialog,
    public configurationService: ConfigurationService
  ) {
    super(service, auth, dialog,configurationService);
    this.configuration = configurationService.configurationObject
    this.params = {
      limit: 15,
      orderBy: {
        field: 'id',
        order: 'desc'
      }
    };

    this.filterOptions = [
      {
        label: 'Tipo Transporte',
        property: 'id_transport_type',
      },
      {
        label: 'Nro. Económico',
        property: 'economic_number',
      },
      {
        label: 'Nro. Placas',
        property: 'plates',
      },
      {
        label: 'Marca',
        property: 'brand',
      },
      {
        label: 'Color',
        property: 'color',
      },
    ];
    this.selectedOption = 'id_transport_type';
  }

  hideColorPicker: boolean = true;
  hideTextInput: boolean = true;
  colorPalette: Array<any> = [
    '#FFFFFF',
    '#FDC12D',
    '#FF8927',
    '#D3370F',
    '#F05DA4',
    '#8600C7',
    '#A1B00D',
    '#1B5ECF',
    '#934409',
    '#A3A5A4',
    '#000000',
  ];

  protected validateExtras(result: Vehicle) {
    result.updated_at = new Date().toDateString();
    return result;
  }

  protected getIdFrom(result: Vehicle): number {
    return result.id;
  }

  protected search(id?: number): Vehicle {
    return this.entities.find(e => e.id == id);
  }

  protected getRefDialog(dialogData: DialogData<Vehicle, any>) {
    return this.dialog.open(VehicleDialogComponent, {
      width: '80%',
      data: dialogData,
      disableClose: true,
      panelClass: '',
    });
  }

  getProfileName(key: number) {
    switch (key) {
      case Profile.ADMIN:
        return 'Administrador';
    }
  }

  protected restore(): void {
    this.entity = {
      id: 0,
      id_transport_type: null,
      economic_number: null,
      num_license: null,
      plates: null,
      brand: null,
      modelo: null,
      year: null,
      color: '#ffffff',
      insurance_carrier: null,
      insurance_policy: null,
      km_x_liter: 0,
      capacity: 0,
      created_at: new Date().toDateString(),
      updated_at: new Date().toDateString(),
    };
  }

  ngOnInit() {
    this.auth.checkPermission('/vehicles')
    this.logged =
      typeof this.auth.currentUserValue === 'string' &&
      this.auth.currentUserValue !== '';

    this.user = JSON.parse(localStorage.getItem('user')) as User;
    //Llenamos la lista
    this.transportTypeService
      .list()
      .subscribe(response => (this.transportTypes = response.data.data));

    this.restore();
    this.reload(false, this.params);
  }

  searchTypes(text: string) {
    if (text.length == 0) {
      this.transportTypeService
        .list()
        .subscribe(response => (this.transportTypes = response.data.data));
    } else {
      this.transportTypeService
        .search(text)
        .subscribe(response => (this.transportTypes = response.data.data));
    }
  }

  

  changeSelected() {
    this.params['id_transport_type '] = null;
    this.params['economic_number'] = null;
    this.params['num_license'] = null;
    this.params['plates'] = null;
    this.params['brand'] = null;
    this.params['color'] = null;
  }

}

@Component({
  selector: 'app-vehicle-dialog',
  templateUrl: './vehicle-dialog.component.html',
  styleUrls: ['./vehicle.component.scss'],
})
export class VehicleDialogComponent extends DialogBase implements OnInit {
  transportTypes: TransportType[];
  constructor(
    public transportTypeService: TransportTypeService,
    public dialogRef: MatDialogRef<VehicleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<Vehicle, null>
  ) {
    super(dialogRef);
  }
  hideColorPicker: boolean = true;
  hideTextInput: boolean = true;
  colorPalette: Array<any> = [
    '#FFFFFF',
    '#FDC12D',
    '#FF8927',
    '#D3370F',
    '#F05DA4',
    '#8600C7',
    '#A1B00D',
    '#1B5ECF',
    '#934409',
    '#A3A5A4',
    '#000000',
  ];

  get readonly() {
    return this.data.options.readonly;
  }
  ngOnInit() {
    this.transportTypeService
      .list()
      .subscribe(response => (this.transportTypes = response.data.data));
   
    const { entity } = this.data;
    if (this.data.entity.color == '') {
      this.data.entity.color = '#ffffff';
    }
  }

  searchTypes(text: string) {
    if (text.length == 0) {
      this.transportTypeService
        .list()
        .subscribe(response => (this.transportTypes = response.data.data));
    } else {
      this.transportTypeService
        .search(text)
        .subscribe(response => (this.transportTypes = response.data.data));
    }
  }

}
