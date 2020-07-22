import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import gql from 'graphql-tag';

@Component({
  selector: 'app-channel-about',
  templateUrl: './channel-about.component.html',
  styleUrls: ['./channel-about.component.scss']
})
export class ChannelAboutComponent implements OnInit {

  constructor(private apollo : Apollo, private router : Router) { }

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

  editModeAbout = false;
  editModeLinks = false;

  channelUserInfo;
  links;

  users = [];
  user;

  linkurl = [];
  linklabel = [];

  toggleEditAbout() {
    this.editModeAbout = !this.editModeAbout;
    console.log(this.editModeAbout)
  }

  toggleEditLinks() {
    this.editModeLinks = !this.editModeLinks;
  }

  updateLinks() {
    this.links.forEach((element, index) => {
      var editedlabel = this.linklabel[index] ? this.linklabel[index] : element.label;
      var editedurl = this.linkurl[index] ? this.linkurl[index] : element.url;
      // f = f+1;
      // console.log(editedlabel)
      // console.log(editedurl)

      this.apollo
        .mutate({
          mutation: gql`
            mutation updatelink($id: Int!, $label: String!, $url: String!) {
              updateLink(
                id: $id,
                label: $label,
                url: $url,
              ){ id }
            }
          `,
          variables: {
            id: element.id,
            url: editedurl,
            label: editedlabel,
          },
          refetchQueries: [{
            query: gql `
              query links($userid: String!) {
                linkByUser(userid: $userid) {
                  id,
                  url,
                  label
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
          this.editModeLinks = false;
        },(error) => {
          console.log('there was an error sending the query', error);
        });
    });
  }

  deleteLink(linkid){
    this.apollo
      .mutate({
        mutation: gql`
          mutation deleteLink($id: Int!) {
            deleteLink(id: $id)
          }
        `,
        variables: {
          id: linkid,
        },
        refetchQueries: [{
          query: gql `
            query links($userid: String!) {
              linkByUser(userid: $userid) {
                id,
                url,
                label
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
        this.editModeLinks = true;
      },(error) => {
        console.log('there was an error sending the query', error);
      });
    }

  editedAbout;
  addModeLink = false;

  newlinklabel;
  newlinkurl;

  totalviews = 0;

  videos;

  addNewLink()
  {
    this.apollo
      .mutate({
        mutation: gql`
          mutation newlink($userid: String!, $url: String!, $label: String!){
            createLink(input: {
              userid: $userid,
              url: $url,
              label: $label,
            }){ userid }
          }
        `,
        variables: {
          userid: this.channelUserInfo.id,
          url: this.newlinkurl,
          label: this.newlinklabel,
        },
        refetchQueries: [{
          query: gql `
            query links($userid: String!) {
              linkByUser(userid: $userid) {
                id,
                url,
                label
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
        this.addModeLink = false;
      },(error) => {
        console.log('there was an error sending the query', error);
      });
  }

  toggleAddLink() {
    this.addModeLink = !this.addModeLink;
    console.log(this.addModeLink)
  }

  submitEditAboutBtn(userid, newabout) {
    console.log(userid)
    console.log(newabout)
    this.apollo
      .mutate({
        mutation: gql`
          mutation updateAbout($id: String!, $about: String!) {
            editAbout(id: $id, about: $about)
            {
              id
            }
          }
        `,
        variables: {
          id: userid,
          about: newabout,
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
                channelart,
                about,
                day,
                month,
                year
              }
            }
          `,
          variables: {
            userid: userid,
          }
        }]
      })
      .subscribe(({ data }) => {
        console.log('got data', data);
        // this.isLiked = !this.isLiked;
        // console.log(this.isLiked);
        this.editModeAbout = false;
      },(error) => {
        console.log('there was an error sending the query', error);
      });
    }

  curUserId;
  self;

  getTotalViews(){
    this.apollo
      .watchQuery({
        query: gql`
        query vidByUser($userid: String!){
          videosByUser(userid: $userid) {
            title,
            view,
            thumbnail,
            day,
            month,
            year,
            id,
          }
        }
        `,
        variables: {
          userid: this.channelUserInfo.id
        }
      })
      .valueChanges.subscribe(result => {
        this.videos = result.data.videosByUser
        console.log(this.videos)
        // this.totalviews = 0;
        this.videos.forEach(element => {
          this.totalviews += element.view
          console.log(this.totalviews)
        });

        // return this.totalviews
      })

      // return 0;
  }

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
    this.onPage = s[3]

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

        this.getTotalViews()

        this.apollo
          .watchQuery({
            query: gql `
              query links($userid: String!) {
                linkByUser(userid: $userid) {
                  id,
                  url,
                  label
                }
              }
            `,
            variables: {
              userid: this.channelUserInfo.id,
            }
          }).valueChanges.subscribe(result => {
            this.links = result.data.linkByUser
            console.log(this.links)
          });
      });
  }

}
