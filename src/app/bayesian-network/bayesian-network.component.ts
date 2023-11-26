import { Component, OnInit, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import { HttpService } from '../http.service';
import { NetworkService } from '../network.service';

@Component({
  selector: 'app-bayesian-network',
  templateUrl: './bayesian-network.component.html',
  styleUrls: ['./bayesian-network.component.css']
})
export class BayesianNetworkComponent implements OnInit, AfterViewInit {
  variables: { key: string, value: string[] }[] = [];
  nodesList: ElementRef[] = [];

  ngxGraphNodes: { id: string, label: string }[] = [];
  ngxGraphEdges: { id:string, source: string, target: string }[] = [];

  edgesFromServer: [string, string][] = [];

  areEdgesSetUp: boolean = false;

  apiResponse = {};

  @ViewChildren('nodeSvg', { read: ElementRef }) nodeSvgs!: QueryList<ElementRef>;

  constructor(private httpService: HttpService,
    private networkService: NetworkService){
    }

  ngOnInit() {
    this.httpService.getNodes().subscribe((data) => {
      this.apiResponse = data;

      for (const key of Object.keys(this.apiResponse)) {
        this.variables.push({ key, value: this.apiResponse[key as keyof typeof this.apiResponse] });
      }

      this.ngxGraphNodes = this.variables.map((node) => {
        return { id: node.key, label: node.key, variables: node };
      });

      this.httpService.getEdges().subscribe((data) => {
        this.edgesFromServer = data as [string, string][];
        this.ngxGraphEdges = this.edgesFromServer.map((edge) => {
          return { id: `${edge[0]}-${edge[1]}`, source: edge[0], target: edge[1] };
        });
      });
    });
  }

  ngAfterViewInit() {
    this.nodeSvgs.changes.subscribe((nodesSvgs) => {

      for (const nodeSvg of nodesSvgs.toArray()) {
        const childHeight = nodeSvg.nativeElement.children[0].getBoundingClientRect().height;
        const childWidth = nodeSvg.nativeElement.children[0].getBoundingClientRect().width;
        nodeSvg.nativeElement.setAttribute('height', childHeight);
        nodeSvg.nativeElement.setAttribute('width', childWidth);
      }
    });
  }
}
