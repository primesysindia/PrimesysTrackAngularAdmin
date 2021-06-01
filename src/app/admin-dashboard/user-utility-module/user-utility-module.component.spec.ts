import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUtilityModuleComponent } from './user-utility-module.component';

describe('UserUtilityModuleComponent', () => {
  let component: UserUtilityModuleComponent;
  let fixture: ComponentFixture<UserUtilityModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserUtilityModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUtilityModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
