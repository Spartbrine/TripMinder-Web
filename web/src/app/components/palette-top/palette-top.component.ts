import { Component, OnInit } from '@angular/core';
import { Configuration } from 'shared/interfaces';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-palette-top',
  templateUrl: './palette-top.component.html',
  styleUrls: ['./palette-top.component.scss']
})
export class PaletteTopComponent implements OnInit {
  configuration: Configuration;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  bg_image = '';
  constructor(
    public configurationService: ConfigurationService
  ) {
  }

  ngOnInit(): void {
    this.configuration = this.configurationService.configurationObject;
    // eslint-disable-next-line max-len
    //this.bg_image = `linear-gradient(to right, ${this.configuration.primary_color}, ${this.configuration.primary_color} 14.28%, ${this.configuration.primary_color} 14.28%, #fff 28.56%, #fff 28.56%, #fff 42.84%, #fff 42.84%, #fff 57.12%, #fff 57.12%, #fff 71.4%, #fff 71.4%, ${this.configuration.primary_color} 85.68%, ${this.configuration.primary_color} 85.68%, ${this.configuration.primary_color})`;
    this.bg_image = `${this.configuration.primary_color}`;
  }

}
