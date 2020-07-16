import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import gql from 'graphql-tag';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  constructor(private apollo: Apollo, private router: Router) { }

  getViewCount(view){
    var res;
    if(view >= 1000000)
    {
      res = (view/1000000).toFixed(1) + "M"
    }
    else if(view >= 1000)
    {
      res = (view/1000).toFixed(1) + "K"
    }
    else
    {
      res = view;
    }

    return res;
  }

  getDiff(day, month, year){
    const vidDate = (year * 365) + (month * 30) + day
    const current = new Date();
    const curDate = (current.getDate()) + ((current.getMonth()) * 30) + (current.getFullYear() * 365)
    const diff = curDate - vidDate

    var res;
    if(diff >= 365)
    {
      res = Math.round(diff/365) + " year ago";
    }
    else if(diff >= 30)
    {
      res = Math.round(diff/30) + " month ago";
    }
    else if(diff >= 7)
    {
      res = Math.round(diff/7) + " week ago"
      // console.log(res)
    }
    else if(diff == 0)
    {
      res = "today"
    }
    else
    {
      res = diff + " days ago"
    }

    return res
  }

  videos;

  ngOnInit(): void {
    this.apollo
      .watchQuery({
        query: gql`
          query videosByCategory($category: String!){
            videosByCategory(category: $category){
              id,
              title,
              url,
              thumbnail,
              userid,
              channelpic,
              channelname,
              view,
              day,
              month,
              year,
              desc,
            }
          }
        `,
        variables: {
          category: "News",
        }
      })
      .valueChanges.subscribe(result => {
        this.videos = result.data.videosByCategory
      });
  }

  toWatchView(nextPage){
    this.router.navigateByUrl('watch/' + nextPage)
  }
}
