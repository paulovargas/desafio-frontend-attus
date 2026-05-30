import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {MatIconModule} from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { UserService } from '../../../users/data-access-users/services/user.service';

/**
 * @title Inputs with prefixes and suffixes
 */
@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrl: './input-search.component.css',
  imports: [ReactiveFormsModule, MatIconModule],
})
export class InputSearchComponent {
  protected readonly searchControl = new FormControl('', { nonNullable: true });

  private readonly destroyRef = inject(DestroyRef);
  private readonly userService = inject(UserService);

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((term) => this.userService.setSearchTerm(term));
  }

}
