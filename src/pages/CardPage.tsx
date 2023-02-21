import { useParams } from "react-router-dom";
import { fetchOnePost } from "../store/slices/postsSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ReactMarkdown from "react-markdown";
import Spinner from "../components/spinner/Spinner";
import StackComponent from "../components/stack/Stack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar/Avatar";
import Comment from "../components/comments/Comment";
import Grid from "@mui/material/Grid";

const CardPage = (): JSX.Element => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const post = useSelector((state: any) => state.postsSlice.onePost);
    const user: any = useSelector((state: any) => state.loginSlice.userData);

    useEffect(() => {
        dispatch(fetchOnePost(id));
    }, []);

    const energyInfoContent =
        post && post.energy
            ? post.energy.map((item: any) => {
                  return (
                      <li>
                          <span style={{ color: "#008080", fontSize: "18px", fontWeight: "bold" }}>{item.value}</span>
                          {item.name !== "calories" ? "g " : " "}
                          {item.name}
                      </li>
                  );
              })
            : null;

    const showComments =
        post && post.comments.length > 0 ? (
            post.comments.map((comment: any, index: any) => {
                let liked = false;
                let disliked = false;

                // якщо айді юзера є в списку, то міняти йому.
                comment.votes.map((vote: any, index: any) => {
                    if (user && user._id) {
                        // && лайк
                        if (vote.user === user._id && vote.result === "like") {
                            disliked = false;
                            liked = true;
                        } else if (vote.user === user._id && vote.result === "dislike") {
                            liked = false;
                            disliked = true;
                        } else {
                            liked = false;
                            disliked = false;
                        }
                    }
                });
                return (
                    <li>
                        <Comment
                            author={comment.user.fullName}
                            avatar={comment.user.avatarUrl}
                            content={comment.content}
                            time={comment.createdAt}
                            commentId={comment._id}
                            commentIndex={index}
                            commentUserId={comment.user._id}
                            postId={id}
                            liked={liked ? true : false}
                            disliked={disliked ? true : false}
                        />
                    </li>
                );
            })
        ) : (
            <Typography variant='h6' mb={2}>
                No comments yet
            </Typography>
        );

    return (
        <>
            {post ? (
                <>
                    <Paper variant='elevation' sx={{ padding: "10px", marginBottom: "20px" }}>
                        <Chip
                            avatar={
                                <Avatar
                                    alt='user photo'
                                    src={post.user.avatarUrl ? `http://localhost:4444${post.user.avatarUrl}` : ""}
                                />
                            }
                            label={post.user.fullName}
                            sx={{ fontSize: "12px" }}
                            variant='outlined'
                            color='default'
                        />
                        <Typography variant='h2' sx={{ textAlign: "center", margin: "10px 0 20px 0" }}>
                            {post.title}
                        </Typography>
                        <Paper variant='outlined' sx={{ marginBottom: "20px" }}>
                            <ul
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    columnGap: "30px",
                                    justifyContent: "center",
                                }}>
                                {energyInfoContent}
                                <li>
                                    <span style={{ color: "black", fontSize: "18px", fontWeight: "bold" }}>
                                        {post.cookTime}
                                    </span>
                                    {"m "}
                                    <AccessTimeIcon />
                                </li>
                            </ul>
                        </Paper>
                        <Grid container>
                            <div>
                                {post.imageUrl ? (
                                    <img
                                        style={{
                                            width: "35%",
                                            objectFit: "contain",
                                            float: "left",
                                            margin: "0 20px 20px 0",
                                        }}
                                        src={`http://localhost:4444${post.imageUrl}`}
                                        alt='dish photo'
                                    />
                                ) : null}
                                <p style={{ paddingRight: "10px" }}>
                                    <ReactMarkdown className='markdown' children={post.text} />
                                </p>
                            </div>

                            {post.ingredients.length > 0 ? <StackComponent data={post.ingredients} /> : null}
                        </Grid>
                    </Paper>
                    <Paper sx={{ padding: "10px" }}>
                        <Typography marginBottom='20px' variant='h5'>
                            Comments
                        </Typography>
                        <ul>{showComments}</ul>
                        {user ? (
                            <Comment
                                create={true}
                                postId={id}
                                avatar={user && user.avatarUrl ? user.avatarUrl : null}
                            />
                        ) : (
                            <Typography marginTop='20px' variant='h5' sx={{ fontWeight: "bold" }}>
                                Please log in for posting comments
                            </Typography>
                        )}
                    </Paper>
                </>
            ) : (
                <Spinner />
            )}
        </>
    );
};

export default CardPage;
