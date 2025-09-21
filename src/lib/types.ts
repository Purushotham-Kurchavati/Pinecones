export interface Post {
  id: string;
  title: string;
  content: string;
  isAnonymous: boolean;
  author: {
    uid: string;
    name: string;
    photoURL: string;
  };
  createdAt: Date;
}
