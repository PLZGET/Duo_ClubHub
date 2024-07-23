import React, {useEffect, useState} from "react";
import axios from "axios";
import './written_post.css'
import {useNavigate, useParams} from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

function Written_post() {
    const navigate = useNavigate();
    const { memberId } = useParams();

    const apiClient = axios.create({
        baseURL: 'http://3.36.56.20:8080', // .env 파일에서 API URL 가져오기
        timeout: 10000, // 요청 타임아웃 설정 (10초)
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // 임의의 list 데이터
//    const [list] = useState(postData.filter(post => post.memberId === parseInt(memberId, 10)));
    const [list, setList] = useState([]);

    // 작성한 글 목록을 가져오는 API
    useEffect(() => {
      // 작성한 글 목록을 조회
        apiClient.get(`/posts/${memberId}`)
             .then(response => {
                 setList(response.data);
             })
             .catch(error => {
                 console.error('작성한 글 목록 조회 중 오류 발생:', error);
             });
    }, [memberId]);

    return (
        <div className="Written_post">
            <div className="header">
                <FaArrowLeft
                    style={{ fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer', marginLeft: '15px' }}
                    onClick={() => navigate(`/members/${memberId}`)}
                />
                <p>작성한 글 보기</p>
            </div>
            <div className="written_post_list">
                {
                    list.map((post, i) => {
                        console.log(post)
                        return (
                            <List key={i} title={post.title} content={post.content} updatedAt={post.updatedAt} memberId={memberId} postId={post.id} />
                        )
                    })
                }
            </div>
        </div>
    )
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}

function List({title, content, updatedAt, memberId, postId}) {
    const navigate = useNavigate();
    return (
        <div className="post_list" onClick={() => navigate(`/posts/${memberId}/${postId}`)}>
            <p className="title">{title}</p>
            <p className="content">{content}</p>
            <p className="date">{formatDate(updatedAt)}</p>
        </div>
    )
}

export default Written_post;