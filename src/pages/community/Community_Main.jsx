import React, { useEffect, useState } from 'react';
import Header_center from "../../components/header/Header_center.jsx";
import Footer from "../../components/footer/Footer.jsx";
import { useNavigate } from "react-router-dom";
import "./community_styles/community.css";
import Calendar from "./Calendar/Calendar.jsx";
import ActivityPage from './activity/ActivityPage.jsx'
import axios from "axios";
import WritePostModal from "./WritePostModal.jsx";

function CommunityMain() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [expandedPosts, setExpandedPosts] = useState({});
    const [posts, setPosts] = useState([]);
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const navigate = useNavigate();
    const clubId = 1;

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('https://zmffjq.store/board/1/posts');
            setPosts(response.data);
        } catch (error) {
            console.log('에러 내용:', error);
        }
    };

    const handleWritePost = async (newPost) => {
        try {
            const response = await axios.post('https://zmffjq.store/board/1/posts', newPost);
            if(response.status === 200) {
                fetchPosts();
            }
            setIsWriteModalOpen(false);
        } catch (error) {
            console.log("에러 내용:", error);
        }
    };

    const handleMenuClick = (index) => {
        setActiveIndex(index);
    };

    const maxContentLength = 30;

    const toggleContent = (postId) => {
        setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    const renderContent = () => {
        switch (activeIndex) {
            case 0:
                return (
                    <div className="posts-container">
                        {posts && posts.length > 0 ? (
                            posts.map((post) => {
                                // null 체크 추가
                                if (!post.title || !post.content) {
                                    return null; // null인 게시글은 렌더링하지 않음
                                }

                                const isLongContent = post.content.length > maxContentLength;
                                const showFullContent = expandedPosts[post.postId];

                                return (
                                    <div key={post.postId.toString()} className="post-item"
                                         onClick={() => navigate(`/board/1/posts/${post.postId.toString()}`)}>
                                        <h3 style={{
                                            textAlign: "left",
                                            marginLeft: "10px",
                                            marginBottom: "5px",
                                            fontWeight: "bold",
                                            fontSize: "20px"
                                        }}>{post.title}</h3>
                                        <div style={{display: "flex", alignItems: "center", marginLeft: "10px"}}>
                                            <p style={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: showFullContent ? "normal" : "nowrap",
                                                maxWidth: showFullContent ? "none" : "450px",
                                                marginBottom: "5px"
                                            }}>
                                                {post.content}
                                            </p>
                                            {isLongContent && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleContent(post.postId);
                                                    }}
                                                    style={{
                                                        color: "gray",
                                                        cursor: "pointer",
                                                        border: "none",
                                                        background: "none",
                                                        marginLeft: "-20px",
                                                        padding: "0"
                                                    }}
                                                >
                                                    {showFullContent ? "간략히" : "더 보기"}
                                                </button>
                                            )}
                                        </div>
                                        <p style={{
                                            textAlign: "left",
                                            marginLeft: "10px",
                                            marginTop: "-5px",
                                            color: "gray",
                                            marginBottom:"10px"
                                        }}>{new Date(post.createdAt).toLocaleDateString()}</p>
                                    </div>
                                );
                            }).filter(Boolean) // null인 요소 제거
                        ) : (
                            <p>게시글이 없습니다.</p>
                        )}
                        <div>
                            <button onClick={() => setIsWriteModalOpen(true)}
                                    style={{
                                        backgroundColor: "#7995b6",
                                        width: '90px',
                                        borderRadius: '100px',
                                        marginTop: '50px',
                                        color: 'white',
                                        marginLeft: '100px',
                                        fontWeight: 'bold',
                                        position:'fixed',
                                        bottom: '100px',
                                        right: '20px',
                                        zIndex: '1000'
                                    }}>글쓰기
                            </button>
                        </div>
                    </div>
                );
            case 1:
                return <Calendar/>
            case 2:
                return <ActivityPage clubId={clubId} />;
            default:
                return null;
        }
    };

    return (
        <div>
            <Header_center />
            <div className="menu-container">
                <div className="menu-scroll">
                    {['자유게시판', '캘린더', '활동내용'].map((item, index) => (
                        <div
                            key={index}
                            className={`menu-all ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => handleMenuClick(index)}
                            style={{border: activeIndex === index ? '2px solid black' : '2px solid lightgray'
                            ,  color: activeIndex === index ? 'black' : 'lightgray',
                            fontWeight: activeIndex === index ? '700' : '500',
                            width: '114px', marginTop:'20px'}}>
                            <p>{item}</p>
                        </div>
                    ))}
                </div>
            </div>
            {renderContent()}
            <WritePostModal
                isOpen={isWriteModalOpen}
                onClose={() => setIsWriteModalOpen(false)}
                onSubmit={handleWritePost}
            />
            <Footer />
        </div>
    );
}

export default CommunityMain;