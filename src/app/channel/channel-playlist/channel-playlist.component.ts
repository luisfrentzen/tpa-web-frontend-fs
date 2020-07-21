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
