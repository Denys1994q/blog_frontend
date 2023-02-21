import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useSelector, useDispatch } from "react-redux";
import { posts_getLimit, posts_getPageNum, fetchPosts } from "../../store/slices/postsSlice";

const SelectPanel = () => {
    const dispatch = useDispatch();
    const limitN = useSelector((state: any) => state.postsSlice.limit);
    const pageN = useSelector((state: any) => state.postsSlice.page);
    const activeBtn = useSelector((state: any) => state.postsSlice.sortBtn);
    const searchValue = useSelector((state: any) => state.postsSlice.searchValue);

    const handleChange = (event: SelectChangeEvent) => {
        dispatch(posts_getLimit(event.target.value));
        dispatch(posts_getPageNum(1));
        
        dispatch(fetchPosts({ page: 1, limit: event.target.value, search: searchValue, sort: activeBtn }));
    };

    return (
        <Box>
            <FormControl size='small'>
                <Select
                    autoWidth
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={limitN}
                    sx={{ fontSize: "12px" }}
                    onChange={handleChange}>
                    <MenuItem value={5} sx={{ fontSize: "12px" }}>
                        5
                    </MenuItem>
                    <MenuItem value={10} sx={{ fontSize: "12px" }}>
                        10
                    </MenuItem>
                    <MenuItem value={20} sx={{ fontSize: "12px" }}>
                        20
                    </MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default SelectPanel;
