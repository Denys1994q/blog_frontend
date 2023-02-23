import CardComponent from "../components/card/Card";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchAllPosts } from "../store/slices/postsSlice";
import { useEffect } from "react";
import SearchPanel from "../components/search-panel/Search-panel";
import SortPanel from "../components/sort-panel/Sort-panel";
import PaginationPanel from "../components/pagination-panel/Pagination-panel";
import Spinner from "../components/spinner/Spinner";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

const HomePage = () => {
    const dispatch = useDispatch();
    const limitN = useSelector((state: any) => state.postsSlice.limit);
    const sortBtn = useSelector((state: any) => state.postsSlice.sortBtn);
    const posts: any = useSelector((state: any) => state.postsSlice.posts);
    const allSearchedPosts: any = useSelector((state: any) => state.postsSlice.allSearchedPosts);

    useEffect(() => {
        dispatch(fetchAllPosts());
        dispatch(fetchPosts({ page: 1, limit: limitN, sort: sortBtn, search: "" }));
    }, []);

    return (
        <>
            <Grid container spacing={2} paddingLeft={2}>
                {(posts && posts.length > 0) || allSearchedPosts ? (
                    <>
                        <Grid container spacing={2}>
                            <Grid item lg={8} md={8} sm={8} xs={12} order={{ lg: 1, md: 1, sm: 1, xs: 2 }}>
                                <SortPanel />
                                <Box>
                                    <CardComponent />
                                </Box>
                            </Grid>
                            <Grid item lg={4} md={4} sm={4} order={{ lg: 2, md: 2, sm: 2, xs: 1 }}>
                                <SearchPanel />
                            </Grid>
                        </Grid>
                        <PaginationPanel />
                    </>
                ) : posts && posts.length === 0 ? (
                    <h4>No posts yet</h4>
                ) : (
                    <Spinner />
                )}
            </Grid>
        </>
    );
};

export default HomePage;
