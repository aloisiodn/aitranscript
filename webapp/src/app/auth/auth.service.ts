import { Injectable } from '@angular/core';
import { StorageService } from '../service/storage.service';
import { UserService } from '../service/user.service';
import { User } from '../model/User';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginDialog } from '../component/login-dialog/login-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  static emptyUser: User = {id:0, name:"Aloisio Dourado", login:"aloisiodn", password: "", is_admin: false};
  static user: User = AuthService.emptyUser;
  static authenticated: boolean = true;


  constructor(private userService: UserService,
              private storageService: StorageService) { }

  isAuthenticated(){
    //return this.storageService.getItem('authenticated');
    return AuthService.authenticated
  }

  authenticate(login:string, password:string, dialogRef: MatDialogRef<LoginDialog>){
    this.userService.getUser404(login).subscribe(res=>{
      console.log('retrieved user credentials', res.login, res.password);
      console.log('dialog credentials', login, password);
      if (password == res.password) {
        AuthService.user = res;
        AuthService.authenticated =true 
        console.log('LoginClick password ok');
        dialogRef.close();
      } else {
        this.logoff();
        console.log('LoginClick not ok', password, AuthService.user.password);
      }
    });

  }

  logoff(){
    AuthService.user = AuthService.emptyUser;
    AuthService.authenticated =false 
  }

  getUser() {
    return AuthService.user
  }
}
