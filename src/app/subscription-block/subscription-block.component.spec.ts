import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionBlockComponent } from './subscription-block.component';

describe('SubscriptionBlockComponent', () => {
  let component: SubscriptionBlockComponent;
  let fixture: ComponentFixture<SubscriptionBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
