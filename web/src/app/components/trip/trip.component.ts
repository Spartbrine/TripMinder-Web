import { Component, OnInit, Inject, NgModule } from '@angular/core';
import { DialogBase } from 'shared/helpers/dialog.base';
import { Catalog, FilterOption } from 'shared/helpers/catalog';
import {
  User,
  DialogData,
  FilterParams,
  Facility,
  Vehicle,
  Trip,
  Configuration,
  Responsible,
} from 'shared/interfaces';
import { AuthenticationService } from 'shared/services/authentication.service';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { TripService } from 'src/app/services/trip.service';
import { FacilityService } from 'src/app/services/facility.service'; //Relacion
import { VehicleService } from 'src/app/services/vehicle.service'; //Relacion

import { Profile } from 'shared/constants';
import jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ConfigurationService } from 'src/app/services/configuration.service'
import { ResponsibleService } from 'src/app/services/responsible.service';
@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.scss']
})
export class TripComponent
  extends Catalog<Trip, TripDialogComponent>
  implements OnInit {
  params: FilterParams<Trip>;
  filterOptions: FilterOption<Trip>[];
  selectedOption: keyof Trip | any;
  facilities: Facility[]; //Relacion
  vehicles: Vehicle[]; //Relacion
  responsibles: Responsible[]; //Relacion

  declare configuration: Configuration
  constructor(
    public service: TripService,
    public auth: AuthenticationService,
    public vehicleService: VehicleService, //Relacion
    public facilityService: FacilityService, //Relacion
    public responsibleService: ResponsibleService, //Relacion

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
        label: 'Instalación',
        property: 'id_facility',
      },
      {
        label: 'Vehiculo',
        property: 'id_vehicle',
      },
      {
        label: 'Responsable',
        property: 'id_responsible',
      },
      {
        label: 'Nombre',
        property: 'name',
      },
      {
        label: 'Fecha',
        property: 'date',
      },
      {
        label: 'Millas iniciales',
        property: 'initial_mileage',
      },
      {
        label: 'Gasolina inicial',
        property: 'initial_fuel',
      },
      {
        label: 'Estatus',
        property: 'status',
      },
      {
        label: 'Millas finales',
        property: 'final_mileage',
      },
      {
        label: 'Gasolina final',
        property: 'final_fuel',
      },
    ];
    this.selectedOption = 'id_trip';
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

  protected validateExtras(result: Trip) {
    result.updated_at = new Date().toDateString();
    return result;
  }

  protected getIdFrom(result: Trip): number {
    return result.id;
  }

  protected search(id?: number): Trip {
    return this.entities.find(e => e.id == id);
  }

  protected getRefDialog(dialogData: DialogData<Trip, any>) {
    return this.dialog.open(TripDialogComponent, {
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
      id_facility: null,
      id_vehicle: null,
      id_responsible: null,
      name: null,
      date: null,
      initial_mileage: null,
      initial_fuel: null,
      status: null,
      final_mileage: null,
      final_fuel: null,
      created_at: new Date().toDateString(),
      updated_at: new Date().toDateString(),
    };
  }

  ngOnInit() {
    this.auth.checkPermission('/trips')
    this.logged =
      typeof this.auth.currentUserValue === 'string' &&
      this.auth.currentUserValue !== '';

    this.user = JSON.parse(localStorage.getItem('user')) as User;
    //Llenamos la lista
    this.facilityService
      .list()
      .subscribe(response => (this.facilities = response.data.data )); //relacion
      
      this.vehicleService
      .list()
      .subscribe(response => (this.vehicles = response.data.data )); //relacion

      this.responsibleService
      .list()
      .subscribe(response => (this.responsibles = response.data.data)); //relacion
      
    this.restore();
    this.reload(false, this.params);
  }

  searchTypes(text: string) {
    if (text.length == 0) {
      this.facilityService //relacion
        .list()
        .subscribe(response => (this.facilities = response.data.data));
    } else {
      this.facilityService //RELACION
        .search(text)
        .subscribe(response => (this.facilities = response.data.data));
    }
  }

  searchVehicles(text: string) {
    if (text.length == 0) {
      this.vehicleService //RELACION
        .list()
        .subscribe(response => (this.vehicles = response.data.data));
    } else {
      this.vehicleService //RELACION
        .search(text)
        .subscribe(response => (this.vehicles = response.data.data));
    }
  }

  searchResponsibles(text: string) {
    if (text.length == 0) {
      this.responsibleService //RELACION
        .list()
        .subscribe(response => (this.responsibles = response.data.data));
    } else {
      this.responsibleService //RELACION
        .search(text)
        .subscribe(response => (this.responsibles = response.data.data));
    }
  }
  

  changeSelected() {
    this.params['id_trip '] = null; //RELACION
    this.params['id_incident_type'] = null;
    this.params['description'] = null;
    this.params['longitude'] = null;
    this.params['latitude'] = null;
    this.params['date'] = null;
  }

}

@Component({
  selector: 'app-trip-dialog',
  templateUrl: './trip-dialog.component.html',
  styleUrls: ['./trip.component.scss'],
})
export class TripDialogComponent extends DialogBase implements OnInit {
  facilities: Facility[]; //RELACION
  responsibles: Responsible[]; //RELACION
  vehicles: Vehicle[]; //RELACION

  constructor(
    public facilityService: FacilityService, //Relacion    
    public responsibleService: ResponsibleService, //Relacion    
    public vehicleService: VehicleService, //Relacion    
    public dialogRef: MatDialogRef<TripComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<Trip, null>
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
    this.facilityService //RELACION
      .list()
      .subscribe(response => (this.facilities = response.data.data)); //RELACION
    
      this.vehicleService //RELACION
      .list()
      .subscribe(response => (this.vehicles = response.data.data)); //RELACION

      this.responsibleService //RELACION
      .list()
      .subscribe(response => (this.responsibles = response.data.data)); //RELACION

  
    
   
    
  }

  searchTypes(text: string) {
    if (text.length == 0) {
      this.facilityService //relacion
        .list()
        .subscribe(response => (this.facilities = response.data.data));
    } else {
      this.facilityService //RELACION
        .search(text)
        .subscribe(response => (this.facilities = response.data.data));
    }
  }

  searchVehicles(text: string) {
    if (text.length == 0) {
      this.vehicleService //RELACION
        .list()
        .subscribe(response => (this.vehicles = response.data.data));
    } else {
      this.vehicleService //RELACION
        .search(text)
        .subscribe(response => (this.vehicles = response.data.data));
    }
  }

  searchResponsibles(text: string) {
    if (text.length == 0) {
      this.responsibleService //RELACION
        .list()
        .subscribe(response => (this.responsibles = response.data.data));
    } else {
      this.responsibleService //RELACION
        .search(text)
        .subscribe(response => (this.responsibles = response.data.data));
    }
  }

}
