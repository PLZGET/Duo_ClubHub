import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./community_styles/post_detail.css";
import '../../styles/App.css';
import { FaArrowLeft } from "react-icons/fa6";
import Modal_delete from '../../components/modal/Modal_delete.jsx';
import axios from "axios";

// SVG 아이콘 컴포넌트
const UploadIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V13.17L15.58 16.75L16.75 15.58L13 11.83V5H11V11.83L7.42 15.42L8.58 16.58L12 13.17V5H12ZM4 18H20V20H4V18ZM20 2H4C2.9 2 2 2.9 2 4V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
    </svg>
);

function WriteModal({ onClose, onEdit, onDelete }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <p style={{ marginBottom: '0px', padding: '3px' }}></p>
                    <hr style={{ marginLeft: '-20px', width: '120%' }}/>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-5px' }}>
                        <button onClick={onEdit} style={{ padding: '3px', borderRight: '1px solid #ccc', height: '50px' }}>수정</button>
                        <button onClick={onDelete} style={{ padding: '5px' }}>삭제</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PostDetail() {
    const { postId } = useParams();
    const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
    const [showWriteModal, setShowWriteModal] = useState(false);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [deleteCommentId, setDeleteCommentId] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedContent, setEditedContent] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentContent, setEditedCommentContent] = useState("");
    const [editedImages, setEditedImages] = useState([]);
    const [memberId, setMemberId] = useState(null);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const axiosInstance = axios.create({
        withCredentials: true
    });

    const handleFileChange = (e) => {
        setEditedImages([...e.target.files]);
    };

    const uploadFileToS3 = async (file) => {
        try {
            const filename = encodeURIComponent(file.name);
            const response = await fetch(`https://zmffjq.store/presigned-url?filename=${filename}`);
            if (!response.ok) {
                throw new Error('Failed to get presigned URL');
            }
            const presignedUrl = await response.text();

            const uploadResponse = await fetch(presignedUrl, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file
            });

            if (uploadResponse.ok) {
                return presignedUrl.split('?')[0]; // 업로드된 파일의 URL 반환
            } else {
                throw new Error('S3 upload failed with status: ' + uploadResponse.status);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };

    const fetchUserId = async () => {
        try {
            const response = await axiosInstance.get("https://zmffjq.store/getUserId", {
                withCredentials: true
            });
            setMemberId(response.data.message);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Unauthorized access. Please log in.');
            } else {
                console.error('유저 아이디를 불러오는 중 에러 발생:', error);
                alert('유저 아이디를 불러오는 중 에러가 발생했습니다.');
            }
        }
    };

    useEffect(() => {
        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchPostAndComments = async () => {
            try {
                const response = await axiosInstance.get(`https://zmffjq.store/board/1/posts/${postId}`);
                const { post } = response.data;

                const attachmentNames = post.attachment_names || [];

                setPost({
                    ...response.data.post,
                    attachmentNames: response.data.attachmentNames
                });

                setEditedTitle(post.title);
                setEditedContent(post.content);

                const commentsResponse = await axiosInstance.get(`https://zmffjq.store/posts/${postId}/comments`);
                setComments(commentsResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchPostAndComments();
    }, [postId]);

    const handleEdit = () => {
        setIsEditing(true);
        setShowWriteModal(false);
    };

    const handleSaveEdit = async () => {
        try {
            const uploadPromises = editedImages.map(file => uploadFileToS3(file));
            const fileUrls = await Promise.all(uploadPromises);

            await axiosInstance.put(`https://zmffjq.store/posts/${postId}`, {
                title: editedTitle,
                content: editedContent,
                attachment_names: fileUrls,
            });

            setPost(prevPost => ({
                ...prevPost,
                title: editedTitle,
                content: editedContent,
                attachmentNames: fileUrls,
            }));

            setIsEditing(false);
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleBack = () => {
        navigate('/community');
    };

    const handleDeleteCommentModalOpen = (commentId) => {
        setDeleteCommentId(commentId);
        setShowDeleteCommentModal(true);
    };

    const handleDeleteCommentModalClose = () => {
        setDeleteCommentId(null);
        setShowDeleteCommentModal(false);
    };

    const handleDeleteCommentConfirm = async () => {
        if (deleteCommentId) {
            try {
                await axiosInstance.delete(`https://zmffjq.store/posts/${postId}/${deleteCommentId}`);
                setComments(comments.filter(comment => comment.commentId !== deleteCommentId));
                handleDeleteCommentModalClose();
            } catch (error) {
                console.error("Error deleting comment:", error);
            }
        }
    };

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (newComment.trim() === "") return;

        try {
            const response = await axiosInstance.post(`https://zmffjq.store/posts/${postId}/comments`, {
                memberId: memberId,
                content: newComment
            });
            setComments([...comments, response.data]);
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleEditComment = (commentId, content) => {
        setEditingCommentId(commentId);
        setEditedCommentContent(content);
    };

    const handleSaveCommentEdit = async (commentId) => {
        try {
            await axiosInstance.put(`https://zmffjq.store/posts/${postId}/${commentId}`, {
                content: editedCommentContent
            });
            setComments(comments.map(comment =>
                comment.commentId === commentId
                    ? { ...comment, content: editedCommentContent }
                    : comment
            ));
            setEditingCommentId(null);
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    };

    const handleWriteModalOpen = () => {
        setShowWriteModal(true);
    };

    const handleWriteModalClose = () => {
        setShowWriteModal(false);
    };

    const handleDeletePost = async () => {
        try {
            await axiosInstance.delete(`https://zmffjq.store/posts/${postId}`);
            navigate('/community');
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    if (isEditing) {
        return (
            <div className="post-edit">
                <header className="edit-header">
                    <span onClick={handleCancelEdit} className="edit-cancel">X</span>
                    <h2 className="edit-title">글 수정하기</h2>
                    <span onClick={handleSaveEdit} className="edit-save">✓</span>
                </header>
                <hr style={{ marginTop: '-30px' }}/>
                <div className="edit-form">
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        style={{ fontWeight: 'bold', fontSize: '18px', width: '100%', marginBottom: '10px', padding: '5px' }}
                    />
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        style={{ fontSize: '16px', width: '100%', height: '200px', padding: '5px' }}
                    />
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: 'none' }}  // 숨깁니다.
                        ref={fileInputRef}
                    />
                    <div className="new-images">
                        {editedImages && Array.from(editedImages).map((file, index) => (
                            <img
                                key={index}
                                src={URL.createObjectURL(file)}
                                alt={`New attachment ${index + 1}`}
                                style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '5px' }}
                            />
                        ))}
                    </div>
                    <button onClick={handleFileInputClick} style={{ cursor: 'pointer', marginTop: '10px' }}>
                        <UploadIcon />
                        <p style={{ marginLeft: '-100px', marginTop:'-25px'}}>이미지 업로드</p>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="post-detail">
            <div className="header">
                <FaArrowLeft
                    style={{ fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer', marginLeft: '15px' }}
                    onClick={handleBack}/>
                <p>게시물 내용</p>
                <button style={{ fontWeight: 'bold', fontSize: '20px', textAlign: 'right' }} onClick={handleWriteModalOpen}>:
                </button>
                {showWriteModal && (
                    <WriteModal
                        onClose={handleWriteModalClose}
                        onEdit={handleEdit}
                        onDelete={handleDeletePost}
                    />
                )}
            </div>
            <hr style={{marginTop: '-30px'}}/>
            <div className="post-content">
                <p style={{textAlign: 'left', marginLeft: '20px', marginTop: '40px', fontSize: '18px', color: 'gray'}}>
                    {post && post.member && post.member.name} | {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <h3 style={{
                    textAlign: 'left',
                    fontSize: '20px',
                    marginLeft: '20px',
                    marginBottom: '40px',
                    marginTop:'10px',
                    fontWeight: 'bold'
                }}>{post.title}</h3>
                <p style={{textAlign: 'left', marginLeft: '20px'}}>{post.content}</p>
                <div className="post-photos" style={{marginLeft: '0px', marginTop: '20px'}}>
                    {post.attachmentNames && post.attachmentNames.length > 0 ? (
                        post.attachmentNames.map((fileName, index) => {
                            const isImage = /\.(jpg|jpeg|png|gif)$/i.test(fileName);

                            return isImage ? (
                                <img
                                    key={index}
                                    src={fileName}
                                    alt={`Post photo ${index + 1}`}
                                    style={{width: '390px', maxWidth: '400px', height: 'auto', marginBottom: '20px'}}
                                    onError={(e) => {
                                        console.error(`이미지 로딩 오류 ${index}:`, e);
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <p key={index}>첨부된 파일: {fileName}</p>
                            )
                        })
                    ) : (
                        <p>첨부된 파일이 없습니다.</p>
                    )}
                </div>
            </div>
            <hr/>
            <div className="comments-section">
                {comments.map((comment) => (
                    <div key={comment.commentId} className="comment" style={{textAlign: 'left', marginLeft: '20px'}}>
                        <p style={{
                            color: 'gray',
                            fontWeight: 'bold'
                        }}>{comment.memberName} | {new Date(comment.createdAt).toLocaleDateString()}</p>
                        {editingCommentId === comment.commentId ? (
                            <div>
                                <input
                                    type="text"
                                    value={editedCommentContent}
                                    onChange={(e) => setEditedCommentContent(e.target.value)}
                                    style={{marginRight: '10px'}}
                                />
                                <button onClick={() => handleSaveCommentEdit(comment.commentId)}>저장</button>
                            </div>
                        ) : (
                            <p>{comment.content}</p>
                        )}
                        <div style={{display: "flex", marginTop: '10px'}}>
                            {editingCommentId !== comment.commentId && (
                                <>
                                    <button className="modify-button" style={{textAlign: 'right', marginRight: '20px'}}
                                            onClick={() => handleEditComment(comment.commentId, comment.content)}>수정
                                    </button>
                                    <button className="delete-button" style={{textAlign: 'right'}}
                                            onClick={() => handleDeleteCommentModalOpen(comment.commentId)}>🗑️
                                    </button>
                                </>
                            )}
                        </div>
                        <hr style={{marginTop: '10px', marginLeft: '-20px', width: '1000px'}}/>
                    </div>
                ))}
                <form className="comment-input" onSubmit={handleAddComment}
                      style={{marginTop: '20px', marginLeft: '20px', display: 'flex', alignItems: 'center'}}>
                    <input
                        type="text"
                        placeholder="댓글"
                        value={newComment}
                        onChange={handleCommentChange}
                        style={{marginRight: '10px', padding: '10px', width:'500%'}}
                    />
                    <button type="submit"
                            style={{height:'45px',color:'white',fontWeight:'bold',backgroundColor:'#567cac',border: '1px solid rgb(204, 204, 204, 0.7)', padding: '10px 10px',marginRight:'15px'}}>작성
                    </button>
                </form>
            </div>

            {showDeleteCommentModal && (
                <Modal_delete
                    onClose={handleDeleteCommentModalClose}
                    onConfirm={handleDeleteCommentConfirm}
                />
            )}
        </div>
    );
}

export default PostDetail;
