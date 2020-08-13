import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  private page = new BehaviorSubject('about');
  currentPage = this.page.asObservable();

  private messageSource = new BehaviorSubject(false);
  currentMessage = this.messageSource.asObservable();

  private useLocation = new BehaviorSubject(false);
  currentLocation = this.useLocation.asObservable();

  private autoPlay = new BehaviorSubject(false);
  currentautoPlay = this.autoPlay.asObservable();

  private logout = new BehaviorSubject(false);
  currentLogout = this.logout.asObservable();

  private useRestriction = new BehaviorSubject(false);
  currentRestriction = this.useRestriction.asObservable();

  private openKeyboardModal = new BehaviorSubject(false);
  currentKeyboardModal = this.openKeyboardModal.asObservable();

  private isEditProfile = new BehaviorSubject(false);
  currentEditProfile = this.isEditProfile.asObservable();

  private openShareModal = new BehaviorSubject(false);
  currentShareModal = this.openShareModal.asObservable();

  constructor() { }

  toggleAutoPlay(next: boolean) {
    this.autoPlay.next(next)
  }

  toggleEditProfile(next: boolean) {
    this.isEditProfile.next(next)
  }

  toggleShareModal(next: boolean) {
    this.openShareModal.next(next)
  }

  changePage(nextPage: string) {
    this.page.next(nextPage)
  }

  toggleLoginModal(showLogin: boolean) {
    this.messageSource.next(showLogin)
  }

  toggleLogoutModal(showLogout: boolean) {
    this.logout.next(showLogout)
  }

  toggleLocation(onLocation: boolean) {
    this.useLocation.next(onLocation)
  }

  toggleRestriction(onRestriction: boolean) {
    this.useRestriction.next(onRestriction)
  }

  toggleKeyboardModal(showKeyboard: boolean) {
    this.openKeyboardModal.next(showKeyboard)
  }

}
