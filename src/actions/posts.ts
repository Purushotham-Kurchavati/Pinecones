'use server';

import { z } from 'zod';
import { getFirestore, collection, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

interface Author {
  uid: string | null;
  name: string | null;
  photoURL: string | null;
}

const PostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  content: z.string().min(10, 'Content must be at least 10 characters long.'),
  imageUrl: z.string().url('Please provide a valid image URL.').optional().or(z.literal('')),
  isAnonymous: z.boolean(),
});

const CommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty.'),
  postId: z.string(),
});

// This function now handles both authenticated and unauthenticated users
export async function createPost(
  author: Author | null,
  formData: FormData
): Promise<{ success: boolean; message: string }> {

  const validatedFields = PostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    imageUrl: formData.get('imageUrl'),
    isAnonymous: formData.get('isAnonymous') === 'true',
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.flatten().fieldErrors.title?.[0] 
        || validatedFields.error.flatten().fieldErrors.content?.[0] 
        || validatedFields.error.flatten().fieldErrors.imageUrl?.[0]
        || 'Invalid input.'
    };
  }

  const { title, content, imageUrl, isAnonymous } = validatedFields.data;
  
  const finalAuthor = (author && !isAnonymous) ? author : {
    uid: null,
    name: 'Anonymous Artisan',
    photoURL: null
  };

  try {
    const firestore = getFirestore(app);
    await addDoc(collection(firestore, 'posts'), {
      title,
      content,
      imageUrl: imageUrl || `https://picsum.photos/seed/${Math.random()}/600/400`,
      isAnonymous: finalAuthor.name === 'Anonymous Artisan',
      author: finalAuthor,
      createdAt: serverTimestamp(),
    });

    revalidatePath('/');
    return { success: true, message: 'Post created successfully.' };
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, message: 'Failed to create post. Please try again.' };
  }
}

export async function createComment(
  author: Author | null,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  
  const validatedFields = CommentSchema.safeParse({
    content: formData.get('content'),
    postId: formData.get('postId'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.flatten().fieldErrors.content?.[0] || 'Invalid comment.',
    };
  }
  
  const { content, postId } = validatedFields.data;
  
  const finalAuthor = author ? author : {
    uid: null,
    name: 'Anonymous Artisan',
    photoURL: null
  };
  
  try {
    const firestore = getFirestore(app);
    const commentsCollection = collection(firestore, `posts/${postId}/comments`);
    await addDoc(commentsCollection, {
      content,
      author: finalAuthor,
      createdAt: serverTimestamp(),
    });

    revalidatePath('/');
    return { success: true, message: 'Comment added.' };
  } catch (error) {
    console.error('Error creating comment:', error);
    return { success: false, message: 'Failed to add comment. Please try again.' };
  }
}
