import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage'
import gql from 'graphql-tag';

@Component({
  selector: 'app-channel-community',
  templateUrl: './channel-community.component.html',
  styleUrls: ['./channel-community.component.scss']
})
export class ChannelCommunityComponent implements OnInit {

  constructor(private apollo : Apollo, private router : Router, private storage: AngularFireStorage) { }

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

    return "";
  }

  posts;
  channelUserInfo;
  curUserId;

  users = [];
  user;

  self;

  files;
  curDate = new Date();

  dsc;
  // atcurl;
  //
  // uploadThumbnail(files: FileList) {
  //   var file;
  //   if (files.item(0).type.split('/')[0]=='image') {
  //     file = files.item(0)
  //     // console.log("benar");
  //   }
  //   else {
  //     return;
  //   }
  //
  //   this.thumbnailFile = file;
  //
  //   const reader = new FileReader();
  //   reader.onload = e => this.atcurl = reader.result as string;
  //
  //   // this.thmsrc =
  //   reader.readAsDataURL(file)
  // }
  atc;

  getAttachment(files){
    if(files.item(0).type.split('/')[0]=='image')
    {
      // atc = files.item(0)
      console.log(files.item(0).name)
      this.atc = files.item(0)
      return
    }
    else{
      return
    }
  }

  atcurl;
  thmTask;

  newPost(){

    if(this.atc != null)
    {
      const thmPath = `atc/${Date.now()}_${this.atc.name}`

      const thmref = this.storage.ref(thmPath);
      this.thmTask = this.storage.upload(thmPath, this.atc);


      this.thmTask.then(async res => await thmref.getDownloadURL().subscribe(url => {
          this.atcurl = url

          this.apollo
            .mutate({
              mutation: gql`
                mutation newPost($userid: String!, $desc: String!, $attachment: String!, $day: Int!, $month: Int!, $year: Int!){
                  createPost(input: {
                    userid: $userid,
                    like: 0,
                    disilike: 0,
                    desc: $desc,
                    attachment: $attachment,
                    day: $day,
                    month: $month,
                    year: $year,
                  }){ userid }
                }
              `,
              variables: {
                userid: this.channelUserInfo.id,
                attachment: this.atcurl,
                desc: this.dsc,
                day: this.curDate.getDate(),
                month: this.curDate.getMonth(),
                year: this.curDate.getFullYear(),
              },
              refetchQueries: [{
                query: gql `
                query posts($userid: String!) {
                  postByUser(userid: $userid){
                    id,
                    like,
                    disilike,
                    attachment,
                    desc,
                    day,
                    month,
                    year
                  }
                }
                `,
                variables: {
                  userid: this.channelUserInfo.id,
                }
              }]
            })
            .subscribe(({ data }) => {
              console.log('got data', data);
              // this.isLiked = !this.isLiked;
              // console.log(this.isLiked);
              // this.addModeLink = false;
              this.apollo
                .mutate({
                  mutation : gql`
                    mutation createNotif($ntitle: String!, $user: String!){
                      createNotif(input: {
                        userid: $user
                        vidthm: ""
                        title: $ntitle
                      }){
                        title
                      }
                    }
                  `,
                  variables: {
                    ntitle: this.dsc,
                    user: this.channelUserInfo.id,
                  }
                }).subscribe(({ data }) => {
                console.log('got data', data);
              },(error) => {
                // console.log(this.playlist)
                // console.log(typeof this.uploadedVideo)
                console.log('there was an error sending the query', error);
              })

            },(error) => {
              console.log('there was an error sending the query', error);
            });
        }
      ))
    }
    else {
      // this.atcurl = url

      this.apollo
        .mutate({
          mutation: gql`
            mutation newPost($userid: String!, $desc: String!, $attachment: String!, $day: Int!, $month: Int!, $year: Int!){
              createPost(input: {
                userid: $userid,
                like: 0,
                disilike: 0,
                desc: $desc,
                attachment: $attachment,
                day: $day,
                month: $month,
                year: $year,
              }){ userid }
            }
          `,
          variables: {
            userid: this.channelUserInfo.id,
            attachment: "",
            desc: this.dsc,
            day: this.curDate.getDate(),
            month: this.curDate.getMonth(),
            year: this.curDate.getFullYear(),
          },
          refetchQueries: [{
            query: gql `
            query posts($userid: String!) {
              postByUser(userid: $userid){
                id,
                like,
                disilike,
                attachment,
                desc,
                day,
                month,
                year
              }
            }
            `,
            variables: {
              userid: this.channelUserInfo.id,
            }
          }]
        })
        .subscribe(({ data }) => {
          console.log('got data', data);
          // this.isLiked = !this.isLiked;
          // console.log(this.isLiked);
          // this.addModeLink = false;
          this.apollo
            .mutate({
              mutation : gql`
                mutation createNotif($ntitle: String!, $user: String!){
                  createNotif(input: {
                    userid: $user
                    vidthm: ""
                    title: $ntitle
                  }){
                    title
                  }
                }
              `,
              variables: {
                ntitle: this.dsc,
                user: this.channelUserInfo.id,
              }
            }).subscribe(({ data }) => {
            console.log('got data', data);
          },(error) => {
            // console.log(this.playlist)
            // console.log(typeof this.uploadedVideo)
            console.log('there was an error sending the query', error);
          })
        },(error) => {
          console.log('there was an error sending the query', error);
        });
    }



  }

  currentUserInfo;

  ngOnInit(): void {
    if(localStorage.getItem('users') == null){
      this.users = [];
      this.curUserId = "";
    }
    else {
      this.users = JSON.parse(localStorage.getItem('users'));
      this.user = this.users[0];
      this.curUserId = this.user.id
    }


    const url = this.router.url
    const s = url.split("/")
    // this.onPage = s[3]

    if(this.curUserId == s[2])
    {
      this.self = true;
    }
    else
    {
      this.self = false;
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
              year,
              likedpost,
              disilikedpost,
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

        // this.getTotalViews()

        this.apollo
          .watchQuery({
            query: gql `
              query posts($userid: String!){
                postByUser(userid: $userid)
                {
                  id,
                  like,
                  disilike,
                  attachment,
                  day,
                  month,
                  year,
                  desc,
                }
              }
            `,
            variables: {
              userid: this.channelUserInfo.id,
            }
          }).valueChanges.subscribe(result => {
            this.posts = result.data.postByUser
            console.log(this.posts)
          });
      });
  }

}
