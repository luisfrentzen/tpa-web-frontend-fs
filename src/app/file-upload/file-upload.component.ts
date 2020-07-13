import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage'
import { Observable } from 'rxjs'
import { AngularFirestore } from '@angular/fire/firestore';

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

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;

  constructor(private storage: AngularFireStorage, private db: AngularFirestore) { }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    if(files.item(0).type.split('/')[0]=='video')
    {
      this.file = files.item(0)
      this.video = document.createElement('video')
      this.video.preload = 'metadata'

      window.URL.revokeObjectURL(this.video.src)

      this.vidDur = this.video.duration
      console.log(this.vidDur)

    }
    else{
      this.dropmsg = 'File must be a video format'
      console.log('error')
    }
  }

  ngOnInit() {
    // console.log(thmsrc)
  }

  uploadThumbnail(files: FileList) {
    const file = files.item(0)

    const reader = new FileReader();
    reader.onload = e => this.thmsrc = reader.result;

    // this.thmsrc =
    reader.readAsDataURL(file)
  }

  startUpload(file: File) {

    // The storage path
    const path = `test/${Date.now()}_${file.name}`;
    console.log(path)
    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot   = this.task.snapshotChanges();
    // .pipe(
    //   tap(console.log),
    //   // The file's download URL
    //   finalize( async() =>  {
    //     this.downloadURL = await ref.getDownloadURL().toPromise();
    //
    //     this.db.collection('files').add( { downloadURL: this.downloadURL, path });
    //   }),
    // );
  }

}
