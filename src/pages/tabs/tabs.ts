import { Component } from '@angular/core';

import { GroupsPage } from '../groups/groups';
import { PurchasesPage } from '../purchases/purchases';
import { DashboardPage } from '../dashboard/dashboard';

import { AuthProvider } from '../../providers/auth/auth'


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = DashboardPage;
  tab2Root = GroupsPage;
  tab3Root = PurchasesPage;

  constructor(public authProvider: AuthProvider) {
  }

  ionViewDidEnter() {
    //this.authProvider.getUserInfo(this.authProvider.getUID());
    
  }

  ionViewCanLeave() {
    //this.authProvider.newUserToFalse();
  }
}
