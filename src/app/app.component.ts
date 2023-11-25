import { Component} from '@angular/core';
import { NetworkService } from './network.service';
import { HttpService } from './http.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'bayes-credit';
  isMenu: boolean = false;
  constructor(public networkService: NetworkService,
    private httpService: HttpService) {
  }

  save(){
    this.httpService.saveNetwork(this.networkService.nodesPositions).subscribe(
      (data) => {
        if (data == "OK")
          alert("Збережено успішно!")
        else
          alert("Помилка збереження!")
      }
    );
    this.networkService.isEdited = false;
  }
}
