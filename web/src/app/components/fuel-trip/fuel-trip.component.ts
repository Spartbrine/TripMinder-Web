import { Component, OnInit, Inject, NgModule } from '@angular/core';
import { DialogBase } from 'shared/helpers/dialog.base';
import { Catalog, FilterOption } from 'shared/helpers/catalog';
import {
  User,
  DialogData,
  FilterParams,
  FuelType, //Relacion
  Vehicle, //Relacion
  Trip, //Relacion
  FuelTrip,
  Configuration,
} from 'shared/interfaces';
import { AuthenticationService } from 'shared/services/authentication.service';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FuelTypeService } from 'src/app/services/fuel-type.service'; //Relacion
import { TripService } from 'src/app/services/trip.service'; //Relacion
import { VehicleService } from 'src/app/services/vehicle.service'; //Relacion
import { FuelTripService } from 'src/app/services/fuel-trip.service';
import { Profile } from 'shared/constants';
import jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ConfigurationService } from 'src/app/services/configuration.service'
@Component({
  selector: 'app-fuel-trip',
  templateUrl: './fuel-trip.component.html',
  styleUrls: ['./fuel-trip.component.scss']
})
export class FuelTripComponent
  extends Catalog<FuelTrip, FuelTripDialogComponent>
  implements OnInit {
  params: FilterParams<FuelTrip>;
  filterOptions: FilterOption<FuelTrip>[];
  selectedOption: keyof FuelTrip | any;
  fuelTypes: FuelType[]; //Relacion
  vehicles: Vehicle[]; //Relacion
  trips: Trip[]; //Relacion
  declare configuration: Configuration
  constructor(
    public service: FuelTripService,
    public auth: AuthenticationService,
    public fuelTypeService: FuelTypeService, //Relacion
    public tripService: TripService, //Relacion
    public vehicleService: VehicleService, //Relacion
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
        label: 'Vehicle',
        property: 'id_vehicle',
      },
      {
        label: 'Viaje',
        property: 'id_trip',
      },
      {
        label: 'Tipo de combustible',
        property: 'id_fuel_type',
      },
      {
        label: 'Litros llenos',
        property: 'liters_filled',
      },
      {
        label: 'Gasolina inicial',
        property: 'initial_fuel',
      },
      {
        label: 'Precio por litro',
        property: 'price_per_liter',
      },
      {
        label: 'Llenado total',
        property: 'total_fill',
      },
      {
        label: 'Fecha de llenado',
        property: 'fill_date',
      },
    ];
  
    this.selectedOption = 'id_vehicle';
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

  protected validateExtras(result: FuelTrip) {
    result.updated_at = new Date().toDateString();
    return result;
  }

  protected getIdFrom(result: FuelTrip): number {
    return result.id;
  }

  protected search(id?: number): FuelTrip {
    return this.entities.find(e => e.id == id);
  }

  protected getRefDialog(dialogData: DialogData<FuelTrip, any>) {
    return this.dialog.open(FuelTripDialogComponent, {
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
      id_vehicle: null,
      id_trip: null,
      id_fuel_type: null,
      liters_filled: null,
      initial_fuel: null,
      price_per_liter: null,
      total_fill: null,
      fill_date: new Date().toDateString(),
      created_at: new Date().toDateString(),
      updated_at: new Date().toDateString(),
    };
  }

  ngOnInit() {
    this.auth.checkPermission('/fueltrips')
    this.logged =
      typeof this.auth.currentUserValue === 'string' &&
      this.auth.currentUserValue !== '';

    this.user = JSON.parse(localStorage.getItem('user')) as User;
    //Llenamos la lista
    this.vehicleService
      .list()
      .subscribe(response => (this.vehicles = response.data.data));
    this.tripService
      .list()
      .subscribe(response => (this.trips = response.data.data));
    this.fuelTypeService
      .list()
      .subscribe(response => (this.fuelTypes = response.data.data));

    this.restore();
    this.reload(false, this.params);
  }

  searchVehicles(text: string) {
    if (text.length == 0) {
      this.vehicleService
        .list()
        .subscribe(response => (this.vehicles = response.data.data));
    } else {
      this.vehicleService
        .search(text)
        .subscribe(response => (this.vehicles = response.data.data));
    }
  }
  serchTrips(text: string) {
    if (text.length == 0) {
      this.tripService
        .list()
        .subscribe(response => (this.trips = response.data.data));
    } else {
      this.tripService
        .search(text)
        .subscribe(response => (this.trips = response.data.data));
    }
  }
  searchFuelTypes(text: string) {
    if (text.length == 0) {
      this.fuelTypeService
        .list()
        .subscribe(response => (this.fuelTypes = response.data.data));
    } else {
      this.fuelTypeService
        .search(text)
        .subscribe(response => (this.fuelTypes = response.data.data));
    }
  }

  changeSelected() {
    this.params['id_vehicle '] = null;
    this.params['id_trip'] = null;
    this.params['id_fuel_type'] = null;
    this.params['liters_filled'] = null;
    this.params['initial_fuel'] = null;
    this.params['price_per_liter'] = null;
    this.params['total_fill'] = null;
    this.params['fill_date'] = null;
  }

}

@Component({
  selector: 'app-fuel-trip-dialog',
  templateUrl: './fuel-trip-dialog.component.html',
  styleUrls: ['./fuel-trip.component.scss'],
})
export class FuelTripDialogComponent extends DialogBase implements OnInit {
  vehicles: Vehicle[];
  trips: Trip[];
  fuelTypes: FuelType[];
  constructor(
    public vehicleService: VehicleService, //Relacion
    public tripService: TripService, //Relacion
    public fuelTypeService: FuelTypeService, //Relacion
    public dialogRef: MatDialogRef<FuelTripComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<FuelTrip, null>
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
    this.vehicleService
    .list()
    .subscribe(response => (this.vehicles = response.data.data));
  this.tripService
    .list()
    .subscribe(response => (this.trips = response.data.data));
  this.fuelTypeService
    .list()
    .subscribe(response => (this.fuelTypes = response.data.data));
   
    
  }

  searchVehicles(text: string) {
    if (text.length == 0) {
      this.vehicleService
        .list()
        .subscribe(response => (this.vehicles = response.data.data));
    } else {
      this.vehicleService
        .search(text)
        .subscribe(response => (this.vehicles = response.data.data));
    }
  }
  serchTrips(text: string) {
    if (text.length == 0) {
      this.tripService
        .list()
        .subscribe(response => (this.trips = response.data.data));
    } else {
      this.tripService
        .search(text)
        .subscribe(response => (this.trips = response.data.data));
    }
  }
  searchFuelType(text: string) {
    if (text.length == 0) {
      this.fuelTypeService
        .list()
        .subscribe(response => (this.fuelTypes = response.data.data));
    } else {
      this.fuelTypeService
        .search(text)
        .subscribe(response => (this.fuelTypes = response.data.data));
    }
  }

}



