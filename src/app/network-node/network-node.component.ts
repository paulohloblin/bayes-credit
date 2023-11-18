import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NetworkService } from '../network.service';
import { HttpService } from '../http.service';
import { DictionaryService } from '../dictionary.service';

@Component({
  selector: 'app-network-node',
  templateUrl: './network-node.component.html',
  styleUrls: ['./network-node.component.css']
})
export class NetworkNodeComponent {
  @Input() variable = { key: '', value: ['']};

  //this record stores states of all variable checkboxes
  checkedStates: Record<string, boolean> = {}

  isQueried = false;
  query_button_text = "+";


  constructor(public networkService: NetworkService,
    private httpService: HttpService,
    public dictionaryService: DictionaryService) {}

  onChecked(state:string){
    for (let i = 0; i < this.variable.value.length; i++) {
      if (this.variable.value[i] == state) {
        this.checkedStates[this.variable.value[i]] = !this.checkedStates[this.variable.value[i]];
      }
      else {
        this.checkedStates[this.variable.value[i]] = false;
      }
    }

    if (this.checkedStates[state]) {
      this.networkService.addEvidence(this.variable.key, state);
    }
    else {
      this.networkService.deleteEvidence(this.variable.key);
    }

    this.setDistribution();
  }

  onQueryClick(){
    if (this.isQueried) {
      this.networkService.deleteQuery(this.variable.key);
      this.isQueried = false;

      this.setDistribution();

      this.query_button_text = "+";
    }
    else {
      this.networkService.deleteEvidence(this.variable.key);
      this.networkService.addQuery(this.variable.key);

      this.setDistribution(true);

      //set all checkboxes to 'unchecked'
      for (let i = 0; i < this.variable.value.length; i++) {
        this.checkedStates[this.variable.value[i]] = false;
      }

      this.query_button_text = "-";
    }
  }

  setDistribution(isThisAQuery: boolean = false){
    let query = this.networkService.query;
    let evidence = this.networkService.evidence;

    if (query.length > 0) {
      this.httpService.getInference(query, evidence)?.subscribe((data) => {
        this.networkService.distribution = data as Record<string, Record<string, number>>;

        if (isThisAQuery) {
          this.isQueried = true;
        }
      });
    }
    else{
      this.networkService.distribution = {}
    }
  }

}
