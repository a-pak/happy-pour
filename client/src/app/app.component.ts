import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppBarComponent } from "./components/app-bar/app-bar.component";
import { MapsWindowComponent } from './components/maps-window/maps-window.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    AppBarComponent,
    MapsWindowComponent,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'happy-pour';
}
