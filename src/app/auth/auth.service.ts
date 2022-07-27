import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable, Subject} from "rxjs";
import {UserModelDTO} from "./user.model";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  BACKEND_URL = environment.apiUrl+'user/';
  private token: string;
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http:HttpClient,private router:Router) { }

  getToken(){
    return this.token;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getUserId() {
    return this.userId;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  public signUp(dto:UserModelDTO){
    this.http.post(this.BACKEND_URL+'save',{
      name: dto.name,
      email: dto.email,
      userName: dto.userName,
      password:dto.password
    })
      .subscribe(() => {
        this.router.navigate(["/auth/login"]);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  public login(email: string, password: string){
    this.http.post(this.BACKEND_URL+'login',
      {email:email,password:password})
      .subscribe(response=>{
        const token = response['token'];
        this.token=token;
        if (token){
          const expiresInDuration =response['expiresIn'];
          this.setAuthTimer(expiresInDuration)
          this.isAuthenticated=true;
          this.userId=response['userId'];
          this.authStatusListener.next(true);
          const now =new Date();
          const expirationDate = new Date(
            now.getTime()+expiresInDuration*1000
          );
          this.saveAuthData(token,expirationDate,this.userId);
          this.router.navigate(['/']);
        }
      },error => {
        this.authStatusListener.next(false);
        }
      )
  }

   autoAuthUser(){
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

   logout(){
    this.token=null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private setAuthTimer(duration:number){
    this.tokenTimer=setTimeout(()=>{
      this.logout();
    },duration*1000)
  }

  private saveAuthData(token:string,expirationDate:Date, userId:string){
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }



}
