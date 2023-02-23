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
                      <>
                          {item.value.length > 0 ? (
                              <li style={{ display: "flex", margin: "5px", }}>
                                  <span
                                      style={{
                                          color: "#008080",
                                          fontSize: "14px",
                                          fontWeight: "bold",
                                          width: "20px",
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          backgroundColor: "#fff59d",
                                          borderRadius: "50%",
                                          marginRight: '5px'
                                      }}>
                                      {item.value}
                                  </span>
                                  {item.name !== "calories" ? "g " : " "}
                                  {item.name}
                              </li>
                          ) : null}
                      </>
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
                    <Paper variant='elevation' sx={{ width: 1, padding: "10px", marginBottom: "20px" }}>
                        <Chip
                            avatar={
                                <Avatar
                                    alt='user photo'
                                    src={
                                        post.user.avatarUrl
                                            ? `${process.env.REACT_APP_API_URL}${post.user.avatarUrl}`
                                            : ""
                                    }
                                />
                            }
                            label={post.user.fullName}
                            sx={{ fontSize: "12px" }}
                            variant='outlined'
                            color='default'
                        />
                        <Typography
                            align='center'
                            // paragraph
                            variant='h3'
                            // noWrap
                            sx={{ margin: "10px 0 20px 0" }}>
                            {post.title}
                        </Typography>
                        <Paper variant='outlined' sx={{ marginBottom: "20px" }}>
                            <ul
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    columnGap: "30px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                {energyInfoContent}
                                {post.cookTime && (
                                    <li>
                                        <span style={{ color: "black", fontSize: "18px", fontWeight: "bold" }}>
                                            {post.cookTime}
                                        </span>
                                        {"m "}
                                        <AccessTimeIcon />
                                    </li>
                                )}
                            </ul>
                        </Paper>
                        <Grid container>
                            <div>
                                {post.imageUrl ? (
                                    <img
                                        style={{
                                            width: "45%",
                                            objectFit: "contain",
                                            float: "left",
                                            margin: "0 20px 20px 0",
                                        }}
                                        src={`${process.env.REACT_APP_API_URL}${post.imageUrl}`}
                                        alt='dish photo'
                                    />
                                ) : null}
                                <p style={{ paddingRight: "10px" }}>
                                    <ReactMarkdown className='markdown' children={post.text} />
                                </p>
                            </div>
                            {post.ingredients.length > 0 && post.ingredients[0] ? (
                                <StackComponent data={post.ingredients} />
                            ) : null}
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
