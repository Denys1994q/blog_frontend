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
import HomeIcon from "@mui/icons-material/Home";

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
                    variant='outlined'
                    color='inherit'
                    startIcon={<PersonIcon />}
                    sx={{
                        fontSize: "14px",
                        marginRight: "10px",
                        padding: "5px 12px",
                        borderColor: "#2A2B2A",
                        color: "#2A2B2A",
                    }}>
                    Register
                </Button>
            </Link>
            <Link to='/login'>
                <Button
                    variant='outlined'
                    color='inherit'
                    startIcon={<LoginIcon />}
                    sx={{
                        fontSize: "14px",
                        marginRight: "10px",
                        padding: "5px 12px",
                        borderColor: "#2A2B2A",
                        color: "#2A2B2A",
                    }}>
                    Login
                </Button>
            </Link>
        </>
    );

    const logoutBtns = (
        <>
            <Link to='/add-post'>
                <Button
                    variant='outlined'
                    color='success'
                    startIcon={<PersonIcon />}
                    sx={{ fontSize: "14px", padding: "5px 12px", marginLeft: "auto", marginRight: "10px" }}>
                    Create Post
                </Button>
            </Link>
            <Link to='/'>
                <Button
                    onClick={() => onClickLogout()}
                    variant='contained'
                    color='error'
                    startIcon={<LoginIcon />}
                    sx={{ minWidth: "60px", fontSize: "14px", padding: "5px 5px" }}></Button>
            </Link>
            {userData ? (
                <img
                    style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        marginLeft: "10px",
                    }}
                    src={
                        userData.avatarUrl
                            ? `http://localhost:4444${userData.avatarUrl}`
                            : `http://localhost:4444/uploads/user.png`
                    }
                    alt='user-photo'
                />
            ) : null}
        </>
    );

    return (
        <div>
            <Box>
                <AppBar position='sticky' sx={{ backgroundColor: "#FFDED6" }}>
                    <Toolbar sx={{ padding: "0 4px" }}>
                        <Link to='/'>
                            <Button
                                variant='outlined'
                                color='inherit'
                                sx={{
                                    fontSize: "14px",
                                    minWidth: "30px",
                                    padding: "5px",
                                    borderColor: "#2A2B2A",
                                    color: "#2A2B2A",
                                }}>
                                <HomeIcon sx={{ padding: "0", fontSize: "20px", cursor: "pointer" }} />
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