import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import EditorJs from 'react-editor-js';
import requiredTools from './requiredTools';
import customTools from '../../config/customTools';

import MediaLibAdapter from '../medialib/adapter'
import MediaLibComponent from '../medialib/component';
import {changeFunc, getToggleFunc} from '../medialib/utils';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';

const Editor = ({ onChange, name, value }) => {

  const [editorInstance, setEditorInstance] = useState();
  const [mediaLibBlockIndex, setMediaLibBlockIndex] = useState(-1);
  const [isMediaLibOpen, setIsMediaLibOpen] = useState(false);

  const mediaLibToggleFunc = useCallback(getToggleFunc({
    openStateSetter: setIsMediaLibOpen,
    indexStateSetter: setMediaLibBlockIndex
  }), []);

  const handleMediaLibChange = useCallback((data) => {
    changeFunc({
        indexStateSetter: setMediaLibBlockIndex,
        data,
        index: mediaLibBlockIndex,
        editor: editorInstance
    });
    mediaLibToggleFunc();
  }, [mediaLibBlockIndex, editorInstance]);

  const customImageTool = {
    mediaLib: {
      class: MediaLibAdapter,
      config: {
        mediaLibToggleFunc
      }
    }
  }

  const handleReady = (editor) => {
    new Undo({ editor });
    new DragDrop(editor);
    if(value && JSON.parse(value).blocks.length) {
      editor.blocks.render(JSON.parse(value))
    }
    if (document.querySelector('[data-tool="image"]')) {
      document.querySelector('[data-tool="image"]').remove()
    }
  };

  return (
    <>
      <div style={{ border: `1px solid rgb(227, 233, 243)`, borderRadius: `2px`, marginTop: `4px` }}>
        <EditorJs
          // data={JSON.parse(value)}
          // enableReInitialize={true}
          onReady={ handleReady }
          onChange={(api, newData) => {
            if (!newData.blocks.length) {
              newData = null;
              onChange({ target: { name, value: newData } });
            } else {
              onChange({ target: { name, value: JSON.stringify(newData) } });
            }
          }}
          tools={{...requiredTools, ...customTools, ...customImageTool}}
          instanceRef={instance => setEditorInstance(instance)}
        />
      </div>
      <MediaLibComponent
        isOpen={isMediaLibOpen}
        onChange={handleMediaLibChange}
        onToggle={mediaLibToggleFunc}
      />
    </>
  );
};

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default Editor;
