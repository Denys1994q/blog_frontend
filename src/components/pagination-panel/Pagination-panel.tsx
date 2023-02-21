import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useSelector, useDispatch } from "react-redux";
import { posts_getPageNum } from "../../store/slices/postsSlice";
import { fetchPosts } from "../../store/slices/postsSlice";

const PaginationPanel = () => {
    const dispatch = useDispatch();
    const posts = useSelector((state: any) => state.postsSlice.posts);
    const allPosts = useSelector((state: any) => state.postsSlice.allPosts);
    const allSearchedPosts = useSelector((state: any) => state.postsSlice.allSearchedPosts);
    const limitN = useSelector((state: any) => state.postsSlice.limit);
    const pageN = useSelector((state: any) => state.postsSlice.page);
    const sortBtn = useSelector((state: any) => state.postsSlice.sortBtn);
    const searchValue = useSelector((state: any) => state.postsSlice.searchValue);

    const getPage = (e: any, pageN: any) => {
        dispatch(posts_getPageNum(pageN));
        // тут не треба поділ такий
        // if (searchValue) {
        //     dispatch(fetchPosts({ page: pageN, limit: limitN, search: searchValue }));
        // } else {
        //     dispatch(fetchPosts({ page: pageN, limit: limitN, sort: sortBtn }));
        // }
        dispatch(fetchPosts({ page: pageN, limit: limitN, sort: sortBtn, search: searchValue }));
        // треба якщо пустий інпут прописати
    };

    return (
        <>
            {allPosts ? (
                <Stack spacing={2}>
                    <Pagination
                        count={
                            allSearchedPosts
                                ? Math.ceil(allSearchedPosts.length / limitN)
                                : Math.ceil(allPosts.length / limitN)
                        }
                        onChange={(e, page) => getPage(e, page)}
                        page={pageN}
                        color='primary'
                        sx={{
                            ".MuiPaginationItem-root": { fontSize: "14px" },
                            ".MuiSvgIcon-root": { fontSize: "20px" },
                        }}
                    />
                </Stack>
            ) : null}
        </>
    );
};

export default PaginationPanel;
