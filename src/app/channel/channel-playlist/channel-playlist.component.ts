import { Component, OnInit, Input} from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag'

@Component({
  selector: 'app-channel-playlist',
  templateUrl: './channel-playlist.component.html',
  styleUrls: ['./channel-playlist.component.scss']
})
export class ChannelPlaylistComponent implements OnInit {
  channelUserInfo;
  playlists;

  users = [];
  user;
  curUserId;

  constructor(private apollo : Apollo, private router : Router) { }

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

        if (localStorage.getItem('users') != null)
        {
          this.users = JSON.parse(localStorage.getItem('users'));
          this.user = this.users[0];
          // this.loggedIn = true;
          this.curUserId = this.user.id;
        }
        else {
          this.curUserId = ""
        }


        let pri = (this.curUserId == this.channelUserInfo.id ? '' : 'private');

        this.apollo
          .watchQuery({
            query: gql`
            query getPlaylistById($userid: String!, $visibility: String!){
              playlistsByUser(userid: $userid, visibility: $visibility){
                title,
                id,
                videos,
                visibility,
              }
            }
            `,
            variables: {
              userid: this.channelUserInfo.id,
              visibility: pri
            }
          })
          .valueChanges.subscribe(result => {
            this.playlists = result.data.playlistsByUser
          })
      })


  }

}
