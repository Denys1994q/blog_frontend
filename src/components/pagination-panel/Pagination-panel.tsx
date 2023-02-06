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
    const filteredPosts: any = useSelector((state: any) => state.postsSlice.filteredPosts);
    const limitN = useSelector((state: any) => state.postsSlice.limit);
    const pageN = useSelector((state: any) => state.postsSlice.page);
    const searchValue = useSelector((state: any) => state.postsSlice.searchValue);

    const getPage = (e: any, pageN: any) => {
        dispatch(posts_getPageNum(pageN));
        if (searchValue) {
            dispatch(fetchPosts({ page: pageN, limit: limitN, search: searchValue }));
        } else {
            dispatch(fetchPosts({ page: pageN, limit: limitN }));
        }
    };

    // якщо кількість дописів змінилася, треба перерахувати пагінацію
    

    return (
        <>
            {allPosts ? (
                <Stack spacing={2}>
                    <Pagination
                        count={Math.ceil(
                            allSearchedPosts ? allSearchedPosts.length / limitN : allPosts.length / limitN
                        )}
                        // onClick={() => console.log('kek')}
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
