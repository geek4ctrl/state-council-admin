import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'posts',
        loadComponent: () => import('./pages/posts/posts.component').then(m => m.PostsComponent)
      },
      {
        path: 'posts/new',
        loadComponent: () => import('./pages/post-form/post-form.component').then(m => m.PostFormComponent)
      },
      {
        path: 'posts/edit/:id',
        loadComponent: () => import('./pages/post-form/post-form.component').then(m => m.PostFormComponent)
      },
      {
        path: 'posts/:id',
        loadComponent: () => import('./pages/post-detail/post-detail.component').then(m => m.PostDetailComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./pages/placeholder/placeholder.component').then(m => m.PlaceholderComponent)
      },
      {
        path: 'fintech',
        loadComponent: () => import('./pages/placeholder/placeholder.component').then(m => m.PlaceholderComponent)
      },
      {
        path: 'gallery',
        loadComponent: () => import('./pages/placeholder/placeholder.component').then(m => m.PlaceholderComponent)
      },
      {
        path: 'calendar',
        loadComponent: () => import('./pages/placeholder/placeholder.component').then(m => m.PlaceholderComponent)
      },
      {
        path: 'community',
        loadComponent: () => import('./pages/placeholder/placeholder.component').then(m => m.PlaceholderComponent)
      },
      {
        path: 'store',
        loadComponent: () => import('./pages/placeholder/placeholder.component').then(m => m.PlaceholderComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  }
];
