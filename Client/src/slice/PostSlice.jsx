//import React from 'react';
import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL,EXTERNAL_PATH } from '../config/config';

const serverUrl = API_URL;
const exteralPath = EXTERNAL_PATH;

export const fetchPost = createAsyncThunk('post/fetchAllPost', async () => {
    const res = await axios.get(serverUrl+'post/fetchAllPosts');
    return res?.data;
});

export const fetchTagPost = createAsyncThunk('post/fetchTagPost', async (tag) => {
    let postData = {'post_tag' : tag};
    const res = await axios.post(serverUrl+'post/fetchTagPost',postData)
    .then((res) => res?.data)
    .catch(err => console.log(err));
    return res;
});

export const fetchFilterPost = createAsyncThunk('post/fetchFilterPost', async (searchText) => {
    let postData = {'filterValue' : searchText};
    const res = await axios.post(serverUrl+'post/fetchFilterPost',postData)
    .then((res) => res?.data)
    .catch(err => console.log(err));
    return res;
});

export const singlePost = createAsyncThunk('post/getPost', async (postId) => {
    let paramId = {'postId' : postId};
    const res =  await axios.post(serverUrl+'post/fetchPost', paramId)
    .then((res) => res?.data)
    .catch(err => console.log(err));
    return res;
})

export const createPost = createAsyncThunk('post/createPost', async (postCreate) => {
    const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
    const res = await axios.post(serverUrl+'post/createPost',postCreate,config)
    .then((res) => res?.data)
    .catch(err => console.log(err));
    return res;
});

let initialState = {
    posts : [],
    externalUrl: exteralPath
}

let PostSlice = createSlice({
    name: 'post',
    initialState : initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchPost.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.posts = action.payload;
        })
        builder.addCase(fetchPost.pending, (state) => {
            state.status = 'loading';
        })
        builder.addCase(fetchPost.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
        builder.addCase(fetchTagPost.fulfilled, (state, action) => {
            state.state = 'succeeded';
            state.posts = action.payload;
        })
        builder.addCase(fetchTagPost.rejected, (state,action) => {
            state.status = 'failed';
            state.error = action.error.message
        })
        builder.addCase(fetchTagPost.pending, (state) => {
            state.status = 'loading';
        })
        builder.addCase(fetchFilterPost.fulfilled, (state, action) => {
            state.state = 'succeeded';
            state.posts = action.payload;
        })
        builder.addCase(fetchFilterPost.rejected, (state,action) => {
            state.status = 'failed';
            state.error = action.error.message
        })
        builder.addCase(fetchFilterPost.pending, (state) => {
            state.status = 'loading';
        })
        builder.addCase(createPost.fulfilled, (state,action) => {
            state.status = 'succeeded';
            state.posts = action.payload;
        })
        builder.addCase(createPost.rejected, (state,action) => {
            state.status = 'failed';
            state.error = action.error.message
        })
        builder.addCase(createPost.pending, (state) => {
            state.status = 'loading';
        })
        builder.addCase(singlePost.fulfilled, (state,action) => {
            state.status = 'succeeded';
            state.posts = action.payload;
        })
        builder.addCase(singlePost.rejected, (state,action) => {
            state.status = 'failed';
            state.error = action.error.message
        })
        builder.addCase(singlePost.pending, (state) => {
            state.status = 'loading';
        })
    }
});

export const getPostError = state => state.post.error;
export const getPostStatus = state => state.post.status;
export default PostSlice.reducer;
