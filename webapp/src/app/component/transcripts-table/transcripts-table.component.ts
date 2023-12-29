import {Component, Inject, ViewChild, ChangeDetectorRef, Optional } from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {TooltipPosition, MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { InputFile } from '../../model/InputFile';
import { User } from '../../model/User';
import { InputFileService } from '../../service/inputFile.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { InputFileDialogController } from '../inputFile-dialog/input-file-dialog.component';
import { AuthService } from '../../auth/auth.service';

//Dialogs
import {
  MatDialog, //MatDialogConfig
} from '@angular/material/dialog';


@Component({
  selector: 'app-transcripts-table',
  templateUrl: './transcripts-table.component.html',
  styleUrl: './transcripts-table.component.css',
})
export class TranscriptsTableComponent {

    inputFilesList!: InputFile[];


    datasource: any;
    changeDetectorRefs: any;

    displayedColumns: string[] = ["name", "file_name", "description", "user", "status", "acoes"];
    @ViewChild(MatPaginator) paginatior !: MatPaginator;
    @ViewChild(MatSort) sort !: MatSort;

    selection: any;

    
    constructor(
                private authService: AuthService,  
                public dialog: MatDialog,
                private inputFileService: InputFileService,
                ) {
                  this.dialog = dialog;
                  this.loadInputFile();  
    }

    loadInputFile() {
      console.log('Data loaded!');
      this.inputFileService.getInputFiles().subscribe(res=>{
        this.inputFilesList = res;
        this.datasource = new MatTableDataSource<InputFile>(this.inputFilesList);
        this.datasource.paginator = this.paginatior;
        this.datasource.sort = this.sort;
      });

    }

    Filterchange(data: Event) {
      const value = (data.target as HTMLInputElement).value;
      this.datasource.filter = value;
    }

    onRowClicked(row: any) {
      console.log('Row clicked: ', row);
    }

    inputFileDataSource = new InputFileDataSource(this.inputFileService)


    //Dialog Control
  
    newInputFile: InputFile = { name: "", description: "", file_name:"", 
                                user: this.authService.getUser(), 
                                status:"Uploaded", transcript: "Indisponível", summary: "Indisponível",
                                file_key: ""
                              }

    openDialogAdd(): void {
      this.newInputFile = { name: "", description: "", file_name:"", 
                            user: this.authService.getUser(), 
                            status:"UP", transcript: "Indisponível", summary: "Indisponível",
                            file_key: ""

      }
      let dialogRef = InputFileDialogController.openDialog(this.dialog, this.newInputFile,'Add')
      dialogRef.afterClosed().subscribe(
        data => { console.log("Dialog output:", data);
                  this.loadInputFile(); }
      );    
  
    }
    openDialogDetails(obj: InputFile): void {
      InputFileDialogController.openDialog(this.dialog, obj,'Details')
    }

    

    ngOnInit(): void {
      this.loadInputFile();  
    }
  
    ngAfterViewInit(): void {
      this.loadInputFile();  
    }


}

export class InputFileDataSource extends DataSource<InputFile> {
  private inputFileSubject = new BehaviorSubject<InputFile[]>([]);

  constructor(private inputFileService : InputFileService) { 
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<InputFile[]> {
    return this.inputFileSubject.asObservable();
  }

  disconnect() {}

  getInputFiles() {
    this.inputFileService.getInputFiles();
  }
}

