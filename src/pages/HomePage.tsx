import CardComponent from "../components/card/Card";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts, fetchPosts } from "../store/slices/postsSlice";
import { useEffect } from "react";
import SearchPanel from "../components/search-panel/Search-panel";
import SortPanel from "../components/sort-panel/Sort-panel";
import PaginationPanel from "../components/pagination-panel/Pagination-panel";

// треба окремо всі пости, які тільки можуть бути з бази, щоб на основі їх кількості зробити пагінацію
// сортування не так працює тепер
// треба видаляти не так, виходить, що видаляє зі списку posts, а пагінація залишаэться для allPosts, просто запит знову робити на всі пости
// тоді не треба окремо filteredPosts взагалі
// по ходу не треба всі пости тоді
const HomePage = () => {
    const dispatch = useDispatch();
    const limitN = useSelector((state: any) => state.postsSlice.limit);

    useEffect(() => {
        dispatch(fetchAllPosts());
        dispatch(fetchPosts({ page: 1, limit: limitN }));
    }, []);

    return (
        <>
            <div style={{ display: "flex" }}>
                <div>
                    <SortPanel />
                    <CardComponent />
                </div>
                <SearchPanel />
            </div>
            <PaginationPanel />
        </>
    );
};

export default HomePage;
