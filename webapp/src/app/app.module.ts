import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenubarComponent } from './component/menubar/menubar.component';
import { HomeComponent } from './component/home/home.component';
import { AboutComponent } from './component/about/about.component';
import { MaterialModule } from './material.module';
import { TranscriptsTableComponent } from './component/transcripts-table/transcripts-table.component';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { StorageService } from './service/storage.service';
import { FileUploadComponent } from './component/file-upload/file-upload.component'
import { InputFileDialog } from './component/inputFile-dialog/input-file-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    MenubarComponent,
    HomeComponent,
    AboutComponent,
    TranscriptsTableComponent,
    FileUploadComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    //FileUploadComponent
  ],
  exports:[FileUploadComponent],
  providers: [
    provideHttpClient(withFetch()), 
    provideClientHydration(),
    StorageService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
