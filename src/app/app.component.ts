import { Component} from '@angular/core';
import { NetworkService } from './network.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'bayes-credit';
  isMenu: boolean = false;
  constructor(public networkService: NetworkService) {
  }
}
