import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from "../post.service";
import {AuthService} from "../../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {
  isLoading=false;
  userId: string;
  userIsAuthenticated=false;
  private authStatusSub:Subscription;
  posts:any=[];
  searchText:String;


  constructor(public postsService: PostService,private authService:AuthService) { }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getAllPosts().subscribe(
      result=>{
        this.posts=result;
        this.posts=this.posts.reverse();

      }
    );
    this.userId=this.authService.getUserId();
    this.userIsAuthenticated=this.authService.getIsAuth();
    this.authStatusSub=this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated=>{
        this.userIsAuthenticated=isAuthenticated;
        this.userId=this.authService.getUserId();
      });
    this.postsService.currentSearchText.subscribe(result=>{
      this.searchText=result;
    })
  }

  onDelete(postId:string){
    this.isLoading=true;
    this.postsService.deletePost(postId).subscribe(()=>{
      this.postsService.getAllPosts().subscribe(
        result=>{
          this.posts=result;
          this.posts=this.posts.reverse();
        }
      );
    },error => {
      this.isLoading=false;
    });
  }

}
