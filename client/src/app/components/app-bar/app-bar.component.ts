import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-app-bar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
  ],
  templateUrl: './app-bar.component.html',
  styleUrl: './app-bar.component.scss'
})
export class AppBarComponent {

}
