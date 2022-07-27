import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import {PostModelDTO} from "./post.model";
import {BehaviorSubject, Observable} from "rxjs";

const BACKEND_URL = environment.apiUrl+"post/";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  public searchText=new BehaviorSubject<string>('');
  currentSearchText = this.searchText.asObservable();

  constructor(private http:HttpClient,private router:Router) { }

  public getAllPosts(){
    return this.http.get(BACKEND_URL+"list");
  }

  addPost(dto:PostModelDTO):Observable<any>{
    return this.http.post(BACKEND_URL+"save",{
      title:dto.title,
      location:dto.location,
      imageUrl:dto.imageUrl,
      content:dto.content
    });

  }
  setSearchText(searchText:string){
    this.searchText.next(searchText);
  }

  deletePost(postId:string){
    return this.http.delete(BACKEND_URL+"delete/"+postId)
  }

  getPost(id:string){
    return this.http.get(BACKEND_URL+"find/"+id)
  }
  public searchPosts(searchText:any):Observable<any>{
    return this.http.get(BACKEND_URL+'search/'+searchText);
  }

  updatePost(id:string, title:string, location:string, content:string, imageUrl:string){
    let postData={
      id:id,
      title:title,
      location:location,
      content:content,
      imageUrl:imageUrl,
      creator:null
    };

    this.http.put(BACKEND_URL+'update',postData).subscribe(response=>{
      this.router.navigate(['/']);
    });
  }

}
