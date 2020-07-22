import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-post-block',
  templateUrl: './post-block.component.html',
  styleUrls: ['./post-block.component.scss']
})
export class PostBlockComponent implements OnInit {

  @Input() postId = 0;
  @Input() channelInfo;

  constructor(private apollo : Apollo) { }

  currentUserInfo;
  user;

  myUser;

  newReplyDesc;

  isLiked;
  isDisiliked;

  likes = []
  disilikes = []

  users = [];

  curDate = new Date()

  toggleLike(ignore){
    if(localStorage.getItem('users') == null){
      return
    }

    this.apollo
        .mutate({
          mutation : gql`
            mutation likepost($id: String!, $comid: String!){
              likepost(id:$id, chnid:$comid)
              {
                id
              }
            }
          `,
          variables : {
            id: this.currentUserInfo.id,
            comid: (this.postId).toString(10),
          },
          refetchQueries: [{
            query: gql`
              query postById($id: Int!){
                postById(id: $id)
                {
                  like,
                  disilike,
                  attachment,
                  day,
                  month,
                  year,
                  userid,
                  desc,
                }
              }
            `,
            variables: {
              id: this.postId,
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
                  likedpost,
                  disilikedpost,
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
      if ( this.currentUserInfo.likedpost != "")
      {
        this.likes = this.currentUserInfo.likedpost.split(",")
        // console.log(this.likes)
      }
      else {
        this.likes = []
      }

      if(this.isDisiliked == true && !ignore)
      {
        this.toggleDisilike(true)
      }
      // console.log(this.isLiked);
    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }

  toggleDisilike(ignore){
    if(localStorage.getItem('users') == null){
      return
    }

    this.apollo
        .mutate({
          mutation : gql`
            mutation disilikepost($id: String!, $chnid: String!){
              disilikepost(id:$id, chnid:$chnid)
              {
                id
              }
            }
          `,
          variables : {
            id: this.currentUserInfo.id,
            chnid: (this.postId).toString(10),
          },
          refetchQueries: [{
            query: gql`
              query postById($id: Int!){
                postById(id: $id)
                {
                  like,
                  disilike,
                  attachment,
                  day,
                  month,
                  year,
                  userid,
                  desc,
                }
              }
            `,
            variables: {
              id: this.postId,
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
                  likedpost,
                  disilikedpost,
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

      if ( this.currentUserInfo.disilikedpost != "")
      {
        this.disilikes = this.currentUserInfo.disilikedpost.split(",")
        // console.log(this.likes)
      }
      else {
        this.disilikes = []
      }

      if(this.isLiked == true && !ignore)
      {
        this.toggleLike(true)
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



  ngOnInit(): void {
    if(localStorage.getItem('users') == null){
      this.users = [];
    }
    else {
      this.users = JSON.parse(localStorage.getItem('users'));
      this.user = this.users[0];
      // this.curUserId = this.user.id

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
            userid: this.user.id,
          }
        })
        .valueChanges.subscribe(result => {
          this.currentUserInfo = result.data.userById
          // console.log(this.channelUserInfo)
          this.currentUserInfo = this.currentUserInfo[0]

          if (this.currentUserInfo.likedpost != "")
          {
            this.likes = this.currentUserInfo.likedpost.split(",")
            // console.log(this.likes)
          }
          else {
            this.likes = []
          }

          if ( this.currentUserInfo.disilikedpost != "")
          {
            this.disilikes = this.currentUserInfo.disilikedpost.split(",")
            // console.log(this.likes)
          }
          else {
            this.disilikes = []
          }

          if(this.likes.includes(this.postId))
          {
            this.isLiked = true;
          }
          else{
            this.isLiked = false;
          }

          if(this.disilikes.includes(this.postId))
          {
            this.isDisiliked = true;
          }
          else{
            this.isDisiliked = false;
          }
        })
    }

    this.apollo
      .watchQuery({
        query: gql`
          query postById($id: Int!){
            postById(id: $id)
            {
              like,
              disilike,
              attachment,
              day,
              month,
              year,
              userid,
              desc,
            }
          }
        `,
        variables: {
          id: this.postId,
        }
      })
      .valueChanges.subscribe(result => {
        this.post = result.data.postById


      })
  }

}
