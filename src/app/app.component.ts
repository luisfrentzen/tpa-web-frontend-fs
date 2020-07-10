import { Component } from '@angular/core';
import { DataService } from './data.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FesTube';

  currentPage = 'home';

  constructor(private data:DataService) {}

  ngOnInit(): void {
    this.data.currentPage.subscribe(currentPage => this.currentPage = currentPage)
  }
}
