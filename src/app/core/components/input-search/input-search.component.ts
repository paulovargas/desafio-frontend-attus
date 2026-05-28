import {Component} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';

/**
 * @title Inputs with prefixes and suffixes
 */
@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrl: './input-search.component.css',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
})
export class InputSearchComponent {

  constructor() { }

}
