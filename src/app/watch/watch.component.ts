import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss']
})
export class WatchComponent implements OnInit {

  url = "";

  constructor(private apollo : Apollo, private route : ActivatedRoute, private router : Router) { }

  videos;
  targetVideo;

  toWatchView(nextPage){

    this.router.navigateByUrl('')
    this.router.navigateByUrl('watch/' + nextPage)
    // window.location.reload()

  }

  channel;

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

  getPercentage(a1, a2){
    return Math.round((a1 / a2) * 100) + "%"
  }

  curDate = new Date();

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

  getMonthName(mon)
  {
    if(mon == 1)
    {
      return "Jan"
    }
    else if(mon == 2)
    {
      return "Feb"
    }
    else if(mon == 3)
    {
      return "Mar"
    }
    else if(mon == 4)
    {
      return "Apr"
    }
    else if(mon == 5)
    {
      return "May"
    }
    else if(mon == 6)
    {
      return "Jun"
    }
    else if(mon == 7)
    {
      return "Jul"
    }
    else if(mon == 8)
    {
      return "Aug"
    }
    else if(mon == 9)
    {
      return "Sep"
    }
    else if(mon == 10)
    {
      return "Oct"
    }
    else if(mon == 11)
    {
      return "Nov"
    }
    else if(mon == 12)
    {
      return "Dec"
    }

    return ""
  }

  comments;

  users = []
  user

  newCommentDesc;

  addNewCommentBtn(newdesc){
    this.apollo
        .mutate({
          mutation : gql`
          mutation newComment($userid: String!, $desc: String!, $day: Int!, $month: Int!, $year: Int!, $videoid: Int!){
            createComment( input: {
              userid: $userid
              videoid: $videoid
              like: 0
              disilike: 0
              desc: $desc
              day: $day
              month: $month
              year: $year
              replyto: 0
              replycount: 0
            }){ replyto }
          }
          `,
          variables : {
            userid: this.user.id,
            desc: newdesc,
            day: this.curDate.getDate(),
            month: this.curDate.getMonth(),
            year: this.curDate.getFullYear(),
            videoid: this.targetVideo.id,
          },
          refetchQueries: [{
            query: gql`
              query commentByVid($videoid: Int!){
                commentsByVideo(videoid: $videoid){
                  id,
                  day,
                  month,
                  year,
                  userid,
                  replycount,
                  desc,
                  disilike,
                  like,
                  replyto,
                }
              }
            `,
            variables: {
              videoid: this.targetVideo.id,
            },
          }
        ]
        }).subscribe(({ data }) => {
      console.log('got data', data);
    },(error) => {
      // console.log(this.user.id)
      // console.log(newdesc)
      // console.log(this.curDate.getDate())
      // console.log(this.curDate.getMonth())
      // console.log(this.curDate.getFullYear())
      // console.log(this.targetVideo.id)

      console.log('there was an error sending the query', error);
    });
  }

  currentUserInfo;
  isSubscribed = false;

  subs;

  toggleSubs(thisid, targetid){
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
            id: thisid,
            chnid: targetid,
          },
        }).subscribe(({ data }) => {
      console.log('got data', data);
      this.isSubscribed = !this.isSubscribed
    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }

  ngOnInit(): void {

    const passedId = +this.route.snapshot.paramMap.get('id');

    if(localStorage.getItem('users') == null){
      this.users = [];
    }
    else{
      this.users = JSON.parse(localStorage.getItem('users'));
      this.user = this.users[0];

      this.apollo
        .watchQuery({
          query: gql`
            query userById($userid: String!){
              userById(userid: $userid){
                id,
                name,
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
        })
        .valueChanges.subscribe(result => {
          this.currentUserInfo = result.data.userById
          this.currentUserInfo = this.currentUserInfo[0]

          if ( this.currentUserInfo.subscribed != "")
          {
            this.subs = this.currentUserInfo.subscribed.split(",")
          }
        })
    }


    // if(id == 2)
    // {
    //   this.url = "https://firebasestorage.googleapis.com/v0/b/tpa-web-71a78.appspot.com/o/1.mp4?alt=media&token=7756e3e9-c27b-4c04-82ec-9bc88be81864"
    // }
    // else{
    //   this.url = "https://firebasestorage.googleapis.com/v0/b/festube-storage.appspot.com/o/vid%2F1594796961321_dummy.mp4?alt=media&token=530ae21d-6deb-4eef-81c3-b9c336de2c27"
    // }



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
          id: passedId,
        }
      })
      .valueChanges.subscribe(result => {
        this.targetVideo = result.data.videoById
        this.targetVideo = this.targetVideo[0]
        // console.log(this.targetVideo)

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
              userid: this.targetVideo.userid,
            }
          })
          .valueChanges.subscribe(result => {
            this.channel = result.data.userById
            this.channel = this.channel[0]

            if ( this.subs.includes(this.channel.id) )
            {
              this.isSubscribed = true;
            }
          });

        this.apollo
          .watchQuery({
            query: gql`
              query commentByVid($videoid: Int!){
                commentsByVideo(videoid: $videoid){
                  id,
                  day,
                  month,
                  year,
                  userid,
                  replycount,
                  desc,
                  disilike,
                  like,
                  replyto,
                }
              }
            `,
            variables: {
              videoid: passedId
            }
          })
          .valueChanges.subscribe(result => {
            this.comments = result.data.commentsByVideo
            console.log(this.comments)
          });
      });


    this.apollo
      .watchQuery({
        query: gql`
          {
            videos{
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
            }
          }
        `,
      })
      .valueChanges.subscribe(result => {
        this.videos = result.data.videos
      });
  }

}
