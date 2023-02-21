import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { posts_openAlert } from "../../store/slices/postsSlice";
import { useSelector, useDispatch } from "react-redux";

type DialogComponentProps = {
    open: boolean;
    alertMsg?: string;
    setOpen: any;
    question: string;
    onYes?: any;
    id?: string;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props: any, ref: any) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const DialogComponent = ({ open, alertMsg, setOpen, question, onYes }: DialogComponentProps): JSX.Element => {
    const dispatch = useDispatch();
    const openAlert: any = useSelector((state: any) => state.postsSlice.openAlert);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        dispatch(posts_openAlert(false));
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onYesFunc = () => {
        onYes();
        setOpen(false);
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'>
                <DialogTitle id='alert-dialog-title' sx={{ fontSize: "16px" }}>
                    {question}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ fontSize: "14px" }}>
                        No
                    </Button>
                    <Button onClick={onYesFunc} sx={{ fontSize: "14px" }} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            {alertMsg ? (
                <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                    <Alert onClose={handleCloseAlert} severity='success' sx={{ width: "100%", fontSize: "14px" }}>
                        {alertMsg}
                    </Alert>
                </Snackbar>
            ) : null}
        </div>
    );
};

export default DialogComponent;
