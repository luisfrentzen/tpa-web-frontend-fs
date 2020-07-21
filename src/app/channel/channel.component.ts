import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';



@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {

  constructor(private router : Router, private route : ActivatedRoute, private apollo : Apollo) { }

  onPage;
  channelUserInfo;

  changePage(nextPage:string) {
    this.router.navigateByUrl('channel/' + this.channelUserInfo.id + '/' + nextPage);
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

  ngOnInit(): void {
    const passedId = +this.route.snapshot.paramMap.get('id');

    const url = this.router.url
    const s = url.split("/")
    this.onPage = s[3]

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
          userid: s[2],
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
