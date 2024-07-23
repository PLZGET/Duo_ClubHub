import React from "react";
import './modal_ok.css';

const Modal_ok = ({message, onClose, onConfirm}) => {
    return (
        <div className="Modal_ok">
            <div className="modal_ok_content">
                <p dangerouslySetInnerHTML={{__html: message}}></p>
                <div className="modal_ok_button">
                    <button onClick={() => {onConfirm(); onClose();}} className="ok_button">OK</button>
                </div>
            </div>
        </div>
    );
};

export default Modal_ok;