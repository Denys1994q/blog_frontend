import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { posts_getPageNum, fetchPosts, fetchAllSearchedPosts, posts_getValue } from "../../store/slices/postsSlice";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const SearchPanel = () => {
    const dispatch = useDispatch();
    // const [searchValue, setSearchValue] = useState("");
    const searchValue = useSelector((state: any) => state.postsSlice.searchValue);
    const filteredPosts: any = useSelector((state: any) => state.postsSlice.filteredPosts);
    const limitN = useSelector((state: any) => state.postsSlice.limit);
    const pageN = useSelector((state: any) => state.postsSlice.page);

    // якщо перевищу ліміт, тільки тоді додаткова сторінка створюється

    // якщо видаляю знайдений пост
    const filter = (value: string) => {
        // записуємо значення з інпута в слайс
        dispatch(posts_getValue(value));
        // надсилаємо запит, шукаємо всі дописи за введеним значенням (для пагінації)
        dispatch(fetchAllSearchedPosts(value));
        // надсилаємо запит, відображуємо на сторінці знайдені дописи
        dispatch(fetchPosts({ page: 1, limit: limitN, search: value }));
        // починаємо пагінацію з 1 сторінки
        dispatch(posts_getPageNum(1));
    };

    return (
        <>
            <Box>
                <TextField
                    value={searchValue}
                    onChange={(e: any) => dispatch(posts_getValue(e.target.value))}
                    id='outlined-basic'
                    variant='standard'
                    sx={{
                        marginLeft: "20px",
                        width: "300px",
                        ".MuiInputLabel-root": { fontSize: "18px" },
                        ".MuiInputBase-root": { marginRight: "20px" },
                        ".MuiInputBase-input": { fontSize: "16px" },
                        ".Mui-focused": { fontSize: "18px" },
                    }}
                    color='secondary'
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <SearchIcon
                                    onClick={() => filter(searchValue)}
                                    sx={{ fontSize: "20px", cursor: "pointer" }}
                                />
                            </InputAdornment>
                        ),
                    }}
                />
                {filteredPosts ? (
                    <Typography gutterBottom variant='h5' component='div' sx={{ margin: "10px 0 0 20px" }}>
                        Found: {filteredPosts.length}
                    </Typography>
                ) : null}
            </Box>
        </>
    );
};

export default SearchPanel;
