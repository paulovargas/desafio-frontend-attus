import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../users/data-access-users/services/user.service';
import { User } from '../../../users/data-access-users/models/user';

import { DeleteComponent } from './delete.component';

describe('DeleteComponent', () => {
  let component: DeleteComponent;
  let fixture: ComponentFixture<DeleteComponent>;
  let dialogRef: { close: jest.Mock };
  let userService: { deleteUser: jest.Mock };
  let toastrService: { error: jest.Mock; success: jest.Mock };

  const user: User = {
    id: 'user-1',
    name: 'Maria Silva',
    email: 'maria@example.com',
    cpf: '529.982.247-25',
    phone: '11999999999',
    phoneType: 'celular',
  };

  beforeEach(async () => {
    dialogRef = { close: jest.fn() };
    userService = { deleteUser: jest.fn() };
    toastrService = { error: jest.fn(), success: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [DeleteComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: UserService, useValue: userService },
        { provide: ToastrService, useValue: toastrService },
        { provide: MAT_DIALOG_DATA, useValue: user },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close without deleting when cancelled', () => {
    component['close']();

    expect(dialogRef.close).toHaveBeenCalledWith(false);
    expect(userService.deleteUser).not.toHaveBeenCalled();
  });

  it('should delete user and close dialog when confirmed', async () => {
    userService.deleteUser.mockResolvedValue(undefined);

    await component['confirmDelete']();

    expect(userService.deleteUser).toHaveBeenCalledWith('user-1');
    expect(toastrService.success).toHaveBeenCalledWith('Usuario excluido com sucesso.');
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should show error and stop deleting when delete fails', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    userService.deleteUser.mockRejectedValue(new Error('delete failed'));

    await component['confirmDelete']();

    expect(component['deleteError']).toBe('Nao foi possivel excluir o usuario.');
    expect(component['isDeleting']).toBe(false);
    expect(toastrService.error).toHaveBeenCalledWith('Nao foi possivel excluir o usuario.');
    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
