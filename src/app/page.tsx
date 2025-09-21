import { getFirestore, collection, getDocs, orderBy, query, Timestamp, FirestoreError } from 'firebase/firestore';
import Image from 'next/image';
import { app } from '@/lib/firebase';
import type { Post } from '@/lib/types';
import { PostList } from '@/components/post-list';
import { CreatePostDialog } from '@/components/create-post-dialog';
import { Suspense } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card } from '@/components/ui/card';

async function getPosts(): Promise<Post[]> {
  try {
    const firestore = getFirestore(app);
    const postsCollection = collection(firestore, 'posts');
    const postsQuery = query(postsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(postsQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        author: data.author,
        isAnonymous: data.isAnonymous,
        createdAt: (data.createdAt as Timestamp).toDate(),
      };
    });
  } catch (error) {
    if (error instanceof FirestoreError && (error.code === 'not-found' || error.code === 'failed-precondition')) {
      console.warn("Firestore database not found or not initialized. It may not be created yet. Returning empty posts array.");
      return [];
    }
    console.error("Error fetching posts:", error);
    return [];
  }
}

function PostsSkeleton() {
  return (
    <div className="grid gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-card p-6 rounded-lg shadow-md space-y-4">
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
            <h1 className="text-4xl font-headline font-bold text-white">Welcome to the Artisan's Circle</h1>
            <p className="text-lg text-primary-foreground/90 mt-2">A space for India's craftspeople to connect, share, and inspire.</p>
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
