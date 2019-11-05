import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {

  constructor() { }

  public exportAsExcelFile(excelFileName: string,json: any[],typename:any[],percent:any[],limit:any[],real:any[],score:any[],finalscore:any[],grade:any[]): void {
    
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet',worksheet);



    let workbook: XLSX.WorkBook;
    workbook = XLSX.utils.book_new()
  //  const workbook: XLSX.WorkBook = { Sheets: { 'TotalScore': worksheet }, SheetNames: ['TotalScore'] };
    let totalscore = [];

    let ob;
    let oball;
    let columntemp;
    let jsonscore;
    let obgrade;
    let oblimit;
    let obscore;
    let obscoreList = [];
    let jsonnew;
    console.log(limit);
    jsonnew = json;
    
    /*
    for(var jsonindex =0; jsonindex<json.length; jsonindex++){
      for(var limitindex =0;limitindex<limit.length-1; limitindex++){
        let limitname = "เต็ม ครั้งที่"+limit[jsonindex][limitindex];
        if(limitindex == 0)
          oblimit = Object.assign({[limitname]:limit[jsonindex][limitindex]});
        else
          oblimit = Object.assign(oblimit,{[limitname]:limit[jsonindex][limitindex]});

        obscore = Object.assign(jsonnew[jsonindex],oblimit);

      }
      obscoreList.push(obscore);
    }

    for(var index =0;index<typename.length-1;index++){
      if(typename[index] != "Score"){
        const scoreworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(obscoreList);

        XLSX.utils.book_append_sheet(workbook,scoreworksheet,typename[index]+" "+percent[index]+"%");
      }
    }*/

    for(var jsonindex =0; jsonindex<json.length; jsonindex++){  

        for(var index =0;index<typename.length;index++){
          if(typename[index] != "Score"){
            columntemp = typename[index]+" "+percent[index]+"%"; 
              if(index == 0)
                ob = Object.assign({[columntemp]:score[jsonindex][index]});
              else
                ob = Object.assign(ob,{[columntemp]:score[jsonindex][index]});
          }else{
              oball = Object.assign(ob,{"TotalScore":finalscore[jsonindex]});
              obgrade =  Object.assign(oball,{"Grade":grade[jsonindex]});

              jsonscore = Object.assign(json[jsonindex],obgrade);
              totalscore.push(jsonscore);
            
          }
        }
    } 
        
    const TotalScore: XLSX.WorkSheet = XLSX.utils.json_to_sheet(totalscore);
    

    XLSX.utils.book_append_sheet(workbook,TotalScore,"TotalScore");

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);

    
  }


  private saveAsExcelFile(buffer: any, fileName: string): void {
    const TotalScore: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(TotalScore, fileName );
  }

 /* multiple sheet 
    public exportAsExcelFile(json: any[], excelFileName: string): void {
    
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet',worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'test':worksheet,'TotalScore': worksheet }, SheetNames: ['test','TotalScore'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const TotalScore: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    const test : Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(TotalScore, fileName );
  } */
}