import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  url: string = 'http://127.0.0.1:5000/'

  constructor(private http: HttpClient){ }

    getNodes(){
        return this.http.get(this.url + 'network')
    }

    getInference(query: string[], evidence: Record<string, string>){
      if (query.length == 0) {
        return
      }
      else{
        let queryParams = new HttpParams();

        for (let query_var of query) {
          queryParams = queryParams.append("query", query_var);
        }
        queryParams = queryParams.append("evidence", JSON.stringify(evidence));
        return this.http.get(this.url + 'inference',{params:queryParams});
      }
    }

    getEdges(){
      return this.http.get(this.url + 'edges')
    }

    getPositions(){
      return this.http.get('assets/positions.json')
    }

    getDictionary(){
      return this.http.get('assets/dict.json')
    }

    saveNetwork(network: Record<string, { x: number, y: number }>){
      return this.http.post(this.url + 'savepositions', network)
    }
}
