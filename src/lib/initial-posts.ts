import type { Post } from './types';

const initialPostData = [
  {
    "id": "1",
    "title": "Vibrant Pottery Collection",
    "content": "Just finished a new set of handcrafted pottery. Each piece is unique and tells a story. What do you all think of the new glaze?",
    "imageUrl": "https://as2.ftcdn.net/v2/jpg/01/44/24/83/1000_F_144248379_GWXH6c2dP86LD5wfLq3Sc4pQjcLQz6M6.jpg"
  },
  {
    "id": "2",
    "title": "Intricate Wood Carving",
    "content": "Spent the last month on this detailed elephant carving. It's carved from a single block of teak wood. I'm so proud of how it turned out!",
    "imageUrl": "https://as1.ftcdn.net/v2/jpg/00/11/89/18/1000_F_11891871_DlAXCUTKO5UEyjHF2ouHuKOiMii3ulny.jpg"
  },
  {
    "id": "3",
    "title": "Handwoven Basketry",
    "content": "Experimenting with new weaving patterns for these baskets. The natural fibers give them such a rustic and earthy feel.",
    "imageUrl": "https://as2.ftcdn.net/v2/jpg/05/45/69/01/1000_F_545690132_IYjb1YQsc2RfLRRdz3ZDD54oVD3uimz3.jpg"
  },
  {
    "id": "4",
    "title": "Colorful Thread Art",
    "content": "There's something so therapeutic about working with colorful threads. Here’s a piece I just completed.",
    "imageUrl": "https://as2.ftcdn.net/v2/jpg/03/13/64/27/1000_F_313642757_74cCIizBFxVh7eL8lqvmZz666N02sOxq.jpg"
  },
  {
    "id": "5",
    "title": "The Art of Shoemaking",
    "content": "A look inside my workshop. Crafting shoes by hand is a long process, but the result is always worth it.",
    "imageUrl": "https://as1.ftcdn.net/v2/jpg/01/05/94/58/1000_F_105945852_XrwXKqIJAXkgz3fBFrXajFZ3nmPNmIo9.jpg"
  },
  {
    "id": "6",
    "title": "Clay Sculptures in Progress",
    "content": "Getting my hands dirty today! These are the initial shapes for a new series of clay sculptures I'm working on.",
    "imageUrl": "https://as1.ftcdn.net/v2/jpg/03/67/48/88/1000_F_367488826_B28NStl2dc9HLm3LP2kvygRvva80czee.jpg"
  },
  {
    "id": "7",
    "title": "Weaving a Masterpiece",
    "content": "The loom is set up and the weaving has begun. This is going to be a large wall hanging with a traditional pattern.",
    "imageUrl": "https://as1.ftcdn.net/v2/jpg/15/41/43/52/1000_F_1541435234_IYA03nEsHMWKQ3HyJcXXNeHVlqBU8s7F.jpg"
  },
  {
    "id": "8",
    "title": "The Beauty of Indian Jewelry",
    "content": "Finalizing some new jewelry designs. The intricate details are inspired by traditional Indian temple art.",
    "imageUrl": "https://as1.ftcdn.net/v2/jpg/02/86/74/58/1000_F_286745832_7iGKxrVEwYq7iE1Ew0lrApxfAN27EQuC.jpg"
  },
  {
    "id": "9",
    "title": "Metalwork and Engraving",
    "content": "Precision is key when it comes to metal engraving. Here's a custom piece I'm working on for a client.",
    "imageUrl": "https://as1.ftcdn.net/v2/jpg/01/42/58/94/1000_F_142589411_nZMogtGZo16zZCVoctBTDr3NfyO6ZqfC.jpg"
  },
  {
    "id": "10",
    "title": "Stone Carving Artistry",
    "content": "Bringing a block of stone to life. This sculpture is starting to take shape after many hours of carving.",
    "imageUrl": "https://as2.ftcdn.net/v2/jpg/01/67/36/75/1000_F_167367550_w19XqGgR8RowGck1F6vf5ssdapmwEyv0.jpg"
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
