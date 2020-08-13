import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { DataService } from "../data.service";
import gql from 'graphql-tag';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage'



@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {

  constructor(private router : Router, private route : ActivatedRoute, private apollo : Apollo, private data : DataService, private storage : AngularFireStorage) { }

  onPage;
  channelUserInfo;

  thmTask;

  isSubscribed = false;

  subs = [];

  isBelled = false;
  notifieds;

  onNotification(){

    this.apollo
        .mutate({
          mutation : gql`
            mutation notify($id: String!, $chnid: String!){
              bellnotif(id:$id, chnid:$chnid){
                name
              }
            }
          `,
          variables : {
            id: this.currentUserInfo.id,
            chnid: this.channelUserInfo.id,
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
                  notified,
                }
              }
            `,
            variables: {
              userid: this.currentUserInfo.id,
            }
          }]
        }).subscribe(({ data }) => {
      console.log('got data', data);

      this.isBelled = !this.isBelled
      console.log(this.isBelled)
      this.notifieds = this.currentUserInfo.notified.split(",")
      if(this.notifieds.includes(this.channelUserInfo.id))
      {
        this.isBelled = true;
      }
      else
      {
        this.isBelled = false;
      }

    },(error) => {
      console.log('there was an error sending the query', error);
    });

  }

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
            chnid: this.channelUserInfo.id,
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
                }
              }
            `,
            variables: {
              userid: this.channelUserInfo.id,
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
                  notified,
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

      if ( this.subs.includes(this.channelUserInfo.id) )
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

  user;
  users = []

  curUserId;

  editProfile = false;

  toggleModal = () => {
    console.log(this.editProfile)
    this.data.toggleEditProfile(!this.editProfile);
    // this.reg = false;
  }

  propic;
  chanart;

  getProfilePic(files){
    if(files.item(0).type.split('/')[0]=='image')
    {
      // atc = files.item(0)
      // console.log(files.item(0).name)
      this.propic = files.item(0)
      return
    }
    else{
      return
    }
  }

  getChannelArt(files){
    if(files.item(0).type.split('/')[0]=='image')
    {
      // atc = files.item(0)
      // console.log(files.item(0).name)
      this.chanart = files.item(0)
      return
    }
    else{
      return
    }
  }

  ppurl;
  chnarturl;

  updateArt(){
    if(this.chanart != null)
    {
      const thmPath = `userthm/${Date.now()}_${this.chanart.name}`

      const thmref = this.storage.ref(thmPath);
      this.thmTask = this.storage.upload(thmPath, this.chanart);


      this.thmTask.then(async res => await thmref.getDownloadURL().subscribe(url => {
          this.chnarturl = url

          this.apollo
            .mutate({
              mutation: gql`
                mutation channelart($id: String!, $channelart: String!){
                  updatechannelart(id: $id, channelart: $channelart)
                  {
                    name
                  }
                }
              `,
              variables: {
                id: this.channelUserInfo.id,
                channelart: url,
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
                  userid: this.channelUserInfo.id,
                }
              }]
            })
            .subscribe(({ data }) => {
              console.log('got data', data);
              // this.isLiked = !this.isLiked;
              // console.log(this.isLiked);
              // this.addModeLink = false;
            },(error) => {
              console.log('there was an error sending the query', error);
            });
          }))
        }
      }

      updatePicture(){

        if(this.propic != null)
        {
          const thmPath = `userpic/${Date.now()}_${this.propic.name}`

          const thmref = this.storage.ref(thmPath);
          this.thmTask = this.storage.upload(thmPath, this.propic);


          this.thmTask.then(async res => await thmref.getDownloadURL().subscribe(url => {
              this.ppurl = url
              console.log(this.ppurl)
              console.log(this.channelUserInfo.id)

              this.apollo
                .mutate({
                  mutation: gql`
                    mutation updatepp($id: String!, $profilepic: String!){
                      updateprofilepic(id: $id, profilepic: $profilepic)
                      {
                        name
                      }
                    }
                  `,
                  variables: {
                    id: this.channelUserInfo.id,
                    profilepic: url,
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
                      userid: this.channelUserInfo.id,
                    }
                  }]
                })
                .subscribe(({ data }) => {
                  console.log('got data', data);
                  // this.isLiked = !this.isLiked;
                  // console.log(this.isLiked);
                  // this.addModeLink = false;
                },(error) => {
                  console.log('there was an error sending the query', error);
                });
              }))
            }
          }


  ngOnInit(): void {
    this.data.currentEditProfile.subscribe(showEdit => this.editProfile = showEdit)
    const passedId = +this.route.snapshot.paramMap.get('id');

    const url = this.router.url
    const s = url.split("/")
    this.onPage = s[3]

    if(localStorage.getItem('users') == null){
      this.users = [];
      this.curUserId = "";
    }
    else {
      this.users = JSON.parse(localStorage.getItem('users'));
      this.user = this.users[0];
      this.curUserId = this.user.id
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

        if(this.user)
        {
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
                  notified,
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

            this.subs = this.currentUserInfo.subscribed.split(",")

            console.log(this.subs)
            if(this.subs.includes(this.channelUserInfo.id))
            {
              this.isSubscribed = true;
            }
            else
            {
              this.isSubscribed = false;
            }

            this.notifieds = this.currentUserInfo.notified.split(",")
            if(this.notifieds.includes(this.channelUserInfo.id))
            {
              this.isBelled = true;
            }
            else
            {
              this.isBelled = false;
            }
            // console.log(this.playlistOwner)
          })
        }
      })
  }

}
