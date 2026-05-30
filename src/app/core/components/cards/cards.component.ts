import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { DeleteComponent } from '../delete/delete.component';
import { MatIcon } from '@angular/material/icon';
import { User } from '../../../users/data-access-users/models/user';
import { UserService } from '../../../users/data-access-users/services/user.service';
import { catchError, map, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UserFormDialogComponent } from '../../../users/feature-users/user-form-dialog/user-form-dialog/user-form-dialog.component';

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
    MatDialogModule,
    MatFormFieldModule,
    MatIcon,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ],
})
export class CardsComponent {
  column = [ 'icon', 'name', 'email', 'action'];
  usersError = '';
  isLoading = true;

  private readonly userService = inject(UserService);
  private readonly toastr = inject(ToastrService);

  users = toSignal(
    this.userService.getFilteredUsers().pipe(
      map((users) => {
        this.isLoading = false;
        this.usersError = '';

        return users;
      }),
      catchError((error) => {
        console.error('Erro ao listar usuarios no Firestore:', error);
        this.isLoading = false;
        this.usersError = 'Nao foi possivel carregar os usuarios.';
        this.toastr.error(this.usersError);

        return of([]);
      }),
    ),
    { initialValue: [] },
  );

  constructor(public dialog: MatDialog) { }

  openEditDialog(user: User): void {
    this.dialog.open(UserFormDialogComponent, {
      width: '580px',
      maxWidth: 'calc(100vw - 48px)',
      panelClass: 'user-form-dialog-panel',
      data: user,
    });
  }

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
