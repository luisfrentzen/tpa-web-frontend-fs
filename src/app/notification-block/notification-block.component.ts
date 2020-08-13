import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-notification-block',
  templateUrl: './notification-block.component.html',
  styleUrls: ['./notification-block.component.scss']
})
export class NotificationBlockComponent implements OnInit {

  @Input() notif;

  user;

  constructor(private apollo : Apollo) { }

  ngOnInit(): void {
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
              year,
              archivedplaylists,
              premium,
            }
          }
        `,
        variables: {
          userid: this.notif.userid,
        }
      })
      .valueChanges.subscribe(result => {
        this.user = result.data.userById[0]
      })
  }

}
