import { Component, OnInit, Input } from '@angular/core';
import { DataService } from "../data.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() show = false;
  @Input() customClass = '';
  @Input() closeCallback = () => (false);
  @Input() modalWidth = 420;

  // showLogin = false;
  constructor(private data: DataService) { }

  ngOnInit(): void {
    // this.data.currentMessage.subscribe(showLogin => this.show = showLogin)
  }

}
