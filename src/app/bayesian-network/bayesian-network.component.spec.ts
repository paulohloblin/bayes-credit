import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BayesianNetworkComponent } from './bayesian-network.component';

describe('BayesianNetworkComponent', () => {
  let component: BayesianNetworkComponent;
  let fixture: ComponentFixture<BayesianNetworkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BayesianNetworkComponent]
    });
    fixture = TestBed.createComponent(BayesianNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
