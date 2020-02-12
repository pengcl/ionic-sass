import {Component} from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {tap, filter, map, mergeMap} from 'rxjs/operators';
import {TabService} from './@shared/components/header/tab.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'SMP';

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private tabSvc: TabService) {
        router.events.pipe(
            // tap(o => console.log(o))
            filter(event => event instanceof NavigationEnd),
            map(() => this.activatedRoute),
            map(route => {
                while (route.firstChild) {
                    route = route.firstChild;
                }
                return route;
            }),
            mergeMap(route => {
                console.log(route);
                return route.data;
            })
        ).subscribe(data => {
            this.tabSvc.set({name: data.name, path: this.router.url});
        });
    }
}
