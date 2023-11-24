import React from 'react'
import RichTextEditor from './editor/RichTextEditor';
//import TextareaMessage from './editor/TextareaMessage';

function CreatePostComponent() {
  return (
    <div className='appContainer'>
        <h1 className='k-mb-6'>Create New Post</h1>
        <div>
            <RichTextEditor/>
        </div>

    </div>
  )
}

export default CreatePostComponent;
