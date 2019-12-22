import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class AdminDashboardPage {
  user;

  constructor(private router: Router, private authSvc: AuthService) {
    this.user = authSvc.currentUser;
  }

}
