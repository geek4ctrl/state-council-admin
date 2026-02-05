export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: BlogCategory;
  imageUrl: string;
  date: Date;
  time: string;
  location?: string;
  externalLink?: string;
  authorId: string;
  authorName: string;
  showOnHomePage: boolean;
  showOnRegistration: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type BlogCategory = 'Event' | 'Announcement' | 'News';

export interface CreateBlogDto {
  title: string;
  content: string;
  excerpt: string;
  category: BlogCategory;
  imageUrl: string;
  date: Date;
  time: string;
  location?: string;
  externalLink?: string;
  showOnHomePage: boolean;
  showOnRegistration: boolean;
}
