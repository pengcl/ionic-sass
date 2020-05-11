import {CompanyGuard} from "../company/company.guard";

export default [
    {// 智能存证列表
        path: 'certificate/list',
        data: {name: '智能存证列表', menuIndex: 10},
        canActivate: [CompanyGuard],
        loadChildren: () =>
            import('./list/list.module').then(m => m.AdminCertificateListPageModule)
    },
    {// 智能存证详情
        path: 'certificate/itemDetail/:id',
        data: {name: '智能存证详情', menuIndex: 10},
        canActivate: [CompanyGuard],
        loadChildren: () =>
            import('./item/item.module').then(m => m.AdminCertificateItemDetailPageModule)
    },
    {// 申请版权存证
        path: 'certificate/declare',
        data: {name: '申请版权存证', menuIndex: 10},
        canActivate: [CompanyGuard],
        loadChildren: () =>
            import('./declare/declare.module').then(m => m.AdminCertificateDeclarePageModule)
    },
    {// 申请版权存证
        path: 'certificate/declare/:id',
        data: {name: '申请版权存证', menuIndex: 10},
        canActivate: [CompanyGuard],
        loadChildren: () =>
            import('./declare/declare.module').then(m => m.AdminCertificateDeclarePageModule)
    },
    {// 申请版权存证
        path: 'certificate/pay',
        data: {name: '存证信息确认和支付', menuIndex: 10},
        canActivate: [CompanyGuard],
        loadChildren: () =>
            import('./pay/pay.module').then(m => m.AdminCertificatePayPageModule)
    }
]
