import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private data : DataService) { }

  settingsVisible = false;
  menuVisible = false;

  showLogin = false;
  reg = false;

  onLocation = false;
  onRestriction = false;
  showKeyboard = false;

  currentPage = 'home';

  ngOnInit(): void {
    this.settingsVisible = false;
    this.menuVisible = false;
    this.reg = false;

    this.data.currentMessage.subscribe(showLogin => this.showLogin = showLogin)
    this.data.currentLocation.subscribe(onLocation => this.onLocation = onLocation)
    this.data.currentRestriction.subscribe(onRestriction => this.onRestriction = onRestriction)
    this.data.currentKeyboardModal.subscribe(showKeyboard => this.showKeyboard = showKeyboard)
    this.data.currentPage.subscribe(currentPage => this.currentPage = currentPage)
  }

  showSettings() {
    this.settingsVisible = !this.settingsVisible
  }

  changePage(nextPage:string) {
    this.data.changePage(nextPage)
    console.log(this.currentPage);
  }

  showMenu() {
    this.menuVisible = !this.menuVisible
  }

  toggleModal = () => {
    this.data.toggleLoginModal(!this.showLogin);
    this.reg = false;
  }

  toggleReg() {
    this.reg = !this.reg;
  }

  toggleRestrictionButton() {
    this.data.toggleRestriction(!this.onRestriction)
  }

  toggleLocationButton() {
    this.data.toggleLocation(!this.onLocation)
  }

  toggleKeyboardModal = () => {
    this.data.toggleKeyboardModal(!this.showKeyboard)
    this.settingsVisible = false
  }

  toggleDropDown() {
    this.menuVisible = false;
    this.settingsVisible = false;
  }
}
