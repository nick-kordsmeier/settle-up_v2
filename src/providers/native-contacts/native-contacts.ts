import { Injectable } from '@angular/core';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';

@Injectable()
export class NativeContactsProvider {
  nativeContactsList;

  constructor(private contacts: Contacts) {
  }

  getNativeContacts() {
    this.contacts.find(['*'], {filter: "", multiple: true}).then(data => {
      this.nativeContactsList = data;
      console.log(data);
    });
  }

}
