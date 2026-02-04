import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';
import { BlogCategory } from '../../models/blog.model';

@Component({
  selector: 'app-post-form',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="post-form-page">
      <div class="form-header">
        <button class="btn-back" (click)="onBack()">« Back</button>
        <h1>{{ isEditMode() ? 'Edit Post' : 'New Post' }}</h1>
      </div>

      <div class="form-container">
        <form (ngSubmit)="onSubmit()">
          <div class="form-section">
            <div class="form-group">
              <label for="category">Category</label>
              <select
                id="category"
                [(ngModel)]="formData.category"
                name="category"
                required
              >
                <option value="Event">Event</option>
                <option value="Announcement">Announcement</option>
                <option value="News">News</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label for="title">Title</label>
              <input
                type="text"
                id="title"
                [(ngModel)]="formData.title"
                name="title"
                placeholder="Enter post title"
                required
              />
            </div>

            <div class="form-group full-width">
              <label for="imageUrl">Image URL</label>
              <input
                type="url"
                id="imageUrl"
                [(ngModel)]="formData.imageUrl"
                name="imageUrl"
                placeholder="https://example.com/image.jpg"
                required
              />
              @if (formData.imageUrl) {
                <div class="image-preview">
                  <img [src]="formData.imageUrl" alt="Preview" />
                </div>
              }
            </div>

            <div class="form-group full-width">
              <label for="excerpt">Excerpt</label>
              <textarea
                id="excerpt"
                [(ngModel)]="formData.excerpt"
                name="excerpt"
                rows="2"
                placeholder="Brief description..."
                required
              ></textarea>
            </div>

            <div class="form-group full-width">
              <label for="content">Content</label>
              <textarea
                id="content"
                [(ngModel)]="formData.content"
                name="content"
                rows="8"
                placeholder="Write your post content here..."
                required
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="date">Date</label>
                <input
                  type="date"
                  id="date"
                  [(ngModel)]="dateString"
                  name="date"
                  required
                />
              </div>

              <div class="form-group">
                <label for="time">Time</label>
                <input
                  type="text"
                  id="time"
                  [(ngModel)]="formData.time"
                  name="time"
                  placeholder="2:00 PM"
                  required
                />
              </div>
            </div>

            <div class="form-group full-width">
              <label for="location">Location (Optional)</label>
              <input
                type="text"
                id="location"
                [(ngModel)]="formData.location"
                name="location"
                placeholder="Event location"
              />
            </div>

            <div class="form-group full-width">
              <label for="externalLink">External Link (Optional)</label>
              <input
                type="url"
                id="externalLink"
                [(ngModel)]="formData.externalLink"
                name="externalLink"
                placeholder="https://example.com"
              />
            </div>

            <div class="form-group full-width">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  [(ngModel)]="formData.showOnHomePage"
                  name="showOnHomePage"
                />
                <span>Show on home page</span>
              </label>

              <label class="checkbox-label">
                <input
                  type="checkbox"
                  [(ngModel)]="formData.showOnRegistration"
                  name="showOnRegistration"
                />
                <span>Show on Registration</span>
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="onBack()">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              {{ isEditMode() ? 'Update Post' : 'Publish' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .post-form-page {
      max-width: 900px;
      margin: 0 auto;
    }

    .form-header {
      margin-bottom: 32px;
    }

    .btn-back {
      background: none;
      border: none;
      color: #007bff;
      font-size: 14px;
      cursor: pointer;
      padding: 8px 0;
      margin-bottom: 12px;
      display: block;
    }

    .btn-back:hover {
      text-decoration: underline;
    }

    .form-header h1 {
      font-size: 32px;
      font-weight: 600;
      margin: 0;
      color: #212529;
    }

    .form-container {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    @media (max-width: 640px) {
      .form-container {
        padding: 20px;
      }

      .form-header h1 {
        font-size: 24px;
      }

      .form-actions {
        flex-direction: column-reverse;
      }

      .btn-primary,
      .btn-secondary {
        width: 100%;
      }
    }

    .form-section {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    @media (max-width: 768px) {
      .form-section {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr !important;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-row {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    label {
      font-size: 14px;
      font-weight: 600;
      color: #495057;
      margin-bottom: 8px;
    }

    input, select, textarea {
      padding: 10px 12px;
      border: 1px solid #ced4da;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      transition: border-color 0.2s;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #007bff;
    }

    textarea {
      resize: vertical;
    }

    .image-preview {
      margin-top: 12px;
      border-radius: 8px;
      overflow: hidden;
      max-height: 300px;
    }

    .image-preview img {
      width: 100%;
      height: auto;
      object-fit: cover;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      cursor: pointer;
      font-weight: 400;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e9ecef;
    }

    .btn-primary {
      background: #007bff;
      color: white;
      border: none;
      padding: 12px 32px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .btn-secondary {
      background: white;
      color: #6c757d;
      border: 1px solid #ced4da;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: #f8f9fa;
      border-color: #6c757d;
    }
  `]
})
export class PostFormComponent implements OnInit {
  protected isEditMode = signal(false);
  protected dateString = '';

  protected formData = {
    title: '',
    content: '',
    excerpt: '',
    category: 'Event' as BlogCategory,
    imageUrl: '',
    date: new Date(),
    time: '',
    location: '',
    externalLink: '',
    showOnHomePage: false,
    showOnRegistration: false
  };

  private editId: string | null = null;

  constructor(
    private blogService: BlogService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.editId = id;
      this.loadBlog(id);
    } else {
      // Set default date to today
      const today = new Date();
      this.dateString = today.toISOString().split('T')[0];
      this.formData.date = today;
    }
  }

  private loadBlog(id: string): void {
    const blog = this.blogService.getBlogById(id);
    if (blog) {
      this.formData = {
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        category: blog.category,
        imageUrl: blog.imageUrl,
        date: new Date(blog.date),
        time: blog.time,
        location: blog.location || '',
        externalLink: blog.externalLink || '',
        showOnHomePage: blog.showOnHomePage,
        showOnRegistration: blog.showOnRegistration
      };
      this.dateString = new Date(blog.date).toISOString().split('T')[0];
    }
  }

  protected onSubmit(): void {
    // Update date from string input
    this.formData.date = new Date(this.dateString);

    const user = this.authService.getCurrentUser()();
    if (!user) {
      alert('You must be logged in to create a post');
      return;
    }

    if (this.isEditMode() && this.editId) {
      this.blogService.updateBlog(this.editId, this.formData);
    } else {
      this.blogService.createBlog(this.formData, user.id, user.name);
    }

    this.router.navigate(['/posts']);
  }

  protected onBack(): void {
    this.router.navigate(['/posts']);
  }
}
