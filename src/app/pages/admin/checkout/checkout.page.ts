import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {StorageService} from '../../../@core/services/storage.service';
import {FormService} from './form/form.service';


@Component({
    selector: 'app-admin-checkout',
    templateUrl: './checkout.page.html',
    styleUrls: ['./checkout.page.scss'],
})
export class AdminCheckoutPage implements OnInit, OnDestroy {
    order = this.formSvc.order;

    constructor(private storageSvc: StorageService,
                private formSvc: FormService,
                private router: Router) {
    }

    ngOnInit() {
    }

    home() {
        console.log('home');
        this.router.navigate(['/admin/dashboard']);
    }

    reset(stepper) {
        this.order = {index: 0, price: 300, count: 0, amount: 0, total: 0};
        stepper.reset();
        this.ngOnInit();
    }

    ngOnDestroy() {
        this.storageSvc.remove('order');
    }
}
