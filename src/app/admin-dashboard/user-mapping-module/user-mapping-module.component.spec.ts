import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMappingModuleComponent } from './user-mapping-module.component';

describe('UserMappingModuleComponent', () => {
  let component: UserMappingModuleComponent;
  let fixture: ComponentFixture<UserMappingModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMappingModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMappingModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
