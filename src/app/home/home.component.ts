import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Input() user;
  currentPage = '';

  videos:any;

  constructor(private data:DataService, private apollo:Apollo) { }

  ngOnInit(): void {
    this.apollo
      .watchQuery({
        query: gql`
          {
            videos{
              title,
              url,
              thumbnail,
            }
          }
        `,
      })
      .valueChanges.subscribe(result => {
        this.videos = result.data.videos
      });

    this.data.currentPage.subscribe(currentPage => this.currentPage = currentPage)
  }

}
