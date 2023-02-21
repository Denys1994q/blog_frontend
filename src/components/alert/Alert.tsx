import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

type AlertComponentProps = {
    openAlert: boolean;
    success: boolean;
    setOpenAlert: any;
    errorText: string
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props: any, ref: any) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const AlertComponent = ({ openAlert, success, setOpenAlert, errorText }: AlertComponentProps): JSX.Element => {
    const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenAlert(false);
    };

    return (
        <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
            <Alert
                onClose={handleCloseAlert}
                severity={success ? "success" : "error"}
                sx={{ width: "100%", fontSize: "14px" }}>
                {success ? "Success" : errorText}
            </Alert>
        </Snackbar>
    );
};

export default AlertComponent;
