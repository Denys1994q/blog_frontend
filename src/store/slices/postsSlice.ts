import axios from '../../axios'
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

type PostsType = {
    allPosts: null | object[],
    allSearchedPosts: null | object[],
    posts: null | object[],
    page: number,
    searchValue: string,
    limit: null | number,
    postsLoading: boolean,
    postsError: boolean,
    onePost: null | {},
    onePostLoading: boolean,
    onePostError: boolean,
    idPostToDeL: null | string,
    sortBtn: null | string
    openAlert: boolean
}

// видаляє наступний 
const initialState: PostsType = {
    // всі дописи, які є в базі даних (по них розробляється пагінація)
    allPosts: null,
    allSearchedPosts: null,
    // пости, які показуються на сторінці з урахуванням пагінації 
    posts: null,
    postsLoading: false,
    postsError: false,
    // пагінація, номер сторінки і ліміт
    page: 1,
    limit: 5,
    searchValue: '',
    onePost: null,
    onePostLoading: false,
    onePostError: false,
    // id допису, який видалити 
    idPostToDeL: null,
    sortBtn: 'all',
    openAlert: false
};

export const fetchPosts: any = createAsyncThunk("posts/fetchPosts", async ({page, limit, sort, search}: any) => {
   const { data }: any = await axios.get(`/posts?page=${page}&limit=${limit}&sort=${sort}&search=${search}`)
    return data
});

export const fetchAllPosts: any = createAsyncThunk("posts/fetchAllPosts", async () => {
    const { data }: any = await axios.get(`/posts`)
    return data
});

export const fetchAllSearchedPosts: any = createAsyncThunk("posts/fetchAllSearchedPosts", async (search) => {
    const { data }: any = await axios.get(`/posts?search=${search}`)
    return data
});


export const fetchOnePost: any = createAsyncThunk("posts/fetchOnePost", async ({id, views}: any) => {
    const { data }: any = await axios.get(`/posts/${id}?views=${views}`)
    return data
});

export const fetchRemovePost: any = createAsyncThunk("posts/fetchRemovePost", (id) => {
    axios.delete(`/posts/${id}`)
});

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        posts_getPageNum: (state, action) => {
            state.page = action.payload
        },
        posts_getValue: (state, action) => {
            state.searchValue = action.payload
        },
        posts_getLimit: (state, action) => {
            state.limit = action.payload
        },
        posts_getIdPostToDel: (state, action) => {
            state.idPostToDeL = action.payload
        },
        posts_getSortBtn: (state, action) => {
            state.sortBtn = action.payload
        },
        posts_openAlert: (state, action) => {
            state.openAlert = action.payload
        }
    },
    extraReducers: builder => {
        builder 
            .addCase(fetchPosts.pending, state => {
                state.postsLoading = true;
                state.postsError = false;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.posts = action.payload;
                state.postsLoading = false;
                state.postsError = false;
            })
            .addCase(fetchPosts.rejected, state => {
                state.postsError = true;
                state.postsLoading = false;
            })
            .addCase(fetchOnePost.pending, state => {
                state.onePostLoading = true;
                state.onePostError = false;
            })
            .addCase(fetchOnePost.fulfilled, (state, action) => {
                state.onePost = action.payload;
                state.onePostLoading = false;
                state.onePostError = false;
            })
            .addCase(fetchOnePost.rejected, state => {
                state.onePostError = true;
                state.onePostLoading = false;
            })
            // видалення статті
            .addCase(fetchRemovePost.pending, (state, action) => {
                if (state.posts) {
                    state.posts = state.posts.filter((post: any) => post._id !== action.meta.arg)
                }
            })
            .addCase(fetchAllPosts.fulfilled, (state,action) => {
                state.allPosts = action.payload;
            })
            //            
            .addCase(fetchAllSearchedPosts.fulfilled, (state,action) => {
                state.allSearchedPosts = action.payload;
            })
        }
});

const { actions, reducer } = postsSlice;

export default reducer;

export const { posts_getPageNum, posts_getValue, posts_getLimit, posts_getIdPostToDel, posts_getSortBtn, posts_openAlert } = actions;