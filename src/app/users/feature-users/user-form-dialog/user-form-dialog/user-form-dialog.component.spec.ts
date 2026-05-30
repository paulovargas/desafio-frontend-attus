import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
        { provide: UserService, useValue: { addUser: jest.fn(), updateUser: jest.fn() } },
        { provide: ToastrService, useValue: { error: jest.fn(), success: jest.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: null },
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

  it('should disable submit button when form is invalid', () => {
    const button = getSubmitButton();

    expect(component['userForm'].invalid).toBe(true);
    expect(button.disabled).toBe(true);
  });

  it('should enable submit button when form is valid', () => {
    fillValidForm();
    fixture.detectChanges();

    const button = getSubmitButton();

    expect(component['userForm'].valid).toBe(true);
    expect(button.disabled).toBe(false);
  });

  it('should keep submit button disabled while saving', () => {
    fillValidForm();
    component['isSaving'] = true;
    fixture.detectChanges();

    const button = getSubmitButton();

    expect(button.disabled).toBe(true);
  });

  function fillValidForm(): void {
    component['userForm'].setValue({
      email: 'maria@example.com',
      fullName: 'Maria Silva',
      cpf: '529.982.247-25',
      phoneNumber: '11999999999',
      phoneType: 'celular',
    });
  }

  function getSubmitButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button');
  }
});
