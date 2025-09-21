import { getFirestore, collection, getDocs, orderBy, query, Timestamp, FirestoreError } from 'firebase/firestore';
import Image from 'next/image';
import { app } from '@/lib/firebase';
import type { Comment, Post } from '@/lib/types';
import { PostList } from '@/components/post-list';
import { CreatePostDialog } from '@/components/create-post-dialog';
import { Suspense } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card } from '@/components/ui/card';
import { getInitialPosts } from '@/lib/initial-posts';

async function getComments(postId: string): Promise<Comment[]> {
  try {
    const firestore = getFirestore(app);
    const commentsCollection = collection(firestore, `posts/${postId}/comments`);
    const commentsQuery = query(commentsCollection, orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(commentsQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        content: data.content,
        author: data.author,
        createdAt: (data.createdAt as Timestamp).toDate(),
      };
    });
  } catch (error) {
    // Similar error handling as getPosts
    if (error instanceof FirestoreError && (error.code === 'not-found' || error.code === 'failed-precondition' || error.code === 'permission-denied')) {
        // This is expected if a post has no comments yet.
        return [];
    }
    console.error(`Error fetching comments for post ${postId}:`, error);
    return [];
  }
}

async function getPosts(): Promise<Post[]> {
  try {
    const firestore = getFirestore(app);
    const postsCollection = collection(firestore, 'posts');
    const postsQuery = query(postsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(postsQuery);
    
    if (querySnapshot.empty) {
      console.log("No posts found in Firestore, returning initial posts.");
      return getInitialPosts();
    }

    const posts = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const comments = await getComments(doc.id);
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        author: data.author,
        isAnonymous: data.isAnonymous,
        createdAt: (data.createdAt as Timestamp).toDate(),
        comments: comments,
      };
    }));
    
    return posts;

  } catch (error) {
    if (error instanceof FirestoreError) {
      if (error.code === 'not-found' || error.code === 'failed-precondition') {
        console.warn("Firestore 'posts' collection or necessary index not found. Returning initial posts.");
        return getInitialPosts();
      }
      if (error.code === 'permission-denied') {
        console.error("Firestore security rules are denying access to the 'posts' collection. For development, you can use: `rules_version = '2'; service cloud.firestore { match /databases/{database}/documents { match /{document=**} { allow read, write: if true; } } }`");
        return getInitialPosts();
      }
    }
    console.error("Error fetching posts:", error);
    return getInitialPosts();
  }
}

function PostsSkeleton() {
  return (
    <div className="grid gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-card p-6 rounded-lg shadow-md space-y-4">
          <div className="h-48 bg-muted rounded w-full animate-pulse"></div>
          <div className="h-6 bg-muted rounded w-3/4 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
          </div>
          <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}

export default async function CommunityPage() {
  const posts = await getPosts();
  const heroImage = PlaceHolderImages.find(img => img.id === 'indian-craft-hero');

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <div className="relative h-56 w-full">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-4xl font-headline font-bold text-white">Welcome to the Pinecone Community</h1>
            <p className="text-lg text-primary-foreground/90 mt-2">A space for craftspeople to connect, share, and inspire.</p>
          </div>
        </div>
      </Card>
      
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-headline font-bold">Community Discussions</h2>
        <CreatePostDialog />
      </div>
      
      <Suspense fallback={<PostsSkeleton />}>
        <PostList posts={posts} />
      </Suspense>
    </div>
  );
}
