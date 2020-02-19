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
                data: {name: '首页'},
                loadChildren: () =>
                    import('./dashboard/dashboard.module').then(m => m.AdminDashboardPageModule)
            },
            {
                path: 'order/list',
                data: {name: '订单'},
                loadChildren: () =>
                    import('./order/list/list.module').then(m => m.AdminOrderListPageModule)
            },
            {
                path: 'order/item/:id',
                data: {name: '订单详情'},
                loadChildren: () =>
                    import('./order/item/item.module').then(m => m.AdminOrderItemPageModule)
            },
            {
                path: 'order/checkout/:id',
                data: {name: '支付订单'},
                loadChildren: () =>
                    import('./order/checkout/checkout.module').then(m => m.AdminOrderCheckoutPageModule)
            },
            {// 主体例表
                path: 'company/list',
                data: {name: '我的主体'},
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./company/list/list.module').then(m => m.AdminCompanyListPageModule)
            },
            {// 主体详情
                path: 'company/item/:id',
                data: {name: '企业资质'},
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./company/item/item.module').then(m => m.AdminCompanyItemPageModule)
            },
            {// 生成报告
                path: 'company/qualification/:id',
                data: {name: '生成报告'},
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./company/qualification/qualification.module').then(m => m.AdminCompanyQualificationPageModule)
            },
            {// 生成报告
                path: 'checkout',
                data: {name: '自助下单'},
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./checkout/checkout.module').then(m => m.AdminCheckoutPageModule)
            },
            {// 体检报告列表
                path: 'plan/list',
                data: {name: '企业体检报告'},
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./plan/list/list.module').then(m => m.AdminPlanListPageModule)
            },
            {// 体检报告列表
                path: 'plan/item/:id',
                data: {name: '企业体检报告'},
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./plan/item/item.module').then(m => m.AdminPlanItemPageModule)
            },
            {// 风险报告列表
                path: 'risk/list',
                data: {name: '企业风险报告'},
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./risk/list/list.module').then(m => m.AdminRiskListPageModule)
            },
            {// 体检报告列表
                path: 'monitor/list',
                data: {name: '竞争对手监控'},
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./monitor/list/list.module').then(m => m.AdminMonitorListPageModule)
            },
            {// 托管例表
                path: 'trust/list',
                data: {name: '知产托管'},
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./trust/list/list.module').then(m => m.AdminTrustListPageModule)
            },
            {// 托管详情
                path: 'trust/item/:id',
                data: {name: '专利托管详情'},
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./trust/item/item.module').then(m => m.AdminTrustItemPageModule)
            },
            {// 托管商标详情
                path: 'trust/detail/:id',
                data: {name: '商标托管详情'},
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./trust/detail/detail.module').then(m => m.AdminTrustDetailPageModule)
            },
            {// 我的知产
                path: 'box/list',
                data: {name: '我的知产'},
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./box/list/list.module').then(m => m.AdminBoxListPageModule)
            },
            {// 添加知产
                path: 'box/upload',
                data: {name: '添加知产'},
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./box/upload/upload.module').then(m => m.AdminBoxUploadPageModule)
            },
            {// 工单列表
                path: 'ticket/list',
                data: {name: '我的工单'},
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./ticket/list/list.module').then(m => m.AdminTicketListPageModule)
            },
            {// 工单详情
                path: 'ticket/item/:id',
                data: {name: '工单详情'},
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./ticket/item/item.module').then(m => m.AdminTicketItemPageModule)
            },
            {// 我的账户
                path: 'user',
                data: {name: '我的账户'},
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./user/user.module').then(m => m.AdminUserPageModule)
            },
            {// 匹配政策
                path: 'policy/index',
                data: {name: '匹配政策'},
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./policy/index/policy.module').then(m => m.AdminPolicyPageModule)
            },
            {// 政策详情
                path: 'policy/item',
                data: {name: '政策详情'},
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./policy/item/item.module').then(m => m.AdminPolicyItemPageModule)
            },
            {// 政策列表
                path: 'policy/list',
                data: {name: '政策列表'},
                canActivate: [CompanyGuard],
                loadChildren: () =>
                    import('./policy/list/list.module').then(m => m.AdminPolicyListPageModule)
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
