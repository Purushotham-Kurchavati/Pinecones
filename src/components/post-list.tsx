'use client';

import type { Post } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { CommentSection } from './comment-section';

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  if (!posts || posts.length === 0) {
    return (
      <Card className="text-center py-12 px-6">
        <div className="flex justify-center mb-4">
          <MessageSquare className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-medium text-foreground">No discussions yet.</h2>
        <p className="text-muted-foreground">Why not start the conversation? Share your craft or ask a question.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-8">
      {posts.map((post) => (
        <Card key={post.id} className="break-inside-avoid">
          {post.imageUrl && (
            <div className="relative aspect-video w-full">
              <Image 
                src={post.imageUrl} 
                alt={post.title} 
                fill 
                className="object-cover rounded-t-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          <CardHeader>
            <CardTitle className="font-headline text-2xl">{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{post.content}</p>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground w-full">
              {post.isAnonymous ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  <span>Anonymous Artisan</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author.photoURL} alt={post.author.name} />
                    <AvatarFallback>{post.author.name?.charAt(0) ?? 'A'}</AvatarFallback>
                  </Avatar>
                  <span>{post.author.name}</span>
                </div>
              )}
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </CardFooter>
          <CommentSection postId={post.id} comments={post.comments} />
        </Card>
      ))}
    </div>
  );
}
