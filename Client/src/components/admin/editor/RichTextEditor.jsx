import React, { useState } from 'react'
import { Editor, EditorTools } from "@progress/kendo-react-editor";
import DOMPurify from "dompurify";
//import { Button } from "@progress/kendo-react-buttons";
import { v4 as uuid } from 'uuid';
import { useDispatch } from 'react-redux';
import { createPost } from '../../../slice/PostSlice';
import { useNavigate } from 'react-router-dom';
const {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  ForeColor,
  BackColor,
  CleanFormatting,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  OrderedList,
  UnorderedList,
  NumberedList,
  BulletedList,
  Undo,
  Redo,
  FontSize,
  FontName,
  FormatBlock,
  Link,
  Unlink,
  InsertImage,
  ViewHtml,
  InsertTable,
  InsertFile,
  SelectAll,
  Print,
  Pdf,
  AddRowBefore,
  AddRowAfter,
  AddColumnBefore,
  AddColumnAfter,
  DeleteRow,
  DeleteColumn,
  DeleteTable,
  MergeCells,
  SplitCell,
} = EditorTools;

const tools = [
  [Bold, Italic, Underline, Strikethrough],
  [Subscript, Superscript],
  ForeColor,
  BackColor,
  [CleanFormatting],
  [AlignLeft, AlignCenter, AlignRight, AlignJustify],
  [Indent, Outdent],
  [OrderedList, UnorderedList],
  [NumberedList, BulletedList],
  FontSize,
  FontName,
  FormatBlock,
  [SelectAll],
  [Undo, Redo],
  [Link, Unlink, InsertImage, ViewHtml],
  [InsertTable, InsertFile],
  [Pdf, Print],
  [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
  [DeleteRow, DeleteColumn, DeleteTable],
  [MergeCells, SplitCell],
];

const initialRichText = `<h1>Hello world</h1>
  <p>How are you doing?</p>
`;

const RichTextEditor = props => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [richText, setRichText] = useState(initialRichText);
    const [file, setFile] = useState();
    const [post_title, setPostTitle] = useState('');
    const [post_tag, setPostTag] = useState('');

    const onChangeText = e => {
        setRichText(DOMPurify.sanitize(e.html));
    };
    const onChangeFile = e => {
        setFile(e.target.files[0]);
    }
    const handleCancel = () => {
        navigate('/');
    }

    const handleSubmit = e => {
        e.preventDefault();
        const unique_id = uuid();
        const small_id = unique_id.slice(0,8)
        const formData = new FormData();
        formData.append('file', file);
        formData.append('post_title', post_title);
        formData.append('post_tag', post_tag);
        formData.append('post_content', richText);
        formData.append('post_id', small_id);

        dispatch(createPost(formData));
        
    };

    return (
        <div>
            <div className=" k-gap-8">
                <div className="k-flex-grow">
                    <form onSubmit={handleSubmit}>
                        <div class="mb-3 mt-3">
                            <label for="title" class="form-label">Post Title</label>
                            <input type="text" required class="form-control" id="post_title" value={post_title}
                                onChange={event => setPostTitle(event.target.value)} placeholder="Enter Title" name="post_title" 
                            />
                        </div>
                        <div class="mb-3">
                            <label for="post_tag" class="form-label">Post Tag</label>
                            <input type="text" required class="form-control" id="post_tag" value={post_tag} 
                                onChange={event => setPostTag(event.target.value)} placeholder="Enter Tag" name="post_tag" 
                            />
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="file">Choose Banner Image</label>
                            <input type="file" class="form-control" id="file"
                                onChange={onChangeFile} name="file" 
                            />
                        </div>
                        <Editor
                            defaultContent={richText}
                            tools={tools}
                            onChange={onChangeText}
                            contentStyle={{ height: 300 }}
                        />
                        <div className="k-form-buttons k-justify-content-end" style={{padding: "10px 0"}}>
                            <button type='submit' className='btn btn-primary' onClick={handleSubmit}>Create Post</button>
                            <button className='btn btn-secondary' onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                </div>
            { /* <div className="k-flex-grow">
                <h2>Parsed Editor Text</h2>
                <div dangerouslySetInnerHTML={{ __html: richText }} />
                </div> 
              */ 
            }
            </div> 
        </div>
    );
}

export default RichTextEditor
