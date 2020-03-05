import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from './pages/auth/auth.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'loader',
        pathMatch: 'full'
    },
    {
        path: 'loader',
        loadChildren: () => import('./pages/loader/loader.module').then(m => m.LoaderPageModule)
    },
    {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthPageModule)
    },
    {
        path: 'admin',
        canActivate: [AuthGuard],
        loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminPageModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {
}
