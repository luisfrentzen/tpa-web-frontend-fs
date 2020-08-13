import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-channel-block',
  templateUrl: './channel-block.component.html',
  styleUrls: ['./channel-block.component.scss']
})
export class ChannelBlockComponent implements OnInit {

  @Input() channel;

  constructor(private apollo : Apollo) { }

  videoCount;

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

  isSubscribed = false;
  curUserId = 0;

  users = [];
  user;

  subs = [];

  isBelled = false;
  notifieds;

  onNotification(){

    this.apollo
        .mutate({
          mutation : gql`
            mutation notify($id: String!, $chnid: String!){
              bellnotif(id:$id, chnid:$chnid){
                name
              }
            }
          `,
          variables : {
            id: this.curUserId,
            chnid: this.channel.id,
          },
          refetchQueries: [{
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
                  notified,
                }
              }
            `,
            variables: {
              userid: this.curUserId,
            }
          }]
        }).subscribe(({ data }) => {
      console.log('got data', data);

      // this.isBelled = !this.isBelled
      console.log(this.isBelled)
      if(this.user.notified.includes(this.channel.id)){
        this.isBelled = true;
      }
      else {
        this.isBelled = false;
      }

    },(error) => {
      console.log('there was an error sending the query', error);
    });

  }

  toggleSubs(){
    if(localStorage.getItem('users') == null){
      return
    }

    this.apollo
        .mutate({
          mutation : gql`
            mutation subscribe($id: String!, $chnid: String!){
              subscribe(id: $id, chnid: $chnid){
                name
              }
            }
          `,
          variables : {
            id: this.user.id,
            chnid: this.channel.id,
          },
          refetchQueries: [{
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
              userid: this.channel.id,
            }
          },
          {
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
              userid: this.user.id,
            }
          }]
        }).subscribe(({ data }) => {
      console.log('got data', data);
      this.isSubscribed = !this.isSubscribed

      if ( this.user.subscribed.includes(this.channel.id) )
      {
        this.isSubscribed = true;
      }
      else
      {
        this.isSubscribed = false;
      }

    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }

  getUserFromStorage(){
    this.users = JSON.parse(localStorage.getItem('users'));
    this.user = this.users[0];
    this.loggedIn = true;
    console.log(this.user)
  }

  ngOnInit(): void {
    if(localStorage.getItem('users') != null){
        this.getUserFromStorage()
        this.curUserId = this.user.id

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
                  notified,
                }
              }
            `,
            variables: {
              userid: this.user.id,
            }
          })
          .valueChanges.subscribe(result => {
            this.user = result.data.userById
            this.user = this.user[0]
            if(this.user.subscribed.includes(this.channel.id)){
              this.isSubscribed = true;
            }
            else{
              this.isSubscribed = false;
            }

            if(this.user.notified.includes(this.channel.id)){
              this.isBelled = true;
            }
            else{
              this.isBelled = false;
            }
          })
        // console.log(this.user.subscribed)



    }

    this.apollo
      .watchQuery({
        query: gql`
        query vidByUser($userid: String!, $sortBy: String!, $privacy: String!){
          videosByUser(userid: $userid, sort: $sortBy, premium: "", privacy: $privacy) {
            title,
          }
        }
        `,
        variables: {
          userid: this.channel.id,
          sortBy: "",
          privacy: ""
        }
      })
      .valueChanges.subscribe(result => {
        this.videoCount = result.data.videosByUser.length

      })
  }

}
