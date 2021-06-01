import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserUtilityComponent } from './edit-user-utility.component';

describe('EditUserUtilityComponent', () => {
  let component: EditUserUtilityComponent;
  let fixture: ComponentFixture<EditUserUtilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUserUtilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserUtilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
