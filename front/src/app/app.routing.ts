import { Routes, RouterModule } from '@angular/router';
import { EditUserComponent } from './edit-user/edit-user.component';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_helpers';

const routes: Routes = [
    { path: '', component: HomeComponent,pathMatch:'full',canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'edit', component: EditUserComponent ,canActivate: [AuthGuard]},


    // otherwise redirect to home
    { path: '**', redirectTo: '' }

];

export const appRoutingModule = RouterModule.forRoot(routes);