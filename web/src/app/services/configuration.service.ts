import { Injectable, } from '@angular/core';
import { Configuration, GenericResponse } from 'shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'shared/services/api.service';
import { Observable } from 'rxjs';
import { color } from 'd3';

@Injectable({
    providedIn: 'root'
})

export class ConfigurationService extends ApiService<Configuration>{
    configuration: Configuration;

    constructor(public http: HttpClient) {
        super(http);
    }

    public root(): string {
        return 'configuration';
    }
    public getConfiguration(): Observable<GenericResponse<Configuration>> {
        return this.http.get<GenericResponse<Configuration>>(`${this.uri}`);
    }
    public updateConfiguration(e: Configuration): Observable<Configuration> {
        return this.http.put<Configuration>(`${this.uri}`, e);
    }


    get configurationObject(){
        try{
            const configurationLS = JSON.parse(localStorage.getItem('configuration'));
            this.configuration = {
                name:              configurationLS['name']               ,
                direction:         configurationLS['direction']          ,
                phone:             configurationLS['phone']              ,
                primary_color:     configurationLS['primary_color']      ,
                progress_color:    configurationLS['progress_color']     ,
                btnlogin_color:    configurationLS['btnlogin_color']     ,
                color_table:       configurationLS['color_table']        ,
                image_login:       configurationLS['image_login']        ,
                image_sidebarlogo: configurationLS['image_sidebarlogo']  ,
                image_headerlogo:  configurationLS['image_headerlogo']   ,
                image_bannerlogin: configurationLS['image_bannerlogin']  ,
                image_report:      configurationLS['image_report']       , 
                primary_color_back: configurationLS['primary_color']     ,
                color_border_form: '#E0E0E0',
                color_border_form_back: '#E0E0E0',
                white_color: '#FFFFFF',
                white_color2: '#FFFFFF',
                white_color_back: '#FFFFFF',
                white_color_back2: '#FFFFFF',
                calculate_hover_primary_color(): string {
                    const hexColor = configurationLS['primary_color'].replace('#', '');
                    const red = parseInt(hexColor.substring(0, 2), 16);
                    const green = parseInt(hexColor.substring(2, 4), 16);
                    const blue = parseInt(hexColor.substring(4, 6), 16);
            
                    const rgbaColor = `rgba(${red}, ${green}, ${blue}, 0.8)`;
            
                    return rgbaColor;
                },
                search_primary_color:     configurationLS['primary_color']      ,
                search_primary_color_back: configurationLS['primary_color']     ,
                search_calculate_hover_primary_color(): string {
                    const hexColor = configurationLS['primary_color'].replace('#', '');
                    const red = parseInt(hexColor.substring(0, 2), 16);
                    const green = parseInt(hexColor.substring(2, 4), 16);
                    const blue = parseInt(hexColor.substring(4, 6), 16);
            
                    const rgbaColor = `rgba(${red}, ${green}, ${blue}, 0.8)`;
            
                    return rgbaColor;
                },
                calculate_primary_color_light(): string {
                    const hexColor = configurationLS['primary_color'].replace('#', '');
                    const red = parseInt(hexColor.substring(0, 2), 16);
                    const green = parseInt(hexColor.substring(2, 4), 16);
                    const blue = parseInt(hexColor.substring(4, 6), 16);
            
                    const rgbaColor = `rgba(${red}, ${green}, ${blue}, 0.1)`;
            
                    return rgbaColor;
                },
                calculate_primary_color_light2(): string {
                    const hexColor = configurationLS['primary_color'].replace('#', '');
                    const red = parseInt(hexColor.substring(0, 2), 16);
                    const green = parseInt(hexColor.substring(2, 4), 16);
                    const blue = parseInt(hexColor.substring(4, 6), 16);
            
                    const rgbaColor = `rgba(${red}, ${green}, ${blue}, 0.1)`;
            
                    return rgbaColor;
                },
            }
        }
        catch(e){
            this.configuration = {
                name:              'System Name',
                direction:         'System Direction',
                phone:             'System Phone',
                primary_color:     '#000000',
                progress_color:    '#000000',
                btnlogin_color:    '#000000',
                color_table:       '#000000',
                image_login:       'System.jpg',
                image_sidebarlogo: 'System.jpg',
                image_headerlogo:  'System.jpg',
                image_bannerlogin: 'System.jpg',
                image_report:      'System.jpg', 
                primary_color_back: '#000000',
                color_border_form: '#E0E0E0',
                color_border_form_back: '#E0E0E0',
                white_color: '#FFFFFF',
                white_color2: '#FFFFFF',
                white_color_back: '#FFFFFF',
                white_color_back2: '#FFFFFF',

                calculate_hover_primary_color(): string {
                    const rgbaColor = `rgba(0, 0, 0, 0.8)`;
                    return rgbaColor;
                },
                search_primary_color:     '#000000',
                search_primary_color_back: '#000000',
                search_calculate_hover_primary_color(): string {
                    const rgbaColor = `rgba(0, 0, 0, 0.8)`;
                    return rgbaColor;
                },
                calculate_primary_color_light(): string {
                    const rgbaColor = `rgba(0, 0, 0, 0.1)`;
                    return rgbaColor;
                },
                calculate_primary_color_light2(): string {
                    const rgbaColor = `rgba(0, 0, 0, 0.1)`;
                    return rgbaColor;
                },

            }
        }

        return this.configuration
    }

}