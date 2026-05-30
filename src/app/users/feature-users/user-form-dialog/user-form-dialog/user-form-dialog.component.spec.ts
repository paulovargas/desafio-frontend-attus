import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../data-access-users/services/user.service';

import { UserFormDialogComponent } from './user-form-dialog.component';
import { User } from '../../../data-access-users/models/user';

describe('UserFormDialogComponent', () => {
  let component: UserFormDialogComponent;
  let fixture: ComponentFixture<UserFormDialogComponent>;
  let dialogRef: { close: jest.Mock };
  let userService: { addUser: jest.Mock; updateUser: jest.Mock };
  let toastrService: { error: jest.Mock; success: jest.Mock };
  let dialogData: User | null;

  beforeEach(async () => {
    dialogData = null;
    dialogRef = { close: jest.fn() };
    userService = { addUser: jest.fn(), updateUser: jest.fn() };
    toastrService = { error: jest.fn(), success: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [UserFormDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: UserService, useValue: userService },
        { provide: ToastrService, useValue: toastrService },
        { provide: MAT_DIALOG_DATA, useFactory: () => dialogData },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    createComponent();
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

  it('should mark controls as touched and not save when submitting an invalid form', async () => {
    await component['submit']();

    expect(component['submitted']).toBe(true);
    expect(component['userForm'].touched).toBe(true);
    expect(userService.addUser).not.toHaveBeenCalled();
    expect(userService.updateUser).not.toHaveBeenCalled();
  });

  it('should create user and close dialog when submitting a valid form', async () => {
    userService.addUser.mockResolvedValue(undefined);
    fillValidForm();

    await component['submit']();

    expect(userService.addUser).toHaveBeenCalledWith({
      name: 'Maria Silva',
      email: 'maria@example.com',
      cpf: '529.982.247-25',
      phone: '11999999999',
      phoneType: 'celular',
    });
    expect(toastrService.success).toHaveBeenCalledWith('Usuario salvo com sucesso.');
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should update user and close dialog when editing', async () => {
    const user = {
      id: 'user-1',
      name: 'Joao Souza',
      email: 'joao@example.com',
      cpf: '529.982.247-25',
      phone: '11988888888',
      phoneType: 'fixo',
    };
    Object.defineProperty(component, 'isEditMode', { value: true });
    Object.defineProperty(component, 'userData', { value: user });
    component['userForm'].setValue({
      email: user.email,
      fullName: user.name,
      cpf: user.cpf,
      phoneNumber: user.phone,
      phoneType: user.phoneType,
    });
    userService.updateUser.mockResolvedValue(undefined);

    await component['submit']();

    expect(userService.updateUser).toHaveBeenCalledWith('user-1', {
      name: 'Joao Souza',
      email: 'joao@example.com',
      cpf: '529.982.247-25',
      phone: '11988888888',
      phoneType: 'fixo',
    });
    expect(toastrService.success).toHaveBeenCalledWith('Usuario atualizado com sucesso.');
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should show error and stop saving when save fails', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    userService.addUser.mockRejectedValue(new Error('save failed'));
    fillValidForm();

    await component['submit']();

    expect(component['saveError']).toBe('Nao foi possivel salvar o usuario.');
    expect(component['isSaving']).toBe(false);
    expect(toastrService.error).toHaveBeenCalledWith('Nao foi possivel salvar o usuario.');
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(UserFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

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
