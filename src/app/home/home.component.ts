import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
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

  constructor(private data:DataService, private apollo:Apollo, private router:Router) { }
  // getChannelName(userid: String) {
  //
  // }

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

  lastKey;
  observer;

  onRestriction = false;

  users = []
  user;
  curUserId = '';

  currentUserInfo;

  ngOnInit(): void {
    this.data.currentRestriction.subscribe(onRestriction => this.onRestriction = onRestriction)

    if(localStorage.getItem('users') == null){
      this.users = [];
      this.curUserId = "";
console.log('g')
      this.apollo
        .watchQuery({
          query: gql`
            query vis($filter: String!, $premium: String!){
              videos(sort: "", filter:$filter, premium:$premium){
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
                premium,
              }
            }
          `,
          variables: {
            filter: (this.onRestriction ? "" : "all"),
            premium: ""
          }
        })
        .valueChanges.subscribe(result => {
          this.videos = result.data.videos

          this.lastKey = 12;
          this.observer = new IntersectionObserver((entry) => {
            if(entry[0].isIntersecting){
              let card = document.querySelector(".auto-grid")
              for(let i = 0; i < 4; i ++){
                if(this.lastKey < this.videos.length){
                  let div = document.createElement("div")
                  let vid = document.createElement("app-video-block")
                  vid.setAttribute("video", this.videos[this.lastKey])
                  div.appendChild(vid)
                  card.appendChild(div)
                  this.lastKey++
                }
              }
            }
          })
          this.observer.observe(document.querySelector(".footer"))
        });
    }
    else{
      this.users = JSON.parse(localStorage.getItem('users'));
      this.user = this.users[0];
      // this.loggedIn = true;
      this.curUserId = this.user.id;
      console.log('premi')
      this.apollo.watchQuery({
        query: gql`
          query getById($userid: String!){
            userById(userid: $userid){
              id,
              name,
              profilepic,
              subscribers,
              subscribed,
              likedvideos,
              likedcomments,
              disilikedvideos,
              disilikedcomments,
              premium,
            }
          }
        `,
        variables: {
          userid: this.curUserId,
        }
      })
      .valueChanges.subscribe(result => {
        this.currentUserInfo = result.data.userById
        this.currentUserInfo = this.currentUserInfo[0]
        console.log(this.currentUserInfo.premium)
        this.apollo
          .watchQuery({
            query: gql`
              query vis($filter: String!, $premium: String!){
                videos(sort: "", filter:$filter, premium:$premium){
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
                  premium,
                  visibility,
                }
              }
            `,
            variables: {
              filter: (this.onRestriction ? "" : "all"),
              premium: (this.currentUserInfo.premium == "yes" ? "yes" : "")
            }
          })
          .valueChanges.subscribe(result => {
            this.videos = result.data.videos
            console.log(this.videos)


            console.log(document.querySelector(".footer"))
            this.lastKey = 12;
            this.observer = new IntersectionObserver((entry) => {
              if(entry[0].isIntersecting){
                console.log("test")
                let card = document.querySelector(".auto-grid")
                for(let i = 0; i < 4; i ++){
                  if(this.lastKey < this.videos.length){
                    let div = document.createElement("div")
                    let vid = document.createElement("app-video-block")
                    vid.setAttribute("video", this.videos[this.lastKey])
                    div.appendChild(vid)
                    card.appendChild(div)
                    this.lastKey++
                  }
                }
              }
            })
            this.observer.observe(document.querySelector(".footer"))
          });
      })
    }





    this.data.currentPage.subscribe(currentPage => this.currentPage = currentPage)
  }

}
