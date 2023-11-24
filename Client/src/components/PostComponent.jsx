import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { singlePost } from '../slice/PostSlice';
import { Link } from 'react-router-dom';
import SidebarComponent from './SidebarComponent';
import moment from 'moment';

function PostComponent() {

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const post = useSelector(state => state.post.posts);
  const exteralImgPath = useSelector((state) => state.post.externalUrl);
  const timeago = moment(post.created_at).fromNow();

  useEffect(() => {
    dispatch(singlePost(id))
  },[dispatch]);

  const postRedirect = (e, postId) => {
    e.preventDefault();
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
        <div  key={'lftcolumn-content-'+posts.id} dangerouslySetInnerHTML={{ __html: posts.post_content }} />
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

export default PostComponent
