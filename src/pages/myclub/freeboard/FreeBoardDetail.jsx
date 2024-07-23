//내 동아리 자유게시판 - 글 상세
import React, { useState, useEffect } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {FaArrowLeft} from 'react-icons/fa6';
import { FiMoreVertical, FiSend } from "react-icons/fi";
import axios from "axios";
import Modal_post from "../../../components/modal/Modal_post.jsx";
import Modal_comment from "../../../components/modal/Modal_comment.jsx";
axios.defaults.withCredentials = true;

function formatDate(dateString) {
    const date = new Date(dateString);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${month}/${day}`;
}

function FreeBoardDetail() {
    let {clubId, postId} = useParams();
    const navigate = useNavigate();
    const [memberId, setMemberId] = useState(null);

    const [showPostModal, setShowPostModal] = useState(false);  // 글 수정or삭제 모달창 띄우기
    const [showCommentModal, setShowCommentModal] = useState(false);  // 댓글 수정or삭제 모달창 띄우기
    const [modalPosition, setModalPosition] = useState({ top: '0px', left: '0px' }); // 모달창 위치 설정

    const [post, setPost] = useState('');
    const [attachmentNames, setAttachmentNames] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState(''); //댓글 입력

    //댓글 수정 상태 변수
    const [selectedCommentContent, setSelectedCommentContent] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentContent, setEditedCommentContent] = useState('');

    const apiClient = axios.create({
        baseURL: 'https://zmffjq.store', // API URL
        timeout: 10000, // 요청 타임아웃 설정 (10초)
        headers: {
            'Content-Type': 'application/json',
        },
    });

    //-------------------------------------------------------------------------
    const fetchUserId = async () => {
        try {
            const response = await apiClient.get("/getUserId", {
                withCredentials: true // Include this if the endpoint requires credentials
            });
            console.log(response.data);
            setMemberId(response.data.message); // memberId 상태 업데이트
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Unauthorized access. Please log in.');
            } else {
                console.error('유저 아이디를 불러오는 중 에러 발생:', error);
                alert('유저 아이디를 불러오는 중 에러가 발생했습니다.');
            }
        }
    };

    const handleBackClick = () => {
        navigate(`/clubs/${clubId}/freeboardlist`);
    };

    const handlePostDotClick = () => {
        setShowPostModal(true);
    };

    //댓글 더보기 아이콘 클릭 -> 수정 or 삭제 모달
    const handleCommentDotClick = (e, commentId, content) => {
        // 모달 위치 설정: 클릭한 위치 + 10px 여백
        setModalPosition({
            top: e.clientY + 3 + 'px'
        });
        setShowCommentModal(true);
        setEditingCommentId(commentId);
        setSelectedCommentContent(content);  // 선택된 댓글 내용 저장
    };

    const closeModal = () => {
        setShowPostModal(false);
        setShowCommentModal(false);
    }

    const handleEditClick = () => { //글 수정
        navigate(`/clubs/${clubId}/board/4/posts/${postId}/edit`);
    };

    //게시글, 댓글 API 조회-----------------------------------------------------------------------------
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await apiClient.get(`/clubs/${clubId}/board/4/posts/${postId}`);
                setPost(response.data.post);
                setAttachmentNames(response.data.attachmentNames || []);
            } catch (error) {
                console.error('게시글 조회 에러 발생:', error);
                if (error.response) {
                    console.error('게시글 조회 실패', error.response.status);
                }
            }
        };
        fetchPost();
        fetchComments();
        fetchUserId();
    }, [clubId, postId]);

    const fetchComments = async () => {
        try {
            const response = await apiClient.get(`/posts/${postId}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error('댓글 조회 에러 발생:', error);
            if (error.response) {
                console.error('댓글 조회 실패', error.response.status);
            }
        }
    };

    //댓글 POST
    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim() && memberId) { // memberId가 존재하는지 확인
            try {
                const response = await apiClient.post(`/posts/${postId}/comments`, {
                    memberId: memberId,
                    content: newComment
                });
                if (response.data.message === '성공') {
                    //댓글 추가 성공 후 전체 댓글 목록 다시 불러옴
                    await fetchComments();
                    setNewComment('');
                }
            } catch (error) {
                console.error('댓글 작성 중 에러 발생', error);
                alert('댓글 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    };

    //댓글 수정 상태 관리 함수
    const handleCommentEdit = () => {
        setEditedCommentContent(selectedCommentContent);  // 선택된 댓글 내용으로 수정
        setShowCommentModal(false);
    };

    //수정 내용 저장하는 함수
    const handleSaveEditedComment = async () => {
        if (editingCommentId && editedCommentContent.trim() && memberId) {
            try {
                const response = await apiClient.put(`/posts/${postId}/${editingCommentId}`, {
                    content: editedCommentContent
                });
                if (response.status === 200) {
                    // 상태 업데이트: 기존 댓글 목록에서 수정된 댓글 내용 업데이트
                    setComments(prevComments =>
                        prevComments.map(comment =>
                            comment.commentId === editingCommentId ? { ...comment, content: editedCommentContent } : comment
                        )
                    );
                    // 수정 상태 초기화
                    setEditingCommentId(null);
                    setEditedCommentContent('');
                } else {
                    console.error("댓글 수정 실패", response.status);
                }
            } catch (error) {
                console.error('댓글 수정 중 에러 발생', error);
                alert('댓글 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    };

    const handleDeleteComment = (commentId) => {
        setComments(prevComments => prevComments.filter(comment => comment.commentId !== commentId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCommentId) {
            handleSaveEditedComment();
        } else {
            handleCommentSubmit(e);
        }
    };

    return (
        <div>
            <div className="header_container">
                <FaArrowLeft
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{fontSize: '20px', fontWeight: "bold"}}>자유게시판</div>
                <FiMoreVertical
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handlePostDotClick}
                />
            </div>
            {post && (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        marginTop: "30px",
                        marginLeft: "20px",
                        marginRight: "10px"
                    }}
                >
                    <p
                        style={{
                            fontSize: "16.6px",
                            color: "gray",
                            fontWeight: "bold",
                            marginBottom: "5px"
                        }}
                    >{post.member.name} | {formatDate(post.createdAt)}</p>
                    <p
                        style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            paddingBottom: "12px",
                            textAlign: "start",
                            width: "100%"
                        }}
                    >{post.title}</p>
                    <p
                        style={{
                            fontSize: "17.8px",
                            marginTop: "10px",
                            textAlign: "start"
                        }}
                    >{post.content}</p>
                    <div className="image-container">
                        {attachmentNames.length > 0 ? (
                            attachmentNames.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`첨부 이미지 ${index + 1}`}
                                    onError={(e) => {
                                        console.error(`이미지 로딩 오류 ${index}:`, e);
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ))
                        ) : (
                            <p></p>
                        )}
                    </div>
                </div>
            )}
            <div style={{borderBottom: '1.5px solid dimgrey', marginTop: '10px'}}></div>
            <div className="comment-container">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.commentId} className="comment-oneline">
                            <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                <p style={{fontSize: '16.5px', color: 'gray', marginLeft: "30px", marginBottom: "2px"}}>
                                    {comment.memberName} | {formatDate(comment.createdAt)}
                                </p>
                                <FiMoreVertical
                                    style={{fontSize: '20px', cursor: 'pointer', marginRight: '20px'}}
                                    onClick={(e) => handleCommentDotClick(e, comment.commentId, comment.content)}
                                />
                            </div>
                            <p style={{
                                fontSize: '17px',
                                marginLeft: "30px",
                                marginBottom: "12px"
                            }}>{comment.content}</p>
                            <div style={{borderBottom: '1px solid gray', width: '100%'}}></div>
                        </div>
                    ))
                ) : (
                    <p style={{fontSize: '18px'}}>댓글이 없습니다.</p>
                )}
            </div>
            <form onSubmit={handleSubmit} style={{marginTop: '15px', display: 'flex', alignItems: 'center'}}>
                <div className="submit-comment-container">
                    <input
                        type="text"
                        value={editingCommentId ? editedCommentContent : newComment}
                        onChange={(e) => editingCommentId ? setEditedCommentContent(e.target.value) : handleCommentChange(e)}
                        placeholder="댓글을 입력하세요."
                    />
                    <button type="submit">
                        <FiSend style={{textAlign: "center", fontSize: "27px"}}/>
                    </button>
                </div>
            </form>
            {showPostModal && <Modal_post onClose={closeModal} onEdit={handleEditClick}/>}
            {showCommentModal && <Modal_comment
                onClose={closeModal}
                position={modalPosition}
                onEdit={handleCommentEdit}
                postId={postId}
                commentId={editingCommentId}
                onDelete={handleDeleteComment}
                content={selectedCommentContent}
            />}
        </div>
    );
}

export default FreeBoardDetail;