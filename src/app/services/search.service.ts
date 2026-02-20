import { Injectable, inject } from '@angular/core';
import { BlogService } from './blog.service';
import { UserService } from './user.service';
import { AuditLogService } from './audit-log.service';
import { Blog } from '../models/blog.model';
import { User } from '../models/user.model';
import { AuditLog } from '../models/audit-log.model';

export interface SearchResult {
  type: 'post' | 'user' | 'audit';
  item: Blog | User | AuditLog;
  matchScore: number;
  matchedFields: string[];
}

export interface AdvancedFilters {
  searchTerm?: string;
  category?: string;
  status?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private blogService = inject(BlogService);
  private userService = inject(UserService);
  private auditLogService = inject(AuditLogService);

  /**
   * Global search across all content types
   */
  globalSearch(query: string): SearchResult[] {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const normalizedQuery = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Search posts
    const posts = this.blogService.getBlogs()();
    posts.forEach((post: Blog) => {
      const matchedFields: string[] = [];
      let matchScore = 0;

      if (post.title.toLowerCase().includes(normalizedQuery)) {
        matchedFields.push('title');
        matchScore += 10;
      }

      if (post.excerpt?.toLowerCase().includes(normalizedQuery)) {
        matchedFields.push('excerpt');
        matchScore += 5;
      }

      if (post.content.toLowerCase().includes(normalizedQuery)) {
        matchedFields.push('content');
        matchScore += 3;
      }

      if (post.category.toLowerCase().includes(normalizedQuery)) {
        matchedFields.push('category');
        matchScore += 7;
      }

      if (post.authorName.toLowerCase().includes(normalizedQuery)) {
        matchedFields.push('author');
        matchScore += 6;
      }

      if (matchedFields.length > 0) {
        results.push({
          type: 'post',
          item: post,
          matchScore,
          matchedFields
        });
      }
    });

    // Search users
    const users = this.userService.getUsers()();
    users.forEach((user: User) => {
      const matchedFields: string[] = [];
      let matchScore = 0;

      if (user.name.toLowerCase().includes(normalizedQuery)) {
        matchedFields.push('name');
        matchScore += 10;
      }

      if (user.email.toLowerCase().includes(normalizedQuery)) {
        matchedFields.push('email');
        matchScore += 8;
      }

      if (user.role.toLowerCase().includes(normalizedQuery)) {
        matchedFields.push('role');
        matchScore += 5;
      }

      if (matchedFields.length > 0) {
        results.push({
          type: 'user',
          item: user,
          matchScore,
          matchedFields
        });
      }
    });

    // Sort by match score (highest first)
    return results.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Advanced filter for posts with multiple criteria
   */
  filterPosts(filters: AdvancedFilters): Blog[] {
    let posts = this.blogService.getBlogs()();

    // Filter by search term
    if (filters.searchTerm && filters.searchTerm.trim().length > 0) {
      const query = filters.searchTerm.toLowerCase().trim();
      posts = posts.filter((post: Blog) => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.authorName.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      posts = posts.filter((post: Blog) => post.category === filters.category);
    }

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      posts = posts.filter((post: Blog) => post.status === filters.status);
    }

    // Filter by author
    if (filters.author && filters.author !== 'all') {
      posts = posts.filter((post: Blog) => post.authorName === filters.author);
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      posts = posts.filter((post: Blog) => new Date(post.createdAt) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      posts = posts.filter((post: Blog) => new Date(post.createdAt) <= toDate);
    }

    return posts;
  }

  /**
   * Get unique authors from posts
   */
  getAuthors(): string[] {
    const posts = this.blogService.getBlogs()();
    const authors = new Set(posts.map((post: Blog) => post.authorName));
    return Array.from(authors).sort();
  }

  /**
   * Get unique categories from posts
   */
  getCategories(): string[] {
    return ['event', 'announcement', 'news'];
  }

  /**
   * Highlight search term in text
   */
  highlightSearchTerm(text: string, searchTerm: string): string {
    if (!searchTerm || !text) {
      return text;
    }

    const regex = new RegExp(`(${this.escapeRegex(searchTerm)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
