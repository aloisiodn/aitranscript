import { TestBed } from '@angular/core/testing';

import { InputFileService } from './inputFile.service';

describe('InputFileService', () => {
  let service: InputFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
