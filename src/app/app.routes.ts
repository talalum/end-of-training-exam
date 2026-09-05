import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FormFillComponent } from './pages/form-fill/form-fill.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { ExamsRepository } from './services/exams-repository';
import { StorageService } from './services/storage.service';
import { DemoStorageService } from './services/demo-storage.service';
import { DEMO_MODE, ROUTE_BASE } from './tokens';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'demo',
    providers: [
      { provide: ExamsRepository, useClass: DemoStorageService },
      { provide: DEMO_MODE, useValue: true },
      { provide: ROUTE_BASE, useValue: '/demo' },
    ],
    children: [
      { path: '', component: HomeComponent },
      { path: 'form', component: FormFillComponent },
      { path: 'form/:id', component: FormFillComponent },
    ],
  },
  {
    path: '',
    providers: [{ provide: ExamsRepository, useClass: StorageService }],
    children: [
      { path: '', component: HomeComponent, canActivate: [authGuard] },
      { path: 'form', component: FormFillComponent, canActivate: [authGuard] },
      { path: 'form/:id', component: FormFillComponent, canActivate: [authGuard] },
    ],
  },
  { path: '**', redirectTo: '' },
];
