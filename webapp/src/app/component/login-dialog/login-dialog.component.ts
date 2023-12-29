//----------------------------
//Login Dialog
//----------------------------
import { Component, Inject, Optional} from '@angular/core';
import { NgIf, CommonModule } from '@angular/common';
import {MAT_DIALOG_DATA,
        MatDialogRef,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatDialog, MatDialogConfig
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormGroup, FormBuilder,FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { UserService } from '../../service/user.service';
import { AuthService } from '../../auth/auth.service';



export interface LoginData {
    login: string;
    password: string;
    err_message: string;
    success:boolean;
    user_name: string
}


export class LoginDialogController{

    static loginData: LoginData = {login:"aloisiodn", password:"test", err_message:"", user_name:"Nobody", success:false};

    static openDialog(dialog: MatDialog):  MatDialogRef<LoginDialog> {

    
        const dialogConfig = new MatDialogConfig();
    
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "600px";
        dialogConfig.height = "800px";

        this.loginData.login = "";
        this.loginData.password = "";

        this.loginData.err_message = "";
        this.loginData.success = false;
    
        dialogConfig.data = {
            action: "login",
            obj: this.loginData
        };
     
        const dialogRef = dialog.open(LoginDialog, dialogConfig);
    
        dialogRef.afterClosed().subscribe(
          data => console.log("Dialog output afterClosed:", dialogRef.componentInstance.local_data.obj)
        );    
        return dialogRef;
    
    
      }
      
  }
  


@Component({
    selector: 'login-dialog',
    templateUrl: './login-dialog.component.html',
    styleUrl:    './login-dialog.component.css',
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
      MatIconModule,
      NgIf, CommonModule
    ],
  
  })
  


export class LoginDialog {

    form: FormGroup;

    action: string;
    local_data: any;
    data: any;
    err_message: any;

 
    constructor(
      private authService: AuthService,  
      private userService: UserService,  
      private fb: FormBuilder,
      @Optional() @Inject(MAT_DIALOG_DATA) data: {obj:LoginData, action:string},
      public dialogRef: MatDialogRef<LoginDialog>,
    ) {
      this.data =data;
      this.local_data = {...data};
      this.action = this.local_data.action;
      this.form = this.fb.group({description: [data.obj.login, []], });

    }
  
    onLoginClick(obj: LoginData): void {
        console.log('LoginClick', obj);
        this.authService.authenticate(obj.login, obj.password, this.dialogRef);
        console.log('Authenticated = ', this.authService.isAuthenticated());
        if (this.authService.isAuthenticated()){
            this.dialogRef.close();
        } else {
          this.err_message="Login invalido"
        };

    
    }
    onCancelarClick(): void {
      this.dialogRef.close();
    }


  }