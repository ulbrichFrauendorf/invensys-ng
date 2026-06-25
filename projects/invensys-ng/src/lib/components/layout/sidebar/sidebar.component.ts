import { Component, ElementRef, Input } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { MenuModel } from '../models/menu.model';
import { LayoutService } from '../services/layout.service';
import { IButton } from '../../button/button.component';

@Component({
  selector: 'i-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [MenuComponent, IButton],
})
export class SidebarComponent {
  @Input() menuModel: MenuModel[] = [];

  constructor(public el: ElementRef, public layoutService: LayoutService) {}
}
