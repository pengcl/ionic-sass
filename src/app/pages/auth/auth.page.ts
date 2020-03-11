import {Component, OnInit, OnDestroy, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {LocationStrategy} from '@angular/common';

import {interval as observableInterval} from 'rxjs';
import {AuthService} from './auth.service';
import {DialogService} from '../../@core/modules/dialog';
import {StorageService} from '../../@core/services/storage.service';

declare var initGeetest: any;

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit, OnDestroy {
    appConfig;
    form: FormGroup;
    isSignInFormSubmit = false;
    isSignUpFormSubmit = false;

    captchaObj;
    randomValidUid;

    activeText = '获取验证码';
    activeClass = true;
    second = 59;
    timePromise;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private location: LocationStrategy,
                private storageSvc: StorageService,
                private dialog: DialogService,
                private authSvc: AuthService) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            loginid: new FormControl('', [Validators.required, Validators.min(10000000000), Validators.max(19999999999)]),
            validCode: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
            type: new FormControl('1', [Validators.required, Validators.minLength(1), Validators.maxLength(1)])
        });

        this.randomValidUid = new Date().getTime();
    }

    sendValidCode() {
        this.getValidImg();

        if (!this.activeClass) {
            return false;
        }

        const validate = this.captchaObj.getValidate();
        if (!validate) {
            alert('请先完成验证！');
            return false;
        }

        this.authSvc.sendValidCode({
            geetest_challenge: validate.geetest_challenge,
            geetest_validate: validate.geetest_validate,
            geetest_seccode: validate.geetest_seccode,
            randomValidUid: this.randomValidUid,
            phone: this.form.get('loginid').value,
            type: 1
        }).subscribe(res => {
            if (res.code === '0000') {
                if (!this.activeClass) {
                    return false;
                }
                this.activeClass = false;
                // $scope.loadingToast.open(false);
                this.timePromise = observableInterval(1000).subscribe(() => {
                    if (this.second <= 0) {
                        this.timePromise.unsubscribe();

                        this.second = 59;
                        this.activeText = '重发验证码';
                        this.activeClass = true;
                        document.getElementById('sendValidCode').style.display = 'block';
                        document.getElementById('origin_sendValidCode').style.display = 'none';
                    } else {
                        document.getElementById('sendValidCode').style.display = 'none';
                        document.getElementById('origin_sendValidCode').style.display = 'block';
                        this.activeText = '' + this.second + 's';
                        this.activeClass = false;
                        this.second = this.second - 1;
                    }
                });
            }
        });

    }

    login() {
        this.isSignUpFormSubmit = true;
        if (this.form.invalid) {
            if (this.form.get('loginid').valid && this.form.get('pwd').valid &&
                this.form.get('validCode').valid && this.form.get('agree').invalid) {
                this.dialog.show({content: '请勾选用户协议', confirm: '我知道了', cancel: ''}).subscribe();
            }
            return false;
        }

        this.authSvc.login(this.form.value).subscribe(res => {
            if (res.code === '0000') {
                this.authSvc.token(res.result.key);
                this.router.navigate(['/loader']);
            } else {
                this.dialog.show({content: res.msg, confirm: '我知道了'}).subscribe();
            }
        });
    }

    ngOnDestroy() {
        if (this.timePromise) {
            this.timePromise.unsubscribe();
        }
    }

    getValidImg() {
        if (this.form.get('loginid').invalid) {
            this.dialog.show({
                content: '请正确填写手机号！',
                cancel: '',
                confirm: '我知道了'
            }).subscribe(data => {
            });
            return false;
        }
        this.authSvc.getValidImg(this.randomValidUid).subscribe(res => {
            const data = JSON.parse(res.result);
            initGeetest({
                gt: data.gt,
                challenge: data.challenge,
                product: 'popup', // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
                offline: !data.success // 表示用户后台检测极验服务器是否宕机，一般不需要关注
            }, captchaObj => {
                this.handlerPopup(captchaObj);
            });
        });

    }

    handlerPopup(captchaObj) {
        this.captchaObj = captchaObj;
        // 弹出式需要绑定触发验证码弹出按钮
        captchaObj.bindOn('#sendValidCode');

        // 将验证码加到id为captcha的元素里
        captchaObj.appendTo('#popup-captcha');
    }
}
