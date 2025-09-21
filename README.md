# 🌲 Pinecones: Artisan Community & AI Toolkit

Pinecones is a web application built for artisans and craftspeople to connect, share their work, and grow their online presence. It combines a vibrant community forum with a powerful AI-driven product description generator tailored for e-commerce.

---
## Overview

The platform is designed to empower artisans by giving them a digital-first space where they can showcase their craft, exchange ideas, and build an online presence. Alongside the community, Pinecones provides an AI toolkit that helps artisans automatically generate e-commerce–friendly titles and product descriptions, optimized for platforms like Etsy, Shopify, and Amazon.

---

## Features

- **Community Platform**
  - Browse categorized discussions (Pottery, Woodwork, Textiles, Jewelry, and more).
  - Create and share posts with titles, content, and cover images.
  - Interactive thread view for in-depth discussions.
  - Comment system with threaded replies using `@<number>`.
  - Automatic URL detection for clickable links.
  - Open participation: registered and anonymous users can both post and comment.
  - User authentication with Firebase (Email/Password).

- **AI Product Description Generator**
  - Instantly generate product titles and descriptions with minimal input.
  - Just provide a product name, key details, and select an e-commerce platform.
  - Outputs tailored for Etsy, Shopify, and Amazon.

---

## Tech Stack

- **Framework**: Next.js (App Router)  
- **Frontend**: React + TypeScript  
- **Styling**: Tailwind CSS  
- **UI Components**: ShadCN UI  
- **Backend & Database**: Firebase (Authentication + Firestore)  
- **Generative AI**: Genkit + Google Gemini models  

---

## Getting Started

### Prerequisites
- Node.js v18+  
- npm or another package manager  

### Installation

Clone the repository and install dependencies:

```bash
git clone <your-repository-url>
cd <repository-directory>
npm install

Firebase Setup
	1.	Create a new project in Firebase Console.
	2.	In project settings, register a new Web App.
	3.	Copy the firebaseConfig object and paste it into src/lib/firebase.ts:

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

Firestore Rules (Development Only)

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

⚠️ For production, implement secure rules.

Run the App

Start the development server:

npm run dev

App will run at: http://localhost:9002

⸻

Roadmap
	•	✅ Community forum with categories & comments
	•	✅ AI product description generator
	•	🔲 AI-powered image-to-description
	•	🔲 Mobile optimization
	•	🔲 Secure production-ready Firestore rules

⸻

Contributing

We welcome contributions!
	1.	Fork the repo
	2.	Create a branch (git checkout -b feature-name)
	3.	Commit changes (git commit -m "Add feature")
	4.	Push the branch (git push origin feature-name)
	5.	Open a Pull Request

⸻

License

This project is licensed under the MIT License. See LICENSE for details.

⸻

⭐ If you find Pinecones useful, please consider giving the repo a star to support the project!

---

Do you also want me to **add badges (Node.js, Firebase, License, etc.) at the very top** so it looks more professional and GitHub-ready, or do you prefer keeping it plain and simple?
