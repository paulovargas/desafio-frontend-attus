import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { InputSearchComponent } from '../input-search/input-search.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  imports: [ InputSearchComponent, MatToolbarModule, MatButtonModule, MatIconModule],
})
export class ToolbarComponent {

  constructor() { }

}
