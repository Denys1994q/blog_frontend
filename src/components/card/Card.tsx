import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
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
    fetchAllPosts,
    fetchAllSearchedPosts,
    posts_getValue,
    fetchPosts,
    posts_getPageNum,
} from "../../store/slices/postsSlice";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Spinner from "../spinner/Spinner";
import DialogComponent from "../dialog/Dialog";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props: any, ref: any) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const CardComponent = (): JSX.Element => {
    const dispatch = useDispatch();
    const posts: any = useSelector((state: any) => state.postsSlice.posts);
    const filteredPosts: any = useSelector((state: any) => state.postsSlice.filteredPosts);
    const user: any = useSelector((state: any) => state.loginSlice.userData);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const limitN = useSelector((state: any) => state.postsSlice.limit);
    const searchValue = useSelector((state: any) => state.postsSlice.searchValue);

    const deletePost = () => {
        setOpenDialog(true);
    };

    // якщо немає нічого в сьорчі, все ок
    // видалив, надіслав новий запит з новою кількістю дописів, показав їх без видаленого
    const onYesDialog = (id: any) => {
        dispatch(fetchRemovePost(id));
        setOpenAlert(true);
        // пагінація: отримуємо всі пости без видаленого
        dispatch(fetchAllPosts({}));
        // після видалення допису пагінація починається з 1 сторінки
        dispatch(posts_getPageNum(1));
        // пагінація: отримуємо всі знайдені пости без видаленого
        // dispatch(fetchAllSearchedPosts(searchValue));
        // відображаємо знайдені пости
        dispatch(fetchPosts({ page: 1, limit: limitN }));
        // очищуємо інпут
        dispatch(posts_getValue(""));
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenAlert(false);
    };

    const content =
        posts && posts.length > 0 ? (
            (filteredPosts && filteredPosts.length > 0 ? filteredPosts : posts).map((post: any) => {
                return (
                    <Card sx={{ width: 645, marginBottom: "50px" }}>
                        {post.imageUrl ? (
                            <CardMedia
                                sx={{ height: 240 }}
                                image={`http://localhost:4444${post.imageUrl}`}
                                title='dish picture'
                            />
                        ) : null}
                        <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Chip
                                    avatar={
                                        <Avatar
                                            alt='user photo'
                                            src={
                                                post.user.avatarUrl ? `http://localhost:4444${post.user.avatarUrl}` : ""
                                            }
                                        />
                                    }
                                    label={post.user.fullName}
                                    variant='outlined'
                                    color='default'
                                    sx={{ fontSize: "10px", marginBottom: "10px" }}
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
                                            <IconButton onClick={() => deletePost()}>
                                                <DeleteIcon sx={{ m: 1 }} fontSize='large' />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                ) : null}
                            </Box>
                            <Typography gutterBottom variant='body1' component='div'>
                                {post.createdAt}
                            </Typography>
                            <Link to={`/posts/${post._id}`}>
                                <Typography gutterBottom variant='h3' component='div'>
                                    {post.title}
                                </Typography>
                            </Link>
                            <Typography marginBottom='15px' variant='h5' color='text.secondary'>
                                {post.text.slice(0, 300) + "..."}
                            </Typography>
                            <Box sx={{ display: "flex" }}>
                                <Badge
                                    badgeContent={post.viewsCount}
                                    color='primary'
                                    showZero
                                    sx={{ marginRight: "20px" }}>
                                    <RemoveRedEyeIcon fontSize='large' color='action' />
                                </Badge>
                                <Badge badgeContent={0} color='primary' showZero>
                                    <CommentIcon fontSize='large' color='action' />
                                </Badge>
                            </Box>
                        </CardContent>
                        <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity='success' sx={{ width: "100%", fontSize: "14px" }}>
                                Post was succesfully deleted!
                            </Alert>
                        </Snackbar>
                        <DialogComponent
                            open={openDialog}
                            setOpen={setOpenDialog}
                            question={"Are you sure you want to delete this post?"}
                            onYes={onYesDialog}
                            id={post._id}
                        />
                    </Card>
                );
            })
        ) : (
            <Box sx={{ width: 645, margin: "20px 0" }}>
                <Typography color='error' variant='h4' component='div'>
                    Nothing found
                </Typography>
            </Box>
        );

    return <> {posts ? content : <Spinner />}</>;
};

export default CardComponent;
