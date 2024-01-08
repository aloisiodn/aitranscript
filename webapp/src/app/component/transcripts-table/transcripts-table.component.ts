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
import { AudioDownloadService } from '../../service/audio-download.service';

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

    private baseUrl = 'http://localhost:8000'; 




    inputFilesList!: InputFile[];


    datasource: any;
    changeDetectorRefs: any;

    displayedColumns: string[] = ["name", "file_name", "description", "user", "status", "acoes"];
    @ViewChild(MatPaginator) paginatior !: MatPaginator;
    @ViewChild(MatSort) sort !: MatSort;

    selection: any;
 
    constructor(
                private audioDownloadService: AudioDownloadService,  
                private authService: AuthService,  
                public dialog: MatDialog,
                private inputFileService: InputFileService,
                ) {
                  this.dialog = dialog;
                  this.loadInputFile();  
    }

    getUrl(id:number){
      return (`${this.baseUrl}/files/${id}/download`)
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
                                file_key: "", id:0, lock_key:0
                              }

    openDialogAdd(): void {
      this.newInputFile = { name: "", description: "", file_name:"", 
                            user: this.authService.getUser(), 
                            status:"UP", transcript: "Indisponível", summary: "Indisponível",
                            file_key: "", id:0, lock_key:0

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

    download(obj: InputFile): void {
      console.log("download:", obj.id)
      this.audioDownloadService.download(obj.id).subscribe( {
        // on successful emissions
        next: add_event => {
          console.log("addEVENT",add_event);
        },
        // on successful emissions
        
        error: up_error => {
          console.log("upERROR1", up_error.message)
          console.log("upERROR2", up_error.error)
          console.log("upERROR3", up_error.ok)
          console.log("upERROR4", up_error.status, up_error.statusText)
        },
        // called once on completion
        complete: () => {
          console.log("upCOMPLETE", 'complete!');
        }  
      });  
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

