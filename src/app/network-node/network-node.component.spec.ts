import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkNodeComponent } from './network-node.component';

describe('NetworkNodeComponent', () => {
  let component: NetworkNodeComponent;
  let fixture: ComponentFixture<NetworkNodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NetworkNodeComponent]
    });
    fixture = TestBed.createComponent(NetworkNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
