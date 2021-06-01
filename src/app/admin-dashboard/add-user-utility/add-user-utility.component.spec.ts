import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserUtilityComponent } from './add-user-utility.component';

describe('AddUserUtilityComponent', () => {
  let component: AddUserUtilityComponent;
  let fixture: ComponentFixture<AddUserUtilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserUtilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserUtilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
