import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistBlockComponent } from './playlist-block.component';

describe('PlaylistBlockComponent', () => {
  let component: PlaylistBlockComponent;
  let fixture: ComponentFixture<PlaylistBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
