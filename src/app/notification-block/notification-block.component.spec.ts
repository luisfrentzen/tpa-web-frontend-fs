import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationBlockComponent } from './notification-block.component';

describe('NotificationBlockComponent', () => {
  let component: NotificationBlockComponent;
  let fixture: ComponentFixture<NotificationBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
