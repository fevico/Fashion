# 3D Avatar Fitting App

A web app built for the Threadswift take-home assignment. Users can upload 3D avatar and clothing models (GLB/GLTF), view them in a 3D scene, and interact with the scene using zoom, rotate, and pan controls.

## Features
- Upload avatar and clothing models via buttons or drag-and-drop.
- 3D viewport with OrbitControls for interaction.
- Toggle clothing visibility.
- Reset scene functionality.
- Simple backend to save scene state in a file.
- Loading spinner during uploads.
- Responsive UI built with Material UI.

## Tech Stack
- Next.js
- React
- Three.js (via @react-three/fiber and @react-three/drei)
- Material UI
- Node.js (Next.js API routes)

## Setup Instructions
1. Clone the repo: `git clone <repo-url>`
2. Install dependencies: `npm install`
3. Run locally: `npm run dev`
4. Open `http://localhost:3000` in your browser.
5. Base url for vercel https://fashion-self-beta.vercel.app/

## Deployment
- Deployed on Vercel: [Insert Vercel URL]
- Note: File uploads may require a storage solution (e.g., Vercel Blob) for production.

## Screenshots
i have a 3D sample in my public/uploads/avatar or /clothing

## Notes
- Clothing "fitting" is simplified by positioning the clothing model at the avatar’s origin.
- Tested with sample GLB models from Sketchfab.