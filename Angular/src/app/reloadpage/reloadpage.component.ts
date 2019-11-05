import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-reloadpage',
  templateUrl: './reloadpage.component.html',
  styleUrls: ['./reloadpage.component.scss']
})
export class ReloadpageComponent implements OnInit {
  page  : any;
  courseParam: any;
  eventParam: any;
  groupParam: any;
  constructor( private route: ActivatedRoute,
   private router: Router) {
      this.page = this.route.snapshot.params.page
    }
  ngOnInit() {
    this.router.navigate(['/'+this.page]);
  }

}