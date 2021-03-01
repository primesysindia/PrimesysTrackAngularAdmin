import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesHistoryComponent } from './devices-history.component';

describe('DevicesHistoryComponent', () => {
  let component: DevicesHistoryComponent;
  let fixture: ComponentFixture<DevicesHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicesHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
