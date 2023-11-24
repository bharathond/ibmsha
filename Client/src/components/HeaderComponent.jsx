import React, { useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import logo from '../Assert/images/logo.png'
import PostComponent from './PostComponent';
import PostListComponent from './PostListComponent';
import UuidComponent from './UuidComponent';
import TagPostComponent from './TagPostComponent';
import AdminComponent from './admin/AdminComponent';
import AdminLogoutComponent from './admin/AdminLogoutComponent';
import { useDispatch } from 'react-redux';
import { fetchFilterPost, fetchPost } from '../slice/PostSlice';
import CreatePostComponent from './admin/CreatePostComponent';
import LoginComponent from './user/LoginComponent';
import RegisterComponent from './user/RegisterComponent';

function HeaderComponent() {
    let navigate = useNavigate();
    let dispatch = useDispatch();
    let [searchText, setSearchText] = useState('');
    let userData = JSON.parse(sessionStorage.getItem('user'));
    let homeRedirect = (e) => {
        e.preventDefault();
        dispatch(fetchPost());
        navigate('/');
    }
    let filterPost = (e) => {
        e.preventDefault();
        dispatch(fetchFilterPost(searchText))
    }

    let fetchAllPost = (e) => {
        //dispatch(fetchPost());
        setSearchText('');
    }

    return (
        <>
            <nav className='navbar navbar-extend-sm navbar-dark bg-dark'>
                <div className='container-fluid'>
                    <img onClick={e => homeRedirect(e)} className="rounded-pill" style={{cursor:'pointer',width:'80px'}} src={logo} alt="logo" />
                    <ul className="navbar-nav custom-navbar-nav">
                        <li className="nav-item custom-nav-item">
                            <Link className='nav-link' onClick={fetchAllPost} to='/'>Home</Link>
                        </li>
                        {
                            (userData?.isAdmin && userData?.isAuth)?(
                                <>
                                    <li className='nav-item custom-nav-item'>
                                        <Link className='nav-link' to='/admin/create-post'>Create Post</Link>
                                    </li>
                                    <li className='nav-item custom-nav-item'>
                                        <Link className='nav-link' to='/admin-logout'>Logout</Link>
                                    </li>
                                </>
                            ) : ''
                        }
                        {
                            (userData?.isUser && userData?.isAuth)? (
                                <>
                                    <li className='nav-item custom-nav-item'>
                                        <Link className='nav-link' to='/admin-logout'>Logout</Link>
                                    </li>
                                </>
                            ):(
                                <>
                                    <li className='nav-item custom-nav-item'>
                                        <Link className='nav-link' to='/user/login'>Login</Link>
                                    </li>
                                </>
                            )   
                        }
                    </ul>
                    <form className="d-flex">
                        <input className="form-control me-2" value={searchText} onChange={event => setSearchText(event.target.value)} type="text" placeholder="Search" />
                        <button className="btn btn-primary" onClick={event => filterPost(event)} type="button">Search</button>
                    </form>
                </div>
            </nav>
            <Routes>
                <Route path='/admin-login' element={<AdminComponent/>} />
                <Route path='/admin-logout' element={<AdminLogoutComponent/>} />
                <Route path='/admin/create-post' element={<CreatePostComponent/>} />
                <Route path='/' element={<PostListComponent/>} />
                <Route path='/user/login' element={<LoginComponent/>} />
                <Route path='/user/register' element={<RegisterComponent/>} />
                <Route path='/gernerateuid' element={<UuidComponent/>} />
                <Route path='/post/:id' element={<PostComponent/>} />
                <Route path='/post/tag/:tag' element={<TagPostComponent/>} />
            </Routes>
        </>
    )
}

export default HeaderComponent
