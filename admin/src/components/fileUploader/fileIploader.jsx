import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, Grid, Paper } from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';

const MultipleFileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const updatedFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Upload Images
      </Typography>
      <Button
        variant="contained"
        component="label"
        startIcon={<PhotoCamera />}
        sx={{ mb: 2 }}
      >
        Select Files
        <input
          type="file"
          hidden
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>

      <Grid container spacing={2}>
        {selectedFiles.map((fileWrapper, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                position: 'relative',
                p: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 150,
                overflow: 'hidden',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: `url(${fileWrapper.preview})`,
              }}
            >
              <IconButton
                size="small"
                color="secondary"
                onClick={() => handleRemoveFile(index)}
                sx={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <Delete />
              </IconButton>
              <Typography
                variant="caption"
                sx={{
                  mt: 'auto',
                  color: '#fff',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  p: 0.5,
                  borderRadius: 1,
                  textAlign: 'center',
                }}
              >
                {fileWrapper.file.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MultipleFileUpload;
