import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-playlist-block',
  templateUrl: './playlist-block.component.html',
  styleUrls: ['./playlist-block.component.scss']
})
export class PlaylistBlockComponent implements OnInit {

  @Input() playlist;
  @Input() typeView;

  video;
  constructor(private apollo : Apollo) { }

  s;
  playlistOwner;

  ngOnInit(): void {
    if (this.playlist.videos != "") {
      this.s = this.playlist.videos.split(",")
      console.log(this.s[0])

      this.apollo
        .watchQuery({
          query: gql`
            query videoById($id: Int!){
              videoById(id: $id){
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
                like,
                disilike,
              }
            }
          `,
          variables: {
            id: this.s[0],
          }
        })
        .valueChanges.subscribe(result => {
          this.video = result.data.videoById
          this.video = this.video[0]

        })
    }
    else {
      this.s = []
    }

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
            archivedplaylists,
            premium,
          }
        }
      `,
      variables: {
        userid: this.playlist.userid,
      }
    })
    .valueChanges.subscribe(result => {
      this.playlistOwner = result.data.userById[0]
      console.log(this.playlistOwner)

    })
  }


}
