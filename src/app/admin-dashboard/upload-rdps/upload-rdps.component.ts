import { Component, OnInit, ViewChild } from '@angular/core';

export class CSVRecord {  
	public Km: any;  
	public Dist : any;  
	public lat: any;  
	public long: any;  
	public feature_code: any;  
  public Feature_details: any;     
  public Section_name: any;

} 
@Component({
  selector: 'app-upload-rdps',
  templateUrl: './upload-rdps.component.html',
  styleUrls: ['./upload-rdps.component.css']
})

export class UploadRdpsComponent implements OnInit {
  csvContent: string;
  @ViewChild('csvReader') csvReader: any;  
  constructor() { }

  ngOnInit() {
  }
  // onFileLoad(fileLoadedEvent) {
  //   const textFromFileLoaded = fileLoadedEvent.target.result;              
  //   this.csvContent = textFromFileLoaded;     
  //   console.log(this.csvContent);
  // }

  // onFileSelect(input: HTMLInputElement) {

  //   const files = input.files;
  //   var content = this.csvContent;

  //  if (files && files.length) {
      
  //       console.log("Filename: " + files[0].name);
  //       console.log("Type: " + files[0].type);
  //       console.log("Size: " + files[0].size + " bytes");
     

  //       const fileToRead = files[0];

  //       const fileReader = new FileReader();
  //       fileReader.onload = this.onFileLoad;

  //       fileReader.readAsText(fileToRead, "UTF-8");
  //  }

  // }
  public records: any[] = [];  
  isValidCSVFile(file: any) {  
    return file.name.endsWith(".csv");  
  } 

  getHeaderArray(csvRecordsArr: any) {  
    let headers = (<string>csvRecordsArr[0]).split(',');  
    let headerArray = [];  
    for (let j = 0; j < headers.length; j++) {  
      headerArray.push(headers[j]);  
    }  
    return headerArray;  
  }  

  uploadListener($event: any): void {  
  
    let text = [];  
    let files = $event.srcElement.files;  
  
    if (this.isValidCSVFile(files[0])) {  
  
      let input = $event.target;  
      let reader = new FileReader();  
      reader.readAsText(input.files[0]);  
  
      reader.onload = () => {  
        let csvData = reader.result;  
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray);  
        console.log("headersRow", headersRow)
        if(headersRow[0] == 'Km') {
          console.log("true");
        } 
        else {
          console.log("false");
        }
  
        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);  
        console.log("record", this.records)
      };  
  
      reader.onerror = function () {  
        console.log('error is occured while reading file!');  
      };  
  
    } else {  
      alert("Please upload valid .csv file.");  
      this.fileReset();  
    }  
  }

  fileReset() {  
    this.csvReader.nativeElement.value = "";  
    this.records = [];  
  }  

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {  
    let csvArr = [];  
  
    for (let i = 1; i < csvRecordsArray.length; i++) {  
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');  
      if (curruntRecord.length == headerLength) {  
        let csvRecord: CSVRecord = new CSVRecord();  
        csvRecord.Km = curruntRecord[0].trim();  
        csvRecord.Dist = curruntRecord[1].trim();  
        csvRecord.lat = curruntRecord[2].trim();  
        csvRecord.feature_code = curruntRecord[3].trim();  
        csvRecord.Feature_details = curruntRecord[4].trim();  
        csvRecord.Section_name = curruntRecord[5].trim();  
        csvArr.push(csvRecord);  
        // console.log("arr", csvArr);
      
      }  
    }  
    return csvArr;  
  }  
}
// https://monkelite.com/how-to-read-csv-file-in-angular/