import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStudentUpdateComponent } from './new-student-update.component';

describe('NewStudentUpdateComponent', () => {
  let component: NewStudentUpdateComponent;
  let fixture: ComponentFixture<NewStudentUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewStudentUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewStudentUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
