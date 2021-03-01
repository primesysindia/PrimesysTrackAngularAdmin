import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPatrolmanBeatComponent } from './edit-patrolman-beat.component';

describe('EditPatrolmanBeatComponent', () => {
  let component: EditPatrolmanBeatComponent;
  let fixture: ComponentFixture<EditPatrolmanBeatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPatrolmanBeatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPatrolmanBeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
