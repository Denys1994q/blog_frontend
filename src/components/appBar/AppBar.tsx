import { useState } from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login_logout } from "../../store/slices/loginSlice";
import { createTheme } from "@mui/material/styles";

import DialogComponent from "../dialog/Dialog";

// показувати діалогові вікна (успішно зареєстровано і тд)
{
    /* <Paper /> */
}
// кнопка додому на головну
export const AppBarComponent = (): JSX.Element => {
    const dispatch = useDispatch();
    const userData = useSelector((state: any) => state.loginSlice.userData);

    const [openDialog, setOpenDialog] = useState(false);

    const onClickLogout = () => {
        setOpenDialog(true);
    };

    const onYesDialog = () => {
        dispatch(login_logout());
        window.localStorage.removeItem("token");
    };

    const loginBtns = (
        <>
            <Link to='/register'>
                <Button
                    // onClick={() => handleOpen()}
                    variant='outlined'
                    color='inherit'
                    startIcon={<PersonIcon />}
                    sx={{ fontSize: "14px", marginRight: "10px", borderColor: "#2A2B2A", color: "#2A2B2A" }}>
                    Register
                </Button>
            </Link>
            <Link to='/login'>
                <Button
                    variant='outlined'
                    color='inherit'
                    startIcon={<LoginIcon />}
                    sx={{ fontSize: "14px", marginRight: "10px", borderColor: "#2A2B2A", color: "#2A2B2A" }}>
                    Login
                </Button>
            </Link>
        </>
    );

    const logoutBtns = (
        <>
            <Link to='/add-post'>
                <Button
                    // onClick={() => handleOpen()}
                    variant='outlined'
                    color='success'
                    startIcon={<PersonIcon />}
                    sx={{ fontSize: "14px", marginLeft: "auto", marginRight: "10px" }}>
                    Create Post
                </Button>
            </Link>
            <Link to='/'>
                <Button
                    onClick={() => onClickLogout()}
                    variant='contained'
                    color='error'
                    startIcon={<LoginIcon />}
                    sx={{ fontSize: "14px" }}>
                    Logout
                </Button>
            </Link>
        </>
    );

    return (
        <div>
            <Box>
                <AppBar position='sticky' sx={{ backgroundColor: "#FFDED6" }}>
                    <Toolbar>
                        <Link to='/'>
                            <Button
                                variant='outlined'
                                color='inherit'
                                sx={{ fontSize: "14px", borderColor: "#2A2B2A", color: "#2A2B2A" }}>
                                Home
                            </Button>
                        </Link>
                        <Box sx={{ marginLeft: "auto" }}>{userData ? logoutBtns : loginBtns}</Box>
                    </Toolbar>
                </AppBar>
            </Box>
            <DialogComponent
                open={openDialog}
                setOpen={setOpenDialog}
                question={"Are you sure you want to leave?"}
                onYes={onYesDialog}
            />
        </div>
    );
};

export default AppBarComponent;
