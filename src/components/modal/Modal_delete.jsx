import React from "react";
import './modal_delete.css'

function Modal_delete({ onClose, onConfirm }) {
    return (
        <div className="Modal_delete">
            <div className="modal_delete_content">
                <p>댓글을 삭제하시겠습니까?</p>
                <div className="modal_delete_buttons">
                    <button onClick={onConfirm} className="confirm_button">네</button>
                    <button onClick={onClose} className="cancel_button">아니오</button>
                </div>
            </div>
        </div>
    );
}

export default Modal_delete;