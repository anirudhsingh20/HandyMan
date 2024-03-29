import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { PostService, postInterface } from '../image/post.service';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit ,OnDestroy{
  posts: any = []
  isLoading: boolean = false
  postSubsciption: Subscription
  error:boolean

  constructor(private http: HttpClient, private translate: TranslateService, private postService: PostService,private loadingController: LoadingController) { }

  ngOnInit() {
    this.postSubsciption = this.postService._post.subscribe((posts) => {
      this.posts = posts
    })
  }

  async ionViewWillEnter() {
    const loading = await this.loadingController.create({
      message: 'Please Wait. This may take some time',
      translucent: true,
    });
    await loading.present();

    this.isLoading = true
    this.postService.fetchPost().subscribe(() => {
      this.isLoading = false
      loading.dismiss();
    },err=>{
      this.isLoading=false
      this.error=true
      loading.dismiss();
    })
  }

  changeLang() {
    if (this.translate.currentLang === 'en') {
      // console.log(this.translate.getDefaultLang().toString() === 'en');
      this.translate.use('hindi')
    }
    else {
      this.translate.use('en')
    }

  }

  ngOnDestroy(){
    if(this.postSubsciption) this.postSubsciption.unsubscribe()
  }
  like(postId:string,post:any){
    if(!post.newLike){
      this.postService.likePost(postId).subscribe(res=>{
        post.newLike = true;
        post.likes  = post.likes ? post.likes + 1 : 1
        console.log(res);
        
      })

    }
    else{
      return
    }
  }

}
