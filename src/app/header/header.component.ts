import { Component } from '@angular/core';
import { NetworkService } from '../network.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public networkService: NetworkService,
    private httpService: HttpService) { }

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
  menu(){
    this.networkService.isMenu = !this.networkService.isMenu;
  }
}
