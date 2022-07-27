import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  loginForm = new FormGroup({
    email: new FormControl(null,[Validators.required, Validators.email]),
    password: new FormControl(null,[Validators.required, Validators.minLength(6),Validators.maxLength(16)]),
  });

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.login(
      this.loginForm.get('email')?.value,
      this.loginForm.get('password')?.value
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
