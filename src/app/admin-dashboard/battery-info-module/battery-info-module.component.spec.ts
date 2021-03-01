import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryInfoModuleComponent } from './battery-info-module.component';

describe('BatteryInfoModuleComponent', () => {
  let component: BatteryInfoModuleComponent;
  let fixture: ComponentFixture<BatteryInfoModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatteryInfoModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatteryInfoModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
