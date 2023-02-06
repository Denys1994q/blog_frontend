import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type DialogComponentProps = {
    open: boolean,
    setOpen: any,
    question: string,
    onYes?: any,
    id?: string 
}

const DialogComponent = ({ open, setOpen, question, onYes, id }: DialogComponentProps): JSX.Element => {
    // const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onYesFunc = () => {
        onYes(id);
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
        </div>
    );
};

export default DialogComponent;
