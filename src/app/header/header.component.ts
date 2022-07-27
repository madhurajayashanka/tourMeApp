import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {debounceTime, Subscription, switchMap} from "rxjs";
import {FormControl, FormGroup} from "@angular/forms";
import {PostService} from "../posts/post.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  userIsAuthenticated=false;
  private authListenerSubs:Subscription;
  searchText:any='';
  myControl = new FormControl();

  @Output()
  searchTextChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor(private authService:AuthService,private postService:PostService) { }

  ngOnInit(): void {
    this.userIsAuthenticated=this.authService.getIsAuth();
    this.authListenerSubs=this.authService.getAuthStatusListener()
      .subscribe(IsAuthenticated=>{
        this.userIsAuthenticated=IsAuthenticated;
      });

    this.myControl.valueChanges.pipe(
      debounceTime(1000),
    ).subscribe(() => {
      this.searchTextChanged.emit(this.searchText)
this.postService.setSearchText(this.searchText);
    });
  }


  onLogout() {
    this.authService.logout();
  }





  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
