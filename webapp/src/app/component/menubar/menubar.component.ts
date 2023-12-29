import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogController} from '../login-dialog/login-dialog.component';
import { NgIf, CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.css',
})
export class MenubarComponent {


  constructor(public dialog: MatDialog, 
              public authService: AuthService,
              private router: Router) {}

  openLoginDialog(){
    console.log('Login acionado');
    const dialogRef = LoginDialogController.openDialog(this.dialog);
    dialogRef.afterClosed().subscribe(
      data => console.log("afterClosed: menu", dialogRef.componentInstance.local_data.obj),
    );  
    dialogRef.afterClosed().subscribe(
      data => {
                  if (this.authService.isAuthenticated()){
                    this.router.navigate(['transcripts-table']);
                  }
              }               
    );    
    
    /**    
    dialogRef.afterClosed().subscribe(
      data => this.user_ok = dialogRef.componentInstance.local_data.obj.success
      );    
      dialogRef.afterClosed().subscribe(
        data => this.user_name = dialogRef.componentInstance.local_data.obj.user_name
      );    
    **/
  }


}
