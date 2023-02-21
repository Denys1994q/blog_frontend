import "./sort-panel.sass";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, posts_getPageNum, posts_getSortBtn } from "../../store/slices/postsSlice";
import Box from "@mui/material/Box";

import SelectPanel from "../select/Select-panel";

// э лоадінгБатон в пошук дати
const SortPanel = () => {
    const dispatch = useDispatch();

    const limitN = useSelector((state: any) => state.postsSlice.limit);
    const activeBtn = useSelector((state: any) => state.postsSlice.sortBtn);
    const searchValue = useSelector((state: any) => state.postsSlice.searchValue);

    const showSortedItems = (type: string) => {
        // записуємо в стор яка кнопка сортування натиснута
        dispatch(posts_getSortBtn(type));
        // після кліку переходимо на 1 сторінку
        dispatch(posts_getPageNum(1));
        // якщо клік по вже вибраній кнопці, скидаємо на початкові налаштування
        if (type === activeBtn) {
            dispatch(posts_getSortBtn("all"));
            dispatch(fetchPosts({ page: 1, limit: limitN, sort: "all", search: searchValue }));
        } else {
            dispatch(fetchPosts({ page: 1, limit: limitN, sort: type, search: searchValue }));
        }
    };

    const activeBtnColor = { background: "#1a1a24", color: "white", borderColor: "#1a1a24", fontSize: "12px" };

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <ButtonGroup color='inherit' variant='outlined' aria-label='outlined primary button group'>
                    <Button
                        onClick={() => showSortedItems("date")}
                        sx={activeBtn === "date" ? activeBtnColor : { fontSize: "12px" }}>
                        New
                    </Button>
                    <Button
                        onClick={() => showSortedItems("views")}
                        sx={activeBtn === "views" ? activeBtnColor : { fontSize: "12px" }}>
                        Most viewed
                    </Button>
                </ButtonGroup>
                <SelectPanel />
            </Box>
        </>
    );
};

export default SortPanel;
