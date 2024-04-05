import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelTypeComponent } from './fuel-type.component';

describe('FuelTypeComponent', () => {
  let component: FuelTypeComponent;
  let fixture: ComponentFixture<FuelTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuelTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
