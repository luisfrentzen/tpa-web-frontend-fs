import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelBlockComponent } from './channel-block.component';

describe('ChannelBlockComponent', () => {
  let component: ChannelBlockComponent;
  let fixture: ComponentFixture<ChannelBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
