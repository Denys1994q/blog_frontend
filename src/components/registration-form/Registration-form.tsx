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
import { useState } from "react";

const RegistrationForm = () => {
    const dispatch = useDispatch();

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

    // закривати модалку і кидати на головну
    const onSubmit = async (values: any) => {
        const data = await dispatch(fetchRegister(values));
        // якщо бек нам повернув data.payload значить все ок
        // за допомогою setError можна прикрутити помилки, які прийшли від бекенду
        if (!data.payload) {
            alert("Registration failed");
        }
        if ("token" in data.payload) {
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
                        {...register("fullName", { required: "Type name" })}
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
                            ".Mui-focused": { fontSize: "14px" },
                        }}
                    />
                    <TextField
                        {...register("email", { required: "Type email" })}
                        error={Boolean(errors.email?.message)}
                        helperText={errors.email?.message}
                        id='email'
                        fullWidth
                        margin='dense'
                        label='email'
                        variant='outlined'
                        sx={{
                            ".MuiInputLabel-root": { fontSize: "14px" },
                            ".MuiInputBase-input": { fontSize: "14px" },
                            ".Mui-focused": { fontSize: "14px" },
                        }}
                    />
                    <TextField
                        {...register("password", { required: "Type password" })}
                        error={Boolean(errors.password?.message)}
                        helperText={errors.password?.message}
                        id='password'
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
        </Box>
    );
};

export default RegistrationForm;
