import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHierarchyComponent } from './add-hierarchy.component';

describe('AddHierarchyComponent', () => {
  let component: AddHierarchyComponent;
  let fixture: ComponentFixture<AddHierarchyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHierarchyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
