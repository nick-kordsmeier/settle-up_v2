import { NgModule } from '@angular/core';
import { AddMoreMembersModalComponent } from './add-more-members-modal/add-more-members-modal';
import { PopoverMenuComponent } from './popover-menu/popover-menu';
@NgModule({
	declarations: [AddMoreMembersModalComponent,
    PopoverMenuComponent],
	imports: [],
	exports: [AddMoreMembersModalComponent,
    PopoverMenuComponent]
})
export class ComponentsModule {}
