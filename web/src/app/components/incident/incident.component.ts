import { Component, OnInit, Inject, NgModule } from '@angular/core';
import { DialogBase } from 'shared/helpers/dialog.base';
import { Catalog, FilterOption } from 'shared/helpers/catalog';
import {
  User,
  DialogData,
  FilterParams,
  IncidentType,
  Incident,
  Trip,
  Configuration,
} from 'shared/interfaces';
import { AuthenticationService } from 'shared/services/authentication.service';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { IncidentService } from 'src/app/services/incident.service';
import { IncidentTypeService } from 'src/app/services/incident-type.service'; //Relacion
import { TripService } from 'src/app/services/trip.service'; //Relacion

import { Profile } from 'shared/constants';
import jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ConfigurationService } from 'src/app/services/configuration.service'
@Component({
  selector: 'app-incident',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.scss']
})
export class IncidentComponent
  extends Catalog<Incident, IncidentDialogComponent>
  implements OnInit {
  params: FilterParams<Incident>;
  filterOptions: FilterOption<Incident>[];
  selectedOption: keyof Incident | any;
  incidentTypes: IncidentType[]; //Relacion
  trips: Trip[]; //Relacion

  declare configuration: Configuration
  constructor(
    public service: IncidentService,
    public auth: AuthenticationService,
    public incidentService: IncidentTypeService, //Relacion
    public tripService: TripService, //Relacion

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
        label: 'Viaje',
        property: 'id_trip',
      },
      {
        label: 'Tipo incidente',
        property: 'id_incident_type',
      },
      {
        label: 'Descripcion',
        property: 'description',
      },
      {
        label: 'Longitud',
        property: 'longitude',
      },
      {
        label: 'Latitud',
        property: 'latitude',
      },
      {
        label: 'Fecha',
        property: 'date',
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

  protected validateExtras(result: Incident) {
    result.updated_at = new Date().toDateString();
    return result;
  }

  protected getIdFrom(result: Incident): number {
    return result.id;
  }

  protected search(id?: number): Incident {
    return this.entities.find(e => e.id == id);
  }

  protected getRefDialog(dialogData: DialogData<Incident, any>) {
    return this.dialog.open(IncidentDialogComponent, {
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
      id_trip: null,
      id_incident_type: null,
      description: null,
      longitude: null,
      latitude: null,
      date: null,
      created_at: new Date().toDateString(),
      updated_at: new Date().toDateString(),
    };
  }

  ngOnInit() {
    this.auth.checkPermission('/incidents')
    this.logged =
      typeof this.auth.currentUserValue === 'string' &&
      this.auth.currentUserValue !== '';

    this.user = JSON.parse(localStorage.getItem('user')) as User;
    //Llenamos la lista
    this.incidentService
      .list()
      .subscribe(response => (this.incidentTypes = response.data.data)); //relacion

    this.restore();
    this.reload(false, this.params);
  }

  searchTypes(text: string) {
    if (text.length == 0) {
      this.incidentTypeService //relacion
        .list()
        .subscribe(response => (this.incidentTypes = response.data.data));
    } else {
      this.incidentTypeService //RELACION
        .search(text)
        .subscribe(response => (this.incidentTypes = response.data.data));
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
  selector: 'app-incident-dialog',
  templateUrl: './incident-dialog.component.html',
  styleUrls: ['./incident.component.scss'],
})
export class IncidentDialogComponent extends DialogBase implements OnInit {
  incidentTypes: IncidentType[]; //RELACION
  trips: Trip[]; //RELACION

  constructor(
    public incidentTypeService: IncidentTypeService, //Relacion    
    public tripService: TripService, //Relacion    
    public dialogRef: MatDialogRef<IncidentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<Incident, null>
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
    this.incidentTypeService //RELACION
      .list()
      .subscribe(response => (this.incidentTypes = response.data.data)); //RELACION
    
      this.tripService //RELACION
      .list()
      .subscribe(response => (this.trips = response.data.data)); //RELACION

    const { entity } = this.data;
    if (this.data.entity.color == '') {
      this.data.entity.color = '#ffffff';
    }
    
   
    
  }

  searchTypes(text: string) {
    if (text.length == 0) {
      this.incidentTypeService //RELACION
        .list()
        .subscribe(response => (this.incidentTypes = response.data.data));
    } else {
      this.incidentTypeService //RELACION
        .search(text)
        .subscribe(response => (this.incidentTypes = response.data.data));
    }
  }
  searchTrips(text: string) {
    if (text.length == 0) {
      this.tripService //RELACION
        .list()
        .subscribe(response => (this.trips = response.data.data));
    } else {
      this.tripService //RELACION
        .search(text)
        .subscribe(response => (this.trips = response.data.data));
    }
  }

}
