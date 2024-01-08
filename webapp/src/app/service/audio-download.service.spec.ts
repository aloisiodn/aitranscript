import { TestBed } from '@angular/core/testing';

import { AudioDownloadService } from './audio-download.service';

describe('AudioDownloadService', () => {
  let service: AudioDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
