import { Component } from '@angular/core';
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
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../data-access-users/services/user.service';

type PhoneType = 'celular' | 'fixo';

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
    MatDividerModule,
    MatIconModule,
  ],
})
export class UserFormDialogComponent {
  protected isSaving = false;
  protected submitted = false;
  protected saveError = '';

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
  ) { }

  protected async submit(): Promise<void> {
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

      await this.userService.addUser({
        name: formValue.fullName.trim(),
        email: formValue.email.trim(),
        cpf: formValue.cpf,
        phone: formValue.phoneNumber.trim(),
        phoneType: formValue.phoneType,
      });

      this.dialogRef.close(true);
    } catch {
      this.saveError = 'Nao foi possivel salvar o usuario.';
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
