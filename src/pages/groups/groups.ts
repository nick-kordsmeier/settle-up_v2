import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { NewGroupPage } from '../new-group/new-group';
import { SettleUpDbProvider } from '../../providers/settle-up-db/settle-up-db';

import { Observable } from 'rxjs/Observable'


@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html'
})
export class GroupsPage {
  groups: Observable<any[]>;
  
  constructor(public navCtrl: NavController, private settleUpProvider: SettleUpDbProvider ) {
    this.groups = this.settleUpProvider.groupsRef.valueChanges();

  }
 
  goToNewGroup() {
    console.log('New Group');
    this.navCtrl.push(NewGroupPage);
  }

}
