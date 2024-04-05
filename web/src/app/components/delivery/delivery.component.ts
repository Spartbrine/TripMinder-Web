import { Component, OnInit, Inject, NgModule } from '@angular/core';
import { DialogBase } from 'shared/helpers/dialog.base';
import { Catalog, FilterOption } from 'shared/helpers/catalog';
import {
  User,
  DialogData,
  FilterParams,
  Point, //Este es para la relacion
  Delivery,
  Configuration,
} from 'shared/interfaces';
import { AuthenticationService } from 'shared/services/authentication.service';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PointService } from 'src/app/services/transport-type.service'; //Este es para la relacion
import { DeliveryService } from 'src/app/services/delivery.service';
import { Profile } from 'shared/constants';
import jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ConfigurationService } from 'src/app/services/configuration.service'
@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent
  extends Catalog<Delivery, DeliveryDialogComponent>
  implements OnInit {
  params: FilterParams<Delivery>;
  filterOptions: FilterOption<Delivery>[];
  selectedOption: keyof Delivery | any;
  Points: Point[];
  declare configuration: Configuration
  constructor(
    public service: DeliveryService,
    public auth: AuthenticationService,
    public pointService: PointService, //Este es para la relacion
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
        label: 'Punto',       //Este es para la relacion
        property: 'id_point', //Este es para la relacion
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
    this.selectedOption = 'id_point';
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

  protected validateExtras(result: Delivery) {
    result.updated_at = new Date().toDateString();
    return result;
  }

  protected getIdFrom(result: Delivery): number {
    return result.id;
  }

  protected search(id?: number): Delivery {
    return this.entities.find(e => e.id == id);
  }

  protected getRefDialog(dialogData: DialogData<Delivery, any>) {
    return this.dialog.open(DeliveryDialogComponent, {
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
      id_point: null, //Este es para la relacion
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
    this.auth.checkPermission('/deliveries')
    this.logged =
      typeof this.auth.currentUserValue === 'string' &&
      this.auth.currentUserValue !== '';

    this.user = JSON.parse(localStorage.getItem('user')) as User;
    //Llenamos la lista
    this.PointService
      .list()
      .subscribe(response => (this.Points = response.data.data));

    this.restore();
    this.reload(false, this.params);
  }

  searchTypes(text: string) { //Este es para la relacion
    if (text.length == 0) {
      this.pointService
        .list()
        .subscribe(response => (this.points = response.data.data));
    } else {
      this.pointService
        .search(text)
        .subscribe(response => (this.points = response.data.data));
    }
  }

  

  changeSelected() {
    this.params['id_point '] = null; //Este es para la relacion
    this.params['economic_number'] = null;
    this.params['num_license'] = null;
    this.params['plates'] = null;
    this.params['brand'] = null;
    this.params['color'] = null;
  }

}

@Component({
  selector: 'app-delivery-dialog',
  templateUrl: './delivery-dialog.component.html',
  styleUrls: ['./delivery.component.scss'],
})
export class DeliveryDialogComponent extends DialogBase implements OnInit {
  point: Point[]; //Este es para la relacion
  constructor(
    public pointService: PointService, //Este es para la relacion
    public dialogRef: MatDialogRef<DeliveryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<Delivery, null>
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
    this.pointService //Este es para la relacion
      .list()
      .subscribe(response => (this.points = response.data.data));
   
    const { entity } = this.data;
    if (this.data.entity.color == '') {
      this.data.entity.color = '#ffffff';
    }
  }

  searchTypes(text: string) { //Este es para la relacion
    if (text.length == 0) {
      this.pointService   
        .list()
        .subscribe(response => (this.points = response.data.data));
    } else {
      this.pointService
        .search(text)
        .subscribe(response => (this.points = response.data.data));
    }
  }

}
