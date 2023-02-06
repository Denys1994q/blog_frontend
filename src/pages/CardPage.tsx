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

const CardPage = (): JSX.Element => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const post = useSelector((state: any) => state.postsSlice.onePost);

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

    return (
        <>
            {post ? (
                <Paper variant='elevation' sx={{ padding: "10px", minHeight: "100vh" }}>
                    <Chip
                        avatar={
                            <Avatar
                                alt='user photo'
                                src={post.user.avatarUrl ? `http://localhost:4444${post.user.avatarUrl}` : ""}
                            />
                        }
                        label={post.user.fullName}
                        variant='outlined'
                        color='default'
                    />
                    <Typography variant='h2' sx={{ textAlign: "center", margin: "0 0 20px 0" }}>
                        {post.title}
                    </Typography>
                    <Paper variant='outlined' sx={{ marginBottom: "20px" }}>
                        <ul style={{ display: "flex", gap: "30px", justifyContent: "center" }}>
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
                    <Box sx={{ display: "flex" }}>
                        <div>
                            {post.imageUrl ? (
                                <img
                                    style={{
                                        width: "350px",
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
                        <StackComponent data={post.ingredients} />
                    </Box>
                </Paper>
            ) : (
                <Spinner />
            )}
        </>
    );
};

export default CardPage;
