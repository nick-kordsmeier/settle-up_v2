import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { NewGroupPage } from '../new-group/new-group';

@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html'
})
export class GroupsPage {

  constructor(public navCtrl: NavController) {

  }

  goToNewGroup() {
    console.log('New Group');
    this.navCtrl.push(NewGroupPage);
  }

}
