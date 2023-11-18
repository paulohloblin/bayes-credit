import { Component, OnInit, ViewChildren, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import { HttpService } from '../http.service';
import { NetworkService } from '../network.service';
import 'leader-line';
declare var LeaderLine: any;

@Component({
  selector: 'app-bayesian-network',
  templateUrl: './bayesian-network.component.html',
  styleUrls: ['./bayesian-network.component.css']
})
export class BayesianNetworkComponent implements OnInit, AfterViewInit {
  variables: { key: string, value: string[] }[] = [];
  nodesList: ElementRef[] = [];

  edgesFromServer: [string, string][] = [];

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
        for (const edge of this.edgesFromServer) {
          this.addEdge(edge[0], edge[1]);
        }

        // this.attachEdgesToElement('app-bayesian-network');
      });
    });
  }

  // attachEdgesToElement(elementName: string) {
  //   //js code
  //   const svgs = document.getElementsByClassName('leader-line');
  //   console.log('svgs: ', svgs);
  //   const element = document.getElementsByTagName(elementName)[0];
  //   console.log('element to append: ', element);
  //   for (let i = 0; i < svgs.length; i++) {
  //     element.appendChild(svgs[i]);
  //   }
  // }

  returnNativeElementById(id: string) {
    return this.nodesList.find((node) => node.nativeElement.id === id)?.nativeElement;
  }

  addEdge(from: string, to: string) {
    const line = new LeaderLine(this.returnNativeElementById(from), this.returnNativeElementById(to));
    line.color = 'gray';
    this.networkService.edges.push({ from, to, line });
  }

  removeEdge(edge: { from: string, to: string, line:any }) {
    if (edge) {
      edge.line.remove();
      this.networkService.edges = this.networkService.edges.filter((e) => e !== edge);
    }
  }

  findAllEdgesOfNode(node: string) {
    return this.networkService.edges.filter((edge) => edge.from === node || edge.to === node);
  }

  eraseAllEdgesOfNode(node: string) {
    for (const edge of this.networkService.edges) {
      if (edge.from === node || edge.to === node) {
        this.removeEdge(edge);
      }
    }
  }

  getCoordinatesOfNode(node: string) {
    if (this.networkService.nodesInitPositions === null) {
      this.networkService.nodesInitPositions = {};
    }
    return this.networkService.nodesInitPositions[node]
  }

  onDrag(event: any) {
    const currentNode = event.source.element.nativeElement.id;

    const edgesOfNode = this.findAllEdgesOfNode(currentNode);

    this.eraseAllEdgesOfNode(currentNode);

    for (const edge of edgesOfNode) {
      this.addEdge(edge.from, edge.to);
    }
  }
  onDragEnd(event: any) {
    this.networkService.nodesPositions[event.source.element.nativeElement.id] = {
      x: event.source.element.nativeElement.getBoundingClientRect().left + window.scrollX,
      y: event.source.element.nativeElement.getBoundingClientRect().top + window.scrollY
    };

    this.networkService.isEdited = true;
  }
}
