import { Injectable } from '@angular/core';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as logoFile from './companyLogo.js';
import * as fs from 'file-saver';
import { DatePipe } from 'node_modules/@angular/common';
import { USERS} from '../core/post';

@Injectable({
  providedIn: 'root'
})
export class CommandExcelService {

  constructor(private datePipe: DatePipe) { }

  applyStyle(titleRow,subTitleRow,workbook,worksheet,headerRow){
    //report name style
    titleRow.font = { name: 'Times New Roman', family: 4, size: 16, underline: 'double', bold: true }
    titleRow.alignment = {
      horizontal: 'center',
      verticle: 'center'
    }
    //vehicle details & datetime style
    subTitleRow.font = { name: 'Times New Roman', family: 4, size: 12, bold: true }
    subTitleRow.alignment = {
      horizontal: 'center'
    }
    subTitleRow.color = 'blue';
    //rows & cols style
    worksheet.mergeCells('A3:I3');
     worksheet.mergeCells('A1:I2');

    //Add Image
    let logo = workbook.addImage({
      base64: logoFile.logoBase64,
      extension: 'png',
    });
    worksheet.addImage(logo, 'A1:A2');
    //header row Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
  }

  generatecommandHistoryExcel(data: Array<USERS>){
    //Create workbook and worksheet
    // console.log("excel data", data)
    let FileName = 'Command History List';
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Report');
    //setFileName
    let subTitleRow;
    //Add Row and formatting
    
    let titleRow = worksheet.addRow(['Command History']);
    worksheet.addRow([]);
    subTitleRow = worksheet.addRow([]);
    
    //Blank Row 
    worksheet.addRow([]);
    //Add Header Row
    let headerRow = worksheet.addRow(['Sr.No','Device Name','Imei Number','	Command','Command Response', '	Device Response', 'Command Sent At', 'Command Sent By']);

    //set style to file
    this.applyStyle(titleRow,subTitleRow,workbook,worksheet,headerRow)
    let i=1;
      data.forEach(item =>{
        let vals=[];
        vals.push(i);
        vals.push(item.name);
        vals.push(item.deviceId);
        vals.push(item.command);
        vals.push(item.commandDeliveredMsg);
        vals.push(item.deviceCommandResponse);
        vals.push(this.datePipe.transform(+item.timestamp*1000, 'MMM d, y HH:mm'));
        vals.push(item.login_name);
        worksheet.addRow(vals);
        i++;
      })
      worksheet.getColumn(1).width = 10;
      worksheet.getColumn(2).width = 20;
      worksheet.getColumn(3).width = 20;
      worksheet.getColumn(4).width = 70;
      worksheet.getColumn(5).width = 30;
      worksheet.getColumn(6).width = 20;
      worksheet.getColumn(7).width = 10;
      worksheet.getColumn(8).width = 10;
      this.saveFile(workbook,FileName)
    }

    saveFile(workbook,fileName){
      //Generate Excel File with given name
      workbook.xlsx.writeBuffer().then((data: any) => {
       let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
       fs.saveAs(blob, fileName+'.xlsx');
     })
   }
}
