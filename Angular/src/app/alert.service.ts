import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';


import { Alert, AlertType } from './alert/alert';
import { Component, ViewChild, ElementRef } from '@angular/core';

declare var $: any;
@Injectable()
export class AlertService {
    id: number = 0;
    
    private subject = new Subject<Alert>();
    private keepAfterRouteChange = false;

    showNotification(color, message,time){
   //     const type = ['','info','success','warning','danger'];
        
  //      const color = Math.floor((Math.random() * 4) + 1);
  
        $.notify({
            icon: "notifications",
            message : message
     //       message: "Welcome to <b>Material Dashboard</b> - a beautiful freebie for every web developer."
  
        },{
            type: color ,
            timer: time,
            placement: {
                from: 'top',
                align: 'right'
            },
            template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
              '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
              '<i class="material-icons" data-notify="icon">notifications</i> ' +
              '<span data-notify="title">{1}</span> ' +
              '<span data-notify="message">{2}</span>' +
              '<div class="progress" data-notify="progressbar">' +
                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
              '</div>' +
              '<a href="{3}" target="{4}" data-notify="url"></a>' +
            '</div>'
        });
    }

    constructor(private router: Router) {
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    // only keep for a single route change
                    this.keepAfterRouteChange = false;
                } else {
                    // clear alert messages
                    this.clear();
                }
            }
        });
    }

    // subscribe to alerts
    getAlert(alertId?: string): Observable<any> {
        return this.subject.asObservable().filter((x: Alert) => x && x.alertId === alertId);
    }

    // convenience methods
    waitsuccess(message: string,timer:number){
        this.clear();
        this.alert(new Alert({ message, type: AlertType.Success }));
        this.showNotification('warning',message,timer*1000);
    }
    success(message: string) {
        this.clear();
        this.alert(new Alert({ message, type: AlertType.Success }));
        this.showNotification('success',message,4000);
    }
    error(message: string) {
        this.clear();
        this.alert(new Alert({ message, type: AlertType.Error }));
        this.showNotification('danger',message,4000);
    }

    info(message: string) {
        this.clear();
        this.alert(new Alert({ message, type: AlertType.Info }));
        this.showNotification('info',message,4000);
    }

    warn(message: string) {
        this.clear();
        this.alert(new Alert({ message, type: AlertType.Warning }));
        this.showNotification('warning',message,4000);
    }

    // main alert method
    alert(alert: Alert) {
        this.keepAfterRouteChange = alert.keepAfterRouteChange;
        this.subject.next(alert);
    }

    // clear alerts
    clear() {
        $().alert('close');    
    }
    
}