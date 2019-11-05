import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { ManageComponent } from '../../manage/manage.component';
import { LoginComponent } from '../../login/login.component';
import { ReloadpageComponent } from '../../reloadpage/reloadpage.component';
import { RegistrationComponent } from '../../registration/registration.component';
export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'manage',     component: ManageComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'login',        component: LoginComponent },
    { path: 'reload/:page', component: ReloadpageComponent},
    { path: 'register', component:RegistrationComponent},
];
