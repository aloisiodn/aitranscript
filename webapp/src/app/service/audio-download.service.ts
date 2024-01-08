import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioDownloadService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }


  download(id: number): Observable<HttpEvent<any>> {
    
    console.log("download:", id )


    const req = new HttpRequest('GET', `${this.baseUrl}/files/${id}/download`); //{responseType: 'json'});

    console.log("REQ:",  req);

    return this.http.request(req);
  }

}
