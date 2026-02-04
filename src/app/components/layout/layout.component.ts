import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="layout">
      <app-sidebar />
      <div class="main-content">
        <app-header />
        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      min-height: 100vh;
      background: #f8f9fa;
    }

    .main-content {
      margin-left: 240px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .content {
      flex: 1;
      padding: 32px;
      overflow-y: auto;
    }
  `]
})
export class LayoutComponent {}
