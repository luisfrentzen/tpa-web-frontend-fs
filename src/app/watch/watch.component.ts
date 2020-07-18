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

  vidDate;

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

  ngOnInit(): void {

    const passedId = +this.route.snapshot.paramMap.get('id');

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
