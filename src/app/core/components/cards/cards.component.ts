import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { DeleteComponent } from '../delete/delete.component';
import { MatIcon } from '@angular/material/icon';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    /* RouterLink, */
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIcon,
    MatInputModule,
    MatNativeDateModule,
    MatTableModule,
  ],
})
export class CardsComponent {
  column = [ 'icon', 'name', 'email', 'action'];
  
  users: User[] = [
    {
      id: 1,
      name: 'Paulo Vargas',
      email: 'paulotomegomesdevargas@gmail.com'
    }
  ];

  constructor(public dialog: MatDialog) { }

  OpenDialog(id: number): void {
    this.dialog.open(DeleteComponent, {
      width: '450px',
      height: '450px',
      data: {
        id: id,
      },
    });
  }
}
