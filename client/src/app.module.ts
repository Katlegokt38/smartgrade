import { LoginErrorComponent } from './loginerror/loginerror.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule, Router } from '@angular/router';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileUploadModule} from 'primeng/fileupload';
import { ToastModule} from 'primeng/toast';
import { TableModule} from 'primeng/table';
import { OverlayPanelModule} from 'primeng/overlaypanel';
import { MessagesModule} from 'primeng/messages';
import { MessageModule} from 'primeng/message';
import { DropdownModule} from 'primeng/dropdown';
import { InputTextModule} from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { InputNumberModule} from 'primeng/inputnumber';
import { TabViewModule} from 'primeng/tabview';
import { MultiSelectModule } from 'primeng/multiselect';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import {
  OKTA_CONFIG,
  OktaAuthGuard,
  OktaAuthModule,
  OktaCallbackComponent,
} from '@okta/okta-angular';

import sampleConfig from './app.config';

const oktaConfig = Object.assign({
  onAuthRequired: (oktaAuth, injector) => {
    const router = injector.get(Router);
    // Redirect the user to your custom login page
    router.navigate(['/login']);
  }
}, sampleConfig.oidc);

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MessagesComponent } from './messages/messages.component';
import { AdminComponent } from './admin/admin.component';
import { StudentComponent } from './student/student.component';
import { EducatorComponent } from './educator/educator.component';
import { SidebarComponent } from './educator/sidebar/sidebar.component';
import { UploadsheetComponent } from './educator/uploadsheet/uploadsheet.component';
import { CardelementComponent } from './educator/cardelement/cardelement.component';
import { OutliersComponent } from './educator/outliers/outliers.component';
import { StudentNavComponent } from './student/student-nav/student-nav.component';
import { StudentMarksComponent } from './student/student-marks/student-marks.component';
import { StudentmodulesComponent } from './student/studentmodules/studentmodules.component';
import { StudentnotificationsComponent } from './student/studentnotifications/studentnotifications.component';
import { StudentdisputesComponent } from './student/studentdisputes/studentdisputes.component';
import { StudentcardsComponent } from './student/studentcards/studentcards.component';
import { DownloadComponent } from './admin/download/download.component';
import { CoursesComponent } from './admin/courses/courses.component';
import { AssessmentsComponent } from './admin/assessments/assessments.component';
import { UsersComponent } from './admin/users/users.component';
import { RegisterUsersComponent } from './admin/register-users/register-users.component';
import { EducatormodulesComponent } from './educator/educatormodules/educatormodules.component';
import { EducatornotificationsComponent } from './educator/educatornotifications/educatornotifications.component';
import { EducatorstudentsComponent } from './educator/educatorstudents/educatorstudents.component';
import { EducatorassessementsComponent } from './educator/educatorassessements/educatorassessements.component';
import { LogoutComponent } from './logout/logout.component';
import { ModulesComponent } from './admin/modules/modules.component';
import { UploadClassListComponent } from './educator/uploadclasslist/uploadclasslist.component';
import { AdminSidebarComponent } from './admin/admin-sidebar/adminsidebar.component';
import { EducatorStudentInfoComponent } from './educator/educatorstudentinfo/educatorstudentinfo.component';
import { EducatorViewNotifsComponent } from './educator/educatorviewnotif/educatorviewnotif.component';
import { EducatorMarkInfoComponent } from './educator/educatormarkinfo/educatormarkinfo.component';
import { StudentViewNotifsComponent } from './student/studentviewnotif/studentviewnotif.component';
import { LogsComponent } from './admin/logs/logs.component';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
  {
    path: 'login/callback',
    component: OktaCallbackComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'messages',
    component: MessagesComponent,
    canActivate: [ OktaAuthGuard ],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [OktaAuthGuard] ,
  },
  {
    path: 'student',
    component: StudentComponent,
    canActivate: [OktaAuthGuard] ,
  },
  {
    path: 'educator',
    component: EducatorComponent,
    canActivate: [OktaAuthGuard] ,
  },

  {
    path: 'studentdisputes',
    component : StudentdisputesComponent,
    canActivate: [OktaAuthGuard]
  },

  {
    path: 'studentmodules',
    component : StudentmodulesComponent,
    canActivate: [OktaAuthGuard]
  },

  {
    path: 'educatornotifications',
    component : EducatornotificationsComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'courses',
    component : CoursesComponent,
  },
  {
    path: 'educatorassessements',
    component : EducatorassessementsComponent,
  },
  {
    path: 'educatorstudents',
    component : EducatorstudentsComponent,
  },
  {
    path: 'educatorstudents/:course',
    component : EducatorstudentsComponent,
  },
  {
    path: 'outliers',
    component : OutliersComponent,
  },
  {
    path: 'studentnotifications',
    component : StudentnotificationsComponent,
  },
  {
    path: 'student-marks',
    component : StudentMarksComponent,
    canActivate: [OktaAuthGuard] , 
  },
  {
    path: 'student-marks/:course',
    component : StudentMarksComponent,
  },
  {
    path: 'register-users',
    component: RegisterUsersComponent,
  },
  {
    path: 'educatorcourses',
    component: EducatormodulesComponent,
  },
  {
    path: 'assessments',
    component: AssessmentsComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'download',
    component: DownloadComponent,
  },
  {
    path: 'uploadsheet',
    component: UploadsheetComponent,
  },
  {
    path: 'modules',
    component: ModulesComponent,
  },
  {
    path: 'loginerror',
    component: LoginErrorComponent
  },
  {
    path : 'student-modules',
    component : StudentmodulesComponent
  },
  {
    path : 'uploadclasslist',
    component : UploadClassListComponent
  },
  {
    path : 'educatorstudentinfo',
    component: EducatorStudentInfoComponent
  },
  {
    path : 'educatorviewnotif',
    component : EducatorViewNotifsComponent
  },
  {
    path : 'educatormarkinfo',
    component : EducatorMarkInfoComponent
  },
  {
    path : 'studentviewnotif',
    component : StudentViewNotifsComponent
  },
  {
    path : 'logs',
    component : LogsComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MessagesComponent,
    LoginComponent,
    AdminComponent,
    StudentComponent,
    EducatorComponent,
    SidebarComponent,
    UploadsheetComponent,
    CardelementComponent,
    EducatornotificationsComponent,
    EducatormodulesComponent,
    CoursesComponent,
    EducatorassessementsComponent,
    EducatorstudentsComponent,
    OutliersComponent,
    UploadClassListComponent,
    EducatorStudentInfoComponent,
    EducatorMarkInfoComponent,
    EducatorViewNotifsComponent,

    StudentNavComponent,
    StudentMarksComponent,
    StudentmodulesComponent,
    StudentnotificationsComponent,
    StudentdisputesComponent,
    StudentcardsComponent,
    StudentViewNotifsComponent,

    RegisterUsersComponent,
    CoursesComponent,
    AssessmentsComponent,
    UsersComponent,
    DownloadComponent,
    LogoutComponent,
    ModulesComponent,
    AdminSidebarComponent,
    LogsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    OktaAuthModule,
    MegaMenuModule,
    MenubarModule,
    ButtonModule,
    MenuModule,
    BrowserAnimationsModule,
    ToolbarModule,
    SplitButtonModule,
    BreadcrumbModule,
    CardModule,
    ChartModule,
    FileUploadModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    DropdownModule,
    InputNumberModule,
    InputTextModule,
    TableModule,
    OverlayPanelModule,
    ReactiveFormsModule,
    FormsModule,
    TabViewModule,
    MultiSelectModule

  ],
  providers: [
    { provide: OKTA_CONFIG, useValue: oktaConfig },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
