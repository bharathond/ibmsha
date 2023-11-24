import { configureStore } from '@reduxjs/toolkit';
import PostSlice from '../slice/PostSlice';
import UserSlice from '../slice/UserSlice';

const store = configureStore({
    reducer : {
        post: PostSlice,
        user: UserSlice
    }
});

export default store;