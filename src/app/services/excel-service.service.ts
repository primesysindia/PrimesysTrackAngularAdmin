import { Injectable } from '@angular/core';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as logoFile from './companyLogo.js';
import * as fs from 'file-saver';
import { DatePipe } from 'node_modules/@angular/common';
import { IssueList, GetAllDeviceInfo, InspectionData} from '../core/post';

@Injectable({
  providedIn: 'root'
})
export class ExcelServiceService {

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

  generateIssueHistoryExcel(data: Array<IssueList>,tableHeader){
    //Create workbook and worksheet
    let FileName = 'Issue History List';
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Report');
    //setFileName
    let subTitleRow;
    //Add Row and formatting
    
    let titleRow = worksheet.addRow(['Issue History']);
    worksheet.addRow([]);
    subTitleRow = worksheet.addRow([]);
    
    //Blank Row 
    worksheet.addRow([]);
    //Add Header Row
    let headerRow = worksheet.addRow(['Sr.No','Division Name', 'Device Name','Issue Title','Description','Contact Person', 'Mobile No.', 'Status', 'Priority', 'Logged By', 'Logged At']);

    //set style to file
    this.applyStyle(titleRow,subTitleRow,workbook,worksheet,headerRow)
    let i=1;
      data.forEach(item =>{
        let vals=[];
        vals.push(i);
        vals.push(item.divisionName);
        vals.push(item.deviceName);
        vals.push(item.issueTitle);
        vals.push(item.issueComment);
        vals.push(item.contactPerson);
        vals.push(item.contactPersonMobNo);
        vals.push(item.issueStatus);
        vals.push(item.priority);
        vals.push(item.issueOwner);
        vals.push(this.datePipe.transform(item.createdAt, 'MMM d, y HH:mm'));
        worksheet.addRow(vals);
        i++;
      })
      worksheet.getColumn(1).width = 10;
      worksheet.getColumn(2).width = 20;
      worksheet.getColumn(3).width = 20;
      worksheet.getColumn(4).width = 30;
      worksheet.getColumn(5).width = 70;
      worksheet.getColumn(6).width = 20;
      worksheet.getColumn(7).width = 10;
      worksheet.getColumn(8).width = 10;
      worksheet.getColumn(9).width = 10;
      this.saveFile(workbook,FileName)
    }
   
    generateAllDeviceInfo(data: Array<GetAllDeviceInfo>,tableHeader){
      // console.log("filter", data)
      //Create workbook and worksheet
      let FileName = 'Device Details';
      let workbook = new Excel.Workbook();
      let worksheet = workbook.addWorksheet('Report');
      //setFileName
      let subTitleRow;
      //Add Row and formatting
      
      let titleRow = worksheet.addRow(['Device Details']);
      worksheet.addRow([]);
      subTitleRow = worksheet.addRow([]);
      
      //Blank Row 
      worksheet.addRow([]);
      //Add Header Row
      let headerRow = worksheet.addRow(['Sr.No','Parent Id', 'Student Id', 'User Name', 'Device Name', 'Device Id', 'Sim No', 'Activation Date',]);
      // parentId', 'studentId', 'userName', 'deviceName', 'deviceId', 'deviceSimNo', 'activationDate',
      //set style to file
      this.applyStyle(titleRow,subTitleRow,workbook,worksheet,headerRow)
      let i=1;
        data.forEach(item =>{
          let vals=[];
          vals.push(i);
          vals.push(item.parentId);
          vals.push(item.studentId);
          vals.push(item.userName);
          vals.push(item.deviceName);
          vals.push(item.deviceId);
          vals.push(item.deviceSimNo);
          vals.push(item.activationDate);
          // vals.push(item.issueOwner);
          // vals.push(this.datePipe.transform(item.createdAt, 'MMM d, y HH:mm'));
          worksheet.addRow(vals);
          i++;
        })
        worksheet.getColumn(1).width = 10;
        worksheet.getColumn(2).width = 20;
        worksheet.getColumn(3).width = 20;
        worksheet.getColumn(4).width = 30;
        worksheet.getColumn(5).width = 70;
        worksheet.getColumn(6).width = 20;
        worksheet.getColumn(7).width = 10;
        worksheet.getColumn(8).width = 10;
        this.saveFile(workbook,FileName)
      }

      generateInspectionHistoryExcel(data: Array<InspectionData>,tableHeader){
        //Create workbook and worksheet
        // console.log(data)
        let FileName = 'Inspection History';
        let workbook = new Excel.Workbook();
        let worksheet = workbook.addWorksheet('Report');
        //setFileName
        let subTitleRow;
        //Add Row and formatting
        
        let titleRow = worksheet.addRow(['Inspection History']);
        worksheet.addRow([]);
        subTitleRow = worksheet.addRow([]);
        
        //Blank Row 
        worksheet.addRow([]);
        //Add Header Row
        let headerRow = worksheet.addRow(['Sr.No','Device Name','Issue Title','Issue Description','Final Report', 'Contact Person', 'Inspected By']);
    
        //set style to file
        this.applyStyle(titleRow,subTitleRow,workbook,worksheet,headerRow)
        let i=1;
          data.forEach(item =>{
            let vals=[];
            vals.push(i);
            vals.push(item.name);
            vals.push(item.issueTitle);
            vals.push(item.issueDescription);
            vals.push(item.finalTestingReport);
            vals.push(item.contactPerson);
            vals.push(item.inspectdBy);
            // vals.push(this.datePipe.transform(item.createdAt, 'MMM d, y HH:mm'));
            worksheet.addRow(vals);
            i++;
          })
          worksheet.getColumn(1).width = 10;
          worksheet.getColumn(2).width = 20;
          worksheet.getColumn(3).width = 20;
          worksheet.getColumn(4).width = 30;
          worksheet.getColumn(5).width = 70;
          worksheet.getColumn(6).width = 20;
          worksheet.getColumn(7).width = 10;
          // worksheet.getColumn(8).width = 10;
          // worksheet.getColumn(9).width = 10;
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
