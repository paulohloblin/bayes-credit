import { Component, OnInit, ViewChildren, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import { HttpService } from '../http.service';
import { DagreLayout, DagreSettings, Layout, Orientation } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-bayesian-network',
  templateUrl: './bayesian-network.component.html',
  styleUrls: ['./bayesian-network.component.css']
})
export class BayesianNetworkComponent implements OnInit, AfterViewInit {
  variables: { key: string, value: string[] }[] = [];

  ngxGraphNodes: { id: string, label: string }[] = [];
  ngxGraphEdges: { id:string, source: string, target: string }[] = [];

  layoutSettings: DagreSettings = {
    orientation: Orientation.TOP_TO_BOTTOM,
    ranker: 'network-simplex',
    rankPadding: 40,
  };

  layout: Layout = new DagreLayout();

  apiResponse = {};

  @ViewChildren('nodeSvg', { read: ElementRef }) nodeSvgs!: QueryList<ElementRef>;

  constructor(private httpService: HttpService){
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
        const edgesFromServer = data as [string, string][];
        this.ngxGraphEdges = edgesFromServer.map((edge) => {
          return { id: `${edge[0]}-${edge[1]}`, source: edge[0], target: edge[1] };
        });
      });
    });
  }

  ngAfterViewInit() {
    this.nodeSvgs.changes.subscribe((nodesSvgs) => {

      for (const nodeSvg of nodesSvgs.toArray()) {
        this.AdjustSvgContainer(nodeSvg);
      }
    });
  }

  private AdjustSvgContainer(nodeSvg: any) {
    const childHeight = nodeSvg.nativeElement.children[0].getBoundingClientRect().height;
    const childWidth = nodeSvg.nativeElement.children[0].getBoundingClientRect().width;
    nodeSvg.nativeElement.setAttribute('height', childHeight);
    nodeSvg.nativeElement.setAttribute('width', childWidth);
  }
}
