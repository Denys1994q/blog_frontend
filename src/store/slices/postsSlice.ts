import axios from '../../axios'
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

type PostsType = {
    allPosts: null | object[],
    allSearchedPosts: null | object[],
    posts: null | object[],
    page: number,
    searchValue: string,
    limit: null | number,
    filteredPosts: null | object[],
    postsLoading: boolean,
    postsError: boolean,
    tags: [],
    onePost: null | {},
    onePostLoading: boolean,
    onePostError: boolean
}

const initialState: PostsType = {
    allPosts: null,
    allSearchedPosts: null,
    posts: null,
    page: 1,
    searchValue: '',
    // якщо 4 то некоректно
    limit: 5,
    filteredPosts: null,
    postsLoading: false,
    postsError: false,
    tags: [],
    onePost: null,
    onePostLoading: false,
    onePostError: false,
};

// редюсери які мыняють пейдж і ліміт

export const fetchPosts: any = createAsyncThunk("posts/fetchPosts", async ({page, limit, search}: any) => {
    let s;
    if (search) {
        s = await axios.get(`/posts?page=${page}&limit=${limit}&search=${search}`)
    } else {
        s = await axios.get(`/posts?page=${page}&limit=${limit}`)
    }

   const { data }: any = s
    // console.log(data)
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


export const fetchOnePost: any = createAsyncThunk("posts/fetchOnePost", async (id) => {
    const { data } = await axios.get(`/posts/${id}`)
    return data
});

export const fetchRemovePost: any = createAsyncThunk("posts/fetchRemovePost", (id) => {
    axios.delete(`/posts/${id}`)
});

export const fetchSortPost: any = createAsyncThunk("posts/fetchSortPost", async (type) => {
    const { data } = await axios.get(`/posts?sort=${type}`)
    return data
});

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        posts_filter: (state, action) => {
            if (state.allPosts) {
                state.filteredPosts = state.allPosts.filter((post: any) => post.title.toLowerCase().indexOf(action.payload.toLowerCase()) > -1)
            }
        },
        posts_getPageNum: (state, action) => {
            state.page = action.payload
        },
        posts_getValue: (state, action) => {
            state.searchValue = action.payload
        },
        posts_getLimit: (state, action) => {
            state.limit = action.payload
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
            // сортування
            .addCase(fetchSortPost.pending, state => {
                state.postsLoading = true;
                state.postsError = false;
            })
            .addCase(fetchSortPost.fulfilled, (state, action) => {
                state.posts = action.payload;
                state.postsLoading = false;
                state.postsError = false;
            })
            .addCase(fetchSortPost.rejected, state => {
                state.postsError = true;
                state.postsLoading = false;
            })
            // 
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

export const { posts_filter, posts_getPageNum, posts_getValue, posts_getLimit } = actions;