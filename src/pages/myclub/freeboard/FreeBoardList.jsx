//내 동아리 자유게시판 - 글 목록
import React, {useState, useEffect} from 'react';
import '../DetailHeader/myclubheader.css'
import '../notice/notice.css';
import { FaArrowLeft } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";

function formatDate(dateString) {
    const date = new Date(dateString);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${month}/${day}`;
}

const apiClient = axios.create({
    baseURL: 'https://zmffjq.store', // API URL
    timeout: 10000, // 요청 타임아웃 설정 (10초)
    headers: {
        'Content-Type': 'application/json',
    },
});

function FreeBoardList(){
    let { id } = useParams();
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [memberId, setMemberId] = useState(null);

    const fetchUserId = async () => {
        try {
            const response = await apiClient.get('/getUserId', {
                withCredentials: true
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

    //자유게시판 리스트 API 조회
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await apiClient.get(`/clubs/${id}/board/4/posts`);
                if (response.status === 200) {
                    const data = response.data;

                    // 작성자 정보 가져옴
                    const postsWithAuthors = await Promise.all(
                        data.map(async (freeboard) => {
                            // 각 postId를 사용하여 상세 정보 API를 호출
                            try {
                                const detailResponse = await apiClient.get(`/clubs/${id}/board/4/posts/${freeboard.postId}`);
                                if (detailResponse.status === 200) {
                                    const detailData = detailResponse.data.post;
                                    return {
                                        ...freeboard,
                                        authorName: detailData.member.name, // 작성자 이름 추가
                                    };
                                } else {
                                    console.error(`게시글 ${freeboard.postId}의 상세 정보 조회 실패`, detailResponse.status);
                                    return freeboard; // 실패 시 기존 데이터 유지
                                }
                            } catch (error) {
                                console.error(`게시글 ${freeboard.postId}의 상세 정보 조회 중 에러 발생`, error);
                                return freeboard;
                            }
                        })
                    );
                    //내림차순 정렬
                    const sortedPosts = postsWithAuthors.sort((a, b) =>
                        new Date(b.createdAt) - new Date(a.createdAt)
                    );
                    setList(sortedPosts);
                } else {
                    console.error("자유게시판 리스트 조회 실패", response.status);
                }
            } catch (error) {
                console.error('자유게시판 리스트 가져오는 중 에러 발생', error);
            }
        };
        fetchPosts();
        fetchUserId();
    }, [id]);

    const handleWriteClick = () => {
        navigate(`/clubs/${id}/freeboardlist/freeboardwrite`);
    };

    const handleBackClick = () => {
        navigate(`/clubs/${id}/myclub`);
    };

    return (
        <div>
            <div className="header_container">
                <FaArrowLeft
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{fontSize: '20px', fontWeight: "bold"}}>자유게시판</div>
                <FiEdit
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handleWriteClick}
                />
            </div>
            <div className="scroll-container">
                <div className="notice_list">
                    {list.length > 0 ? (
                        list.map((post, index) => (
                            <div key={index} className="post">
                                <Link to={`/clubs/${id}/board/4/posts/${post.postId}?memberId=${memberId}`}>
                                    <p className="title">{post.title}</p>
                                    <p className="content">{post.content}</p>
                                    <p className="createdAt">{post.authorName} | {formatDate(post.createdAt)}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>작성된 글이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FreeBoardList;
