import React from "react";
import './modal_confirm.css';
import { useNavigate } from "react-router-dom";

const Modal_confirm = ({onClose, message, onConfirm}) => {

    return (
        <div className="Modal_confirm">
            <div className="modal_confirm_content">
                <p dangerouslySetInnerHTML={{__html: message}}></p>
                <div className="modal_confirm_buttons">
                    <button onClick={() => {onConfirm(); onClose();}} className="confirm_button">예</button>
                    <button onClick={onClose} className="cancel_button">아니요</button>
                </div>
            </div>
        </div>
    );
};

export default Modal_confirm;