import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar/Avatar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchRemovePost,
    posts_getIdPostToDel,
    fetchAllSearchedPosts,
    posts_getValue,
    posts_openAlert,
    fetchAllPosts,
    fetchPosts,
    posts_getPageNum,
} from "../../store/slices/postsSlice";
import { blueGrey } from "@mui/material/colors";
import DialogComponent from "../dialog/Dialog";

const CardComponent = (): JSX.Element => {
    const dispatch = useDispatch();
    const posts: any = useSelector((state: any) => state.postsSlice.posts);
    const filteredPosts: any = useSelector((state: any) => state.postsSlice.allSearchedPosts);
    const user: any = useSelector((state: any) => state.loginSlice.userData);
    const [openDialog, setOpenDialog] = React.useState(false);
    const limitN = useSelector((state: any) => state.postsSlice.limit);
    const searchValue = useSelector((state: any) => state.postsSlice.searchValue);
    const pageN = useSelector((state: any) => state.postsSlice.page);
    const idToDel = useSelector((state: any) => state.postsSlice.idPostToDeL);

    const deletePost = (id: string) => {
        console.log(2);
        dispatch(posts_getIdPostToDel(id));
        setOpenDialog(true);
    };

    const onYesDialog = () => {
        // видаляємо пост
        dispatch(fetchRemovePost(idToDel));
        // пагінація: отримуємо всі пости без видаленого
        dispatch(fetchAllPosts({}));

        dispatch(fetchAllSearchedPosts(searchValue));

        // якщо на сторінці один допис і його видаляємо, то переходимо на попередню сторінку
        if (posts.length === 1) {
            dispatch(fetchAllPosts({}));
            dispatch(posts_getPageNum(pageN - 1));
            dispatch(fetchPosts({ page: pageN - 1, limit: limitN, search: "" }));
        }
        dispatch(posts_openAlert(true));
    };

    const getDate = (publishedDate: string) => {
        let newDate = new Date(publishedDate);
        const year = newDate.getFullYear();

        const date = newDate.toDateString().slice(3, 10) + ", " + year;

        return date;
    };

    const content = posts.map((post: any, index: any) => {
        return (
            <Card key={index} sx={{ marginBottom: "50px" }}>
                {post.imageUrl ? (
                    <CardMedia
                        sx={{ height: 240 }}
                        image={`${process.env.REACT_APP_API_URL}${post.imageUrl}`}
                        title='dish picture'
                    />
                ) : null}
                <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Chip
                            avatar={
                                <Avatar
                                    sx={{ bgcolor: "#f5f5f5" }}
                                    alt='user photo'
                                    src={
                                        post.user.avatarUrl
                                            ? `${process.env.REACT_APP_API_URL}${post.user.avatarUrl}`
                                            : ""
                                    }
                                />
                            }
                            label={post.user.fullName}
                            variant='filled'
                            sx={{ fontSize: "14px", marginBottom: "10px", bgcolor: "#212121", color: "white" }}
                        />
                        {user && post.user._id === user._id ? (
                            <Box sx={{ display: "flex" }}>
                                <Link to={`/posts/${post._id}/edit`}>
                                    <Tooltip title='Edit'>
                                        <IconButton>
                                            <EditIcon sx={{ m: 1 }} fontSize='large' />
                                        </IconButton>
                                    </Tooltip>
                                </Link>
                                <Tooltip title='Delete'>
                                    <IconButton onClick={() => deletePost(post._id)}>
                                        <DeleteIcon sx={{ m: 1 }} fontSize='large' />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        ) : null}
                    </Box>
                    <Typography gutterBottom variant='inherit' component='div'>
                        {getDate(post.createdAt)}
                    </Typography>
                    <Link to={`/posts/${post._id}`}>
                        <Typography gutterBottom variant='h3' component='div'>
                            {post.title.slice(0, 50)}
                        </Typography>
                    </Link>
                    <Typography marginBottom='15px' variant='h5' color='text.secondary'>
                        {post.text.slice(0, 300) + "..."}
                    </Typography>
                    <Box sx={{ display: "flex" }}>
                        <Badge
                            badgeContent={post.viewsCount}
                            showZero
                            sx={{
                                marginRight: "20px",
                                ".MuiBadge-badge": { fontSize: "12px", bgcolor: "#123e60", color: "white" },
                            }}>
                            <RemoveRedEyeIcon fontSize='large' color='action' />
                        </Badge>
                        <Badge
                            badgeContent={post.comments.length}
                            showZero
                            sx={{ ".MuiBadge-badge": { fontSize: "12px", bgcolor: "#123e60", color: "white" } }}>
                            <CommentIcon fontSize='large' color='action' />
                        </Badge>
                    </Box>
                </CardContent>
                <DialogComponent
                    open={openDialog}
                    setOpen={setOpenDialog}
                    question={"Are you sure you want to delete this post?"}
                    alertMsg={"Post was succesfully deleted!"}
                    onYes={onYesDialog}
                    id={idToDel}
                />
            </Card>
        );
    });

    return <> {content}</>;
};

export default CardComponent;
