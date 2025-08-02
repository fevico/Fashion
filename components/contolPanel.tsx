
'use client';

import { useState, useCallback, memo, useRef } from 'react';
import { Button, Switch, FormControlLabel, Box, CircularProgress, Typography } from '@mui/material';
import { uploadFile } from '@/app/actions/upload';

interface ControlPanelProps {
  onAvatarUpload: (url: string) => void;
  onClothingUpload: (url: string) => void;
  onToggleClothing: () => void;
  onReset: () => void;
  showClothing: boolean;
}

const ControlPanel = memo(
  ({ onAvatarUpload, onClothingUpload, onToggleClothing, onReset, showClothing }: ControlPanelProps) => {
    const [uploading, setUploading] = useState<boolean>(false);
    const [dragOver, setDragOver] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const clothingInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = useCallback(
      async (file: File, type: 'avatar' | 'clothing') => {
        if (!file || uploading) return;

        if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
          setError(`Only .glb or .gltf 3D models are supported for ${type}.`);
          return;
        }

        setError(null);
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
          const result = await uploadFile(formData, type);
          console.log(`Uploaded ${type} URL:`, result.url);
          if (type === 'avatar') onAvatarUpload(result.url);
          else onClothingUpload(result.url);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to upload file. Please try again.');
          console.error('Upload error:', err);
        } finally {
          setUploading(false);
        }
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
          <Button
            variant="contained"
            component="label"
            sx={{ mb: 1 }}
            disabled={uploading}
          >
            Upload Avatar
            <input
              type="file"
              hidden
              accept=".glb,.gltf"
              onChange={(e) => handleFileInput(e, 'avatar')}
            />
          </Button>
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
          <Button
            variant="contained"
            component="label"
            sx={{ mb: 1, ml: 1 }}
            disabled={uploading}
          >
            Upload Clothing
            <input
              type="file"
              hidden
              accept=".glb,.gltf"
              onChange={(e) => handleFileInput(e, 'clothing')}
            />
          </Button>
        </Box>
        <FormControlLabel
          control={<Switch checked={showClothing} onChange={onToggleClothing} />}
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