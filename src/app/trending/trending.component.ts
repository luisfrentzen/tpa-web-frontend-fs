import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import gql from 'graphql-tag';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss']
})
export class TrendingComponent implements OnInit {

  constructor(private apollo: Apollo, private router : Router) { }

  toWatchView(nextPage){
    this.router.navigateByUrl('watch/' + nextPage)
  }

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

  users = [];
  user;
  premi = '';

  type = 3;

  myFunction(x) {
    let vids;
    vids = document.querySelector("app-video-block")
    if (x.matches) {
      this.type = 1
    } else {
      this.type = 3
    }
  }

  ngOnInit(): void {

    var x = window.matchMedia("(max-width: 700px)")
    this.myFunction(x)
    x.addListener(this.myFunction)

    if(localStorage.getItem('users') != null){
      this.users = JSON.parse(localStorage.getItem('users'));
      this.user = this.users[0]

      this.premi = this.user.premium == 'yes' ? 'yes' : ''
    }
    console.log(this.premi)

    this.apollo
      .watchQuery({
        query: gql`
          query videos($premi: String!){
            videos(sort: "view", filter:"all", premium: $premi){
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
              premium,
            }
          }
        `,
        variables: {
          premi: this.premi
        }
      })
      .valueChanges.subscribe(result => {
        this.videos = result.data.videos
        console.log(this.videos)
        let i = 0;
        while (this.videos[0].view == 0) {
          let val = this.videos.shift()
          this.videos.push(val)
        }

        var s = []
        var n = 0

        this.videos.forEach(element => {
          const vidDate = (element.year * 365) + (element.month * 30) + element.day
          const current = new Date();
          const curDate = (current.getDate()) + ((current.getMonth()) * 30) + (current.getFullYear() * 365)
          const diff = curDate - vidDate
          // console.log(diff)
          if(diff <= 7 && n < 20)
          {
            s.unshift(element)
            n = n + 1
          }

        });
        this.videos = s;
      });
  }

}
