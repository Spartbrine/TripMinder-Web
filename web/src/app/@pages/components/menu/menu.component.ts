import { Component, OnInit, AfterViewInit, Input, ViewEncapsulation, HostListener } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { MenuLink, User } from 'shared/interfaces';

@Component({
  selector: 'pg-menu-items',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    trigger('toggleHeight', [
      state(
        'close',
        style({
          height: '0',
          overflow: 'hidden'
        })
      ),
      state(
        'open',
        style({
          height: '*',
          overflow: 'hidden'
        })
      ),
      transition('close => open', animate('140ms ease-in')),
      transition('open => close', animate('140ms ease-out'))
    ])
  ],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit, AfterViewInit {
  menuItems: MenuLink[] = [];
  currentItem: MenuLink = null;
  @Input() user: User;
  isPerfectScrollbarDisabled = false;
  public config: PerfectScrollbarConfigInterface = {};
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.togglePerfectScrollbar();
    });
  }

  @HostListener('window:resize', [])
  onResize() {
    this.togglePerfectScrollbar();
  }

  togglePerfectScrollbar() {
    this.isPerfectScrollbarDisabled = window.innerWidth < 1025;
  }

  @Input()
  set Items(value: MenuLink[]) {
    this.menuItems = value;
  }

  get Items() {
    const predicate = (item: MenuLink) => {
      if (!item.profiles || !this.user) { return true; }
      return item.profiles.includes(this.user.profile);
    };

    const _menuItems = this.menuItems.filter(predicate);
    _menuItems.forEach(item => {
      if (item.submenu) {
        const f1 = item.submenu.filter(predicate);
        if (f1.length) {
          item.submenu = f1;
          item.submenu.forEach(subitem => {
            if (subitem.submenu) {
              const f2 = subitem.submenu.filter(predicate);
              if (f2.length) {
                subitem.submenu = f2;
              } else {
                subitem.submenu = undefined;
              }
            }
          });
        } else {
          item.submenu = undefined;
        }
      }
    });

    return _menuItems;
  }

  toggleNavigationSub(event: MouseEvent, item: MenuLink, child?: MenuLink) {
    event.preventDefault();
    if (this.currentItem) {
      if (this.currentItem !== item) {
        this.currentItem.toggle = 'close';
        item.toggle = item.toggle === 'close' ? 'open' : 'close';
        if (this.currentItem.submenu) {
          this.currentItem.submenu.forEach(c => c.toggle = 'close');
        }
      } else if (child) {
        item.submenu
          .filter(c => c != child)
          .forEach(c => c.toggle = 'close');
        child.toggle = child.toggle === 'close' ? 'open' : 'close';
      } else {
        item.toggle = item.toggle === 'close' ? 'open' : 'close';
      }
    } else {
      item.toggle = item.toggle === 'close' ? 'open' : 'close';
    }
    this.currentItem = item;
  }
}
