import "./styles/App.sass";
import AppBarComponent from "./components/appBar/AppBar";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { useEffect } from "react";
import { fetchAuthMe } from "./store/slices/loginSlice";
import { createTheme, ThemeProvider  } from "@mui/material/styles";

import RegisterPage from "./pages/RegisterPage";
import CardPage from "./pages/CardPage";
import CreatePost from "./pages/Create-post-page";

function App(): JSX.Element {
    const dispatch = useDispatch();

    const theme = createTheme({
        typography: {
            fontFamily: ["Montserrat"].join(","),
        },
    });

    useEffect(() => {
        dispatch(fetchAuthMe());
    }, []);
    return (
        <ThemeProvider theme={theme}>
            <div className='App'>
                <AppBarComponent />
                <div className='mainContainer'>
                    <Routes>
                        <Route path='/' element={<HomePage />} />
                        <Route path='/register' element={<RegisterPage />} />
                        <Route path='/login' element={<LoginPage />} />
                        <Route path='/posts/:id' element={<CardPage />} />
                        <Route path='/posts/:id/edit' element={<CreatePost />} />
                        <Route path='/add-post' element={<CreatePost />} />
                    </Routes>
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;
