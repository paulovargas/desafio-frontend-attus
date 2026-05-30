import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../data-access-users/services/user.service';
import { FirebaseError } from 'firebase/app';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../data-access-users/models/user';

type PhoneType = 'celular' | 'fixo';
const SAVE_TIMEOUT_MS = 12000;

@Component({
  selector: 'app-user-form-dialog',
  templateUrl: './user-form-dialog.component.html',
  styleUrls: ['./user-form-dialog.component.css'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class UserFormDialogComponent {
  protected isSaving = false;
  protected submitted = false;
  protected saveError = '';
  protected readonly isEditMode: boolean;

  protected readonly userForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    cpf: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, cpfValidator()],
    }),
    phoneNumber: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, phoneValidator()],
    }),
    phoneType: new FormControl<PhoneType>('celular', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private readonly dialogRef: MatDialogRef<UserFormDialogComponent>,
    private readonly userService: UserService,
    private readonly toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) private readonly userData: User | null,
  ) {
    this.isEditMode = !!this.userData?.id;

    if (this.userData) {
      this.userForm.patchValue({
        email: this.userData.email,
        fullName: this.userData.name,
        cpf: this.userData.cpf,
        phoneNumber: this.userData.phone,
        phoneType: this.userData.phoneType,
      });
    }
  }

  protected async submit(): Promise<void> {
    if (this.isSaving) {
      return;
    }

    this.submitted = true;
    this.saveError = '';

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.userForm.markAsDirty();
      this.userForm.updateValueAndValidity();
      return;
    }

    this.isSaving = true;

    try {
      const formValue = this.userForm.getRawValue();
      const user = {
        name: formValue.fullName.trim(),
        email: formValue.email.trim(),
        cpf: formValue.cpf,
        phone: formValue.phoneNumber.trim(),
        phoneType: formValue.phoneType,
      };

      await withTimeout(
        this.isEditMode && this.userData
          ? this.userService.updateUser(this.userData.id, user)
          : this.userService.addUser(user),
        SAVE_TIMEOUT_MS,
      );

      this.toastr.success(this.isEditMode ? 'Usuario atualizado com sucesso.' : 'Usuario salvo com sucesso.');
      this.dialogRef.close(true);
    } catch (error) {
      console.error('Erro ao salvar usuario no Firestore:', error);
      this.saveError = getSaveErrorMessage(error);
      this.toastr.error(this.saveError);
      this.isSaving = false;
    }
  }

  protected showError(controlName: keyof typeof this.userForm.controls, error: string): boolean {
    const control = this.userForm.controls[controlName];

    return control.hasError(error) && (control.touched || this.submitted);
  }

  protected formatCpf(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formattedCpf = cpfMask(input.value);

    this.userForm.controls.cpf.setValue(formattedCpf, { emitEvent: false });
  }
}

function cpfValidator(): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const cpf = onlyNumbers(control.value);

    if (!cpf) {
      return null;
    }

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return { cpf: true };
    }

    const firstDigit = calculateCpfDigit(cpf, 9);
    const secondDigit = calculateCpfDigit(cpf, 10);

    return firstDigit === Number(cpf[9]) && secondDigit === Number(cpf[10])
      ? null
      : { cpf: true };
  };
}

function phoneValidator(): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const phone = onlyNumbers(control.value);

    if (!phone) {
      return null;
    }

    return phone.length >= 10 && phone.length <= 11 ? null : { phone: true };
  };
}

function calculateCpfDigit(cpf: string, length: number): number {
  let sum = 0;

  for (let index = 0; index < length; index++) {
    sum += Number(cpf[index]) * (length + 1 - index);
  }

  const digit = (sum * 10) % 11;
  return digit === 10 ? 0 : digit;
}

function onlyNumbers(value: string): string {
  return value.replace(/\D/g, '');
}

function cpfMask(value: string): string {
  return onlyNumbers(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function getSaveErrorMessage(error: unknown): string {
  if (error instanceof SaveTimeoutError) {
    return 'Tempo esgotado ao salvar. Verifique a conexao e as regras do Firestore.';
  }

  if (error instanceof FirebaseError) {
    if (error.code === 'permission-denied') {
      return 'Sem permissao para salvar. Verifique as regras do Firestore.';
    }

    if (error.code === 'unavailable') {
      return 'Firestore indisponivel. Tente novamente em instantes.';
    }

    if (error.code === 'not-found') {
      return 'Banco do Firestore nao encontrado para este projeto.';
    }

    return `Erro do Firebase: ${error.code}`;
  }

  return 'Nao foi possivel salvar o usuario.';
}

class SaveTimeoutError extends Error {
  constructor() {
    super('Save timeout');
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new SaveTimeoutError());
    }, timeoutMs);

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => window.clearTimeout(timeoutId));
  });
}
