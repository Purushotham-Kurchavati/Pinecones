'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { Comment } from '@/lib/types';
import { createComment } from '@/actions/posts';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CardContent, CardFooter } from '@/components/ui/card';
import { User, Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export function CommentSection({ postId, comments }: CommentSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleCommentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    formData.append('postId', postId);
    
    const author = user ? { uid: user.uid, name: user.displayName, photoURL: user.photoURL } : null;

    const result = await createComment(author, formData);

    if (result.success) {
      formRef.current?.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Separator className="my-4" />
      <CardContent className="space-y-4">
        <h3 className="font-semibold text-lg">Comments ({comments.length})</h3>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                {comment.author.photoURL ? (
                  <AvatarImage src={comment.author.photoURL} alt={comment.author.name || 'User'} />
                ) : (
                  <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">{comment.author.name || 'Anonymous Artisan'}</span>
                  <span className="text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm mt-1">{comment.content}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet. Be the first to reply!</p>}
        </div>
      </CardContent>
      <CardFooter>
        <form ref={formRef} onSubmit={handleCommentSubmit} className="w-full flex flex-col gap-2">
          <Textarea
            name="content"
            placeholder="Write a comment..."
            className="min-h-[60px]"
            required
          />
          <Button type="submit" disabled={isSubmitting} className="self-end">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Commenting...' : 'Comment'}
          </Button>
        </form>
      </CardFooter>
    </>
  );
}
