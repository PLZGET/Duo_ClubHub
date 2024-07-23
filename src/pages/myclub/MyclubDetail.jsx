import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./myclubdetail.css";
import Footer from '../../components/footer/Footer.jsx';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import MyclubHeader from "./DetailHeader/MyclubHeader.jsx";
// import {FaArrowLeft} from "react-icons/fa6";
// import {FiMoreVertical} from "react-icons/fi";

function MyclubDetail() {
    const { id } = useParams();
    console.log("club id:", id); // test
    const navigate = useNavigate();
    const location = useLocation();
    const [clubName, setClubName] = useState(''); //헤더에 이름 띄우기

    //공지사항,자유게시판 글 API 조회
    const [noticePosts, setNoticePosts] = useState([]);
    const [freeboardPosts, setFreeboardPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedClubName = localStorage.getItem(`clubName_${id}`);

        if (storedClubName) {
            setClubName(storedClubName);
        } else if (location.state?.clubName) {
            setClubName(location.state.clubName);
            localStorage.setItem(`clubName_${id}`, location.state.clubName);
        }

        const fetchPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const [noticeResponse, freeboardResponse] = await Promise.all([
                    axios.get(`https://zmffjq.store/clubs/${id}/board/2/posts`),
                    axios.get(`https://zmffjq.store/clubs/${id}/board/4/posts`)
                ]);
                setNoticePosts(noticeResponse.data);
                setFreeboardPosts(freeboardResponse.data);

                // 서버에서 배열이 아닌 경우에 대비하여 처리
                if (Array.isArray(noticeResponse.data)) {
                    setNoticePosts(noticeResponse.data);
                } else {
                    setNoticePosts([noticeResponse.data]);
                }
                if (Array.isArray(freeboardResponse.data)) {
                    setFreeboardPosts(freeboardResponse.data);
                } else {
                    setFreeboardPosts([freeboardResponse.data]);
                }

                // 공지사항 정렬
                const sortedNoticePosts = Array.isArray(noticeResponse.data)
                    ? noticeResponse.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    : [noticeResponse.data];
                setNoticePosts(sortedNoticePosts);

                // 자유게시판 정렬
                const sortedFreeboardPosts = Array.isArray(freeboardResponse.data)
                    ? freeboardResponse.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    : [freeboardResponse.data];
                setFreeboardPosts(sortedFreeboardPosts);

            } catch (error) {
                console.error('API 호출 중 오류 발생:', error.response || error);
                setError('게시글을 불러오는데 실패했습니다. 다시 시도해주세요.');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [id, location.state]);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    const handleNoticeClick = () => {
        navigate(`/clubs/${id}/noticelist`);
    };

    const handleFreeboardClick = () => {
        navigate(`/clubs/${id}/freeboardlist`);
    };

    const etc1handleMoreClick = () => {
        navigate(`/clubs/etc1`);
    }; //출석 화면으로 이동

    const etc2handleMoreClick = () => {
        navigate(`/clubs/etc2`);
    }; //정산 화면으로 이동

    const etc3handleMoreClick = () => {
        navigate(`/clubs/etc3`);
    }; //투표 화면으로 이동

    return (
        <div className="myclub-detail-container">
            <MyclubHeader clubName={clubName} />
            <div className="scroll-container">
                <div className="item-container">
                    <div className="headerrcontainer">
                        <h2>공지사항</h2>
                        <p onClick={() => handleNoticeClick()}>더보기</p>
                    </div>
                    <section className="box-section">
                        {noticePosts.length > 0 ? (
                            noticePosts.map((item, index) => (
                                <div className="box-item" key={index}>
                                    <h3>{item.title}</h3>
                                    <p>{item.content}</p>
                                </div>
                            ))
                        ) : (
                            <p className="no-posts-message">작성된 글이 없습니다</p>
                        )}
                    </section>
                </div>
                <div className="item-container">
                    <div className="headerrcontainer">
                        <h2>자유게시판</h2>
                        <p onClick={() => handleFreeboardClick()}>더보기</p>
                    </div>
                    <section className="box-section">
                        {freeboardPosts.length > 0 ? (
                            freeboardPosts.map((item, index) => (
                                <div className="box-item" key={index}>
                                    <h3>{item.title}</h3>
                                    <p>{item.content}</p>
                                </div>
                            ))
                        ) : (
                            <p className="no-posts-message">작성된 글이 없습니다</p>
                        )}
                    </section>
                </div>
                <div className="item-container">
                    <div className="headerrcontainer">
                        <h2>출석</h2>
                        <p onClick={etc1handleMoreClick}>더보기</p>
                    </div>
                    <section className="box-section">
                        <div className="box-item"
                             style={{minWidth: "190px", border: "1.5px solid black"}}
                        >
                            <p
                                style={{fontSize: "15px"}}
                            >2024/07/30 (일)<br/>정기 모임</p>
                        </div>
                        <div className="box-item"
                             style={{minWidth: "190px", border: "1.5px solid black"}}
                        >
                            <p
                                style={{fontSize: "15px"}}
                            >2024/07/19 (금)<br/>회식</p>
                        </div>
                        <div className="box-item"
                             style={{minWidth: "190px", border: "1.5px solid black"}}
                        >
                            <p
                                style={{fontSize: "15px"}}
                            >2024/06/10 (월)<br/>MT</p>
                        </div>
                        <div className="box-item"
                             style={{minWidth: "190px", border: "1.5px solid black"}}
                        >
                            <p
                                style={{fontSize: "15px"}}
                            >2024/06/03 (월)<br/>정기 모임</p>
                        </div>
                        <div className="box-item"
                             style={{minWidth: "190px", border: "1.5px solid black"}}
                        >
                            <p
                                style={{fontSize: "15px"}}
                            >2024/05/21 (화)<br/>오리엔테이션</p>
                        </div>
                    </section>
                </div>
                <div className="item-container">
                    <div className="headerrcontainer">
                        <h2>정산</h2>
                        <p onClick={etc2handleMoreClick}>더보기</p>
                    </div>
                    <section className="box-section">
                        <div className="box-item"
                             style={{minWidth: "190px", border: "1.5px solid black"}}
                        >
                            <p
                                style={{fontSize: "15px"}}
                            >7월 19일 회식</p>
                        </div>
                        <div className="box-item"
                             style={{minWidth: "190px", border: "1.5px solid black"}}
                        >
                            <p
                                style={{fontSize: "15px"}}
                            >유니폼 구입</p>
                        </div>
                        <div className="box-item"
                             style={{minWidth: "190px", border: "1.5px solid black"}}
                        >
                            <p
                                style={{fontSize: "15px"}}
                            >MT 참가비</p>
                        </div>
                    </section>
                </div>
                <div className="item-container">
                    <div className="headerrcontainer">
                        <h2>투표</h2>
                        <p onClick={etc3handleMoreClick}>더보기</p>
                    </div>
                    <section className="box-section">
                        <div className="box-item"
                             style={{minWidth: "190px", border: "1.5px solid black"}}
                        >
                            <p
                                style={{fontSize: "15px"}}
                            >7월 19일 회식 장소</p>
                        </div>
                        <div className="box-item"
                             style={{minWidth: "190px", border: "1.5px solid black"}}
                        >
                            <p
                                style={{fontSize: "15px"}}
                            >MT 날짜</p>
                        </div>
                    </section>
                </div>
            </div>
            <Footer style={{height: "72.5px", marginTop: "0"}}/>
        </div>
    );
}

export default MyclubDetail;