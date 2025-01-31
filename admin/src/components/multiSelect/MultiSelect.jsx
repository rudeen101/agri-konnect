import React, { useState } from 'react';
import { Select, MenuItem, Checkbox, ListItemText } from '@mui/material';

const MultiSelectTags = ({ tags, onTagsSelected }) => {
    const [selectedTags, setSelectedTags] = useState([]);

    const handleChange = (event) => {
        const { value } = event.target;

        // Update the selected tags (MUI handles multiple as an array)
        setSelectedTags(value);

        // Pass the tag IDs to the parent or use them
        const selectedTagIds = value.map(tag => tag._id);
        onTagsSelected(selectedTagIds); // Callback with IDs
    };

    return (
        <Select
            multiple
            value={selectedTags}
            onChange={handleChange}
            renderValue={(selected) => selected.map(tag => tag.name).join(', ')}
            sx={{
                width: '200px', // Set the fixed width
            }}
        >
            {tags.map(tag => (
                <MenuItem key={tag._id} value={tag}>
                    <Checkbox checked={selectedTags.some(selected => selected._id === tag._id)} />
                    <ListItemText primary={tag.name} />
                </MenuItem>
            ))}
        </Select>
    );
};

export default MultiSelectTags;
