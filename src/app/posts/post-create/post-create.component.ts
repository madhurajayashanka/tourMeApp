import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PostService} from "../post.service";
import {PostModelDTO} from "../post.model";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
postForm:FormGroup;
public post;
  private  mode='create'
  private postId:string;
  private authStatusSub:Subscription;
  isLoading=false;

  constructor(private authService:AuthService,private postService:PostService,private route:ActivatedRoute,private router:Router) {
  }

  ngOnInit(): void {
    this.authStatusSub=this.authService.getAuthStatusListener().subscribe(
      authstatus=>{
        this.isLoading=false;
      }
    );

    this.postForm=new FormGroup({
      title:new FormControl(null,{validators:[Validators.required,Validators.minLength(5)]}),
      location:new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]}),
      imageUrl:new FormControl(null,{validators:[Validators.required]}),
      content:new FormControl(null,{validators:[Validators.required,Validators.minLength(15)]}),
    });

    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if (paramMap.has('postId')){
        this.mode='edit';
        this.postId=paramMap.get('postId');
        this.isLoading=true;
        this.postService.getPost(this.postId).subscribe(postData=>{
          this.isLoading=false;
          this.post={
            id:postData['_id'],
            title:postData['title'],
            location:postData['location'],
            content:postData['content'],
            imageUrl:postData['imageUrl'],
            creator:postData['creator'],
          };
          this.postForm.setValue(
            {
            'title':this.post['title'],
            'location':this.post['location'],
            'content':this.post['content'],
            'imageUrl':this.post['imageUrl'],
          });
        });
      }else{
        this.mode='create';
        this.postId=null;
      }
    });

  }


  onSavePost() {
    this.isLoading = true;
    if (this.mode==='create'){
      let dataDTO:PostModelDTO= new PostModelDTO(
        this.postForm.get('title')?.value,
        this.postForm.get('location')?.value,
        this.postForm.get('imageUrl')?.value,
        this.postForm.get('content')?.value,
      );

      this.postService.addPost(dataDTO).subscribe(response=>{
        console.log(response.code);
        this.router.navigate(['/']);
      },error => {
        console.log(error)
      })
    } else {
      this.postService.updatePost(
        this.postId,
        this.postForm.get('title')?.value,
        this.postForm.get('location')?.value,
        this.postForm.get('content')?.value,
        this.postForm.get('imageUrl')?.value,
      );
    }
    this.postForm.reset();

  }
}
