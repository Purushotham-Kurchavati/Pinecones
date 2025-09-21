export interface Author {
  uid: string | null;
  name: string | null;
  photoURL: string | null;
}

export interface Comment {
  id: string;
  content: string;
  author: Author;
  createdAt: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  isAnonymous: boolean;
  author: Author;
  createdAt: Date;
  comments: Comment[];
}
