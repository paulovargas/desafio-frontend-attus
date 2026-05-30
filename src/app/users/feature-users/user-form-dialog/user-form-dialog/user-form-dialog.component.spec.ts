import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../data-access-users/services/user.service';

import { UserFormDialogComponent } from './user-form-dialog.component';

describe('UserFormDialogComponent', () => {
  let component: UserFormDialogComponent;
  let fixture: ComponentFixture<UserFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFormDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: UserService, useValue: { addUser: jest.fn() } },
        { provide: ToastrService, useValue: { error: jest.fn(), success: jest.fn() } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
