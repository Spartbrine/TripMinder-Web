import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelTripComponent } from './fuel-trip.component';

describe('FuelTripComponent', () => {
  let component: FuelTripComponent;
  let fixture: ComponentFixture<FuelTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuelTripComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
