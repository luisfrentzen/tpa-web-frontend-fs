import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import gql from 'graphql-tag';

@Component({
  selector: 'app-video-block',
  templateUrl: './video-block.component.html',
  styleUrls: ['./video-block.component.scss']
})
export class VideoBlockComponent implements OnInit {

  @Input() video;
  @Input() typeView;
  @Input() width = 300;
  @Input() height = 170;
  @Input() fromPlaylist = 0;

  constructor(private apollo : Apollo, private router : Router) { }

  channelUserInfo;

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

  duration;
  getDuration(v){
    let d = Math.round(v.target.duration)
    if(d < 10){
      this.duration = "00:0" + d
    }
    else if(d < 60){
      this.duration = "00:" + d
    }
    else if(d < 3600){
      this.duration = Math.round(d / 60).toString() + ':'
      if(Math.round(d / 60) < 10)
      {
        this.duration = '0' + this.duration;
      }

      let temp;
      if(Math.round(d % 60) < 10)
      {
        temp = '0' + Math.round(d % 60).toString()
      }

      this.duration = this.duration + temp;
    }
  }

  user;
  users = [];
  curUserId = '';
  premiumUser = false;

  deleteVideo(){
    this.apollo
        .mutate({
          mutation : gql`
            mutation delete($id: ID!){
              deleteVideo(id: $id)
            }
          `,
          variables: {
            id: this.video.id,
          }
        }).subscribe(({ data }) => {
      console.log('got data', data);
    },(error) => {
      console.log(this.playlist)
      // console.log(typeof this.uploadedVideo)
      console.log('there was an error sending the query', error);
    })
  }


  downloadVideo(){
    var element = document.createElement('a');
    element.setAttribute('href',
    'data:text/plain;charset=utf-8, '
    + encodeURIComponent(this.video.name));
    element.setAttribute('download', this.video.url);

    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

  }

  s;

  ngOnInit(): void {
    const url = this.router.url
    this.s = url.split("/")

    if(localStorage.getItem('users') == null){
      this.users = [];
      this.curUserId = "";

    }
    else{
      this.users = JSON.parse(localStorage.getItem('users'));
      this.user = this.users[0];
      // this.loggedIn = true;
      this.curUserId = this.user.id;
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
              premiday,
              premiyear,
              premimonth,
              premitype,
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
        this.curUserId = this.currentUserInfo.id
        this.premiumUser = (this.currentUserInfo.premium == "yes" ? true : false)

      })
    }
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
              channelart,
              about,
              day,
              month,
              year
            }
          }
        `,
        variables: {
          userid: this.video.userid,
        }
      })
      .valueChanges.subscribe(result => {
        this.channelUserInfo = result.data.userById
        // console.log(this.channelUserInfo)
        this.channelUserInfo = this.channelUserInfo[0]
        // console.log(s[2])
      })

}

}
