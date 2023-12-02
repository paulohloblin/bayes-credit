import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  evidence: Record<string, string> = {}
  query: string[] = []
  distribution: Record<string, Record<string, number>> = {}
  edges: { from: string, to: string, line:any }[] = [];

  constructor() {
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
