import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { AboutComponent } from './component/about/about.component';
import { TranscriptsTableComponent } from './component/transcripts-table/transcripts-table.component';
import { authGuard } from './auth/auth.guard';


  const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'about',component:AboutComponent},
  {path:'transcripts-table',component:TranscriptsTableComponent, canActivate:[authGuard]},
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
