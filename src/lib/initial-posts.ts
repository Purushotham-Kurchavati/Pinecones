import type { Post } from './types';

const initialPostData = [
  {
    "id": "1",
    "title": "Vibrant Pottery Collection",
    "content": "Just finished a new set of handcrafted pottery. Each piece is unique and tells a story. What do you all think of the new glaze?",
    "imageUrl": "https://picsum.photos/seed/post1/600/400"
  },
  {
    "id": "2",
    "title": "Intricate Wood Carving",
    "content": "Spent the last month on this detailed elephant carving. It's carved from a single block of teak wood. I'm so proud of how it turned out!",
    "imageUrl": "https://picsum.photos/seed/post2/600/400"
  },
  {
    "id": "3",
    "title": "Handwoven Basketry",
    "content": "Experimenting with new weaving patterns for these baskets. The natural fibers give them such a rustic and earthy feel.",
    "imageUrl": "https://picsum.photos/seed/post3/600/400"
  },
  {
    "id": "4",
    "title": "Colorful Thread Art",
    "content": "There's something so therapeutic about working with colorful threads. Here’s a piece I just completed.",
    "imageUrl": "https://picsum.photos/seed/post4/600/400"
  },
  {
    "id": "5",
    "title": "The Art of Shoemaking",
    "content": "A look inside my workshop. Crafting shoes by hand is a long process, but the result is always worth it.",
    "imageUrl": "https://picsum.photos/seed/post5/600/400"
  },
  {
    "id": "6",
    "title": "Clay Sculptures in Progress",
    "content": "Getting my hands dirty today! These are the initial shapes for a new series of clay sculptures I'm working on.",
    "imageUrl": "https://picsum.photos/seed/post6/600/400"
  },
  {
    "id": "7",
    "title": "Weaving a Masterpiece",
    "content": "The loom is set up and the weaving has begun. This is going to be a large wall hanging with a traditional pattern.",
    "imageUrl": "https://picsum.photos/seed/post7/600/400"
  },
  {
    "id": "8",
    "title": "The Beauty of Indian Jewelry",
    "content": "Finalizing some new jewelry designs. The intricate details are inspired by traditional Indian temple art.",
    "imageUrl": "https://picsum.photos/seed/post8/600/400"
  },
  {
    "id": "9",
    "title": "Metalwork and Engraving",
    "content": "Precision is key when it comes to metal engraving. Here's a custom piece I'm working on for a client.",
    "imageUrl": "https://picsum.photos/seed/post9/600/400"
  },
  {
    "id": "10",
    "title": "Stone Carving Artistry",
    "content": "Bringing a block of stone to life. This sculpture is starting to take shape after many hours of carving.",
    "imageUrl": "https://picsum.photos/seed/post10/600/400"
  }
];

export function getInitialPosts(): Post[] {
  return initialPostData.map((post, index) => ({
    ...post,
    isAnonymous: true,
    author: {
      uid: null,
      name: 'Anonymous Artisan',
      photoURL: null,
    },
    createdAt: new Date(Date.now() - index * 1000 * 60 * 60 * 24), // Stagger creation times
    comments: [],
  }));
}
