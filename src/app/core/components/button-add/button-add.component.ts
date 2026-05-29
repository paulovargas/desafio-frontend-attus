import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserFormDialogComponent } from '../../../users/feature-users/user-form-dialog/user-form-dialog/user-form-dialog.component';

@Component({
  selector: 'app-button-add',
  templateUrl: './button-add.component.html',
  styleUrls: ['./button-add.component.css'],
  imports: [MatButtonModule, MatDividerModule, MatIconModule, MatDialogModule]
})
export class ButtonAddComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openModal(): void {
    this.dialog.open(UserFormDialogComponent, {
      width: '580px',
      maxWidth: 'calc(100vw - 48px)',
      panelClass: 'user-form-dialog-panel',
    });
  }

}
