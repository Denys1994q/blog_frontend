import Modal from "@mui/material/Modal";

import { ModalComponentProps } from "./Modal.props";

import RegistrationForm from "../registration-form/Registration-form";

const ModalComponent = ({ open, setOpen }: ModalComponentProps): JSX.Element => {
    return (
        <div>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'>
                <RegistrationForm />
            </Modal>
        </div>
    );
};

export default ModalComponent;

// 3.20
