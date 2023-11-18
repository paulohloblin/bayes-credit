import { Injectable, ElementRef } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  evidence: Record<string, string> = {}
  query: string[] = []
  distribution: Record<string, Record<string, number>> = {}
  isEdited: boolean = false
  nodesPositions: Record<string, { x: number, y: number }> = {}
  nodesInitPositions: Record<string, { x: number, y: number }> = {}
  edges: { from: string, to: string, line:any }[] = [];
  isMenu: boolean = false;

  constructor(private httpService: HttpService) {
    this.httpService.getPositions().subscribe((data) => {
      this.nodesPositions = data as Record<string, { x: number, y: number }>;
      this.nodesInitPositions = JSON.parse(JSON.stringify(this.nodesPositions));
      console.log(this.nodesPositions);
    });
   }

  addEvidence(variable: string, state: string) {
    this.evidence[variable] = state;
  }

  addQuery(variable: string) {
    this.query.push(variable);
  }

  deleteEvidence(variable: string) {
    delete this.evidence[variable];
  }

  deleteQuery(variable: string) {
    this.query = this.query.filter(item => item !== variable);
  }
}
