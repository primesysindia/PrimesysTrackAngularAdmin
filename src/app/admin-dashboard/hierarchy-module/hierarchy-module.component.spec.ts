import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchyModuleComponent } from './hierarchy-module.component';

describe('HierarchyModuleComponent', () => {
  let component: HierarchyModuleComponent;
  let fixture: ComponentFixture<HierarchyModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HierarchyModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchyModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
