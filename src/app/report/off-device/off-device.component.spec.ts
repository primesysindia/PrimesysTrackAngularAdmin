import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffDeviceComponent } from './off-device.component';

describe('OffDeviceComponent', () => {
  let component: OffDeviceComponent;
  let fixture: ComponentFixture<OffDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
