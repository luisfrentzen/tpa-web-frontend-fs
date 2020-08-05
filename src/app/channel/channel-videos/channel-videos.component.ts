import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-channel-videos',
  templateUrl: './channel-videos.component.html',
  styleUrls: ['./channel-videos.component.scss']
})
export class ChannelVideosComponent implements OnInit {

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

  constructor(private router : Router, private apollo : Apollo) { }
  videos;
  channelUserInfo;

  sortBy = "";
  sortLabel = "Newest"

  toggleSort(){
    if( this.sortBy == "")
    {
      this.sortBy = "old"
      this.sortLabel = "Oldest"
    }
    else if( this.sortBy == "old")
    {
      this.sortBy = "view"
      this.sortLabel = "Views"
    }
    else if( this.sortBy == "view")
    {
      this.sortBy = ""
      this.sortLabel = "Newest"
    }

    let pri = (this.currentUserInfo.id == this.channelUserInfo.id ? 'all' : '');

    this.apollo
      .watchQuery({
        query: gql`
        query vidByUser($userid: String!, $sortBy: String!, $privacy: String!){
          videosByUser(userid: $userid, sort: $sortBy, premium: "", privacy: $privacy) {
            title,
            view,
            thumbnail,
            day,
            month,
            year,
            id,
            userid,
            premium,
            url,
          }
        }
        `,
        variables: {
          userid: this.channelUserInfo.id,
          sortBy: this.sortBy,
          privacy: pri
        }
      })
      .valueChanges.subscribe(result => {
        this.videos = result.data.videosByUser
        console.log(this.videos)
        if(this.sortBy == 'view')
        {
          let i = 0;
          while (this.videos[0].view == 0) {
            let val = this.videos.shift()
            this.videos.push(val)
          }
          console.log(this.videos)
        }
      })
  }

  lastKey;
  obeserver;

  user;
  users = [];
  currentUserInfo;
  curUserId = ''

  ngOnInit(): void {
    const url = this.router.url
    const s = url.split("/")

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

    // console.log(this.channelUserInfo)
    this.apollo
      .watchQuery({
        query: gql`
          query userById($userid: String!){
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
          userid: s[2],
        }
      })
      .valueChanges.subscribe(result => {
        this.channelUserInfo = result.data.userById
        // console.log(this.channelUserInfo)
        this.channelUserInfo = this.channelUserInfo[0]
        // console.log(s[2])

        if(localStorage.getItem('users') == null){
          this.users = [];
          this.curUserId = "";

          this.apollo
            .watchQuery({
              query: gql`
              query vidByUser($userid: String!, $premium: String!){
                videosByUser(userid: $userid, sort: "", premium: $premium, privacy: "") {
                  title,
                  view,
                  thumbnail,
                  day,
                  month,
                  year,
                  id,
                  userid,
                  premium,
                  url,
                }
              }
              `,
              variables: {
                userid: this.channelUserInfo.id,
                premium: ""
              }
            })
            .valueChanges.subscribe(result => {
              this.videos = result.data.videosByUser
              console.log(this.videos)
            })

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
            let pri = (this.currentUserInfo.id == s[2] ? 'all' : '');
            this.apollo
              .watchQuery({
                query: gql`
                query vidByUser($userid: String!, $premium: String!, $privacy: String!){
                  videosByUser(userid: $userid, sort: "", premium: $premium, privacy: $privacy) {
                    title,
                    view,
                    thumbnail,
                    day,
                    month,
                    year,
                    id,
                    userid,
                    premium,
                    url,
                    visibility,
                  }
                }
                `,
                variables: {
                  userid: this.channelUserInfo.id,
                  premium: (this.currentUserInfo.premium == "yes" ? "yes" : ""),
                  privacy: pri,
                }
              })
              .valueChanges.subscribe(result => {
                this.videos = result.data.videosByUser
                console.log(this.videos)
              })
            })
          }
      })
  }

}
