import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatrolmenBeatVerificationComponent } from './patrolmen-beat-verification.component';

describe('PatrolmenBeatVerificationComponent', () => {
  let component: PatrolmenBeatVerificationComponent;
  let fixture: ComponentFixture<PatrolmenBeatVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatrolmenBeatVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatrolmenBeatVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
