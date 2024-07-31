import { Routes } from '@angular/router';
import { LoginComponent } from './user-login/user-login.component';
import { SignupComponent } from './signup/signup.component';
import { ProjectComponent } from '../project/project.component';
import { AboutComponent } from './about/about.component';
import { LogoutComponent } from './logout/logout.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Default redirect to login page
  { path: 'project', component: ProjectComponent},
  { path: 'about', component: AboutComponent },
  { path: 'logout', component: LogoutComponent }
];