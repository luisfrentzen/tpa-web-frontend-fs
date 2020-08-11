import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router, ActivatedRoute } from '@angular/router'
import gql from 'graphql-tag';

@Component({
  selector: 'app-gaming',
  templateUrl: './gaming.component.html',
  styleUrls: ['./gaming.component.scss']
})
export class GamingComponent implements OnInit {

  constructor(private apollo: Apollo, private router : Router, private route : ActivatedRoute) { }

  toWatchView(nextPage){
    this.router.navigateByUrl('watch/' + nextPage)
  }

  getUserFromStorage(){
    this.users = JSON.parse(localStorage.getItem('users'));
    this.user = this.users[0];
    // this.loggedIn = true;
    console.log(this.user)
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

  now = new Date();
  videos;
  recentvideos;
  weekvideos;
  monthvideos;

  users = [];
  user;
  premi = '';

  passedCat;
  iconClass;

  ngOnInit(): void {

    this.passedCat = this.route.snapshot.paramMap.get('cat');
    this.passedCat = this.passedCat[0].toUpperCase() + this.passedCat.slice(1)

    if(this.passedCat == "Gaming"){
      this.iconClass = "fa fa-gamepad"
    }
    else if(this.passedCat == "Music"){
      this.iconClass = "fa fa-music"
    }
    else if(this.passedCat == "Entertainment"){
      this.iconClass = "fa fa-magic"
    }
    else if(this.passedCat == "Sport"){
      this.iconClass = "fa fa-dumbbell"
    }
    else if(this.passedCat == "News"){
      this.iconClass = "fa fa-newspaper"
    }
    else if(this.passedCat == "Travel"){
      this.iconClass = "fa fa-map-marked-alt"
    }

    if(localStorage.getItem('users') != null)
    {
      this.getUserFromStorage()
      if(this.user.premium == 'yes')
      {
        this.premi = 'yes';
      }
    }



    this.apollo
      .watchQuery({
        query: gql`
          query videosByCategory($category: String!, $premi: String!){
            videosByCategory(category: $category, sortBy: "view", premi: $premi){
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
          category: this.passedCat,
          premi: this.premi == 'yes' ? '' : 'yes',
        }
      })
      .valueChanges.subscribe(result => {
        this.videos = result.data.videosByCategory
        console.log(this.videos);

        while(this.videos[0].view == 0 )
        {
          this.videos.push(this.videos.shift())
        }
        console.log(this.videos);

        this.weekvideos = []
        this.monthvideos = []

        this.videos.forEach(element => {
          if((this.now.getDate() + this.now.getMonth() * 30 + this.now.getFullYear() * 365) - (element.day + element.month * 30 + element.year * 365) <= 30){
            this.monthvideos.push(element)
          }

          if((this.now.getDate() + this.now.getMonth() * 30 + this.now.getFullYear() * 365) - (element.day + element.month * 30 + element.year * 365) <= 7){
            this.weekvideos.push(element)
          }
        });

        console.log(this.weekvideos);


        // while(this.videos.length > 20)
        // {
        //   this.videos.pop()
        // }
      });

      this.apollo
        .watchQuery({
          query: gql`
            query videosByCategory($category: String!, $premi: String!){
              videosByCategory(category: $category, sortBy: "date", premi: $premi){
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
            category: this.passedCat,
            premi: this.premi == 'yes' ? '' : 'yes',
          }
        })
        .valueChanges.subscribe(result => {
          this.recentvideos = result.data.videosByCategory
          console.log(this.recentvideos);

          // while(this.recentvideos.length > 20)
          // {
          //   this.recentvideos.pop()
          // }
        });
  }
}
