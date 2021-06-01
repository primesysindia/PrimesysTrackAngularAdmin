import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppModuleComponent } from './edit-app-module.component';

describe('EditAppModuleComponent', () => {
  let component: EditAppModuleComponent;
  let fixture: ComponentFixture<EditAppModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAppModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
