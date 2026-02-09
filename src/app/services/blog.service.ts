import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Blog, CreateBlogDto } from '../models/blog.model';
import { AuthService } from './auth.service';

type ApiPost = {
  id: number | string;
  title?: string;
  content?: string;
  excerpt?: string | null;
  category?: string | null;
  image_url?: string | null;
  imageUrl?: string | null;
  date?: string | null;
  time?: string | null;
  location?: string | null;
  external_link?: string | null;
  externalLink?: string | null;
  author_id?: number | string | null;
  authorId?: number | string | null;
  author_name?: string | null;
  authorName?: string | null;
  author_email?: string | null;
  show_on_home_page?: boolean | null;
  showOnHomePage?: boolean | null;
  show_on_registration?: boolean | null;
  showOnRegistration?: boolean | null;
  created_at?: string | null;
  createdAt?: string | null;
  updated_at?: string | null;
  updatedAt?: string | null;
};

type ApiPostResponse = {
  post?: ApiPost;
};

type ApiPostsResponse = {
  posts?: ApiPost[];
};

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private blogs = signal<Blog[]>([]);
  private apiBase = 'http://localhost:3001';

  constructor() {
    void this.loadBlogs();
  }

  getBlogs() {
    return this.blogs.asReadonly();
  }

  getBlogById(id: string): Blog | undefined {
    return this.blogs().find(blog => blog.id === id);
  }

  async fetchBlogById(id: string): Promise<Blog | undefined> {
    const cached = this.getBlogById(id);
    if (cached) {
      return cached;
    }

    const response = await firstValueFrom(
      this.http.get<ApiPost | ApiPostResponse>(`${this.apiBase}/api/posts/${id}`, { headers: this.getAuthHeaders() })
    );

    const apiPost = this.extractPost(response);
    if (!apiPost) {
      return undefined;
    }

    const mapped = this.mapApiPost(apiPost);
    this.blogs.update(items => {
      const exists = items.some(item => item.id === mapped.id);
      return exists ? items.map(item => (item.id === mapped.id ? mapped : item)) : [...items, mapped];
    });

    return mapped;
  }

  async loadBlogs(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.get<ApiPost[] | ApiPostsResponse>(`${this.apiBase}/api/posts`, { headers: this.getAuthHeaders() })
      );
      const posts = this.extractPosts(response);
      this.blogs.set(posts.map((post) => this.mapApiPost(post)));
      return true;
    } catch (error) {
      const status = (error as HttpErrorResponse).status;
      if (status === 401 || status === 403) {
        try {
          const response = await firstValueFrom(
            this.http.get<ApiPost[] | ApiPostsResponse>(`${this.apiBase}/api/posts`, { headers: this.getAuthHeaders(false) })
          );
          const posts = this.extractPosts(response);
          this.blogs.set(posts.map((post) => this.mapApiPost(post)));
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  }

  async createBlog(dto: CreateBlogDto, authorId: string, authorName: string): Promise<Blog> {
    const created = await firstValueFrom(
      this.http.post<ApiPost>(
        `${this.apiBase}/api/posts`,
        this.toApiPayload(dto, authorId, authorName),
        { headers: this.getAuthHeaders() }
      )
    );

    const mapped = this.mapApiPost(created);
    this.blogs.update(blogs => [...blogs, mapped]);
    return mapped;
  }

  async updateBlog(id: string, updates: Partial<CreateBlogDto>): Promise<Blog> {
    const updated = await firstValueFrom(
      this.http.put<ApiPost>(
        `${this.apiBase}/api/posts/${id}`,
        this.toApiUpdatePayload(updates),
        { headers: this.getAuthHeaders() }
      )
    );

    const mapped = this.mapApiPost(updated);
    this.blogs.update(blogs => blogs.map(blog => (blog.id === mapped.id ? mapped : blog)));
    return mapped;
  }

  async deleteBlog(id: string): Promise<boolean> {
    await firstValueFrom(
      this.http.delete<void>(`${this.apiBase}/api/posts/${id}`, { headers: this.getAuthHeaders() })
    );
    this.blogs.update(blogs => blogs.filter(b => b.id !== id));
    return true;
  }

  private mapApiPost(post: ApiPost): Blog {
    const title = post.title ?? 'Untitled Post';
    const content = post.content ?? '';
    const excerpt = post.excerpt ?? '';
    const category = this.normalizeCategory(post.category ?? 'News');
    const imageUrl = post.imageUrl ?? post.image_url ?? 'https://placehold.co/600x400/e5e7eb/6b7280?text=Image+Not+Available';
    const createdAtRaw = post.createdAt ?? post.created_at ?? new Date().toISOString();
    const updatedAtRaw = post.updatedAt ?? post.updated_at ?? createdAtRaw;
    const dateRaw = post.date ?? createdAtRaw;

    return {
      id: String(post.id),
      title,
      content,
      excerpt,
      category,
      imageUrl,
      date: new Date(dateRaw),
      time: post.time ?? 'N/A',
      location: post.location ?? undefined,
      externalLink: post.externalLink ?? post.external_link ?? undefined,
      authorId: String(post.authorId ?? post.author_id ?? 'unknown'),
      authorName: post.authorName ?? post.author_name ?? post.author_email ?? 'Unknown',
      showOnHomePage: post.showOnHomePage ?? post.show_on_home_page ?? false,
      showOnRegistration: post.showOnRegistration ?? post.show_on_registration ?? false,
      createdAt: new Date(createdAtRaw),
      updatedAt: new Date(updatedAtRaw)
    };
  }

  private extractPost(response: ApiPost | ApiPostResponse): ApiPost | undefined {
    if (!response) {
      return undefined;
    }

    if (this.isApiPostResponse(response)) {
      return response.post;
    }

    return response;
  }

  private isApiPostResponse(response: ApiPost | ApiPostResponse): response is ApiPostResponse {
    return (response as ApiPostResponse).post !== undefined;
  }

  private extractPosts(response: ApiPost[] | ApiPostsResponse): ApiPost[] {
    if (Array.isArray(response)) {
      return response;
    }
    return response.posts ?? [];
  }

  private normalizeCategory(category: string): Blog['category'] {
    if (category === 'Announcement' || category === 'News' || category === 'Event') {
      return category;
    }
    return 'News';
  }

  private toApiPayload(dto: CreateBlogDto, authorId: string, authorName: string) {
    return {
      ...dto,
      authorId,
      authorName,
      date: dto.date.toISOString()
    };
  }

  private toApiUpdatePayload(updates: Partial<CreateBlogDto>) {
    return {
      ...updates,
      date: updates.date ? updates.date.toISOString() : undefined
    };
  }

  private getAuthHeaders(includeAuth = true): HttpHeaders {
    if (!includeAuth) {
      return new HttpHeaders();
    }

    const token = this.authService.getAuthToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}
