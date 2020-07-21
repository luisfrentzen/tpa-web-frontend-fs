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

  channelUserinfo;
  playlists;
  videos;

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
          })
      })
  }

}
