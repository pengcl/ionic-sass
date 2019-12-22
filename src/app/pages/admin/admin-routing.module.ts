import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminPage} from './admin.page';
import {CompanyGuard} from './company/company.guard';

const routes: Routes = [
    {
        path: '',
        component: AdminPage,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('./dashboard/dashboard.module').then(m => m.AdminDashboardPageModule)
            },
            {// 主体例表
                path: 'company/list',
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./company/list/list.module').then(m => m.AdminCompanyListPageModule)
            },
            {// 主体详情
                path: 'company/item/:id',
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./company/item/item.module').then(m => m.AdminCompanyItemPageModule)
            },
            {// 体检报告列表
                path: 'plan/list',
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./plan/list/list.module').then(m => m.AdminPlanListPageModule)
            },
            {// 体检报告详情
                path: 'plan/item/:id',
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./plan/item/item.module').then(m => m.AdminPlanItemPageModule)
            },
            {// 风险报告列表
                path: 'risk/list',
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./risk/list/list.module').then(m => m.AdminRiskListPageModule)
            },
            {// 风险报告详情
                path: 'risk/item/:id',
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./risk/item/item.module').then(m => m.AdminRiskItemPageModule)
            },
            {// 体检报告列表
                path: 'monitor/list',
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./monitor/list/list.module').then(m => m.AdminMonitorListPageModule)
            },
            {// 托管例表
                path: 'trust/list',
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./trust/list/list.module').then(m => m.AdminTrustListPageModule)
            },
            {// 托管详情
                path: 'trust/item/:id',
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./trust/item/item.module').then(m => m.AdminTrustItemPageModule)
            },
            {// 保险箱
                path: 'box/list',
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./box/list/list.module').then(m => m.AdminBoxListPageModule)
            },
            {// 保险箱
                path: 'box/upload',
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./box/upload/upload.module').then(m => m.AdminBoxUploadPageModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [CompanyGuard]
})
export class AdminRoutingModule {
}
