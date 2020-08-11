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

  isLiked;
  isDisiliked;

  likes = [];
  disilikes = [];


  comments;

  users = []
  user

  newCommentDesc;


  toggleLike(ignore){
    if(localStorage.getItem('users') == null){
      return
    }

    this.apollo
        .mutate({
          mutation : gql`
            mutation likecom($id: String!, $comid: String!){
              likevid(id:$id, chnid:$comid)
              {
                name
              }
            }
          `,
          variables : {
            id: this.currentUserInfo.id,
            comid: (this.targetVideo.id).toString(10),
          },
          refetchQueries: [{
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
              id: this.targetVideo.id,
            }
          },{
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
                  profilepic,
                }
              }
            `,
            variables: {
              userid: this.currentUserInfo.id,
            }
          }]
        }).subscribe(({ data }) => {
      console.log('got data', data);
      // this.isLiked = !this.isLiked;

      if(this.isDisiliked == true && !ignore)
      {
        this.toggleDisilike(true)
      }

      if ( this.currentUserInfo.disilikedvideos != "")
      {
        this.disilikes = this.currentUserInfo.disilikedvideos.split(",")
        // console.log(this.likes)
      }
      else {
        this.disilikes = []
      }

      if ( this.currentUserInfo.likedvideos != "")
      {
        this.likes = this.currentUserInfo.likedvideos.split(",")
        // console.log(this.likes)
      }
      else {
        this.likes = []
      }

      if ( this.likes.includes(this.targetVideo.id) )
      {
        this.isLiked = true;
      }
      else
      {
        this.isLiked = false;
      }

      if ( this.disilikes.includes(this.targetVideo.id) )
      {
        this.isDisiliked = true;
      }
      else
      {
        this.isDisiliked = false;
      }
      // console.log(this.isLiked);
    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }

  toggleDisilike(ignore){
    // console.log(this.myUser.id)
    if(localStorage.getItem('users') == null){
      return
    }

    this.apollo
        .mutate({
          mutation : gql`
            mutation disilikelikecom($id: String!, $comid: String!){
              disilikevid(id:$id, chnid:$comid)
              {
                name
              }
            }
          `,
          variables : {
            id: this.currentUserInfo.id,
            comid: (this.targetVideo.id).toString(10),
          },
          refetchQueries: [{
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
              id: this.targetVideo.id,
            }
          },{
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
                  profilepic,
                }
              }
            `,
            variables: {
              userid: this.currentUserInfo.id,
            }
          }]
        }).subscribe(({ data }) => {
      console.log('got data', data);
      // this.isLiked = !this.isLiked;

      if(this.isLiked == true && !ignore)
      {
        this.toggleLike(true)
      }

      if ( this.currentUserInfo.disilikedvideos != "")
      {
        this.disilikes = this.currentUserInfo.disilikedvideos.split(",")
        // console.log(this.likes)
      }
      else {
        this.disilikes = []
      }

      if ( this.currentUserInfo.likedvideos != "")
      {
        this.likes = this.currentUserInfo.likedvideos.split(",")
        // console.log(this.likes)
      }
      else {
        this.likes = []
      }

      if ( this.likes.includes(this.targetVideo.id) )
      {
        this.isLiked = true;
      }
      else
      {
        this.isLiked = false;
      }

      if ( this.disilikes.includes(this.targetVideo.id) )
      {
        this.isDisiliked = true;
      }
      else
      {
        this.isDisiliked = false;
      }
      // console.log(this.isLiked);
    },(error) => {
      console.log('there was an error sending the query', error);
    });
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
    if(mon == 0)
    {
      return "Jan"
    }
    else if(mon == 1)
    {
      return "Feb"
    }
    else if(mon == 2)
    {
      return "Mar"
    }
    else if(mon == 3)
    {
      return "Apr"
    }
    else if(mon == 4)
    {
      return "May"
    }
    else if(mon == 5)
    {
      return "Jun"
    }
    else if(mon == 6)
    {
      return "Jul"
    }
    else if(mon == 7)
    {
      return "Aug"
    }
    else if(mon == 8)
    {
      return "Sep"
    }
    else if(mon == 9)
    {
      return "Oct"
    }
    else if(mon == 10)
    {
      return "Nov"
    }
    else if(mon == 11)
    {
      return "Dec"
    }

    return ""
  }

  sortBy = ""

  toggleSort(){
    if(this.sortBy == "")
    {
      this.sortBy = "like"
    }
    else {
      this.sortBy = ""
    }

    this.apollo
      .watchQuery({
        query: gql`
          query commentByVid($videoid: Int!, $sortBy: String!){
            commentsByVideo(videoid: $videoid, sort: $sortBy){
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
          sortBy: this.sortBy
        }
      })
      .valueChanges.subscribe(result => {
        this.comments = result.data.commentsByVideo
        // console.log(this.comments)

        if(this.sortBy == 'like')
        {
          let i = 0;
          while (this.comments[0].like == 0) {
            let val = this.comments.shift()
            this.comments.push(val)
          }
        }
      });

      // console.log(th)
  }

  addNewCommentBtn(newdesc){
    if(!this.user){
      return
    }
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
              postid: 0
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
                commentsByVideo(videoid: $videoid, sort: ""){
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

  subs = [];

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
            id: this.currentUserInfo.id,
            chnid: this.targetVideo.userid,
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
                  profilepic,
                }
              }
            `,
            variables: {
              userid: this.targetVideo.userid,
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
              userid: this.currentUserInfo.id,
            }
          }]
        }).subscribe(({ data }) => {
      console.log('got data', data);
      this.isSubscribed = !this.isSubscribed

      if(this.currentUserInfo.subscribed = "")
      {
        this.subs = this.currentUserInfo.subscribed.split(",")
      }
      else
      {
        this.subs = []
      }

      if ( this.subs.includes(this.targetVideo.userid) )
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

  curUserId = "";
  lastKey;
  lastComment;
  observer;
  plid;

  videosInPl = [];
  currentPlaylist;

  ngOnInit(){

    const passedId = +this.route.snapshot.paramMap.get('id');

    this.plid = +this.route.snapshot.paramMap.get('playlistid');

    if(this.plid != 0)
    {
      this.apollo
        .mutate({
          mutation: gql`
            mutation viewPl($id: ID!){
              viewPlaylist(id: $id){
                title
              }
            }
          `,
          variables: {
            id: parseInt(this.plid),
          },
        })
        .subscribe(({ data }) => {
          console.log('got data', data);
          // this.isLiked = !this.isLiked;
          // console.log(this.isLiked);
          // this.addModeLink = false;
        },(error) => {
          console.log('there was an error sending the query', error);
        })

      this.apollo
        .watchQuery({
          query: gql`
            query playlistById($id: Int!){
              playlistById(id: $id){
                id,
                title,
                userid,
                view,
                day,
                month,
                year,
                desc,
                videos,
                visibility,
              }
            }
          `,
          variables: {
            id: this.plid,
          }
        })
        .valueChanges.subscribe(result => {
          this.currentPlaylist = result.data.playlistById
          this.currentPlaylist = this.currentPlaylist[0]
          console.log(this.currentPlaylist)

          this.apollo.watchQuery({
            query: gql`
              query videosByIds($id: String!){
                videosByIds(id: $id){
                  id,
                  title,
                  thumbnail,
                  channelname,
                  userid,
                  view,
                  url,
                }
              }
            `,
            variables: {
              id: this.currentPlaylist.videos,
            }
          })
          .valueChanges.subscribe(result => {
            this.videosInPl = result.data.videosByIds
            // console.log(this.videosInPl)


          })
        })
    }

    //
    // if(document.referrer.includes("playlist"))
    // {
    //   console.log("fromplaylist")
    // }

    this.apollo
      .mutate({
        mutation: gql`
          mutation viewVid($id: ID!){
            viewVideo(id: $id){
              title
            }
          }
        `,
        variables: {
          id: parseInt(passedId),
        },
      })
      .subscribe(({ data }) => {
        console.log('got data', data);
        // this.isLiked = !this.isLiked;
        // console.log(this.isLiked);
        // this.addModeLink = false;
      },(error) => {
        console.log('there was an error sending the query', error);
      })

    if(localStorage.getItem('users') == null){
      this.users = [];
      this.curUserId = "";

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
              else
              {
                this.isSubscribed = false;
              }


            });

          this.apollo
            .watchQuery({
              query: gql`
                query commentByVid($videoid: Int!){
                  commentsByVideo(videoid: $videoid, sort:""){
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
              videos(sort: "", filter: "", premium: "yes"){
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

          this.lastKey = 6;
          this.lastComment = 4;
          this.observer = new IntersectionObserver((entry) => {
            if(entry[0].isIntersecting){
              let card = document.querySelector(".recContainer")
              for(let i = 0; i < 3; i ++){
                if(this.lastKey < this.videos.length){
                  let div = document.createElement("div")
                  let vid = document.createElement("app-video-block")
                  vid.setAttribute("video", this.videos[this.lastKey])
                  div.appendChild(vid)
                  card.appendChild(div)
                  this.lastKey++
                }
              }

              let cont = document.querySelector(".commentContainer")
              for(let i = 0; i < 6; i ++){
                if(this.lastComment < this.comments.length){
                  let div = document.createElement("div")
                  let vid = document.createElement("app-comment-block")
                  vid.setAttribute("comment", this.comments[this.lastComment].id)
                  div.appendChild(vid)
                  card.appendChild(div)
                  this.lastComment++
                }
              }
            }
          })
          this.observer.observe(document.querySelector(".footer"))

        });
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
                profilepic,
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
          this.curUserId = this.currentUserInfo.id;

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


              if ( this.currentUserInfo.subscribed != "")
              {
                this.subs = this.currentUserInfo.subscribed.split(",")
                console.log(this.subs)
              }
              else
              {
                this.subs = []
              }

              if( this.currentUserInfo.likedvideos != "")
              {
                this.likes = this.currentUserInfo.likedvideos.split(",")
              }
              else {
                this.likes = []
              }

              if( this.currentUserInfo.disilikedvideos != "")
              {
                this.disilikes = this.currentUserInfo.disilikedvideos.split(",")
              }
              else {
                this.disilikes = []
              }

              if ( this.likes.includes(this.targetVideo.id) )
              {
                this.isLiked = true;
              }
              else
              {
                this.isLiked = false;
              }

              if ( this.disilikes.includes(this.targetVideo.id) )
              {
                this.isDisiliked = true;
              }
              else
              {
                this.isDisiliked = false;
              }


              console.log("Likes Disilikes")
              console.log(this.isLiked)
              console.log(this.isDisiliked)



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
                  else
                  {
                    this.isSubscribed = false;
                  }


                });

              this.apollo
                .watchQuery({
                  query: gql`
                    query commentByVid($videoid: Int!){
                      commentsByVideo(videoid: $videoid, sort: ""){
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
                  videos(sort: "", filter: "", premium: ""){
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

              this.lastKey = 6;
              this.lastComment = 4;
              this.observer = new IntersectionObserver((entry) => {
                if(entry[0].isIntersecting){
                  let card = document.querySelector(".recContainer")
                  for(let i = 0; i < 3; i ++){
                    if(this.lastKey < this.videos.length){
                      let div = document.createElement("div")
                      let vid = document.createElement("app-video-block")
                      vid.setAttribute("video", this.videos[this.lastKey])
                      div.appendChild(vid)
                      card.appendChild(div)
                      this.lastKey++
                    }
                  }

                  let cont = document.querySelector(".commentContainer")
                  for(let i = 0; i < 6; i ++){
                    if(this.lastComment < this.comments.length){
                      let div = document.createElement("div")
                      let vid = document.createElement("app-comment-block")
                      vid.setAttribute("comment", this.comments[this.lastComment].id)
                      div.appendChild(vid)
                      card.appendChild(div)
                      this.lastComment++
                    }
                  }
                }
              })
              this.observer.observe(document.querySelector(".footer"))

            });
        })
      }



  }


    // if(id == 2)
    // {
    //   this.url = "https://firebasestorage.googleapis.com/v0/b/tpa-web-71a78.appspot.com/o/1.mp4?alt=media&token=7756e3e9-c27b-4c04-82ec-9bc88be81864"
    // }
    // else{
    //   this.url = "https://firebasestorage.googleapis.com/v0/b/festube-storage.appspot.com/o/vid%2F1594796961321_dummy.mp4?alt=media&token=530ae21d-6deb-4eef-81c3-b9c336de2c27"
    // }





}
