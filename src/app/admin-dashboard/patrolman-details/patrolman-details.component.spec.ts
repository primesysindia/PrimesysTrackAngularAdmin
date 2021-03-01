import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatrolmanDetailsComponent } from './patrolman-details.component';

describe('PatrolmanDetailsComponent', () => {
  let component: PatrolmanDetailsComponent;
  let fixture: ComponentFixture<PatrolmanDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatrolmanDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatrolmanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
