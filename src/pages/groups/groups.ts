import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';

import { NewGroupPage } from '../new-group/new-group';
import { PopoverMenuComponent } from '../../components/popover-menu/popover-menu'

import { AuthProvider } from '../../providers/auth/auth';
import { SettleUpDbProvider } from '../../providers/settle-up-db/settle-up-db';
import { GroupDetailsPage } from '../group-details/group-details';

@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html'
})
export class GroupsPage {

  groups = [];
  activeGroups = [];
  currentUID;
  groupsObj;
  currentUserInfo;
  
  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    private authProvider: AuthProvider,
    private settleUpProvider: SettleUpDbProvider
  ) {

  }

  ionViewWillEnter() {
    this.currentUID = this.authProvider.getUID();
  }

  ionViewDidEnter() {
    this.settleUpProvider.getUserData(this.currentUID).then(uidData => {
      this.currentUserInfo = uidData;
      console.log(this.currentUserInfo);
    }).catch(err => { console.error(err) });;

    this.activeGroups = [];
    this.settleUpProvider.getActiveUserGroup(this.currentUID).then(activeUserGroupsData => {
      if (activeUserGroupsData !== null) { 
      this.groupsObj = activeUserGroupsData;
      let groupKeys = Object.keys(this.groupsObj);
      for (let i = 0; i < groupKeys.length; i++) {
        this.activeGroups.push(this.groupsObj[`${groupKeys[i]}`]);
      }
      console.log(this.activeGroups);
      console.log(this.groupsObj);

      this.groups = [];
      for (let i = 0; i< this.activeGroups.length; i++) {
        this.settleUpProvider.getGroupDetails(this.activeGroups[i].key).then( groupDetailData => {
          this.groups.push(groupDetailData);
        }).catch(err => { console.error(err)});
        console.log(this.groups);
      }
    }
    }).catch(err => { console.error(err) });    
  }

 
  goToNewGroup() {
    console.log('New Group');
    this.navCtrl.push(NewGroupPage);
  }

  goToGroupDetails(key) {
    this.navCtrl.push(GroupDetailsPage, {key: key});
  }
  
  presentPopover(ev: UIEvent, currentUserInfo) {
    let popover = this.popoverCtrl.create(PopoverMenuComponent, {currentUserInfo: currentUserInfo}, {cssClass: "popover-menu"});

    popover.present({ev: ev});
  }

}