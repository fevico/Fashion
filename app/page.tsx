// 'use client';

// import ControlPanel from '@/components/contolPanel';
// import Scene from '@/components/scene';
// import { useState, useEffect, useCallback } from 'react';

// export default function Home() {
//   const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
//   const [clothingUrl, setClothingUrl] = useState<string | null>(null);
//   const [showClothing, setShowClothing] = useState<boolean>(true);

//   // Log state changes for debugging
//   useEffect(() => {
//     console.log('State updated:', { avatarUrl, clothingUrl, showClothing });
//   }, [avatarUrl, clothingUrl, showClothing]);

//   // Save scene state when dependencies change
//   useEffect(() => {
//     const saveScene = async () => {  
//       try {
//         console.log('Saving scene:', { avatarUrl, clothingUrl, showClothing });
//         await fetch('/api/save-scene', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ avatarUrl, clothingUrl, showClothing }),
//         });
//       } catch (error) {
//         console.error('Failed to save scene:', error);
//       }
//     };

//     // Only save the scene if at least one of the URLs is not null
//     if (avatarUrl || clothingUrl) {
//       saveScene();
//     }
//   }, [avatarUrl, clothingUrl, showClothing]);

//   const handleReset = useCallback(async () => {
//     console.log('Resetting scene');
//     setAvatarUrl(null);
//     setClothingUrl(null);
//     setShowClothing(true);
//   }, []);

//   const handleAvatarUpload = useCallback((url: string) => {
//     console.log('Avatar uploaded:', url);
//     setAvatarUrl(url);
//   }, []);

//   const handleClothingUpload = useCallback((url: string) => {
//     console.log('Clothing uploaded:', url);
//     setClothingUrl(url);
//   }, []);

//   const handleToggleClothing = useCallback(() => {
//     console.log('Toggling clothing visibility');
//     setShowClothing((prev) => !prev);
//   }, []);

//   return (
//     <div style={{ position: 'relative', height: '100vh' }}>
//       <Scene avatarUrl={avatarUrl} clothingUrl={clothingUrl} showClothing={showClothing} />
//       <ControlPanel
//         onAvatarUpload={handleAvatarUpload}
//         onClothingUpload={handleClothingUpload}
//         onToggleClothing={handleToggleClothing}
//         onReset={handleReset}
//       />
//     </div>
//   );         
// }



'use client';

import ControlPanel from '@/components/contolPanel';
import Scene from '@/components/scene';
import { useState, useEffect, useCallback } from 'react';

export default function Home() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [clothingUrl, setClothingUrl] = useState<string | null>(null);
  const [showClothing, setShowClothing] = useState<boolean>(true);

  useEffect(() => {
    console.log('State updated:', { avatarUrl, clothingUrl, showClothing });
  }, [avatarUrl, clothingUrl, showClothing]);

  useEffect(() => {
    const saveScene = async () => {
      try {
        console.log('Saving scene:', { avatarUrl, clothingUrl, showClothing });
        await fetch('/api/save-scene', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatarUrl, clothingUrl, showClothing }),
        });
      } catch (error) {
        console.error('Failed to save scene:', error);
      }
    };

    if (avatarUrl || clothingUrl) {
      saveScene();
    }
  }, [avatarUrl, clothingUrl, showClothing]);

  const handleReset = useCallback(async () => {
    console.log('Resetting scene');
    setAvatarUrl(null);
    setClothingUrl(null);
    setShowClothing(true);
  }, []);

  const handleAvatarUpload = useCallback((url: string) => {
    console.log('Avatar uploaded:', url);
    setAvatarUrl(url);
  }, []);

  const handleClothingUpload = useCallback((url: string) => {
    console.log('Clothing uploaded:', url);
    setClothingUrl(url);
  }, []);

  const handleToggleClothing = useCallback(() => {
    console.log('Toggling clothing visibility');
    setShowClothing((prev) => !prev);
  }, []);

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <Scene avatarUrl={avatarUrl} clothingUrl={clothingUrl} showClothing={showClothing} />
      <ControlPanel
        onAvatarUpload={handleAvatarUpload}
        onClothingUpload={handleClothingUpload}
        onToggleClothing={handleToggleClothing}
        onReset={handleReset}
        showClothing={showClothing}
      />
    </div>
  );
}