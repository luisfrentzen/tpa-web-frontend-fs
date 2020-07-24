import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-subscription-block',
  templateUrl: './subscription-block.component.html',
  styleUrls: ['./subscription-block.component.scss']
})
export class SubscriptionBlockComponent implements OnInit {

  @Input() channel;

  constructor() { }

  ngOnInit(): void {
  }

}
