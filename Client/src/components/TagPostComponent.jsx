import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom'
import { fetchTagPost } from '../slice/PostSlice';
//import logo from '../Assert/images/logo.png';
import moment from 'moment';
import SidebarComponent from './SidebarComponent';

function TagPostComponent() {

    const { tag } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const exteralImgPath = useSelector((state) => state.post.externalUrl);
    let tagPost = useSelector(state => state.post.posts);
    useEffect(() => {
        dispatch(fetchTagPost(tag));
    },[dispatch])

    const postRedirect = (e, postId) => {
        e.preventDefault();
        navigate(`/post/${postId}`);
    }
    
    const listTagPost = (e, post_tag) => {
        e.preventDefault();
        console.log(post_tag);
        navigate(`/post/tag/${post_tag?.toLowerCase()}`)
    }

    let postContent = tagPost.map((posts) => {
        const timeago = moment(tagPost.created_at).fromNow();
        return (
            <>
                <div className="leftcolumn">
                    <div key={posts.id} className="card">
                        <h2><Link className='nav-link post-card-title' onClick={event => postRedirect(event, posts.post_id)}>{posts.post_title}</Link></h2>
                        <div>
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
                </div>
            </>
        );
    });

    return (
        <>
            <div className="header">
                <h2>Blog Name</h2>
            </div>
            <div className="row">
                {postContent}
                <SidebarComponent/>
            </div>
        </>
    )
}

export default TagPostComponent
