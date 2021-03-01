import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCommandModuleComponent } from './custom-command-module.component';

describe('CustomCommandModuleComponent', () => {
  let component: CustomCommandModuleComponent;
  let fixture: ComponentFixture<CustomCommandModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomCommandModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCommandModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
