import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useSelector, useDispatch } from "react-redux";
import { posts_getPageNum } from "../../store/slices/postsSlice";
import { fetchPosts } from "../../store/slices/postsSlice";

const PaginationPanel = () => {
    const dispatch = useDispatch();
    const allPosts = useSelector((state: any) => state.postsSlice.allPosts);
    const allSearchedPosts = useSelector((state: any) => state.postsSlice.allSearchedPosts);
    const limitN = useSelector((state: any) => state.postsSlice.limit);
    const pageN = useSelector((state: any) => state.postsSlice.page);
    const sortBtn = useSelector((state: any) => state.postsSlice.sortBtn);
    const searchValue = useSelector((state: any) => state.postsSlice.searchValue);

    const getPage = (e: any, pageN: any) => {
        dispatch(posts_getPageNum(pageN));
        dispatch(fetchPosts({ page: pageN, limit: limitN, sort: sortBtn, search: searchValue }));
        window.scrollTo(0, 0);
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
                        sx={{
                            ".MuiPaginationItem-root": {
                                fontSize: "14px",
                                bgcolor: "#123e60",
                                opacity: 0.5,
                                color: "white",
                            },
                            ".MuiPaginationItem-root:hover": {
                                opacity: 1,
                                bgcolor: "#123e60",
                            },
                            ".MuiPaginationItem-root.Mui-selected": { bgcolor: "#123e60", opacity: 1 },
                            ".MuiSvgIcon-root": { fontSize: "20px" },
                            ".MuiPaginationItem-previousNext": { bgcolor: "#e0e0e0", opacity: 0.2, color: "black" },
                        }}
                    />
                </Stack>
            ) : null}
        </>
    );
};

export default PaginationPanel;
