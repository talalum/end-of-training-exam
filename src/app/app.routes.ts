import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FormFillComponent } from './pages/form-fill/form-fill.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'form', component: FormFillComponent },
  { path: 'form/:id', component: FormFillComponent },
  { path: '**', redirectTo: '' },
];
