import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  currentPage = '';

  videos:any;

  constructor(private apollo:Apollo) { }
  // getChannelName(userid: String) {
  //
  // }

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

    if(localStorage.getItem('users') == null){
      this.users = [];
      this.curUserId = "";

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
              query subbedvids($id: String!, $premium: String!) {
                videosByUsers(id: $id, premium: $premium){
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
              id: this.currentUserInfo.subscribed,
              premium: (this.currentUserInfo.premium == "yes" ? "yes" : "")
            }
          })
          .valueChanges.subscribe(result => {
            this.videos = result.data.videosByUsers
            console.log(this.videos)
          });
      })
    }
  }

}
