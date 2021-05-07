import { TestBed } from '@angular/core/testing';

import { CommandExcelService } from './command-excel.service';

describe('CommandExcelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommandExcelService = TestBed.get(CommandExcelService);
    expect(service).toBeTruthy();
  });
});
