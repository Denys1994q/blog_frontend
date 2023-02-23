import * as React from "react";
import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import SimpleMDEReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { TextField, Button, Paper } from "@mui/material";
import axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";
import SpinnerDev from "../spinner/SpinnerDev";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchAllPosts, posts_getPageNum } from "../../store/slices/postsSlice";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props: any, ref: any) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const Editor = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState<any>("");
    const [text, setText] = useState("");
    const [calories, setCalories] = useState("");
    const [fat, setFat] = useState("");
    const [carbs, setCarbs] = useState("");
    const [protein, setProtein] = useState("");
    const [cookTime, setCookTime] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const inputFileRef: any = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [emptyData, setEmptyData] = useState(true);
    const limitN = useSelector((state: any) => state.postsSlice.limit);
    const [openAlert, setOpenAlert] = useState(false);

    const isEditing = Boolean(id);

    useEffect(() => {
        if (id) {
            axios.get(`/posts/${id}`).then(({ data }) => {
                setTitle(data.title);
                setText(data.text);
                setIngredients(data.ingredients);
                setCalories(data.energy[0].value);
                setFat(data.energy[1].value);
                setCarbs(data.energy[3].value);
                setProtein(data.energy[2].value);
                setCookTime(data.cookTime);
                setImageUrl(data.imageUrl);
            });
        }
    }, []);

    const onChange = useCallback((value: string) => {
        setText(value);
    }, []);

    const autofocusNoSpellcheckerOptions = useMemo(() => {
        return {
            spellChecker: false,
        } as any;
    }, []);

    const s = () => {
        setIsLoading(false);
        setSuccess(true);
    };

    const sendForm = async () => {
        setIsLoading(true);
        try {
            const fields = {
                title: title,
                text: text,
                ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split(","),
                energy: [
                    { name: "calories", value: calories },
                    { name: "fat", value: fat },
                    { name: "protein", value: protein },
                    { name: "carbs", value: carbs },
                ],
                cookTime: cookTime,
                imageUrl: imageUrl,
            };
            // якщо редагування, то патч запит, якщо нова стаття створення - то пост
            const { data } = isEditing ? await axios.patch(`/posts/${id}`, fields) : await axios.post("/posts", fields);
            // надсилаємо на сервер і відразу беремо отримані дані назад на клієнт. Потрібно витягнути айді, щоб відразу користувач перейшов на сторінку статті
            const _id = isEditing ? id : data._id;

            if (data) {
                setSuccess(true);
                setIsLoading(false);
                setOpenAlert(true);
                setTimeout(() => {
                    navigate(`/posts/${_id}`);
                }, 5000);
            } else {
                setSuccess(false);
            }

            dispatch(fetchAllPosts({}));
            dispatch(posts_getPageNum(1));
            dispatch(fetchPosts({ page: 1, limit: limitN }));
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            setOpenAlert(true);
        }
    };

    useEffect(() => {
        // ленгс перевіряти відповідно до беку
        if (text && title.length >= 10) {
            setEmptyData(false);
        } else {
            setEmptyData(true);
        }
    }, [title, text]);

    const handleChangeFile = async (e: any) => {
        try {
            const formData = new FormData();
            formData.append("image", e.target.files[0]);
            const { data } = await axios.post("/uploads", formData);
            setImageUrl(data.url);
        } catch (err) {
            console.warn(err);
            alert("Error");
        }
    };

    const onClickRemoveImage = () => {
        setImageUrl("");
    };

    const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenAlert(false);
    };

    return (
        <>
            <Button onClick={() => inputFileRef?.current.click()} variant='outlined' color='primary' size='large'>
                Upload image
            </Button>
            <input ref={inputFileRef} type='file' style={{ display: "none" }} onChange={handleChangeFile} />
            {imageUrl && (
                <>
                    <Button
                        variant='contained'
                        color='error'
                        size='large'
                        onClick={onClickRemoveImage}
                        sx={{ marginLeft: "20px" }}>
                        Delete
                    </Button>
                    <div>
                        <img
                            style={{ maxWidth: "300px", marginTop: "10px" }}
                            src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
                            alt='uploaded photo'
                        />
                    </div>
                </>
            )}
            <TextField
                value={title}
                onChange={e => setTitle(e.target.value)}
                helperText='at least 10 characters'
                label='Title'
                autoFocus
                fullWidth
                variant='filled'
                margin='normal'
                sx={{
                    ".MuiInputLabel-root": { fontSize: "18px" },
                    ".MuiInputBase-input": { fontSize: "18px", fontWeight: "bold" },
                    ".Mui-focused": { fontSize: "18px" },
                }}
            />
            <TextField
                value={ingredients}
                onChange={e => setIngredients(e.target.value)}
                label='Ingredients'
                helperText='separate ingredients with commas'
                fullWidth
                variant='filled'
                margin='dense'
                sx={{
                    ".MuiInputLabel-root": { fontSize: "18px" },
                    ".MuiInputBase-input": { fontSize: "18px" },
                    ".Mui-focused": { fontSize: "18px" },
                }}
            />
            <Box sx={{ dispay: "flex", gap: "30px" }}>
                <TextField
                    value={calories}
                    onChange={e => setCalories(e.target.value)}
                    label='Calories'
                    variant='outlined'
                    margin='dense'
                    type='number'
                    sx={{
                        ".MuiInputLabel-root": { fontSize: "18px" },
                        ".MuiInputBase-root": { marginRight: "20px" },
                        ".MuiInputBase-input": { fontSize: "18px", width: "100px" },
                        ".Mui-focused": { fontSize: "18px" },
                    }}
                />
                <TextField
                    value={fat}
                    onChange={e => setFat(e.target.value)}
                    label='Fat'
                    helperText='gram'
                    variant='outlined'
                    margin='dense'
                    type='number'
                    sx={{
                        ".MuiInputLabel-root": { fontSize: "18px" },
                        ".MuiInputBase-root": { marginRight: "20px" },
                        ".MuiInputBase-input": { fontSize: "18px", width: "100px" },
                        ".Mui-focused": { fontSize: "18px" },
                    }}
                />
                <TextField
                    value={carbs}
                    onChange={e => setCarbs(e.target.value)}
                    label='Carbs'
                    helperText='gram'
                    variant='outlined'
                    margin='dense'
                    type='number'
                    sx={{
                        ".MuiInputLabel-root": { fontSize: "18px" },
                        ".MuiInputBase-root": { marginRight: "20px" },
                        ".MuiInputBase-input": { fontSize: "18px", width: "100px" },
                        ".Mui-focused": { fontSize: "18px" },
                    }}
                />
                <TextField
                    value={protein}
                    onChange={e => setProtein(e.target.value)}
                    label='Protein'
                    helperText='gram'
                    variant='outlined'
                    margin='dense'
                    type='number'
                    sx={{
                        ".MuiInputLabel-root": { fontSize: "18px" },
                        ".MuiInputBase-root": { marginRight: "20px" },
                        ".MuiInputBase-input": { fontSize: "18px", width: "100px" },
                        ".Mui-focused": { fontSize: "18px" },
                    }}
                />
                <TextField
                    value={cookTime}
                    onChange={e => setCookTime(e.target.value)}
                    label='Cook time'
                    helperText='minutes'
                    variant='standard'
                    margin='dense'
                    type='number'
                    sx={{
                        ".MuiInputLabel-root": { fontSize: "18px" },
                        ".MuiInputBase-root": { marginRight: "20px" },
                        ".MuiInputBase-input": { fontSize: "18px", width: "100px" },
                        ".Mui-focused": { fontSize: "18px" },
                    }}
                />
            </Box>
            <SimpleMDEReact value={text} onChange={onChange} options={autofocusNoSpellcheckerOptions} />
            <SpinnerDev
                onClickFunc={sendForm}
                btnText={isEditing ? "Save" : "Send"}
                emptyData={emptyData}
                loading={isLoading}
                success={success}
            />
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert
                    onClose={handleCloseAlert}
                    severity={success ? "success" : "error"}
                    sx={{ width: "100%", fontSize: "14px" }}>
                    {success ? "Success, redirect to the Post page in 5 seconds..." : "Error"}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Editor;
