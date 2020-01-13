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
            {
                path: 'order/list',
                loadChildren: () =>
                    import('./order/list/list.module').then(m => m.AdminOrderListPageModule)
            },
            {
                path: 'order/checkout/:id',
                loadChildren: () =>
                    import('./order/checkout/checkout.module').then(m => m.AdminOrderCheckoutPageModule)
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
            {// 生成报告
                path: 'company/qualification/:id',
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./company/qualification/qualification.module').then(m => m.AdminCompanyQualificationPageModule)
            },
            {// 生成报告
                path: 'checkout',
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./checkout/checkout.module').then(m => m.AdminCheckoutPageModule)
            },
            {// 体检报告列表
                path: 'plan/list',
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./plan/list/list.module').then(m => m.AdminPlanListPageModule)
            },
            {// 风险报告列表
                path: 'risk/list',
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./risk/list/list.module').then(m => m.AdminRiskListPageModule)
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
            {// 托管商标详情
                path: 'trust/detail/:id',
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./trust/detail/detail.module').then(m => m.AdminTrustDetailPageModule)
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
