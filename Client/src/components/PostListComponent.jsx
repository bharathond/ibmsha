import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPost } from '../slice/PostSlice';
import { useNavigate, Link } from 'react-router-dom';
//import logo from '../Assert/images/logo.png'
import moment from 'moment';
import SidebarComponent from './SidebarComponent';

function PostListComponent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const exteralImgPath = useSelector((state) => state.post.externalUrl);
  const post = useSelector((state) => state.post.posts);
  useEffect(() => {
      dispatch(fetchPost());
  },[dispatch]);

  const postRedirect = (e, postId) => {
    e.preventDefault();
    navigate(`/post/${postId}`);
  }

  const listTagPost = (e, post_tag) => {
      e.preventDefault();
      console.log(post_tag);
      navigate(`/post/tag/${post_tag?.toLowerCase()}`)
  }
  

  let postContent = post.map((posts,i) => {
    const timeago = moment(posts.created_at).fromNow();
    return (
      <div key={'card-'+posts.id} className="card">
        <h2><Link className='nav-link post-card-title' onClick={event => postRedirect(event, posts.post_id)}>{posts.post_title}</Link></h2>
        <div key={'lftcolumn-tag-'+posts.id}>
          <span className='post-card-tag' onClick={event => listTagPost(event, posts.post_tag)} >#{posts.post_tag}</span>
          <span className='post-card-publish'>Published {timeago}</span>
        </div>
        <div key={'lftcolumn-img-'+posts.id}>
          <img className="orginalimg" src={
            (posts.post_image)?exteralImgPath+posts.post_image:exteralImgPath+'No_image_available.png'
          } alt='Banner' />
        </div>
        <div  key={'lftcolumn-content-'+posts.id} className='txt-wrapper' dangerouslySetInnerHTML={{ __html: posts.post_content }} />
      </div>
    );
  });

  return (
    <>
      <div key={'post-header'} className="header">
        <h2>Blog Name</h2>
      </div>
      <div key={'post-row'} className="row">
        <div className="leftcolumn">
          {postContent}
        </div>
        <SidebarComponent/>
      </div>
    </>
  )
}

export default PostListComponent
