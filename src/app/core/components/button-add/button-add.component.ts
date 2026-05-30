import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserFormDialogComponent } from '../../../users/feature-users/user-form-dialog/user-form-dialog/user-form-dialog.component';

@Component({
  selector: 'app-button-add',
  templateUrl: './button-add.component.html',
  styleUrls: ['./button-add.component.css'],
  imports: [MatButtonModule, MatIconModule, MatDialogModule]
})
export class ButtonAddComponent {

  constructor(private dialog: MatDialog) { }

  openModal(): void {
    this.dialog.open(UserFormDialogComponent, {
      width: '580px',
      maxWidth: 'calc(100vw - 48px)',
      panelClass: 'user-form-dialog-panel',
    });
  }

}
