import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  upload(file: File, file_key:string): Observable<HttpEvent<any>> {
    
    console.log("upload1:", file.name )
    let formData: FormData = new FormData();

    formData.append('file_uploaded', file, "F".concat(file_key, "_",file.name));

    console.log("upload2:", formData)

    const req = new HttpRequest('POST', `${this.baseUrl}/upload/`, formData, {
      //reportProgress: true,
      responseType: 'json'
    });

    console.log("request headers",req.headers)
    console.log("request body",req.headers)

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
}