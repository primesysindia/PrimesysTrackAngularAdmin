import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUtilityMappingComponent } from './user-utility-mapping.component';

describe('UserUtilityMappingComponent', () => {
  let component: UserUtilityMappingComponent;
  let fixture: ComponentFixture<UserUtilityMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserUtilityMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUtilityMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
