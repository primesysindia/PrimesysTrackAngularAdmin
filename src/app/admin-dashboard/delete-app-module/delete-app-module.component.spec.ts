import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAppModuleComponent } from './delete-app-module.component';

describe('DeleteAppModuleComponent', () => {
  let component: DeleteAppModuleComponent;
  let fixture: ComponentFixture<DeleteAppModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteAppModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAppModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
