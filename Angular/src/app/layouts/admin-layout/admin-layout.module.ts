import { NgModule,Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { AlertService } from '../../alert.service';
import { AlertComponent } from '../../alert/alert.component';
import { ClassroomService } from '../../classroom.service';
import { LoginComponent } from '../../login/login.component';
import { ReloadpageComponent } from '../../reloadpage/reloadpage.component';
import { RegistrationComponent } from '../../registration/registration.component';
import { ManageComponent ,Dialog} from '../../manage/manage.component';
import { QRCodeModule } from "angularx-qrcode";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { FlexLayoutModule } from '@angular/flex-layout';
import { NgQRCodeReaderModule } from 'ng2-qrcode-reader';

import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
  MatFormFieldModule,
} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    QRCodeModule,
    
  ],
  declarations: [
    DashboardComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    LoginComponent,
    AlertComponent,
    ReloadpageComponent,
    RegistrationComponent,
    ManageComponent,
    Dialog
  ],
  providers: [AlertService,ClassroomService],
  entryComponents: [ManageComponent,Dialog],
  bootstrap: [ManageComponent],
  exports: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class AdminLayoutModule {}
