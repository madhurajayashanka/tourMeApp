import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserModelDTO} from "../user.model";
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit,OnDestroy {
  private authStatusSub:Subscription;
  isLoading=false;

  signupForm = new FormGroup({
    name: new FormControl(null,[Validators.required, Validators.minLength(3),Validators.maxLength(45)]),
    email: new FormControl(null,[Validators.required, Validators.email]),
    userName: new FormControl(null,[Validators.required, Validators.maxLength(10)]),
    password: new FormControl(null,[Validators.required, Validators.minLength(6),Validators.maxLength(16)]),
  });

  constructor(private authService:AuthService,private router:Router) { }

  ngOnInit(): void {
    this.authStatusSub=this.authService.getAuthStatusListener().subscribe(
      authStatus=>{
        this.isLoading=false;
      }
    )
  }

  onSignup() {
    let userDTO:UserModelDTO=new UserModelDTO(
      this.signupForm.get('name')?.value,
      this.signupForm.get('email')?.value,
      this.signupForm.get('userName')?.value,
      this.signupForm.get('password')?.value,
    );
    this.isLoading=true;
    this.authService.signUp(userDTO);
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
