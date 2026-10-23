import { Routes } from '@angular/router';
import { Builder } from './pages/builder/builder';
import { Preview } from './pages/preview/preview';

export const routes: Routes = [
    { path: '', component: Builder },   
    { path: 'preview', component: Preview },
    { path: '**', redirectTo: '' }
];
