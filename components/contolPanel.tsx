// 'use client';

// import { useState, useCallback, memo } from 'react';
// import { Button, Switch, FormControlLabel, Box, CircularProgress, Typography } from '@mui/material';

// interface ControlPanelProps {
//   onAvatarUpload: (url: string) => void;
//   onClothingUpload: (url: string) => void;
//   onToggleClothing: () => void;
//   onReset: () => void;
// }

// const ControlPanel = memo(
//   ({ onAvatarUpload, onClothingUpload, onToggleClothing, onReset }: ControlPanelProps) => {
//     const [uploading, setUploading] = useState<boolean>(false);
//     const [dragOver, setDragOver] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);

//     const handleUpload = useCallback(
//       (file: File, type: 'avatar' | 'clothing') => {
//         if (!file || uploading) return; // Prevent multiple uploads

//         // Validate file extension
//         if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
//           setError(`Only .glb or .gltf 3D models are supported for ${type}. Images like .jpg are not valid.`);
//           return;
//         }

//         setError(null);
//         setUploading(true);
//         const formData = new FormData();
//         formData.append('file', file);

//         const performUpload = async () => {
//           try { 
//             console.log(`Starting upload for ${type}:`, file.name); // Debug log
//             const res = await fetch(`/api/upload?type=${type}`, {
//               method: 'POST',
//               body: formData,
//             });
//             if (!res.ok) throw new Error('Upload failed');
//             const { url }: { url: string } = await res.json();
//             console.log(`Uploaded ${type} URL:`, url); // Debug log
//             if (type === 'avatar') onAvatarUpload(url);
//             else onClothingUpload(url);
//           } catch (err) {
//             setError('Failed to upload file. Please try again.');
//             console.error('Upload error:', err);
//           } finally {
//             setUploading(false);
//           }
//         }; 

//     const debounce = (func: () => void, wait: number) => {
//           let timeout: NodeJS.Timeout;
//           return () => {
//             clearTimeout(timeout);
//             timeout = setTimeout(func, wait);
//           };
//         };

//         debounce(performUpload, 300)();
//       },
//       [onAvatarUpload, onClothingUpload, uploading]
//     );


//     const handleDrop = useCallback(
//       (e: React.DragEvent<HTMLDivElement>, type: 'avatar' | 'clothing') => {
//         e.preventDefault();
//         setDragOver(false);
//         const file = e.dataTransfer.files[0];
//         if (file) {
//           console.log(`Dropped file for ${type}:`, file.name); // Debug log
//           handleUpload(file, type);
//         }
//       },
//       [handleUpload]
//     );

//     const handleFileInput = useCallback(
//       (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'clothing') => {
//         const file = e.target.files?.[0];
//         if (file) {
//           console.log(`Selected file for ${type}:`, file.name); // Debug log
//           handleUpload(file, type);
//         }
//       },
//       [handleUpload]
//     );

//     return (
//       <Box
//         sx={{
//           position: 'absolute',
//           top: 20,
//           left: 20,
//           p: 2,
//           bgcolor: 'rgba(255, 255, 255, 0.8)',
//           borderRadius: 2,
//         }}
//       >
//         {error && (
//           <Typography color="error" sx={{ mb: 2 }}>
//             {error}
//           </Typography>
//         )}
//         <Box
//           sx={{
//             border: dragOver ? '2px dashed blue' : '2px dashed gray',
//             p: 2,
//             mb: 2,
//             textAlign: 'center',
//           }}
//           onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
//             e.preventDefault();
//             setDragOver(true);
//           }}
//           onDragLeave={() => setDragOver(false)}
//           onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, 'avatar')}
//         >
//           <Typography>Drop Avatar 3D Model Here (.glb/.gltf only)</Typography>
//         </Box>
//         <Box
//           sx={{
//             border: dragOver ? '2px dashed blue' : '2px dashed gray',
//             p: 2,
//             mb: 2,
//             textAlign: 'center',
//           }}
//           onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
//             e.preventDefault();
//             setDragOver(true);
//           }}
//           onDragLeave={() => setDragOver(false)}
//           onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, 'clothing')}
//         >
//           <Typography>Drop Clothing 3D Model Here (.glb/.gltf only)</Typography>
//         </Box>
//         <Button variant="contained" component="label" sx={{ mb: 1 }} disabled={uploading}>
//           Upload Avatar
//           <input
//             type="file"
//             hidden
//             accept=".glb,.gltf"
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileInput(e, 'avatar')}
//           />
//         </Button>
//         <Button variant="contained" component="label" sx={{ mb: 1, ml: 1 }} disabled={uploading}>
//           Upload Clothing
//           <input
//             type="file"
//             hidden
//             accept=".glb,.gltf"
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileInput(e, 'clothing')}
//           />
//         </Button>
//         <FormControlLabel
//           control={<Switch onChange={onToggleClothing} />}  
//           label="Show Clothing"
//           sx={{ mb: 1 }}
//         />
//         <Button variant="outlined" onClick={onReset} sx={{ mb: 1 }}>
//           Reset Scene
//         </Button>              
//         {uploading && <CircularProgress size={24} />}
//       </Box>
//     );
//   }
// );

// ControlPanel.displayName = 'ControlPanel';

// export default ControlPanel;  


'use client';

import { useState, useCallback, memo } from 'react';
import { Button, Switch, FormControlLabel, Box, CircularProgress, Typography } from '@mui/material';

interface ControlPanelProps {
  onAvatarUpload: (url: string) => void;
  onClothingUpload: (url: string) => void;
  onToggleClothing: () => void;
  onReset: () => void;
}

const ControlPanel = memo(
  ({ onAvatarUpload, onClothingUpload, onToggleClothing, onReset }: ControlPanelProps) => {
    const [uploading, setUploading] = useState<boolean>(false);
    const [dragOver, setDragOver] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = useCallback(
      (file: File, type: 'avatar' | 'clothing') => {
        if (!file || uploading) return;

        if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
          setError(`Only .glb or .gltf 3D models are supported for ${type}.`);
          return;
        }

        setError(null);
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const performUpload = async () => {
          try {
            console.log(`Starting upload for ${type}:`, file.name);
            const res = await fetch('/api/upload', { // Removed ?type= parameter
              method: 'POST',
              body: formData,
            }); 
            if (!res.ok) throw new Error('Upload failed');
            const { url } = await res.json();
            console.log(`Uploaded ${type} URL:`, url);
            if (type === 'avatar') onAvatarUpload(url);
            else onClothingUpload(url);
          } catch (err) {
            setError('Failed to upload file. Please try again.');
            console.error('Upload error:', err);    
          } finally {
            setUploading(false); 
          }
        };

        const debounce = (func: () => void, wait: number) => {
          let timeout: NodeJS.Timeout;
          return () => {
            clearTimeout(timeout);
            timeout = setTimeout(func, wait);
          };
        };

        debounce(performUpload, 300)();
      },
      [onAvatarUpload, onClothingUpload, uploading]
    );

    const handleDrop = useCallback(
      (e: React.DragEvent<HTMLDivElement>, type: 'avatar' | 'clothing') => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) {
          console.log(`Dropped file for ${type}:`, file.name);
          handleUpload(file, type);
        }
      },
      [handleUpload]
    );

    const handleFileInput = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'clothing') => {
        const file = e.target.files?.[0];
        if (file) {
          console.log(`Selected file for ${type}:`, file.name);
          handleUpload(file, type);
        }
      },
      [handleUpload]
    );

    return (
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          p: 2,
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 2,
        }}
      >
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box
          sx={{
            border: dragOver ? '2px dashed blue' : '2px dashed gray',
            p: 2,
            mb: 2,
            textAlign: 'center',
          }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => handleDrop(e, 'avatar')}
        >
          <Typography>Drop Avatar 3D Model Here (.glb/.gltf only)</Typography>
        </Box>
        <Box
          sx={{
            border: dragOver ? '2px dashed blue' : '2px dashed gray',
            p: 2,
            mb: 2,
            textAlign: 'center',
          }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => handleDrop(e, 'clothing')}
        >
          <Typography>Drop Clothing 3D Model Here (.glb/.gltf only)</Typography>
        </Box>
        <Button variant="contained" component="label" sx={{ mb: 1 }} disabled={uploading}>
          Upload Avatar
          <input
            type="file"
            hidden
            accept=".glb,.gltf"
            onChange={(e) => handleFileInput(e, 'avatar')}
          />
        </Button>
        <Button variant="contained" component="label" sx={{ mb: 1, ml: 1 }} disabled={uploading}>
          Upload Clothing
          <input
            type="file"
            hidden
            accept=".glb,.gltf"
            onChange={(e) => handleFileInput(e, 'clothing')}
          />
        </Button>
        <FormControlLabel
          control={<Switch onChange={onToggleClothing} />}
          label="Show Clothing"
          sx={{ mb: 1 }}
        />
        <Button variant="outlined" onClick={onReset} sx={{ mb: 1 }}>
          Reset Scene
        </Button>
        {uploading && <CircularProgress size={24} />}
      </Box>
    );
  }
);

ControlPanel.displayName = 'ControlPanel';

export default ControlPanel;