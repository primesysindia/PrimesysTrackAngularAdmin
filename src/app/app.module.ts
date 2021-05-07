import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from './core/material.module';
import { AppRoutingModule } from './core/app.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginService } from './services/login.service';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { HistoryComponent } from './history/history.component';
import { ReportComponent } from './report/report.component';
import { PaymentComponent } from './payment/payment.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { GetDeviceService } from './services/get-device.service';
import { ScrollbarModule } from 'ngx-scrollbar';
import { FindDevicePipe } from './filters/find-device.pipe';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { WebsocketService } from './services/websocket.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import { GetHistoryService } from './services/get-history.service';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { ModuleListService } from './services/module-list.service';
import { ReportService } from './services/report.service';
import { TripReportComponent } from './report/trip-report/trip-report.component';
import { ExcelService } from './services/excel.service';
import { DatePipe } from '@angular/common';
import { CurrentStatusComponent } from './report/current-status/current-status.component';
import { OffDeviceComponent } from './report/off-device/off-device.component';
import { NgxLoadingModule } from 'ngx-loading';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SortDevicesPipe } from './filters/sort-devices.pipe';
import { PaymentService } from './services/payment.service';
import { FeedbackService } from './services/feedback.service';
import { ManageEmployeeComponent } from './manage-employee/manage-employee.component';
import { DownloadTaskComponent } from './download-task/download-task.component';
import { AddEmpComponent } from './manage-employee/add-emp/add-emp.component';
import { TaskManagementService } from './services/task-management.service';
import { OfflineComponent } from './offline/offline.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrderModule } from 'ngx-order-pipe';
import { SearchDevicePipe } from './filters/search-device.pipe';
import { AllLocationPipe } from './filters/all-location.pipe';
import { UserDataService } from './services/user-data.service';
import { AddTaskComponent } from './add-task/add-task.component';
import { ViewTaskComponent } from './view-task/view-task.component';
import { UpdateTaskDialogComponent } from './dialog/update-task-dialog/update-task-dialog.component';
import { CopyTaskViewDialogComponent } from './dialog/copy-task-view-dialog/copy-task-view-dialog.component';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard/admin-dashboard.component';
// import {SearchBarComponent} from './search-bar/search-bar.component';
import { BeatUpdateComponent } from './admin-dashboard/beat-update/beat-update.component';
import { AddBeatFormComponent } from './admin-dashboard/add-beat-form/add-beat-form.component';
import { SelectExampleComponent } from './select-example/select-example.component';
import { EditBeatComponent } from './admin-dashboard/edit-beat/edit-beat.component';
import { PatrolmanDetailsComponent } from './admin-dashboard/patrolman-details/patrolman-details.component';
import { AddPatmasterBeatComponent } from './admin-dashboard/add-patmaster-beat/add-patmaster-beat.component';
import { AddPatrolmanBeatComponent } from './admin-dashboard/add-patrolman-beat/add-patrolman-beat.component';
import { EditPatrolmanBeatComponent } from './admin-dashboard/edit-patrolman-beat/edit-patrolman-beat.component';
import { SidenavService } from './services/sidenav.service';
import { HierarchyModuleComponent } from './admin-dashboard/hierarchy-module/hierarchy-module.component';
import { AddHierarchyComponent } from './admin-dashboard/add-hierarchy/add-hierarchy.component';
import { EditHierarchyComponent } from './admin-dashboard/edit-hierarchy/edit-hierarchy.component';
import { ConfirmDialogComponent } from './admin-dashboard/confirm-dialog/confirm-dialog.component';
import { ApprovePatrolmanComponent } from './admin-dashboard/approve-patrolman/approve-patrolman.component';
import { ApproveHierarchyComponent } from './admin-dashboard/approve-hierarchy/approve-hierarchy.component';
import { IssueTrackingComponent } from './admin-dashboard/issue-tracking/issue-tracking.component';
import { AddIssueComponent } from './admin-dashboard/add-issue/add-issue.component';
import { EditIssueComponent } from './admin-dashboard/edit-issue/edit-issue.component';
import { StudentUpdateComponent } from './admin-dashboard/student-update/student-update.component';
import { ConfirmDeviceexcahngeComponent } from './admin-dashboard/confirm-deviceexcahnge/confirm-deviceexcahnge.component';
import { NewStudentUpdateComponent } from './admin-dashboard/new-student-update/new-student-update.component';
import { DeviceExchangeComponent } from './admin-dashboard/device-exchange/device-exchange.component';
import { ConfirmdevExBeatComponent } from './admin-dashboard/confirmdev-ex-beat/confirmdev-ex-beat.component';
import { ExchangeHistoryComponent } from './admin-dashboard/exchange-history/exchange-history.component';
import { CustomCommandModuleComponent } from './admin-dashboard/custom-command-module/custom-command-module.component';
import { CommandHistoryComponent } from './admin-dashboard/command-history/command-history.component';
import { IssueHistoryComponent } from './admin-dashboard/issue-history/issue-history.component';
import { ReplaceUnderscorePipe } from './filters/replace-underscore.pipe';
import { DeviceTrackerComponent } from './admin-dashboard/device-tracker/device-tracker.component';
import { DevicesHistoryComponent } from './admin-dashboard/devices-history/devices-history.component';
import { SendMailComponent } from './admin-dashboard/send-mail/send-mail.component';
import { ServerStatisticsComponent } from './admin-dashboard/server-statistics/server-statistics.component';
import { UploadRdpsComponent } from './admin-dashboard/upload-rdps/upload-rdps.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectSearchComponent } from './mat-select-search/mat-select-search.component';
import { DeviceDiagnoseComponent } from './admin-dashboard/device-diagnose/device-diagnose.component';
import { BatteryInfoModuleComponent } from './admin-dashboard/battery-info-module/battery-info-module.component';
import { DevicePaymentComponent } from './admin-dashboard/device-payment/device-payment.component';
import { DeleteBeatComponent } from './admin-dashboard/delete-beat/delete-beat.component';
import { DemoIssueComponent } from './admin-dashboard/demo-issue/demo-issue.component';
import { AllDeviceInfoComponent } from './admin-dashboard/all-device-info/all-device-info.component';
import { FilterDevicesPipe } from './filters/filter-devices.pipe';
import { EditDeviceDetailsComponent } from './admin-dashboard/edit-device-details/edit-device-details.component';
import { CustomerIssuesComponent } from './admin-dashboard/customer-issues/customer-issues.component';
import { ViewCustomerIssuesComponent } from './admin-dashboard/view-customer-issues/view-customer-issues.component';
import { UserSearchPipe } from './filters/user-search.pipe';
// import { PatrolmenBeatVerificationComponent } from './admin-dashboard/patrolmen-beat-verification/patrolmen-beat-verification.component';
import { KeymenBeatVerificationComponent } from './user-portal-handling-module/keymen-beat-verification/keymen-beat-verification.component';
import { KeymenBeatApprovalComponent } from './user-portal-handling-module/keymen-beat-approval/keymen-beat-approval.component';
import { PatrolmenBeatVerificationComponent } from './user-portal-handling-module/patrolmen-beat-verification/patrolmen-beat-verification.component';
import { EditKeymenBeatsComponent } from './user-portal-handling-module/edit-keymen-beats/edit-keymen-beats.component';
import { DeviceRemoveUnregisterComponent } from './admin-dashboard/device-remove-unregister/device-remove-unregister.component';
import { GenerateReportComponent } from './admin-dashboard/generate-report/generate-report.component';
import { ConfirmDeviceUnregisterComponent } from './admin-dashboard/confirm-device-unregister/confirm-device-unregister.component';
import { ConfirmDeviceRemoveComponent } from './admin-dashboard/confirm-device-remove/confirm-device-remove.component';
import { AddDeviceComponent } from './admin-dashboard/add-device/add-device.component';
import { AddDeviceConfirmComponent } from './admin-dashboard/add-device-confirm/add-device-confirm.component';
import { MultipleDeviceConfirmComponent } from './admin-dashboard/multiple-device-confirm/multiple-device-confirm.component';
import { PatrolmenBeatApprovalComponent } from './user-portal-handling-module/patrolmen-beat-approval/patrolmen-beat-approval.component';
import { AddKeymenMutipleBeatComponent } from './admin-dashboard/add-keymen-mutiple-beat/add-keymen-mutiple-beat.component';
import { CommandTabeFilterPipe } from './filters/command-tabe-filter.pipe';
// import { MatTableFilterModule } from 'mat-table-filter';
import { SearchComponent } from './admin-dashboard/command-filter-module/search/search.component';
import { CommandTableComponent } from './admin-dashboard/command-filter-module/command-table/command-table.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { OnsiteInspectionFormComponent } from './admin-dashboard/onsite-inspection-form/onsite-inspection-form.component';
import { EditInspectionFormComponent } from './admin-dashboard/edit-inspection-form/edit-inspection-form.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AppHeaderComponent,
    HistoryComponent,
    ReportComponent,
    PaymentComponent,
    FeedbackComponent,
    AppFooterComponent,
    FindDevicePipe,
    TripReportComponent,
    CurrentStatusComponent,
    OffDeviceComponent,
    SortDevicesPipe,
    ManageEmployeeComponent,
    DownloadTaskComponent,
    AddEmpComponent,
    OfflineComponent,
    SearchDevicePipe,
    AllLocationPipe,
    AddTaskComponent,
    ViewTaskComponent,
    UpdateTaskDialogComponent,
    CopyTaskViewDialogComponent,
    AdminDashboardComponent,
    // SearchBarComponent,
    BeatUpdateComponent,
    AddBeatFormComponent,
    SelectExampleComponent,
    EditBeatComponent,
    PatrolmanDetailsComponent,
    AddPatmasterBeatComponent,
    AddPatrolmanBeatComponent,
    EditPatrolmanBeatComponent,
    HierarchyModuleComponent,
    AddHierarchyComponent,
    EditHierarchyComponent,
    ConfirmDialogComponent,
    ApprovePatrolmanComponent,
    ApproveHierarchyComponent,
    IssueTrackingComponent,
    AddIssueComponent,
    EditIssueComponent,
    StudentUpdateComponent,
    ConfirmDeviceexcahngeComponent,
    NewStudentUpdateComponent,
    DeviceExchangeComponent,
    ConfirmdevExBeatComponent,
    ExchangeHistoryComponent,
    CustomCommandModuleComponent,
    CommandHistoryComponent,
    IssueHistoryComponent,
    ReplaceUnderscorePipe,
    DeviceTrackerComponent,
    DevicesHistoryComponent,
    SendMailComponent,
    ServerStatisticsComponent,
    UploadRdpsComponent,
    MatSelectSearchComponent,
    DeviceDiagnoseComponent,
    BatteryInfoModuleComponent,
    DevicePaymentComponent,
    DeleteBeatComponent,
    DemoIssueComponent,
    AllDeviceInfoComponent,
    FilterDevicesPipe,
    EditDeviceDetailsComponent,
    CustomerIssuesComponent,
    ViewCustomerIssuesComponent,
    // PatrolmenBeatVerificationComponent,
    KeymenBeatVerificationComponent,
    KeymenBeatApprovalComponent,
    UserSearchPipe,
    PatrolmenBeatVerificationComponent,
    EditKeymenBeatsComponent,
    DeviceRemoveUnregisterComponent,
    GenerateReportComponent,
    ConfirmDeviceUnregisterComponent,
    ConfirmDeviceRemoveComponent,
    AddDeviceComponent,
    AddDeviceConfirmComponent,
    MultipleDeviceConfirmComponent,
    PatrolmenBeatApprovalComponent,
    AddKeymenMutipleBeatComponent,
    CommandTabeFilterPipe,
    SearchComponent,
    CommandTableComponent,
    OnsiteInspectionFormComponent,
    EditInspectionFormComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCfxl6zY8sJMW-pVsmwYClRPyfxWkQb8us'
    }),
    AgmJsMarkerClustererModule,
    NgxLoadingModule.forRoot({}),
    AgmSnazzyInfoWindowModule,
    ScrollbarModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule,
    ChartsModule,
    SlimLoadingBarModule,
    NgSelectModule,
    OrderModule,
    NgxMatSelectSearchModule,
    NgxPaginationModule
  ],
  providers: [
    LoginService,

    
    UserDataService,
    AuthGuard,
    GetDeviceService,
    WebsocketService,
    GetHistoryService,
    ModuleListService,
    ReportService,
    ExcelService,
    DatePipe,
    GoogleMapsAPIWrapper,
    PaymentService,
    FeedbackService,
    TaskManagementService,
    SidenavService
  ],
  entryComponents: [
    UpdateTaskDialogComponent,
    CopyTaskViewDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
