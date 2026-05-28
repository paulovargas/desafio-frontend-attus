import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './core/components/toolbar/toolbar.component';
import { CardsComponent } from './core/components/cards/cards.component';
import { ButtonAddComponent } from './core/components/button-add/button-add.component';

@Component({
  selector: 'app-root',
  imports: [ ButtonAddComponent, CardsComponent, ToolbarComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'desafio-frontend-attus';
}
