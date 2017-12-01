import { Component } from '@angular/core';

import { GroupsPage } from '../groups/groups';
import { PurchasesPage } from '../purchases/purchases';
import { DashboardPage } from '../dashboard/dashboard';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = DashboardPage;
  tab2Root = GroupsPage;
  tab3Root = PurchasesPage;

  constructor() {

  }
}
