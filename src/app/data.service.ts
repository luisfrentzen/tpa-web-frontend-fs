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

  private useRestriction = new BehaviorSubject(false);
  currentRestriction = this.useRestriction.asObservable();

  private openKeyboardModal = new BehaviorSubject(false);
  currentKeyboardModal = this.openKeyboardModal.asObservable();

  constructor() { }

  changePage(nextPage: string) {
    this.page.next(nextPage)
  }

  toggleLoginModal(showLogin: boolean) {
    this.messageSource.next(showLogin)
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
