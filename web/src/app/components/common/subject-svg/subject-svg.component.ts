import { Component, Input } from "@angular/core";

@Component({
   selector: 'app-subject-svg',
   templateUrl: './subject-svg.component.svg',
   styleUrls: ['./subject-svg.component.scss']
})

export class SubjectSvgComponent {
   _studyProgram: string = 'Name';
   _teacher: string = 'Name';

   @Input()
   set StudyProgram(value: string) {
      this._studyProgram = value; 
   }
   
   get StudyProgram() {
      return this._studyProgram;
   }

   @Input()
   set Teacher(value: string) {
      this._teacher = value; 
   }
   
   get Teacher() {
      return this._teacher;
   }
}