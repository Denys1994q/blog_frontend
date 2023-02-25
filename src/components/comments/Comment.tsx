import { useDispatch } from "react-redux";
import { useState } from "react";
import axios from "../../axios";
import { useEffect } from "react";

import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { indigo } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar/Avatar";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import DialogComponent from "../dialog/Dialog";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Tooltip from "@mui/material/Tooltip";

import { useSelector } from "react-redux";
import { fetchOnePost, posts_openAlert } from "../../store/slices/postsSlice";

import Votes from "../votes/Votes";

type CommentProps = {
    author?: string;
    avatar?: string;
    commentId?: string;
    time?: string;
    postId?: string;
    content?: string;
    create?: boolean;
    liked?: boolean;
    disliked?: boolean;
    commentUserId?: string;
    commentIndex?: any;
};

const Comment = ({
    create,
    postId,
    content,
    avatar,
    time,
    author,
    commentId,
    commentUserId,
    liked,
    disliked,
    commentIndex,
}: CommentProps): JSX.Element => {
    const dispatch = useDispatch();
    const [text, setText] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const user: any = useSelector((state: any) => state.loginSlice.userData);
    const currentPost: any = useSelector((state: any) => state.postsSlice.onePost);

    const sendComment = () => {
        const fields = {
            content: text,
            // votes: { result: "like" },
        };
        axios.post(`/posts/${postId}/comments`, fields).then(() => dispatch(fetchOnePost(postId)));
        setText("");
    };

    const deleteComment = () => {
        setOpenDialog(true);
    };

    const onYesDialog = () => {
        currentPost.comments.length !== 1
            ? axios
                  .delete(`/posts/${postId}/${commentId}/comments`)
                  .then(() => dispatch(fetchOnePost(postId)))
                  .then(() => dispatch(posts_openAlert(true)))
            : axios
                  .delete(`/posts/${postId}/${commentId}/comments`)
                  .then(() => dispatch(posts_openAlert(true)))
                  .then(() => dispatch(fetchOnePost(postId)))
                  .then(() => dispatch(posts_openAlert(false)));
    };

    const getDate = (publishedDate: string) => {
        let newDate = new Date(publishedDate);
        const year = newDate.getFullYear();

        const date = newDate.toDateString().slice(3, 10) + ", " + year;

        return date;
    };

    return (
        <>
            <Grid container direction='row' gap={2} mb={2}>
                <Box>
                    <Avatar
                        sx={{ bgcolor: indigo[500] }}
                        alt='user photo'
                        // src={avatar ? `${process.env.REACT_APP_API_URL}${avatar}` : ""}
                        src={avatar ? `${avatar}` : ""}
                    />
                </Box>
                {create ? (
                    <Box sx={{ width: "85%" }}>
                        <Box>
                            <TextField
                                value={text}
                                onChange={e => setText(e.target.value)}
                                multiline
                                variant='outlined'
                                fullWidth
                                maxRows={4}
                                sx={{
                                    ".MuiInputBase-input": { fontSize: "14px" },
                                }}
                            />
                        </Box>
                        <Button
                            onClick={sendComment}
                            variant='contained'
                            size='large'
                            sx={{ fontSize: "12px", margin: "10px 0", bgcolor: indigo[500] }}>
                            Send
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ width: "85%" }}>
                        <Grid container justifyContent={"space-between"}>
                            <Box>
                                <Typography variant='h6'>{author}</Typography>
                                <Grid container sx={{ marginBottom: "5px" }}>
                                    <AccessTimeIcon sx={{ marginRight: "5px", color: "rgb(0, 128, 128)" }} />
                                    <Typography variant='subtitle1'>{time ? getDate(time) : null}</Typography>
                                </Grid>
                            </Box>
                            {user && user._id && commentUserId === user._id ? (
                                <Box>
                                    <Tooltip title='Delete'>
                                        <IconButton onClick={() => deleteComment()}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            ) : null}
                        </Grid>
                        <Typography sx={{ marginBottom: "10px" }} variant='h5'>
                            {content}
                        </Typography>
                        <Votes
                            liked={liked}
                            disliked={disliked}
                            commentIndex={commentIndex}
                            commentId={commentId}
                            postId={postId}
                        />
                        <DialogComponent
                            open={openDialog}
                            setOpen={setOpenDialog}
                            question={"Are you sure you want to delete this comment?"}
                            alertMsg={"Comment was succesfully deleted!"}
                            onYes={onYesDialog}
                        />
                    </Box>
                )}
            </Grid>
        </>
    );
};

export default Comment;
