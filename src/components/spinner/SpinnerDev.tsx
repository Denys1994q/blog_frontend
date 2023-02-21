import * as React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { green, red } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import CheckIcon from "@mui/icons-material/Check";
import SendIcon from "@mui/icons-material/Send";

type SpinnerDevProps = {
    onClickFunc: any;
    btnText: string;
    emptyData: boolean;
    loading: boolean;
    success: boolean;
};

const SpinnerDev = ({ onClickFunc, btnText, loading, success, emptyData }: SpinnerDevProps) => {
    const timer = React.useRef<number>();

    const buttonSx = {
        fontSize: "14px",
        ...(success && {
            bgcolor: green[500],
            "&:hover": {
                bgcolor: green[700],
            },
        }),
    };

    React.useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    const handleButtonClick = () => {
        onClickFunc();
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            {!emptyData ? (
                <Box sx={{ m: 1, position: "relative" }}>
                    <Fab aria-label='save' color='primary' sx={buttonSx} onClick={handleButtonClick}>
                        {success ? <CheckIcon /> : <SendIcon />}
                    </Fab>
                    {loading && (
                        <CircularProgress
                            size={68}
                            sx={{
                                color: green[500],
                                position: "absolute",
                                top: -6,
                                left: -6,
                                zIndex: 1,
                            }}
                        />
                    )}
                </Box>
            ) : null}
            <Box sx={{ m: 1, position: "relative" }}>
                <Button variant='contained' sx={buttonSx} disabled={loading || emptyData} onClick={handleButtonClick}>
                    {btnText}
                </Button>
                {loading && (
                    <CircularProgress
                        size={24}
                        sx={{
                            color: green[500],
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            marginTop: "-12px",
                            marginLeft: "-12px",
                        }}
                    />
                )}
            </Box>
        </Box>
    );
};

export default SpinnerDev;
