import { Component } from '@angular/core';
import { NetworkService } from '../network.service';
import { DictionaryService } from '../dictionary.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(public networkService: NetworkService,
    public dictionaryService: DictionaryService) { }
}
