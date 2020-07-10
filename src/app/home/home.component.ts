import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Input() name = '';
  currentPage = '';

  constructor(private data:DataService) { }

  ngOnInit(): void {
    this.data.currentPage.subscribe(currentPage => this.currentPage = currentPage)
  }

}
