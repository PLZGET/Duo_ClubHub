import React, { useState, useEffect } from 'react';
import axios from "axios";
import '../../DetailHeader/myclubheader.css'
import './noticewrite.css';
import {useNavigate, useParams} from "react-router-dom";
import { FiX, FiCheck } from "react-icons/fi";
import { LuImagePlus } from "react-icons/lu";

function NoticeEdit() {
    const navigate = useNavigate();
    let { clubId, postId } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [attachmentNames, setAttachmentNames] = useState([]);
    const [memberId, setMemberId] = useState(null);

    const apiClient = axios.create({
        baseURL: 'https://zmffjq.store',
        timeout: 10000, // 요청 타임아웃 설정 (10초)
        headers: {
            'Content-Type': 'application/json',
        },
    });

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

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                //게시글 정보 가져오기
                const response = await apiClient.get(`/clubs/${clubId}/board/2/posts/${postId}`);
                const post = response.data.post;
                setTitle(post.title);
                setContent(post.content);
                setAttachmentNames(response.data.attachmentNames || []);
            } catch (error) {
                console.error('게시글 정보 가져오는 중 오류 발생:', error);
                alert('게시글 정보를 불러오는 데 실패했습니다.');
            }
        };
        fetchPostData();
        fetchUserId();
    }, [clubId, postId]);

    // 제목 입력
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    // 내용 입력
    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    // Presigned URL 요청 및 이미지 업로드
    const getPresignedUrl = async (file) => {
        try {
            const filename = encodeURIComponent(file.name);
            const response = await apiClient.get(`/presigned-url?filename=${filename}`);

            console.log("Server response:", response.data.url); // 서버 응답 전체 출력

            const presignedUrl = response.data.url;
            if (!presignedUrl) {
                throw new Error('서버로부터 URL 받을 수 없음');
            }
            
            console.log("Fetched Presigned URL:", presignedUrl);

            await axios.put(presignedUrl, file, {
                headers: {
                    'Content-Type': file.type,
                },
                withCredentials: false
            });
            return presignedUrl.split("?")[0]; // 이미지 URL 반환
        } catch (error) {
            console.error('Presigned URL 요청 또는 이미지 업로드 실패:', error);
            throw error;
        }
    };

    // 첨부 파일 선택
    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        const urls = await Promise.all(selectedFiles.map(async (file) => {
            try {
                const presignedUrl = await getPresignedUrl(file);
                console.log("Presigned URL:", presignedUrl);
                return presignedUrl;
            } catch (error) {
                console.error('파일 업로드 중 오류 발생:', error);
                alert('파일 업로드 중 오류가 발생했습니다.');
                throw error;
            }
        }));
        setAttachmentNames([...attachmentNames, ...urls]);
    };

    // 글쓰기 폼 제출
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.put(`/posts/${postId}`, {
                postId,
                title,
                content,
                attachment_flag: attachmentNames.length > 0 ? 'Y' : 'N',
                attachment_names: attachmentNames,
            });
            if (response.status === 200 || response.status === 201) {
                alert('수정 완료');
                //navigate(`/clubs/${clubId}/board/2/posts/${postId}`);
                navigate(-1)
            }
        } catch (error) {
            console.error('수정 중 오류 발생:', error);
            alert('글 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <div>
            <div className="header_container">
                <FiX
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{fontSize: '19px', fontWeight: "bold"}}>글 수정</div>
                <FiCheck
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handleSubmit}
                />
            </div>
            <div className='write_container'>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="notice_title"
                        placeholder="제목"
                        value={title}
                        onChange={handleTitleChange}
                    />
                    <textarea
                        className="notice_content"
                        placeholder="내용을 입력하세요."
                        rows={10}
                        value={content}
                        onChange={handleContentChange}
                    ></textarea>
                    <div
                        style={{display: "flex", justifyContent: "center", alignItems: "center", color: "#414141"}}>
                        <label>
                            <LuImagePlus style={{fontSize: '30px', cursor: 'pointer', marginLeft: "10px"}}/>
                            <input
                                type="file"
                                multiple
                                style={{display: 'none'}}
                                onChange={handleFileChange}
                            />
                        </label>
                        <div style={{marginLeft: "10px"}}>첨부할 사진을 선택하세요.</div>
                    </div>
                </form>
                <div id="uploaded-images">
                    {attachmentNames.map((url, index) => (
                        <img key={index} src={url} alt={`uploaded ${index}`}
                             style={{width: '100px', height: '100px', margin: '10px'}}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NoticeEdit;