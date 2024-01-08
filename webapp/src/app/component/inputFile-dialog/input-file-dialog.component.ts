//----------------------------
//Input File Dialog
//----------------------------
import { Component, Inject, Optional, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgIf, CommonModule } from '@angular/common';
import { InputFile } from '../../model/InputFile';
import {MAT_DIALOG_DATA,
        MatDialogRef,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose
} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {FormGroup, FormBuilder,FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Observable } from 'rxjs';

import { FileUploadService } from '../../service/file-upload.service';
import { InputFileService } from '../../service/inputFile.service';
import { TranscriptsTableComponent } from '../transcripts-table/transcripts-table.component';

import { HttpEventType, HttpResponse } from '@angular/common/http';

//Dialogs
import {
  MatDialog, MatDialogConfig
} from '@angular/material/dialog';


const padLeft = (number: number, length: number, character: string = '0'): string => {
  let result = String(number);
  for (let i = result.length; i < length; ++i) {
    result = character + result;
  }
  return result;
};
function getRandomStr(min:number, max:number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  let random_number = Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  return padLeft(random_number,8)
}  


export class InputFileDialogController{

  //constructor(public dialog: MatDialog) {
  //    this.dialog = dialog;
  //}
  static openDialog(dialog: MatDialog, obj: InputFile, action:string): MatDialogRef<InputFileDialog> {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "800px";
    dialogConfig.height = "850px";

    dialogConfig.data = {
        action: action,
        obj: obj
    };
 
    const dialogRef = dialog.open(InputFileDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => console.log("Dialog output:", data)
    );    
  return dialogRef
  }
}


@Component({
    selector: 'inputFile-dialog',
    templateUrl: './inputFile-dialog.component.html',
    styleUrl:    './inputFile-dialog.component.css',
    standalone: true,
    imports: [
      MatFormFieldModule,
      MatInputModule,
      FormsModule,
      MatButtonModule,
      MatDialogTitle,
      MatDialogContent,
      ReactiveFormsModule,
      MatDialogActions,
      MatDialogClose,
      NgIf, CommonModule,
      MatProgressSpinnerModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  
  })


export class InputFileDialog {

    form: FormGroup;

    action: string;
    local_data: any;
    data: any;

    public disabled = false;

    public err_message: string = "";
    public show_err: boolean = false;

    
    /** upload properties **/
    fileName:string  = 'Select File';
    uploadFile: any;

      
    /** end upload proprties **/
  

    constructor(
      private fileUploadService: FileUploadService, 
      private inputFileService: InputFileService,
      public dialog: MatDialog,
      private fb: FormBuilder,
      @Optional() @Inject(MAT_DIALOG_DATA) data: {obj:InputFile, action:string},
      public dialogRef: MatDialogRef<InputFileDialog>,
    ) {
      console.log("Construtor");
      console.log(data.obj);
      this.data =data;
      this.local_data = {...data};
      this.action = this.local_data.action;
      this.form = this.fb.group({description: [data.obj.name, []], });
    }
  
    onFecharClick(): void {
      this.dialogRef.close();
    }

    SelecionarArquivo(fileInput:any): void {
      
      console.log('Selecionar', fileInput.files[0].name);
      this.data.obj.file_name=fileInput.files[0].name;
      this.uploadFile = fileInput.files[0]
      console.log(this.data.obj)
   }
  
    onSubmeterClick(data: {obj:InputFile, action:string}): void {

      
      if (this.uploadFile) {

        this.data.obj.file_key = getRandomStr(0, 99999999)

        this.disabled= true

        console.log("SUBMETER", this.uploadFile.name)
        this.fileUploadService.upload(this.uploadFile, this.data.obj.file_key).subscribe( {
          // on successful emissions
          next: up_event => {
            console.log("upEVENT",up_event);
          },
          // on errors
          error: up_error => {
            console.log("upERROR", up_error)
            this.disabled= false
          },
          // called once on completion
          complete: () => {
            console.log("upCOMPLETE", 'complete!');
            this.inputFileService.addInputFile(this.data.obj).subscribe( {
              // on successful emissions
              next: add_event => {
                console.log("addEVENT",add_event);
              },
              // on errors
              error: add_error => {
                console.log("addERROR", add_error)
                this.show_err = true;
                this.err_message = "Dados incompletos ou inválidos..."
                this.disabled= false
              },
              // called once on completion
              complete: () => {
                console.log("addCOMPLETE", 'complete!');
                this.dialogRef.close();
                this.disabled= false
              }
            });    
          }  
        });

      } else {
        this.show_err = true;
        this.err_message = "Escolha um arquivo de audio..."
      }
    }

  


    onCancelarClick(): void {
      this.dialogRef.close();
    }

     
}