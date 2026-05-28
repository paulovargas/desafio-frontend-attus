import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-button-add',
  templateUrl: './button-add.component.html',
  styleUrls: ['./button-add.component.css'],
  imports: [MatButtonModule, MatDividerModule, MatIconModule]
})
export class ButtonAddComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
