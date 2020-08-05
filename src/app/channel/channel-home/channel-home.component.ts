import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-channel-home',
  templateUrl: './channel-home.component.html',
  styleUrls: ['./channel-home.component.scss']
})
export class ChannelHomeComponent implements OnInit {

  constructor(private router : Router, private apollo : Apollo) { }

  channelUserInfo;
  playlists;
  videos;

  recentVid;
  randomVid;
  randomPl;

  onPage;

  changePage(nextPage:string) {
    this.router.navigateByUrl('channel/' + nextPage);
    this.onPage = nextPage;
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

  ngOnInit(): void {
    const url = this.router.url
    const s = url.split("/")

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

        this.apollo
          .watchQuery({
            query: gql`
            query vidByUser($userid: String!){
              videosByUser(userid: $userid, sort: "", premium: "", privacy: "") {
                title,
                view,
                thumbnail,
                day,
                month,
                year,
                id,
                userid,
                url,
              }
            }
            `,
            variables: {
              userid: s[2],
            }
          })
          .valueChanges.subscribe(result => {
            this.videos = result.data.videosByUser

            if(this.videos.length <= 5 )
            {
              this.recentVid = result.data.videosByUser
              this.randomVid = result.data.videosByUser
              // console.log(result.data.videosByUser)
            }
            else {
              this.recentVid = this.videos.slice(0,5)

              this.randomVid = []
              while (this.randomVid.length < 5) {
                  var x = Math.floor(Math.random() * this.videos.length)
                  if(!(this.videos[x] in this.randomVid)) {
                    this.randomVid.push(this.videos[x])
                    console.log(this.randomVid)
                  }
              }
            }
          })

        this.apollo
          .watchQuery({
            query: gql`
            query getPlaylistById($userid: String!){
              playlistsByUser(userid: $userid){
                title,
                id,
                videos,
              }
            }
            `,
            variables: {
              userid: this.channelUserInfo.id
            }
          })
          .valueChanges.subscribe(result => {
            this.playlists = result.data.playlistsByUser

            if(this.playlists.length <= 3 )
            {
              this.randomPl = result.data.playlistsByUser
            }
            else {
              this.randomPl = []
              while (this.randomPl.length < 3) {
                  var x = Math.floor(Math.random() * this.playlists.length)
                  if(!(this.playlists[x] in this.randomPl)) {
                    this.randomPl.push(this.playlists[x])
                  }
              }
            }
          })
      })
  }

}
