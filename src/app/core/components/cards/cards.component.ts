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
import { catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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
  usersError = '';

  private readonly userService = inject(UserService);
  private readonly toastr = inject(ToastrService);

  users = toSignal(
    this.userService.getUsers().pipe(
      catchError((error) => {
        console.error('Erro ao listar usuarios no Firestore:', error);
        this.usersError = 'Nao foi possivel carregar os usuarios.';
        this.toastr.error(this.usersError);

        return of([]);
      }),
    ),
    { initialValue: [] },
  );

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
