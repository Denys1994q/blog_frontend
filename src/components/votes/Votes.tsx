import Grid from "@mui/material/Grid";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import Badge from "@mui/material/Badge";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "../../axios";
import { useEffect } from "react";
import { fetchOnePost } from "../../store/slices/postsSlice";

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: "#37474f",
    },
    [`& .${tooltipClasses.tooltip}`]: {
        fontSize: "12px",
        backgroundColor: "#37474f",
    },
}));

type VotesProps = {
    liked: boolean | undefined;
    disliked: boolean | undefined;
    commentIndex: number;
    commentId: string | undefined;
    postId: string | undefined;
};

const Votes = ({ liked, disliked, commentIndex, commentId, postId }: VotesProps): JSX.Element => {
    const dispatch = useDispatch();
    const [allUsers, setAllUsers] = useState<any>(null);
    const user: any = useSelector((state: any) => state.loginSlice.userData);
    const currentPost: any = useSelector((state: any) => state.postsSlice.onePost);

    const addVoteToComment = (voteStr: string) => {
        const votesArr = currentPost.comments[commentIndex].votes;
        const userId = user._id;

        if (votesArr.length > 0) {
            if (votesArr.findIndex((item: any) => item.user === userId) !== -1) {
                const vote = {
                    result: voteStr,
                    user: user._id,
                };
                const data: any = {
                    commentId: commentId,
                    userId: user._id,
                    vote,
                };
                axios.patch("/comments/update", data).then(() => dispatch(fetchOnePost({ id: postId })));
            } else {
                const vote = {
                    result: voteStr,
                    user: user._id,
                };
                const data: any = {
                    commentId: commentId,
                    userId: user._id,
                    vote,
                };
                axios.post("/comments/addVote", data).then(() => dispatch(fetchOnePost({ id: postId })));
            }
        } else {
            const vote = {
                result: voteStr,
                user: user._id,
            };
            const data: any = {
                commentId: commentId,
                userId: user._id,
                vote,
            };
            axios.post("/comments/addVote", data).then(() => dispatch(fetchOnePost({ id: postId })));
        }
    };

    const getLikes = () => {
        const votesArr = currentPost.comments[commentIndex].votes;
        let likes: number = 0;
        votesArr.map((vote: any) => {
            if (vote.result === "like") {
                likes++;
            }
        });
        return likes;
    };

    const getDislikes = () => {
        const votesArr = currentPost.comments[commentIndex].votes;
        let dislikes: number = 0;
        votesArr.map((vote: any) => {
            if (vote.result === "dislike") {
                dislikes++;
            }
        });
        return dislikes;
    };

    const removeVote = () => {
        const userId = user._id;
        axios.delete(`/comments/${commentId}/${userId}/removeVote`).then(() => dispatch(fetchOnePost({id: postId})));
    };

    const usersWhoLiked = (str: string) => {
        let userWithLikes: any = [];
        if (currentPost.comments[commentIndex] && currentPost.comments[commentIndex].votes) {
            currentPost.comments[commentIndex].votes.map((vote: any) => {
                if (vote.result === str) {
                    userWithLikes.push(vote.user);
                }
            });
        }
        let usersNamesArr: object[] = [];
        if (allUsers && allUsers.length > 0) {
            userWithLikes.map((it: any) => {
                allUsers.map((user: any) => {
                    if (user._id === it) {
                        usersNamesArr.push(user);
                    }
                });
            });
        }
        const modUsersNames = usersNamesArr.slice(0, 10);
        return modUsersNames.map((item: any, index: number) => {
            if (index === modUsersNames.length - 1 && index >= 10 && index !== 0) {
                return item.fullName + "...";
            } else if (
                (index === 0 && modUsersNames.length === 1) ||
                (modUsersNames.length <= 10 && index === modUsersNames.length - 1)
            ) {
                return item.fullName;
            }
            return item.fullName + ", ";
        });
    };

    useEffect(() => {
        axios.get("/auth/users").then(data => setAllUsers(data.data.users));
    }, []);

    return (
        <>
            <Grid container>
                <Badge
                    badgeContent={getLikes()}
                    color='success'
                    sx={{
                        marginRight: "30px",
                        ".MuiBadge-badge": { fontSize: "10px", right: -10, top: 13 },
                    }}>
                    <>
                        {liked ? (
                            <BootstrapTooltip title={allUsers ? usersWhoLiked("like") : null} placement='bottom-start'>
                                <ThumbUpIcon
                                    onClick={() => removeVote()}
                                    fontSize='large'
                                    color='success'
                                    sx={{ cursor: "pointer" }}
                                />
                            </BootstrapTooltip>
                        ) : currentPost.comments[commentIndex].votes.findIndex((it: any) => it.result === "like") >=
                          0 ? (
                            <BootstrapTooltip title={allUsers ? usersWhoLiked("like") : null} placement='bottom-start'>
                                <ThumbUpAltOutlinedIcon
                                    onClick={() => addVoteToComment("like")}
                                    fontSize='large'
                                    color='success'
                                    sx={{ cursor: "pointer" }}
                                />
                            </BootstrapTooltip>
                        ) : (
                            <ThumbUpAltOutlinedIcon
                                onClick={() => addVoteToComment("like")}
                                fontSize='large'
                                color='success'
                                sx={{ cursor: "pointer" }}
                            />
                        )}
                    </>
                </Badge>

                <Badge
                    badgeContent={getDislikes()}
                    color='error'
                    sx={{
                        ".MuiBadge-badge": { fontSize: "10px", right: -10, top: 13 },
                    }}>
                    {disliked ? (
                        <BootstrapTooltip title={allUsers ? usersWhoLiked("dislike") : null} placement='bottom-start'>
                            <ThumbDownIcon
                                onClick={() => removeVote()}
                                fontSize='large'
                                color='error'
                                sx={{ cursor: "pointer" }}
                            />
                        </BootstrapTooltip>
                    ) : currentPost.comments[commentIndex].votes.findIndex((it: any) => it.result === "dislike") >=
                      0 ? (
                        <BootstrapTooltip title={allUsers ? usersWhoLiked("dislike") : null} placement='bottom-start'>
                            <ThumbDownOutlinedIcon
                                onClick={() => addVoteToComment("dislike")}
                                fontSize='large'
                                color='error'
                                sx={{ cursor: "pointer" }}
                            />
                        </BootstrapTooltip>
                    ) : (
                        <ThumbDownOutlinedIcon
                            onClick={() => addVoteToComment("dislike")}
                            fontSize='large'
                            color='error'
                            sx={{ cursor: "pointer" }}
                        />
                    )}
                </Badge>
            </Grid>
        </>
    );
};

export default Votes;
