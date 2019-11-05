import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';

import { ClassroomService } from '../classroom.service';
import { AlertService } from '../alert.service';
import {ExcelService} from '../excel.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  teachers :  Array<any>;
  tests :  Array<any>;
  alert : any;
  subjects:any;
  $alert = 0;
  subjectname: any;
  subjectupdate:any;
  stdupdate:any;
  modegrade:any;
  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
   barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
   barChartType = 'bar';
   barChartLegend = true;
   barChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];
  
  name = 'Angular 6';
  datatest: any = [{
    eid: 'e101',
    ename: 'ravi',
    esal: 1000
  },
  {
    eid: 'e102',
    ename: 'ram',
    esal: 2000
  },
  {
    eid: 'e103',
    ename: 'rajesh',
    esal: 3000
  }];

  constructor(private excelService: ExcelService,private classroomService : ClassroomService,private alertService : AlertService) { 

  }


  startAnimationForLineChart(chart){
      let seq: any, delays: any, durations: any;
      seq = 0;
      delays = 80;
      durations = 500;

      chart.on('draw', function(data) {
        if(data.type === 'line' || data.type === 'area') {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if(data.type === 'point') {
              seq++;
              data.element.animate({
                opacity: {
                  begin: seq * delays,
                  dur: durations,
                  from: 0,
                  to: 1,
                  easing: 'ease'
                }
              });
          }
      });

      seq = 0;
  };
  startAnimationForBarChart(chart){
      let seq2: any, delays2: any, durations2: any;

      seq2 = 0;
      delays2 = 80;
      durations2 = 500;
      chart.on('draw', function(data) {
        if(data.type === 'bar'){
            seq2++;
            data.element.animate({
              opacity: {
                begin: seq2 * delays2,
                dur: durations2,
                from: 0,
                to: 1,
                easing: 'ease'
              }
            });
        }
      });

      seq2 = 0;
  };
  show(i){
    this.subjectname = this.subjects[i].subjectId+" : "+this.subjects[i].subjectName;
    this.subjectupdate = this.subjects[i].dateScore;
    this.stdupdate = this.subjects[i].dateStudent;
    this.modegrade = this.subjects[i].modeGrade;
  }
  ngOnInit() {
      /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */
      this.classroomService.QSubjectbyteacher(localStorage.getItem('tCode')).subscribe(data =>{
        
        this.subjectname = data[0].subjectId+" : "+data[0].subjectName;
        this.subjectupdate = data[0].dateScore;
        this.stdupdate = data[0].dateStudent;
        this.modegrade = data[0].modeGrade;
        this.subjects = data;
        console.log("QSubjectbyteacher : "+JSON.stringify(data));
      });
      
      if(localStorage.getItem("currentUser") && localStorage.getItem("alert") == "0"){
        localStorage.setItem("alert", "1");
        this.classroomService.QSubjectbyteacher(localStorage.getItem('tCode')).subscribe(data =>{
          console.log("QSubjectbyteacher : "+JSON.stringify(data));
          this.alertService.success('ยินดีต้อนรับ '+localStorage.getItem("currentUser"));
        },error=>{
          location.replace("/login");
        }
        );
      }
      else if(localStorage.getItem("currentUser") == null){
        
        localStorage.removeItem("currentUser");
        localStorage.removeItem('tCode');
        location.replace("/login");
      }
            
      const dataDailySalesChart: any = {
          labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
          series: [
              [12, 17, 7, 17, 23, 18, 38]
          ]
      };

     const optionsDailySalesChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
      }

      var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

      this.startAnimationForLineChart(dailySalesChart);


      /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

      const dataCompletedTasksChart: any = {
          labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
          series: [
              [230, 750, 450, 300, 280, 240, 200, 190]
          ]
      };

     const optionsCompletedTasksChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
      }

      var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

      // start animation for the Completed Tasks Chart - Line Chart
      this.startAnimationForLineChart(completedTasksChart);



      /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

      var datawebsiteViewsChart = {
        labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
        series: [
          [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

        ]
      };
      var optionswebsiteViewsChart = {
          axisX: {
              showGrid: false
          },
          low: 0,
          high: 1000,
          chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
      };
      var responsiveOptions: any[] = [
        ['screen and (max-width: 640px)', {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
            }
          }
        }]
      ];
      var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

      //start animation for the Emails Subscription Chart
      this.startAnimationForBarChart(websiteViewsChart);
  }

}
