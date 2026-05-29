import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { DeleteComponent } from '../delete/delete.component';
import { MatIcon } from '@angular/material/icon';
import { UserService } from '../../../users/data-access-users/services/user.service';

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

  private readonly userService = inject(UserService);

  users = toSignal(this.userService.getUsers(), { initialValue: [] });

  constructor(public dialog: MatDialog) { }

  OpenDialog(id: string): void {
    this.dialog.open(DeleteComponent, {
      width: '450px',
      height: '450px',
      data: {
        id: id,
      },
    });
  }
}
