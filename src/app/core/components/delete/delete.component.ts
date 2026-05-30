import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../users/data-access-users/models/user';
import { UserService } from '../../../users/data-access-users/services/user.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css'],
  imports: [MatButtonModule, MatIconModule],
})
export class DeleteComponent {
  protected isDeleting = false;
  protected deleteError = '';

  constructor(
    private readonly dialogRef: MatDialogRef<DeleteComponent>,
    private readonly userService: UserService,
    private readonly toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) protected readonly user: User,
  ) { }

  protected close(): void {
    this.dialogRef.close(false);
  }

  protected async confirmDelete(): Promise<void> {
    if (this.isDeleting) {
      return;
    }

    this.isDeleting = true;
    this.deleteError = '';

    try {
      await this.userService.deleteUser(this.user.id);
      this.toastr.success('Usuario excluido com sucesso.');
      this.dialogRef.close(true);
    } catch (error) {
      console.error('Erro ao excluir usuario no Firestore:', error);
      this.deleteError = 'Nao foi possivel excluir o usuario.';
      this.toastr.error(this.deleteError);
      this.isDeleting = false;
    }
  }
}
