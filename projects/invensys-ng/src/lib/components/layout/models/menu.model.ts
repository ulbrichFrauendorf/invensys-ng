export interface MenuItem {
  label: string;
  icon?: string;
  routerLink?: string[];
  items?: MenuItem[];
  claim?: string; // Optional claim required to view this menu item
}

export interface MenuModel {
  label: string;
  items: MenuItem[];
  separator?: boolean;
  claim?: string; // Optional claim required to view this menu group
}
