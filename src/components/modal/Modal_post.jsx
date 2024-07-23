import React, {useCallback, useState} from "react";
import './modal_post.css';
import Modal_confirm from "./Modal_confirm.jsx";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

const Modal_post = ({onClose, onEdit}) => {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [modalMessage, setModalMessage] = useState("");   // 모달창에 띄울 메세지 전달
    const [showDeleteModal, setShowDeleteModal] = useState(false);  // 네/아니오 모달창 띄우기
    const [onConfirm, setOnConfirm] = useState(() => () => {});

    const apiClient = axios.create({
        baseURL: 'http://3.36.56.20:8080', // API URL
        timeout: 10000, // 요청 타임아웃 설정 (10초)
        headers: {
            'Content-Type': 'application/json',
        },
    });

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

    const handleEdit = () => {
        onEdit();
        onClose();
    };

    const handleDelete = async () => {
        try {
            await apiClient.delete(`https://zmffjq.store/posts/${postId}`);
            navigate(-1);
        } catch (error) {
            console.error('게시글 삭제 중 에러 발생:', error);
            alert('게시글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
            // if (currentUserId === postAuthorId) {
            //     try {
            //         await axios.delete(`https://zmffjq.store/posts/${postId}`);
            //         navigate(-1);
            //     } catch (error) {
            //         console.error('게시글 삭제 중 에러 발생:', error);
            //         alert('게시글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
            //     }
            // } else {
            //     alert('자신이 작성한 게시글만 삭제할 수 있습니다.');
            // }
        }
    };

    return (
        <div className="Modal_post" onClick={handleOverlayClick}>
            <div className="modal_post_content" onClick={(e) => e.stopPropagation()}>
                <button className="post_delete" onClick={() => handleOpenModal("글을 삭제하시겠습니까?", handleDelete)}>글 삭제하기</button>
                <button onClick={handleEdit}>글 수정하기</button>
            </div>
            {showDeleteModal && <Modal_confirm onClose={handleCloseModal} message={modalMessage} onConfirm={onConfirm} />}
        </div>
    );
};

export default Modal_post;