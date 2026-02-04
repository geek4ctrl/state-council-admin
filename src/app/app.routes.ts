import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PostsComponent } from './pages/posts/posts.component';
import { PostFormComponent } from './pages/post-form/post-form.component';
import { PostDetailComponent } from './pages/post-detail/post-detail.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { PlaceholderComponent } from './pages/placeholder/placeholder.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'posts', component: PostsComponent },
      { path: 'posts/new', component: PostFormComponent },
      { path: 'posts/edit/:id', component: PostFormComponent },
      { path: 'posts/:id', component: PostDetailComponent },
      { path: 'services', component: PlaceholderComponent },
      { path: 'fintech', component: PlaceholderComponent },
      { path: 'gallery', component: PlaceholderComponent },
      { path: 'calendar', component: PlaceholderComponent },
      { path: 'community', component: PlaceholderComponent },
      { path: 'store', component: PlaceholderComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];
