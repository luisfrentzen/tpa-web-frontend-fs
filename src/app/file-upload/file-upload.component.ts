import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage'
import { Observable } from 'rxjs'
import { AngularFirestore } from '@angular/fire/firestore';
import { finalize, tap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  dropmsg = 'No File Selected'
  isHovering: boolean;

  thmsrc = '../assets/no_thumbnail.png'
  files: File[] = [];
  file: File = null;

  vidDur;

  task: AngularFireUploadTask;
  thmTask: AngularFireUploadTask;

  vidTitle: String = '';
  vidDesc: String = '';

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: Observable<string>;

  constructor(private storage: AngularFireStorage, private db: AngularFirestore, private apollo : Apollo) { }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    if(files.item(0).type.split('/')[0]=='video')
    {
      this.file = files.item(0)
      // this.video = document.createElement('video')
      // this.video.preload = 'metadata'
      //
      // window.URL.revokeObjectURL(this.video.src)
      //
      // this.vidDur = this.video.duration
      // console.log(this.vidDur)

    }
    else{
      this.dropmsg = 'File must be a video format'
      console.log('error')
    }
  }

  ngOnInit() {
    // console.log(thmsrc)
  }

  thumbnailFile;

  uploadThumbnail(files: FileList) {
    const file = files.item(0)
    this.thumbnailFile = file;

    const reader = new FileReader();
    reader.onload = e => this.thmsrc = reader.result as string;

    // this.thmsrc =
    reader.readAsDataURL(file)
  }

  users = [];
  user;

  vidurl;
  thmurl;

  startUpload(file: File) {
    this.users = JSON.parse(localStorage.getItem('users'));
    this.user = this.users[0];
    // The storage path
    const thmPath = `thm/${Date.now()}_${this.thumbnailFile}`
    const path = `vid/${Date.now()}_${file.name}`;
    // console.log(path)
    // Reference to storage bucket
    const ref = this.storage.ref(path);
    const thmref = this.storage.ref(thmPath);
    // The main task
    this.task = this.storage.upload(path, file);
    this.thmTask = this.storage.upload(thmPath, this.thumbnailFile);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    // this.snapshot   = this.task.snapshotChanges().pipe(
    //   tap(() => console.log(this.downloadURL)),
    //   finalize( async() =>  {
    //     this.downloadURL = await ref.getDownloadURL().toPromise();
    //
    //     console.log(this.downloadURL)
    //     // this.db.collection('files').add( { downloadURL: this.downloadURL, path });
    //   }),
    // );

    // const vidurl
    // const thmurl

    this.thmTask.then(async res => await thmref.getDownloadURL().subscribe(url => {this.thmurl = url} ))
    this.task.then(async res => await ref.getDownloadURL().subscribe(url => {
      this.vidurl = url
      this.apollo
          .mutate({
            mutation : gql`
            mutation createVideo($url: String!, $restriction: String!, $location: String!, $visibility: String!, $desc: String!, $category: String!, $thumbnail: String!, $userid: String!, $playlist: String!, $title: String!) {
              createVideo(input: {
                url: $url
                restriction: $restriction
                location: $location
                visibility: $visibility
                desc: $desc
                category: $category
                disilike: 1
                like: 1
                view: 1
                thumbnail: $thumbnail
                userid: $userid
                playlist: $playlist
                title: $title
              }){ title }
            }
            `,
            variables : {
              url: this.vidurl,
              restriction: "no",
              location: "Indonesia",
              visibility: "public",
              desc: this.vidDesc,
              category: "no",
              thumbnail: this.thmurl,
              userid: this.user.id,
              playlist: "none",
              title: this.vidTitle,
            }
          }).subscribe(({ data }) => {
        console.log('got data', data);
      },(error) => {
        console.log('there was an error sending the query', error);
      })

    }
  ))
    // console.log(this.vidurl)
    // console.log(this.thmurl)
    // const vidURL = this.task.then(async res => await



  }

  // test() {
  //
  //
  //
  //
  //   // this.task.snapshotChanges().pipe(
  //   //     finalize(() => this.downloadURL = ref.getDownloadURL() )
  //   //  )
  //   // .subscribe()
  //
  //   console.log('test')
  // }

}
