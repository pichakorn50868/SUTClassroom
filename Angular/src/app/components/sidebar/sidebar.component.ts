import { Component, OnInit } from '@angular/core';

import { ClassroomService } from '../../classroom.service';


declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/manage', title: 'จัดการรายวิชา',  icon:'content_paste', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  subjects :  Array<any>;
  user : String;
  online : boolean;
  offline : boolean;
  suspect : boolean;
  database : string;
  interval:any;
  constructor(private classroomService : ClassroomService) {
    this.interval = setInterval(() => {
      this.check();
    },900000)
   }
  
  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.user = localStorage.getItem("currentUser");
    
    this.offline = false;
    this.online=false;
    this.suspect = true;
    this.database = "suspect";

    this.classroomService.QSubjectbyteacher(localStorage.getItem('tCode')).subscribe(data =>{
      this.subjects = data;

      this.suspect = false;
      this.offline = false;
      this.online = true;
      this.database = "online";

    },
    error =>{
      this.suspect = false;
      this.online=false;
      this.offline = true;
      this.database = "offline";

    }
    );
    
  }

  check(){
    this.classroomService.getTeacher().subscribe(data =>{
      this.suspect = false;
      this.offline = false;
      this.online = true;
      this.database = "online";
      
      console.log("Database online");
    },
    error =>{
      this.suspect = false;
      this.online=false;
      this.offline = true;
      this.database = "offline";
      
      console.log("Database offline");
    }
    );
  }

  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
