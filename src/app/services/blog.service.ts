import { Injectable, signal } from '@angular/core';
import { Blog, CreateBlogDto } from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private blogs = signal<Blog[]>([]);
  private storageKey = 'blogs';

  constructor() {
    this.loadFromStorage();

    // Initialize with sample data if empty
    if (this.blogs().length === 0) {
      this.initializeSampleData();
    }
  }

  getBlogs() {
    return this.blogs.asReadonly();
  }

  getBlogById(id: string): Blog | undefined {
    return this.blogs().find(blog => blog.id === id);
  }

  createBlog(dto: CreateBlogDto, authorId: string, authorName: string): Blog {
    const newBlog: Blog = {
      id: this.generateId(),
      ...dto,
      authorId,
      authorName,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.blogs.update(blogs => [...blogs, newBlog]);
    this.saveToStorage();
    return newBlog;
  }

  updateBlog(id: string, updates: Partial<CreateBlogDto>): Blog | undefined {
    let updatedBlog: Blog | undefined;

    this.blogs.update(blogs => {
      const index = blogs.findIndex(b => b.id === id);
      if (index === -1) return blogs;

      updatedBlog = {
        ...blogs[index],
        ...updates,
        updatedAt: new Date()
      };

      const newBlogs = [...blogs];
      newBlogs[index] = updatedBlog;
      return newBlogs;
    });

    if (updatedBlog) {
      this.saveToStorage();
    }

    return updatedBlog;
  }

  deleteBlog(id: string): boolean {
    const initialLength = this.blogs().length;
    this.blogs.update(blogs => blogs.filter(b => b.id !== id));

    if (this.blogs().length < initialLength) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(this.blogs()));
    }
  }

  private loadFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          this.blogs.set(parsed.map((blog: any) => ({
            ...blog,
            date: new Date(blog.date),
            createdAt: new Date(blog.createdAt),
            updatedAt: new Date(blog.updatedAt)
          })));
        } catch (e) {
          console.error('Error loading blogs from storage:', e);
        }
      }
    }
  }

  private initializeSampleData(): void {
    const sampleBlogs: Blog[] = [
      {
        id: '1',
        title: 'Effects of nature in today\'s Architecture',
        content: 'Join us for a brief discussion with professionals on the topic...',
        excerpt: 'Join us for a brief discussion with professionals...',
        category: 'Event',
        imageUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400',
        date: new Date('2022-07-14'),
        time: '2:00 PM',
        location: 'Conference Hall',
        externalLink: '',
        authorId: 'admin',
        authorName: 'Admin',
        showOnHomePage: true,
        showOnRegistration: false,
        createdAt: new Date('2022-04-05'),
        updatedAt: new Date('2022-04-05')
      },
      {
        id: '2',
        title: 'FlowerLand Festivals',
        content: 'Spring brings with it the vibrant colors and delightful fragrances of blooming flowers...',
        excerpt: 'Spring brings vibrant colors and delightful fragrances...',
        category: 'Event',
        imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
        date: new Date('2023-03-16'),
        time: '10:00 AM',
        location: 'Garden Park',
        externalLink: '',
        authorId: 'admin',
        authorName: 'Admin',
        showOnHomePage: true,
        showOnRegistration: true,
        createdAt: new Date('2023-03-01'),
        updatedAt: new Date('2023-03-01')
      },
      {
        id: '3',
        title: 'Colored Festivals in 22nd Jan',
        content: 'Join us for a brief discussion with 92 years old...',
        excerpt: 'Join us for a brief discussion...',
        category: 'Event',
        imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
        date: new Date('2022-07-14'),
        time: '10am to 1pm',
        location: '4415 Fortran Ct, San Jose, CA 95134',
        externalLink: '',
        authorId: 'admin',
        authorName: 'Admin',
        showOnHomePage: false,
        showOnRegistration: false,
        createdAt: new Date('2022-01-15'),
        updatedAt: new Date('2022-01-15')
      }
    ];

    this.blogs.set(sampleBlogs);
    this.saveToStorage();
  }
}
