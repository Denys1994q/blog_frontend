import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import SimpleMDEReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { TextField, Button, Paper } from "@mui/material";
import axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";
import SpinnerDev from "../spinner/SpinnerDev";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts, fetchPosts, posts_getPageNum } from "../../store/slices/postsSlice";

// замість простого алерта показувати снек з помилкою
const Editor = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [text, setText] = useState("");
    const [calories, setCalories] = useState("");
    const [fat, setFat] = useState("");
    const [carbs, setCarbs] = useState("");
    const [protein, setProtein] = useState("");
    const [cookTime, setCookTime] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const inputFileRef: any = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [emptyData, setEmptyData] = useState(true);
    const limitN = useSelector((state: any) => state.postsSlice.limit);

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

    const sendForm = async () => {
        try {
            setIsLoading(true);
            const fields = {
                title: title,
                text: text,
                ingredients: ingredients.length > 0 ? ingredients.split(",") : [],
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
            navigate(`/posts/${_id}`);
        } catch (err) {
            console.log(err);
            alert("Помилка при створенні статті");
        }
    };

    useEffect(() => {
        // ленгс перевіряти відповідно до беку
        if (text && title) {
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
                            style={{ maxWidth: "500px", marginTop: "10px" }}
                            src={`http://localhost:4444${imageUrl}`}
                            alt='uploaded photo'
                        />
                    </div>
                </>
            )}
            <TextField
                value={title}
                onChange={e => setTitle(e.target.value)}
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
            <SpinnerDev onClickFunc={sendForm} btnText={isEditing ? "Save" : "Send"} emptyData={emptyData} />
        </>
    );
};

export default Editor;
