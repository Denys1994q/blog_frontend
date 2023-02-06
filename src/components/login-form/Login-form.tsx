import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoginIcon from "@mui/icons-material/Login";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../store/slices/loginSlice";
import { Navigate } from "react-router-dom";

import axios from "../../axios";

const LoginForm = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state: any) => state.loginSlice.userData);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onChange",
    });

    const onSubmit = async (values: any) => {
        const data = await dispatch(fetchUserData(values));
        if (!data.payload) {
            alert("Authorization failed");
        }

        if ("token" in data.payload) {
            window.localStorage.setItem("token", data.payload.token);
        } 
    };

    useEffect(() => {
        axios.get("/posts").then(data => console.log(data));
    }, []);

    if (userData) {
        return <Navigate to='/' />;
    }

    const style = {
        position: "absolute" as "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
        textAlign: "center",
    };

    return (
        <>
            <Box sx={style}>
                <Typography id='modal-modal-title' variant='h3' component='h2'>
                    Login to the account
                </Typography>
                <LoginIcon sx={{ fontSize: 50 }} color='secondary' />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box>
                        <TextField
                            {...register("email", { required: "Вкажіть пошту" })}
                            error={Boolean(errors.email?.message)}
                            helperText={errors.email?.message}
                            id='email'
                            type='email'
                            fullWidth
                            margin='dense'
                            label='email'
                            focused
                            variant='outlined'
                            sx={{
                                ".MuiInputLabel-root": { fontSize: "14px" },
                                ".MuiInputBase-input": { fontSize: "14px" },
                                ".Mui-focused": { fontSize: "14px" },
                            }}
                        />
                        <TextField
                            {...register("password", { required: "Вкажіть пароль" })}
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
                                ".Mui-focused": { fontSize: "14px" },
                            }}
                        />
                        <Button
                            type='submit'
                            variant='contained'
                            color='secondary'
                            size='large'
                            fullWidth
                            sx={{ fontSize: "12px", margin: "10px 0" }}>
                            Login
                        </Button>
                    </Box>
                </form>
            </Box>
        </>
    );
};

export default LoginForm;
