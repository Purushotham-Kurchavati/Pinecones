'use server';

import { z } from 'zod';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';
import { auth } from 'firebase-admin';

// This is a simplified auth check for server actions.
// In a real app, you'd want a more robust way to get the current user on the server.
// For this example, we'll assume a mechanism to pass user info or verify a session.
// As this starter doesn't include a full server-side auth session management,
// we will pass the user object from the client.
interface Author {
  uid: string;
  name: string | null;
  photoURL: string | null;
}

const PostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  content: z.string().min(10, 'Content must be at least 10 characters long.'),
  isAnonymous: z.boolean(),
});

export async function createPost(
  author: Author | null,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  if (!author) {
    return { success: false, message: 'You must be logged in to create a post.' };
  }

  const validatedFields = PostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    isAnonymous: formData.get('isAnonymous') === 'true',
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.flatten().fieldErrors.title?.[0] || validatedFields.error.flatten().fieldErrors.content?.[0] || 'Invalid input.'
    };
  }

  const { title, content, isAnonymous } = validatedFields.data;

  try {
    const firestore = getFirestore(app);
    await addDoc(collection(firestore, 'posts'), {
      title,
      content,
      isAnonymous,
      author: {
        uid: author.uid,
        name: author.name,
        photoURL: author.photoURL,
      },
      createdAt: serverTimestamp(),
    });

    revalidatePath('/');
    return { success: true, message: 'Post created successfully.' };
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, message: 'Failed to create post. Please try again.' };
  }
}
