import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { HomeComponent } from '../home/home.component';
import { AuthGuard } from '../auth.guard';
import { HistoryComponent } from '../history/history.component';
import { ReportComponent } from '../report/report.component';
import { PaymentComponent } from '../payment/payment.component';
import { FeedbackComponent } from '../feedback/feedback.component';
import { HistoryNotFoundComponent } from '../dialog/history-not-found/history-not-found.component';
import { ManageEmployeeComponent } from '../manage-employee/manage-employee.component';
import { DownloadTaskComponent } from '../download-task/download-task.component';
import { OfflineComponent } from '../offline/offline.component';
import { AddTaskComponent } from '../add-task/add-task.component';
import { ViewTaskComponent } from '../view-task/view-task.component';

import { SelectExampleComponent } from '../select-example/select-example.component';
// import { SearchBarComponent} from '../search-bar/search-bar.component';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard/admin-dashboard.component';
import { BeatUpdateComponent } from '../admin-dashboard/beat-update/beat-update.component';
import { AddBeatFormComponent } from '../admin-dashboard/add-beat-form/add-beat-form.component';
import { EditBeatComponent } from '../admin-dashboard/edit-beat/edit-beat.component';
import { PatrolmanDetailsComponent } from '../admin-dashboard/patrolman-details/patrolman-details.component';
import { AddPatmasterBeatComponent } from '../admin-dashboard/add-patmaster-beat/add-patmaster-beat.component';
import { AddPatrolmanBeatComponent } from '../admin-dashboard/add-patrolman-beat/add-patrolman-beat.component';
import { EditPatrolmanBeatComponent } from '../admin-dashboard/edit-patrolman-beat/edit-patrolman-beat.component';
import { HierarchyModuleComponent } from '../admin-dashboard/hierarchy-module/hierarchy-module.component';
import { AddHierarchyComponent } from '../admin-dashboard/add-hierarchy/add-hierarchy.component';
import { ConfirmDialogComponent } from '../admin-dashboard/confirm-dialog/confirm-dialog.component';
import { ApprovePatrolmanComponent } from '../admin-dashboard/approve-patrolman/approve-patrolman.component';
import { EditHierarchyComponent } from '../admin-dashboard/edit-hierarchy/edit-hierarchy.component';
import { ApproveHierarchyComponent } from '../admin-dashboard/approve-hierarchy/approve-hierarchy.component';
import { IssueTrackingComponent } from '../admin-dashboard/issue-tracking/issue-tracking.component';
import { AddIssueComponent } from '../admin-dashboard/add-issue/add-issue.component';
import { EditIssueComponent } from '../admin-dashboard/edit-issue/edit-issue.component';
import { StudentUpdateComponent } from '../admin-dashboard/student-update/student-update.component';
import { ConfirmDeviceexcahngeComponent } from '../admin-dashboard/confirm-deviceexcahnge/confirm-deviceexcahnge.component';
import { NewStudentUpdateComponent } from '../admin-dashboard/new-student-update/new-student-update.component';
import { DeviceExchangeComponent } from '../admin-dashboard/device-exchange/device-exchange.component';
import { ConfirmdevExBeatComponent } from '../admin-dashboard/confirmdev-ex-beat/confirmdev-ex-beat.component';
import { ExchangeHistoryComponent } from '../admin-dashboard/exchange-history/exchange-history.component';
import { CustomCommandModuleComponent } from '../admin-dashboard/custom-command-module/custom-command-module.component';
import { CommandHistoryComponent } from '../admin-dashboard/command-history/command-history.component';
import { IssueHistoryComponent } from '../admin-dashboard/issue-history/issue-history.component';
import { DeviceTrackerComponent } from '../admin-dashboard/device-tracker/device-tracker.component';
import { DevicesHistoryComponent } from '../admin-dashboard/devices-history/devices-history.component';
import { SendMailComponent } from '../admin-dashboard/send-mail/send-mail.component';
import { ServerStatisticsComponent } from '../admin-dashboard/server-statistics/server-statistics.component';
import { UploadRdpsComponent } from '../admin-dashboard/upload-rdps/upload-rdps.component';
import { DeviceDiagnoseComponent } from '../admin-dashboard/device-diagnose/device-diagnose.component';
import { BatteryInfoModuleComponent } from '../admin-dashboard/battery-info-module/battery-info-module.component';
import { DevicePaymentComponent } from '../admin-dashboard/device-payment/device-payment.component';
import { DeleteBeatComponent } from '../admin-dashboard/delete-beat/delete-beat.component';
import { DemoIssueComponent } from '../admin-dashboard/demo-issue/demo-issue.component';
import { AllDeviceInfoComponent } from '../admin-dashboard/all-device-info/all-device-info.component';
import { EditDeviceDetailsComponent } from '../admin-dashboard/edit-device-details/edit-device-details.component';
import { CustomerIssuesComponent } from '../admin-dashboard/customer-issues/customer-issues.component';
import { ViewCustomerIssuesComponent } from '../admin-dashboard/view-customer-issues/view-customer-issues.component';
import { PatrolmenBeatVerificationComponent } from '../user-portal-handling-module/patrolmen-beat-verification/patrolmen-beat-verification.component';
import { KeymenBeatVerificationComponent } from '../user-portal-handling-module/keymen-beat-verification/keymen-beat-verification.component';
import { KeymenBeatApprovalComponent } from '../user-portal-handling-module/keymen-beat-approval/keymen-beat-approval.component';
import { EditKeymenBeatsComponent } from '../user-portal-handling-module/edit-keymen-beats/edit-keymen-beats.component';
import { DeviceRemoveUnregisterComponent } from '../admin-dashboard/device-remove-unregister/device-remove-unregister.component';
import { GenerateReportComponent } from '../admin-dashboard/generate-report/generate-report.component';
import { ConfirmDeviceUnregisterComponent } from '../admin-dashboard/confirm-device-unregister/confirm-device-unregister.component';
import { ConfirmDeviceRemoveComponent } from '../admin-dashboard/confirm-device-remove/confirm-device-remove.component';
import { AddDeviceComponent } from '../admin-dashboard/add-device/add-device.component';
import { AddDeviceConfirmComponent } from '../admin-dashboard/add-device-confirm/add-device-confirm.component';
import { MultipleDeviceConfirmComponent } from '../admin-dashboard/multiple-device-confirm/multiple-device-confirm.component';
import { PatrolmenBeatApprovalComponent } from '../user-portal-handling-module/patrolmen-beat-approval/patrolmen-beat-approval.component';
import { AddKeymenMutipleBeatComponent } from '../admin-dashboard/add-keymen-mutiple-beat/add-keymen-mutiple-beat.component';
import { SearchComponent } from '../admin-dashboard/command-filter-module/search/search.component';
import { CommandTableComponent } from '../admin-dashboard/command-filter-module/command-table/command-table.component';
import { OnsiteInspectionFormComponent } from '../admin-dashboard/onsite-inspection-form/onsite-inspection-form.component';
import { EditInspectionFormComponent } from '../admin-dashboard/edit-inspection-form/edit-inspection-form.component';
import { AppModuleComponent } from '../admin-dashboard/app-module/app-module.component';
import { AddUserappModuleComponent } from '../admin-dashboard/add-userapp-module/add-userapp-module.component';
import { EditAppModuleComponent } from '../admin-dashboard/edit-app-module/edit-app-module.component';
import { DeleteAppModuleComponent } from '../admin-dashboard/delete-app-module/delete-app-module.component';
import { UserMappingModuleComponent } from '../admin-dashboard/user-mapping-module/user-mapping-module.component';
import { UserUtilityModuleComponent } from '../admin-dashboard/user-utility-module/user-utility-module.component';
import { AddUserUtilityComponent } from '../admin-dashboard/add-user-utility/add-user-utility.component';
import { EditUserUtilityComponent } from '../admin-dashboard/edit-user-utility/edit-user-utility.component';
import { DeleteUserUtilityComponent } from '../admin-dashboard/delete-user-utility/delete-user-utility.component';
import { UserUtilityMappingComponent } from '../admin-dashboard/user-utility-mapping/user-utility-mapping.component';
import { VersionControlComponent } from '../version-control/version-control.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'track-device', component: HomeComponent, canActivate:[AuthGuard] },
  { path: 'history', component: HistoryComponent, canActivate:[AuthGuard] },
  { path: 'report', component: ReportComponent, canActivate:[AuthGuard] },
  { path: 'payment', component: PaymentComponent, canActivate:[AuthGuard] },
  { path: 'feedback', component: FeedbackComponent, canActivate:[AuthGuard] },
  { path: 'manage-employee', component: ManageEmployeeComponent, canActivate:[AuthGuard] },
  { path: 'add-task', component: AddTaskComponent, canActivate:[AuthGuard] },
  { path: 'tasks', component: ViewTaskComponent, canActivate:[AuthGuard] },
  { path: 'download-task', component: DownloadTaskComponent, canActivate:[AuthGuard] },

  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate:[AuthGuard] },
  { path: 'beat-update', component: BeatUpdateComponent, canActivate:[AuthGuard] },
  { path: 'add-beat', component: AddBeatFormComponent, canActivate:[AuthGuard] },
  { path: 'select', component: SelectExampleComponent, canActivate:[AuthGuard] },
  // { path: 'select-bar', component: SearchBarComponent, canActivate:[AuthGuard] },
  { path: 'patrolman-detail', component: PatrolmanDetailsComponent, canActivate:[AuthGuard] },
  { path: 'master-beat', component: AddPatmasterBeatComponent, canActivate:[AuthGuard] },
  { path: 'patrolman-beat', component: AddPatrolmanBeatComponent, canActivate:[AuthGuard] },
  { path: 'edit-beat/:id', component: EditBeatComponent, canActivate:[AuthGuard] },
  { path: 'edit-patrolman-beat/:id', component: EditPatrolmanBeatComponent, canActivate:[AuthGuard] },
  { path: 'hierarchy-module', component: HierarchyModuleComponent, canActivate:[AuthGuard] },
  { path: 'add-hierarchy', component: AddHierarchyComponent, canActivate:[AuthGuard] },
  { path: 'confirm-box', component: ConfirmDialogComponent, canActivate:[AuthGuard] },
  { path: 'approve-beat', component: ApprovePatrolmanComponent, canActivate:[AuthGuard] },
  { path: 'edit-hierarchy', component: EditHierarchyComponent, canActivate:[AuthGuard] },
  { path: 'approve-hierarchy', component: ApproveHierarchyComponent, canActivate:[AuthGuard] },
  { path: 'issue-tracking', component: IssueTrackingComponent, canActivate:[AuthGuard] },
  { path: 'add-issue', component: AddIssueComponent, canActivate:[AuthGuard] },
  { path: 'edit-issue', component: EditIssueComponent, canActivate:[AuthGuard] },
  { path: 'student-module', component: StudentUpdateComponent, canActivate:[AuthGuard] },
  { path: 'update-student', component: NewStudentUpdateComponent, canActivate:[AuthGuard] },
  { path: 'confirm', component: ConfirmDeviceexcahngeComponent, canActivate:[AuthGuard] },
  { path: 'exchange-student', component: DeviceExchangeComponent, canActivate:[AuthGuard] },
  { path: 'exchange-history', component: DeviceExchangeComponent, canActivate:[AuthGuard] },
  { path: 'update-device-details', component: EditDeviceDetailsComponent, canActivate:[AuthGuard] },
  
  { path: 'confirm-complete-exchange', component: ConfirmdevExBeatComponent, canActivate:[AuthGuard] },
  { path: 'exchange-confirm', component: ExchangeHistoryComponent, canActivate:[AuthGuard] },
  { path: 'custom-command', component: CustomCommandModuleComponent, canActivate: [AuthGuard]},
  { path: 'command-table', component: CommandHistoryComponent, canActivate: [AuthGuard]},
  { path: 'issue-history', component: IssueHistoryComponent, canActivate: [AuthGuard] },
  { path: 'home', component: DeviceTrackerComponent, canActivate: [AuthGuard] },
  { path: 'tracking-history', component: DevicesHistoryComponent, canActivate: [AuthGuard] },
  { path: 'server-statics', component: ServerStatisticsComponent, canActivate: [AuthGuard] },
  { path: 'upload-rdps', component: UploadRdpsComponent, canActivate: [AuthGuard] },
  { path: 'send-mail', component: SendMailComponent, canActivate: [AuthGuard] },
  { path: 'device-diagnose', component: DeviceDiagnoseComponent, canActivate: [AuthGuard] },
  { path: 'battery-info', component: BatteryInfoModuleComponent, canActivate: [AuthGuard]},
  { path: 'delete-beat', component: DeleteBeatComponent, canActivate: [AuthGuard]},
  { path: 'issue-demo', component: DemoIssueComponent, canActivate: [AuthGuard]},
  { path: 'device-payment', component: DevicePaymentComponent, canActivate: [AuthGuard]},
  { path: 'devices-info', component: AllDeviceInfoComponent, canActivate: [AuthGuard]},
  { path: 'customer-issues', component: CustomerIssuesComponent, canActivate:[AuthGuard] },
  { path: 'view-customer-issues', component: ViewCustomerIssuesComponent, canActivate:[AuthGuard] },
  { path: 'patrolmen-verification', component: PatrolmenBeatVerificationComponent, canActivate:[AuthGuard] },
  { path: 'keymen-verification', component: KeymenBeatVerificationComponent, canActivate:[AuthGuard] },
  { path: 'keymen-approval', component: KeymenBeatApprovalComponent, canActivate:[AuthGuard] },
  { path: 'keymen-beat-update', component: EditKeymenBeatsComponent, canActivate:[AuthGuard] },
  { path: 'device-unregister', component: DeviceRemoveUnregisterComponent, canActivate:[AuthGuard] },
  { path: 'generate-report', component: GenerateReportComponent, canActivate:[AuthGuard] },
  { path: 'confirm-unregister', component: ConfirmDeviceUnregisterComponent, canActivate:[AuthGuard] },
  { path: 'confirm-remove', component: ConfirmDeviceRemoveComponent, canActivate:[AuthGuard] },
  { path: 'add-device', component: AddDeviceComponent, canActivate:[AuthGuard] },
  { path: 'add-device-confirm', component: AddDeviceConfirmComponent, canActivate:[AuthGuard] },
  { path: 'multiple-device-confirm', component: MultipleDeviceConfirmComponent, canActivate:[AuthGuard] },
  { path: 'patrolmen-approval', component: PatrolmenBeatApprovalComponent, canActivate:[AuthGuard] },
  { path: 'keymen-multiple-beats', component: AddKeymenMutipleBeatComponent, canActivate:[AuthGuard] },
  { path: 'search-component', component: SearchComponent, canActivate:[AuthGuard] },
  { path: 'command-history', component: CommandTableComponent, canActivate:[AuthGuard] },
  { path: 'edit-inspection-form', component: EditInspectionFormComponent, canActivate:[AuthGuard] },
  { path: 'inspection-form', component: OnsiteInspectionFormComponent, canActivate:[AuthGuard] },
  { path: 'userApp-module-details', component: AppModuleComponent, canActivate:[AuthGuard] },
  { path: 'add-app-module', component: AddUserappModuleComponent, canActivate:[AuthGuard] },
  { path: 'edit-app-module', component: EditAppModuleComponent, canActivate:[AuthGuard] },
  { path: 'delete-app-module', component: DeleteAppModuleComponent, canActivate:[AuthGuard] },
  { path: 'user-mapping-module', component: UserMappingModuleComponent, canActivate:[AuthGuard] },
  { path: 'user-utility-details', component: UserUtilityModuleComponent, canActivate:[AuthGuard] },
  { path: 'add-utility-module', component: AddUserUtilityComponent, canActivate:[AuthGuard] },
  { path: 'edit-utility-module', component: EditUserUtilityComponent, canActivate:[AuthGuard] },
  { path: 'delete-utility-module', component: DeleteUserUtilityComponent, canActivate:[AuthGuard] },
  { path: 'utility-mapping-module', component: UserUtilityMappingComponent, canActivate:[AuthGuard] },
  { path: 'version-page', component: VersionControlComponent, canActivate:[AuthGuard] },
  { path: 'offline', component: OfflineComponent},
  { path: '', component : LoginComponent},
   // otherwise redirect to home
   { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [
    RouterModule
  ],
  declarations: [ 
                  HistoryNotFoundComponent
                ],
  entryComponents:[
                  HistoryNotFoundComponent
                ]
})
export class AppRoutingModule {}