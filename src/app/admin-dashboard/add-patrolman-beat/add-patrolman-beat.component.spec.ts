import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatrolmanBeatComponent } from './add-patrolman-beat.component';

describe('AddPatrolmanBeatComponent', () => {
  let component: AddPatrolmanBeatComponent;
  let fixture: ComponentFixture<AddPatrolmanBeatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPatrolmanBeatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPatrolmanBeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
