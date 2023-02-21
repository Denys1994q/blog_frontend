import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { posts_getPageNum, fetchPosts, posts_getValue, fetchAllSearchedPosts } from "../../store/slices/postsSlice";
import { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { indigo } from "@mui/material/colors";

const SearchPanel = () => {
    const dispatch = useDispatch();
    const searchValue = useSelector((state: any) => state.postsSlice.searchValue);
    const allSearchedPosts: any = useSelector((state: any) => state.postsSlice.allSearchedPosts);
    const limitN = useSelector((state: any) => state.postsSlice.limit);
    const pageN = useSelector((state: any) => state.postsSlice.page);
    const sortBtn = useSelector((state: any) => state.postsSlice.sortBtn);

    const filter = (value: string) => {
        // записуємо значення з інпута в слайс
        dispatch(posts_getValue(value));
        // надсилаємо запит, шукаємо всі дописи за введеним значенням (для пагінації)
        dispatch(fetchAllSearchedPosts(value));
        // надсилаємо запит, відображуємо на сторінці знайдені дописи
        dispatch(fetchPosts({ page: 1, limit: limitN, sort: sortBtn, search: value }));
        // починаємо пагінацію з 1 сторінки
        dispatch(posts_getPageNum(1));
    };

    useEffect(() => {
        filter(searchValue);
    }, [searchValue]);

    return (
        <>
            <Box ml={{ lg: 5, xs: 1 }}>
                <TextField
                    value={searchValue}
                    onChange={(e: any) => dispatch(posts_getValue(e.target.value))}
                    id='outlined-basic'
                    variant='standard'
                    sx={{
                        input: { border: "red" },
                        ".MuiInputLabel-root": { fontSize: "18px" },
                        ".MuiInput-root:before": { borderBottom: "1px solid #b0bec5" },
                        ".MuiInput-root:hover:before": {
                            borderBottom: "2px solid #212121",
                        },
                        ".MuiInput-root:after": {
                            borderBottom: "2px solid #212121",
                        },
                        ".MuiInputBase-input": { fontSize: "16px" },
                        ".Mui-focused": { fontSize: "18px" },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment
                                position='start'
                                sx={{
                                    width: "30px",
                                    height: "30px",
                                    justifyContent: "center",
                                    maxHeight: "3em",
                                    bgcolor: "#212121",
                                    color: "white",
                                }}>
                                <SearchIcon sx={{ fontSize: "20px", cursor: "pointer" }} />
                            </InputAdornment>
                        ),
                    }}
                />
                {allSearchedPosts ? (
                    <Typography gutterBottom variant='inherit' component='div' sx={{ margin: "10px 0 0 0" }}>
                        Found: <span style={{ borderBottom: "1px solid black" }}>{allSearchedPosts.length}</span>
                    </Typography>
                ) : null}
            </Box>
        </>
    );
};

export default SearchPanel;
