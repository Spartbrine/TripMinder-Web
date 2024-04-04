import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentTypeComponent } from './incident-type.component';

describe('IncidentTypeComponent', () => {
  let component: IncidentTypeComponent;
  let fixture: ComponentFixture<IncidentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncidentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
