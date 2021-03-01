import {NgModule} from "@angular/core";
import { CommonModule } from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule, MatSnackBarModule, 
  MatToolbarModule, MatMenuModule,MatIconModule, MatProgressSpinnerModule, MatCheckboxModule, MatListModule,
  MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatTooltipModule, MatExpansionModule, MatRadioModule, 
  MatFormFieldModule, MatPaginatorModule, MatAutocompleteModule, MatChipsModule, MatSidenavModule, MatSortModule 
} from '@angular/material';
import { MatMomentDateModule } from "@angular/material-moment-adapter";

@NgModule({
  imports: [
  CommonModule, 
  MatToolbarModule,
  MatButtonModule, 
  MatCardModule,
  MatInputModule,
  MatDialogModule,
  MatTableModule,
  MatMenuModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatListModule,
  MatSnackBarModule,
  MatSelectModule,
  MatDatepickerModule,
  MatMomentDateModule,
  MatNativeDateModule,
  MatTooltipModule,
  MatExpansionModule,
  MatRadioModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatAutocompleteModule, 
  MatChipsModule,
  MatSidenavModule,
  MatSortModule 
  ],
  exports: [
   CommonModule,
   MatToolbarModule, 
   MatButtonModule, 
   MatCardModule, 
   MatInputModule, 
   MatDialogModule, 
   MatTableModule, 
   MatMenuModule,
   MatIconModule,
   MatProgressSpinnerModule,
   MatCheckboxModule,
   MatListModule,
   MatSnackBarModule,
   MatSelectModule,
   MatDatepickerModule,
   MatMomentDateModule,
   MatNativeDateModule,
   MatTooltipModule,
   MatExpansionModule,
   MatRadioModule,
   MatFormFieldModule,
   MatPaginatorModule,
   MatAutocompleteModule, 
   MatChipsModule,
   MatSidenavModule,
   MatSortModule 
   ],
})
export class CustomMaterialModule { }