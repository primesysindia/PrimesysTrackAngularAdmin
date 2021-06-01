import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserappModuleComponent } from './add-userapp-module.component';

describe('AddUserappModuleComponent', () => {
  let component: AddUserappModuleComponent;
  let fixture: ComponentFixture<AddUserappModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserappModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserappModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
