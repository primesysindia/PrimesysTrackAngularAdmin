import { TestBed } from '@angular/core/testing';

import { ModuleListService } from './module-list.service';

describe('ModuleListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModuleListService = TestBed.get(ModuleListService);
    expect(service).toBeTruthy();
  });
});
