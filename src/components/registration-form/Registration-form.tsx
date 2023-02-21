import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PersonIcon from "@mui/icons-material/Person";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import { fetchRegister } from "../../store/slices/loginSlice";
import { useDispatch } from "react-redux";
import ModalComponent from "../modal/Modal";
import { useState, useRef } from "react";
import AlertComponent from "../alert/Alert";
import { sassFalse } from "sass";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";

const RegistrationForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const inputFileRef: any = useRef(null);
    const [imageUrl, setImageUrl] = useState("");

    const [openAlert, setOpenAlert] = useState(false);
    const [success, setSuccess] = useState(false);

    const style = {
        width: 400,
        margin: '0 auto',
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
        textAlign: "center",
    };

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
        },
        mode: "onChange",
    });

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

    const onSubmit = async (values: any) => {
        const valueWithImg = {
            ...values,
            avatarUrl: imageUrl,
        };
        const data = await dispatch(fetchRegister(valueWithImg));
        // якщо бек нам повернув data.payload значить все ок
        // за допомогою setError можна прикрутити помилки, які прийшли від бекенду
        console.log(errors);
        if (!data.payload) {
            setOpenAlert(true);
            setSuccess(false);
        }
        if ("token" in data.payload) {
            setOpenAlert(true);
            setSuccess(true);
            setTimeout(() => {
                navigate("/");
            }, 2000);
            window.localStorage.setItem("token", data.payload.token);
        }
    };

    return (
        <Box sx={style}>
            <Typography id='modal-modal-title' variant='h3' component='h2'>
                Create Account
            </Typography>
            <PersonIcon sx={{ fontSize: 100 }} color='primary' />
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box>
                    <TextField
                        {...register("fullName", {
                            required: "Please enter a name",
                            minLength: { value: 5, message: "At least 5 letters" },
                        })}
                        error={Boolean(errors.fullName?.message)}
                        helperText={errors.fullName?.message}
                        id='fullName'
                        fullWidth
                        margin='dense'
                        label='name'
                        variant='outlined'
                        sx={{
                            ".MuiInputLabel-root": { fontSize: "14px" },
                            ".MuiInputBase-input": { fontSize: "14px" },
                            ".MuiFormHelperText-root.Mui-error": { fontSize: "14px" },
                            ".MuiOutlinedInput-root": { fontSize: "14px" },
                            ".Mui-focused": { fontSize: "14px" },
                        }}
                    />
                    <TextField
                        {...register("email", {
                            required: "Please enter an email",
                            pattern: {
                                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: "Please enter a valid email",
                            },
                        })}
                        error={Boolean(errors.email?.message)}
                        helperText={errors.email?.message}
                        id='email'
                        type='email'
                        fullWidth
                        margin='dense'
                        label='email'
                        variant='outlined'
                        sx={{
                            ".MuiInputLabel-root": { fontSize: "14px" },
                            ".MuiInputBase-input": { fontSize: "14px" },
                            ".MuiFormHelperText-root.Mui-error": { fontSize: "14px" },
                            ".MuiOutlinedInput-root": { fontSize: "14px" },
                            ".Mui-focused": { fontSize: "14px" },
                        }}
                    />
                    <TextField
                        {...register("password", {
                            required: "Please enter a password",
                            minLength: { value: 10, message: "At least 10 symbols" },
                        })}
                        error={Boolean(errors.password?.message)}
                        helperText={errors.password?.message}
                        id='password'
                        type='password'
                        margin='dense'
                        label='password'
                        variant='outlined'
                        fullWidth
                        sx={{
                            ".MuiInputLabel-root": { fontSize: "14px" },
                            ".MuiInputBase-input": { fontSize: "14px" },
                            ".MuiFormHelperText-root.Mui-error": { fontSize: "14px" },
                            ".MuiOutlinedInput-root": { fontSize: "14px" },
                            ".Mui-focused": { fontSize: "14px" },
                        }}
                    />
                    <Button
                        onClick={() => inputFileRef?.current.click()}
                        variant='contained'
                        color='primary'
                        fullWidth
                        size='large'
                        sx={{ marginTop: "6px" }}>
                        Upload image
                    </Button>
                    <input ref={inputFileRef} type='file' style={{ display: "none" }} onChange={handleChangeFile} />
                    {imageUrl && (
                        <>
                            <Button
                                variant='contained'
                                color='error'
                                size='large'
                                fullWidth
                                onClick={onClickRemoveImage}
                                sx={{ marginTop: "10px" }}>
                                Delete
                            </Button>
                            <div>
                                <img
                                    style={{ maxWidth: "200px", marginTop: "10px" }}
                                    src={`http://localhost:4444${imageUrl}`}
                                    alt='uploaded photo'
                                />
                            </div>
                        </>
                    )}
                    <Button
                        type='submit'
                        disabled={!isValid}
                        variant='contained'
                        color='primary'
                        size='large'
                        fullWidth
                        sx={{ fontSize: "12px", margin: "10px 0" }}>
                        Register
                    </Button>
                </Box>
            </form>
            <AlertComponent
                setOpenAlert={setOpenAlert}
                openAlert={openAlert}
                success={success}
                errorText={"Registration failed"}
            />
        </Box>
    );
};

export default RegistrationForm;
