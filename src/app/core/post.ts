export interface ParentUserList {
  Name: string,
  parentId: number,
  rollId: number,
  studentCount: number
}

export interface KeyManBeatList {
  SectionName: string,
  DeviceId: number,
  parentId: number,
  studentId: number,
  beatId: number,
  KmStart: number,
  KmEnd: number,
  Start_Lat: number,
  Start_Lon: number,
  End_Lat: number,
  End_Lon: number,
  isApprove: boolean
}

export interface PostKeymanData {
  SectionName: string,
  ParentId: number,
  StudentID : number,
  KmStart: number,
  KmEnd: number,
  startLat: number,
  startLon: number,
  endLat: number,
  endLan: number

}

export interface PetrolmanBeatList {
  sectionName: string,
  deviceID: number,
  tripName: string,
  kmFromTo: number,
  tripStartTime:number,
  tripEndTime: number,
  tripSpendTimeIntervalAdd:number,
  tripStartTimeAdd: number,
  tripTimeShedule: number,
  parentId: number,
  beatId: number,
  studentId: number,
  fk_TripMasterId: number,
  createdBy: number,
  kmStart: number,
  kmStartLat: number,
  kmStartLang: number,
  kmEnd: number,
  kmEndLat: number,
  kmEndLang: number,
  totalKmCover: number

}

export interface getHierarchyData {
  
  userLoginId: number,
  deptId: number,
  deptParentId: number,
  parentId: number,
  hirachyParentId: number,
  createdBy: number,
  hirachyId: number,
  userPassword: string,
  deptName: string,
  parentName: string,
  deptParentName: string,
  emailId: string,
  studentsNo: number,
  mobileNo: number,
  designation: string,
  isApprove: boolean,
  selected: boolean;

}

export interface deptHierachyName {
  deptId: number,
  name: string
}

export interface issuesTitleList {
  isseMasterId: number,
  issueTitle: string
}

export interface IssueList {
  issueTitle: string,
  contactPerson: string,
  issueTime: string,
  contactPersonMobNo: number   ,
  issueComment: string,
  createdAt: string,
  issueStatus: number,
  isseMasterId: number,
  issueId: number,
  priority: number,
  parentId: number,
  studentId: number,
  userLoginId: number,
  createdBy: number,
  updatedBy: number,
  updatedAt: number,
  isSendMail: boolean,
  isBatteryOn:number,
  isDeviceOn:number,
  isImeiSIMCorrect:number,
  isGSMOn:number,
  isDeviceButtonOn:number,
  isGpsOn:number,
  fileId: number,
  fileName: string,
  fileUrl: string,
  divisionName: string,
  deviceName: string,
  issueOwner: string,
  deviceId: string,
}

export interface fileList {
  fileId: number,
  fileName: string,
  fileUrl: string
}

export interface commandHistory {
  imeiNo: number,
  name: string,
  command: string,
  commandResponse: string,
  deviceResponse: string,
  commandDeliveryStatus: string,
  timeStamp: number,
  studentId: number
}

export interface GetExchangedDeviceList {
  afterDeviceId1: number,
  afterDeviceId2: number,
  afterDeviceSimNo1: number,
  afterDeviceSimNo2: number,
  beforDeviceSimNo1: number,
  beforDeviceSimNo2: number,
  beforeDeviceId1: number,
  beforeDeviceId2: number,
  createdAt: number,
  createdBy: number,
  issueOwner: string,
  id: number,
  name1: string,
  name2: string,
  parentId: number,
  studentId1: number,
  studentId2: number
}

export interface GetBatteryInfo {
  status: string,
  timestamp: string
}

export interface GetTripMaster {
  beatId: number,
  createdBy: string,
  fk_TripMasterId: number,
  parentId: number,
  seasonId: number,
  studentId: number,
  tripName: string,
  tripSpendTimeIntervalAdd: string,
  tripStartTimeAdd: string,
  tripTimeShedule: string,
  userLoginId: number
}

export interface GetAllDeviceInfo {
  deviceName: string,
  deviceSimNo: number,
  activationDate: string,
  userName: string,
  deviceId: number,
  parentId:number,
  studentId: number,
  firstName: string,
  lastName: string
}

export interface GetPaymentDetailsInfo {
  Device_name: string, 
  IMEI_No: string, 
  Device_SimNo: string, 
  Plan_Type: string, 
  LastPaymentDate: string, 
  ExpiryDate: string,
  DeviceStatus: string, 
  RemainingDays: string,
  FullName: string
}

export interface keymenBeatsForApproval {
  ApprovedDate: number,
    BeatId: number,
    CreatedBy: number,
    DeviceId:string,
    Devicename: string,
    EmailWhoInsert: string,
    EndTime: number,
    End_Lat: number,
    End_Lon: number,
    ExistingBeatId: number,
    KmEnd: string,
    KmStart: string,
    MobWhoInsert: string,
    NameWhoInsert:string,
    SectionName: string,
    Start_Lat: number,
    Start_Lon: number,
    UpdatedBy: number,
    UserLoginId: number,
    activeStatus: number,
    beatId: number,
    id: number,
    isApprove: boolean,
    parentId: number,
    startTime: number,
    studentId: number
}

export interface USERS {
  deviceId: string,
  name: string,
  command: string,
  commandResponse: string,
  deviceResponse: string,
  commandDeliveryStatus: string,
  deviceCommandResponse: string,
  commandDeliveredMsg: string,
  timestamp: number,
  studentId: number,
  deviceResponseTime: number,
  login_name: string
}

export interface InspectionData {
   userLoginId :number,
   studentId : number,
   name: string,
   issueTitle : string ,
   issueDescription : string,
   finalTestingReport : string,
   inspectdBy : string,
   contactPerson : string,
   activeStatus : boolean
}