import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { InputFile } from '../model/InputFile';
import { User } from '../model/User';
import { MessageService } from './message.service';



@Injectable({ providedIn: 'root' })
export class InputFileService {

  private inputFileUrl = 'http://127.0.0.1:8000/api/v1/files/';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET heroes from the server */
  getInputFiles(): Observable<InputFile[]> {
    return this.http.get<InputFile[]>(this.inputFileUrl)
        .pipe(
            tap(_ => this.log('fetched input files')),
            catchError(this.handleError<InputFile[]>('getInputFiles', []))
      );
  }

  /** GET hero by id. Return `undefined` when id not found */
  getInputFile404<Data>(id: number): Observable<InputFile> {
    const url = `${this.inputFileUrl}/?id=${id}`;
    return this.http.get<InputFile[]>(url)
      .pipe(
        map(inputFiles => inputFiles[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<InputFile>(`getInputFile id=${id}`))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getInputFile(id: number): Observable<InputFile> {
    const url = `${this.inputFileUrl}/${id}`;
    return this.http.get<InputFile>(url).pipe(
      tap(_ => this.log(`fetched input file id=${id}`)),
      catchError(this.handleError<InputFile>(`getInputFile id=${id}`))
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addInputFile(inputFile: InputFile): Observable<InputFile> {
    console.log('addInputFile', inputFile);
    return this.http.post<InputFile>(this.inputFileUrl, inputFile, this.httpOptions).pipe(
      tap((newInputFile: InputFile) => this.log(`added input file w/ name=${newInputFile.name}`))
      //,
      //catchError(this.handleError<InputFile>('addInputFile'))
    );
  }

  /** DELETE: delete the hero from the server */
  /** 
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
  */ 
  /** PUT: update the hero on the server */
  /**
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }
  */
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`InputFileService: ${message}`);
  }
}