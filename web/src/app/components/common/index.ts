import { NgModule } from '@angular/core';
import { RemoveCommaPipe, ZeroFilled } from 'shared/helpers/pipes';
import { SharedModule } from 'src/app/@pages/components/shared.module';
import { PaletteTopComponent } from '../palette-top/palette-top.component';
import { FilterTagsComponent } from './filter-tags/filter-tags.component';
import { NotDataComponent } from './pg-not-data/not-data.component';
import { RadioGroupComponent } from './radio-group/radio-group.component';
import { SkeletonLoadingComponent } from './skeleton-loading/skeleton-loading.component';
import { SubjectSvgComponent } from './subject-svg/subject-svg.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [ FilterTagsComponent,
      SkeletonLoadingComponent, SubjectSvgComponent,
      RadioGroupComponent, NotDataComponent, RemoveCommaPipe, ZeroFilled,
      PaletteTopComponent ],
    imports: [SharedModule, CommonModule],
    exports:    [ FilterTagsComponent,
      SkeletonLoadingComponent,SubjectSvgComponent,
      RadioGroupComponent, NotDataComponent, ZeroFilled,
      RemoveCommaPipe, PaletteTopComponent ]
  })
  export class MainModule { }
