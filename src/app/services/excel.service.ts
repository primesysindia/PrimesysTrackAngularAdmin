import { Injectable } from '@angular/core';
import * as Excel from "exceljs/dist/exceljs.min.js";
import { DatePipe } from 'node_modules/@angular/common';
import * as logoFile from './companyLogo.js';
import * as fs from 'file-saver';
import { TripReportInfo } from '../core/tripReport.model.js';
import { MonitorSos } from '../core/monitorSos.model.js';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(private datePipe: DatePipe) { }

  applyStyle(titleRow,subTitleRow,workbook,worksheet,headerRow,reportName){
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
    if(reportName=="Trip Report" || reportName == "Monthly Report"){
      worksheet.mergeCells('A3:I3');
      worksheet.mergeCells('A1:I2');
    }
    else if(reportName=="Device On Report" || reportName == "Device Off Report" || reportName == "Device Current Status" || reportName == 'Monitor SOS Press' 
              || reportName == 'Today'+"'"+'s Device Status' ||  reportName == "Device ON OFF Status"){
      worksheet.mergeCells('A3:G3');
      worksheet.mergeCells('A1:G2');
    }
    else if(reportName == "Device Battery Status"){
      worksheet.mergeCells('A3:E3');
      worksheet.mergeCells('A1:E2');
    }
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

  generateTripExcel(reportName,DeviceName,reportDate,tableHeader,data: Array<TripReportInfo>,stoppageMins,totalDistance,endDate?){
    //Create workbook and worksheet
    let workbook = new Excel.Workbook();

    let worksheet = workbook.addWorksheet('Report');
    //setFileName
    let FileName, subTitleRow;
    //Add Row
    let titleRow = worksheet.addRow([reportName]);
   
    worksheet.addRow([]);
    if(reportName == "Trip Report"){
        subTitleRow = worksheet.addRow([DeviceName+' '+'Date : ' + this.datePipe.transform(reportDate, 'mediumDate')])
        FileName = reportName.replace(/\s/g, "")+'_'+DeviceName+'_'+this.datePipe.transform(reportDate, 'MMM d').replace(/\s/g, "")
    }
    else{
        subTitleRow = worksheet.addRow([DeviceName+'                           From Date : ' + this.datePipe.transform(reportDate, 'mediumDate')
                                            +' To Date : ' + this.datePipe.transform(endDate, 'mediumDate')])
        FileName = reportName.replace(/\s/g, "")+'_'+DeviceName+'_'+this.datePipe.transform(reportDate, 'MMM d').replace(/\s/g, "")+'To'+this.datePipe.transform(endDate, 'MMM d').replace(/\s/g, "")
    }

    //Blank Row 
    worksheet.addRow([]);
    //Add Header Row
    let headerRow = worksheet.addRow(tableHeader);
    //set style to file
    this.applyStyle(titleRow,subTitleRow,workbook,worksheet,headerRow,reportName)

    let i=1;
    data.forEach(item =>{
      let vals=[];
      vals.push(i);
      vals.push(this.datePipe.transform(+item.srctimestamp*1000, 'medium'));
      vals.push(item.src_adress);
      vals.push(this.datePipe.transform(+item.desttimestamp*1000, 'medium'));
      vals.push(item.dest_address);
      vals.push(stoppageMins[i-1].toFixed(2))
      vals.push(item.avgspeed);
      vals.push(item.maxspeed);
      let total = +item.totalkm
      vals.push(total.toFixed(2));
      worksheet.addRow(vals);
      i++;
    })
    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(3).width = 40;
    worksheet.getColumn(5).width = 40;
    worksheet.getColumn(6).width = 10;
    worksheet.getColumn(9).width = 15;

    let totalKms = worksheet.addRow(['Total Distance: '+totalDistance.toFixed(2)]);
    let color = 'FF99FF99';
    totalKms.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color }
    }
    totalKms.alignment = {
      horizontal: 'right'
    }

    worksheet.mergeCells(`A${totalKms.number}:I${totalKms.number}`);
    
    /* or */
    //worksheet.addRows(data);

    this.saveFile(workbook,FileName)

  }//end method

  generateCurrentStatusExcel(reportName,reportDate,deviceOnStatus,deviceOffStatus,tableHeader,offDevicesCnt,onDevicesCnt,reportTime){
    //Create workbook and worksheet
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Report');
    //setFileName
    let FileName = reportName.replace(/\s/g, "")+'_'+this.datePipe.transform(reportDate, 'MMM d').replace(/\s/g, "")
    let subTitleRow;
    //Add Row and formatting
    let titleRow = worksheet.addRow([reportName]);
    
    worksheet.addRow([]);
    subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(reportDate, 'mediumDate')+'                          Total OFF Devices: '+offDevicesCnt+
                                        ', Total ON Devices: '+onDevicesCnt])
    //Generated date
    let generateDt = worksheet.addRow(['Generated on: '+this.datePipe.transform(reportTime, 'medium')])
    generateDt.alignment = {
      horizontal: 'right'
    }
    worksheet.mergeCells('A4:G4');
    let headerRow = worksheet.addRow(tableHeader);
    //set style to file
    this.applyStyle(titleRow,subTitleRow,workbook,worksheet,headerRow,reportName)
    let i=1;
    if(reportName == 'Device On Report' || reportName == 'Device Off Report'){
      deviceOffStatus.forEach(item =>{
        let vals=[];
        vals.push(i)
        vals.push(item.Name);
        vals.push('OFF');
        vals.push('-')
        vals.push('-');
        vals.push('-');
        vals.push('-');
        worksheet.addRow(vals);
        i++;
      })
    }
    else{
      deviceOffStatus.forEach(item =>{
        let vals=[];
        vals.push(i)
        vals.push(item.Name);
        vals.push('OFF');
        vals.push(this.datePipe.transform(+item.time*1000, 'medium'))
        vals.push(item.address);
        vals.push(item.lat);
        vals.push(item.lang);
        worksheet.addRow(vals);
        i++;
      })
    }
    if(reportName == 'Device On Report' || reportName == 'Device Off Report'){
      deviceOnStatus.forEach(item =>{
        let vals=[];
        vals.push(i)
        vals.push(item.Name);
        vals.push('ON');
        vals.push(this.datePipe.transform(+item.time*1000, 'medium'));
        vals.push(item.address);
        vals.push(item.lat)
        vals.push(item.lang);
        worksheet.addRow(vals);
        i++;
      })
    }
    else{
      deviceOnStatus.forEach(item =>{
        let vals=[];
        vals.push(i)
        vals.push(item.Name);
        vals.push('ON');
        vals.push(this.datePipe.transform(+item.time*1000, 'medium'));
        vals.push('Section: '+item.section+', '+item.address);
        vals.push(item.lat)
        vals.push(item.lang);
        worksheet.addRow(vals);
        i++;
      })
    }
    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 10;
    worksheet.getColumn(4).width = 25;
    worksheet.getColumn(5).width = 40;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 15;
    
    this.saveFile(workbook,FileName)
  
  }//end method

  generateMonitorSOSExcel(reportName,reportDate,data: Array<MonitorSos>,tableHeader){
    //Create workbook and worksheet
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Report');
    //setFileName
    let FileName = reportName.replace(/\s/g, "")+'_'+this.datePipe.transform(reportDate, 'MMM d').replace(/\s/g, "")
    let subTitleRow;
    //Add Row and formatting
    let titleRow = worksheet.addRow([reportName]);
    
    worksheet.addRow([]);
    subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(reportDate, 'mediumDate')])
    
    //Blank Row 
    worksheet.addRow([]);
    //Add Header Row
    let headerRow = worksheet.addRow(tableHeader);
    
    //set style to file
    this.applyStyle(titleRow,subTitleRow,workbook,worksheet,headerRow,reportName)
    let i=1;
    if(reportName == 'Monitor SOS Press'){
      data.forEach(item =>{
        let vals=[];
        vals.push(i);
        vals.push(item.gpsDeviceName);
        vals.push(item.address);
        vals.push(this.datePipe.transform(+item.time*1000, 'medium'));
        vals.push(item.gsm_signal_strength);
        vals.push(item.speed);
        vals.push(item.voltage_level);
        worksheet.addRow(vals);
        i++;
      })
    }
    else{
      data.forEach(item =>{
        let vals=[];
        vals.push(i);
        vals.push(item.gpsDeviceName);
        vals.push(this.datePipe.transform(+item.time*1000, 'medium'));
        vals.push(item.gsm_signal_strength);
        vals.push(item.voltage_level);
        worksheet.addRow(vals);
        i++;
      })
    }
    if(reportName == 'Monitor SOS Press'){
      worksheet.getColumn(1).width = 10;
      worksheet.getColumn(2).width = 15;
      worksheet.getColumn(3).width = 40;
      worksheet.getColumn(4).width = 30;
      worksheet.getColumn(5).width = 10;
      worksheet.getColumn(6).width = 10;
      worksheet.getColumn(7).width = 10;
    }
    else{
      worksheet.getColumn(1).width = 10;
      worksheet.getColumn(2).width = 15;
      worksheet.getColumn(3).width = 30;
      worksheet.getColumn(4).width = 10;
      worksheet.getColumn(5).width = 10;
    }

    this.saveFile(workbook,FileName)
  
  }//end method

  generateDateRangeExceptionExcel(reportName,data,tableHeader,startDt,endDt){
     //Create workbook and worksheet
    let workbook = new Excel.Workbook();

    let worksheet = workbook.addWorksheet('Report');
    //setFileName
    let FileName, subTitleRow;
    //Add Row
    let titleRow = worksheet.addRow([reportName]);
    worksheet.addRow([]);
    subTitleRow = worksheet.addRow(['Date From: ' + this.datePipe.transform(startDt, 'mediumDate')
                                          +' To: ' + this.datePipe.transform(endDt, 'mediumDate')])
    FileName = reportName.replace(/\s/g, "")+'_'+this.datePipe.transform(startDt, 'MMM d').replace(/\s/g, "")+'To'+this.datePipe.transform(endDt, 'MMM d').replace(/\s/g, "")
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
    worksheet.font = {
      name: 'Times New Roman',
      border: 'thin'
    }
   /*  worksheet.getColumn('B').font = {
      name: 'Times New Roman',
      color: { argb: "004e47cc" }
    }; */
    worksheet.mergeCells('A3:E3');
    worksheet.mergeCells('A1:E2');
   
    //Blank Row 
    worksheet.addRow([]);
    //Add Header Row
    
    let headerRow = worksheet.addRow(tableHeader);
    //set style to file
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
    let i=1;
    data.forEach(item => {
      worksheet.addRow(item);
    })

    worksheet.getColumn(1).width = 25;

    this.saveFile(workbook,FileName)
  }//end method

  //to download the file
  saveFile(workbook,fileName){
     //Generate Excel File with given name
     workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName+'.xlsx');
    })
  }

}
