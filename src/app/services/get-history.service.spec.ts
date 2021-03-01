import { TestBed } from '@angular/core/testing';

import { GetHistoryService } from './get-history.service';

describe('GetHistoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetHistoryService = TestBed.get(GetHistoryService);
    expect(service).toBeTruthy();
  });
});
