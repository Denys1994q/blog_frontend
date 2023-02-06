import "./sort-panel.sass";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useDispatch } from "react-redux";
import { fetchSortPost, fetchPosts } from "../../store/slices/postsSlice";
import { useState } from "react";
import Box from "@mui/material/Box";

import SelectPanel from "../select/Select-panel";

// э лоадінгБатон в пошук дати
const SortPanel = () => {
    const dispatch = useDispatch();
    const [activeBtn, setActiveBtn] = useState("");

    const showSortedItems = (type: string) => {
        if (type === "date") {
            setActiveBtn("date");
            dispatch(fetchSortPost("date"));
            if (activeBtn === "date") {
                setActiveBtn("");
                dispatch(fetchPosts());
            }
        } else if (type === "views") {
            setActiveBtn("views");
            dispatch(fetchSortPost("views"));
            if (activeBtn === "views") {
                setActiveBtn("");
                dispatch(fetchPosts());
            }
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
