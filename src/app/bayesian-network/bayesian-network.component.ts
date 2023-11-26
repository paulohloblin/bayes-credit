import { Component, OnInit, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import { HttpService } from '../http.service';
import { NetworkService } from '../network.service';
import { arrowCreate, HEAD } from 'arrows-svg';

@Component({
  selector: 'app-bayesian-network',
  templateUrl: './bayesian-network.component.html',
  styleUrls: ['./bayesian-network.component.css']
})
export class BayesianNetworkComponent implements OnInit, AfterViewInit {
  variables: { key: string, value: string[] }[] = [];
  nodesList: ElementRef[] = [];

  edgesFromServer: [string, string][] = [];

  areEdgesSetUp: boolean = false;

  apiResponse = {};

  @ViewChildren('node', { read: ElementRef }) nodes!: QueryList<ElementRef>;

  constructor(private httpService: HttpService,
    private networkService: NetworkService){
    }

  ngOnInit() {
    this.httpService.getNodes().subscribe((data) => {
      this.apiResponse = data;

      for (const key of Object.keys(this.apiResponse)) {
        this.variables.push({ key, value: this.apiResponse[key as keyof typeof this.apiResponse] });
      }
    });
  }

  ngAfterViewInit() {
    this.nodes.changes.subscribe((nodes) => {
      this.nodesList = nodes.toArray();

      this.httpService.getEdges().subscribe((data) => {
        this.edgesFromServer = data as [string, string][];

        let elmWrapper = document.querySelectorAll("mat-drawer-container")[0];

        for (const edge of this.edgesFromServer) {
          this.addEdge(edge[0], edge[1], elmWrapper);
        }
        this.areEdgesSetUp = true;
      });
    });
  }

  returnNativeElementById(id: string) {
    return this.nodesList.find((node) => node.nativeElement.id === id)?.nativeElement;
  }

  addEdge(from: string, to: string, elmWrapper:Element) {
    const arrow = arrowCreate({
      from: {node: this.returnNativeElementById(from)},
      to: {node: this.returnNativeElementById(to)},
      head: {
        func: HEAD['VEE'],
        size: 10,
      }
    })

    elmWrapper.appendChild(arrow.node);
  }

  getCoordinatesOfNode(node: string) {
    if (this.networkService.nodesInitPositions === null) {
      this.networkService.nodesInitPositions = {};
    }
    return this.networkService.nodesInitPositions[node]
  }

  onDragEnd(event: any) {
    const element = event.source.element.nativeElement;

    const style = window.getComputedStyle(element);
    const matrix = style.transform;

    const matrixType = matrix.includes('3d') ? '3d' : '2d';

    const matrixMatch = matrix.match(/matrix.*\((.+)\)/);

    if (matrixMatch) {
      const matrixValues = matrixMatch[1].split(', ');
      let x = 0;
      let y = 0;

      if (matrixType === '2d') {
        x = +matrixValues[4];
        y = +matrixValues[5];
      }

      else if (matrixType === '3d') {
        x = +matrixValues[12];
        y = +matrixValues[13];
      }

      this.networkService.nodesPositions[element.id] = {
        x: x,
        y: y
      };
    }

    this.networkService.isEdited = true;
  }
}
