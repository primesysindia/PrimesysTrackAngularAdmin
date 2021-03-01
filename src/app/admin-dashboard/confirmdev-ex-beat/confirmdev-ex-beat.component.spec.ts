import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmdevExBeatComponent } from './confirmdev-ex-beat.component';

describe('ConfirmdevExBeatComponent', () => {
  let component: ConfirmdevExBeatComponent;
  let fixture: ComponentFixture<ConfirmdevExBeatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmdevExBeatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmdevExBeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
