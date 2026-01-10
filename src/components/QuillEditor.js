import React, { useState } from 'react';
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { Box } from '@mui/material';
import '@mui/lab/themeAugmentation';

const RichTextEditor = ({ value, onChange }) => {
  const [editorState, setEditorState] = useState(() => {
    if (value) {
      const contentState = ContentState.createFromText(value);
      return EditorState.createWithContent(contentState);
    } else {
      return EditorState.createEmpty();
    }
  });

  const handleEditorChange = (state) => {
    setEditorState(state);
    const content = state.getCurrentContent();
    const textValue = content.getPlainText();
    onChange(textValue);
  };

  return (
    <Box sx={{ height: '400px' }}>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
      />
    </Box>
  );
};

export default RichTextEditor;
