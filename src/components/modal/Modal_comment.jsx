import React, {useCallback, useState} from "react";
import './modal_comment.css';
import {useNavigate} from "react-router-dom";
import Modal_confirm from "./Modal_confirm.jsx";
import axios from "axios";

const Modal_comment = ({ onClose, onEdit, position, postId, commentId, onDelete, content }) => {
    const [modalMessage, setModalMessage] = useState("");   // 모달창에 띄울 메세지 전달
    const [showDeleteModal, setShowDeleteModal] = useState(false);  // 네/아니오 모달창 띄우기
    const [onConfirm, setOnConfirm] = useState(() => () => {});

    const handleOpenModal = useCallback((message, confirmCallback) => {
        setModalMessage(message);
        setOnConfirm(() => confirmCallback);
        setShowDeleteModal(true);
    }, []);

    const handleCloseModal = () => setShowDeleteModal(false);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`https://zmffjq.store/posts/${postId}/${commentId}`);
            onDelete(commentId);
            onClose();
        } catch (error) {
            console.error('댓글 삭제 중 에러 발생:', error);
            alert('댓글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const handleEdit = () => {
        onEdit();
        onClose();
    };

    return (
        <div className="Modal_comment" onClick={handleOverlayClick}>
            <div
                className="modal_comment_content"
                style={{ top: position.top }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className="comment_delete" onClick={() => handleOpenModal("댓글을 삭제하시겠습니까?", handleDelete)}>댓글 삭제하기</button>
                <button onClick={handleEdit}>댓글 수정하기</button>
            </div>
            {showDeleteModal && <Modal_confirm onClose={handleCloseModal} message={modalMessage} onConfirm={onConfirm} />}
        </div>
    );
};

export default Modal_comment;