import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUserUtilityComponent } from './delete-user-utility.component';

describe('DeleteUserUtilityComponent', () => {
  let component: DeleteUserUtilityComponent;
  let fixture: ComponentFixture<DeleteUserUtilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteUserUtilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteUserUtilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
