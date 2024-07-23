import React, {useEffect, useState} from "react";
import './member_request.css';
import {useNavigate, useParams} from "react-router-dom";
import {FaArrowLeft} from "react-icons/fa";
import axios from "axios";

function Member_request() {
    let { id } = useParams();
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [memberId, setMemberId] = useState('');

    const apiClient = axios.create({
        baseURL: 'https://zmffjq.store',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const fetchUserId = async () => {
        try {
            const response = await apiClient.get("/getUserId", {
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

    const fetchJoinRequests = async () => {
        try {
            const response = await apiClient.get(`/clubs/${id}/joinRequest`);
            setList(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching member data:', error);
        }
    };

    useEffect(() => {
        fetchUserId();
        fetchJoinRequests();
    }, [id]);

    return (
        <div className="Member_request">
            <div className="header">
                <FaArrowLeft
                    style={{fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer', marginLeft: '15px'}}
                    onClick={() => navigate(-1)}
                />
                <p>가입 신청 현황</p>
            </div>
            <div className="request_member_list">
                {
                    list.length > 0 ? (
                        list.map((a, i) => (
                            <List
                                key={i}
                                memberImageURL={a.memberImageurl}
                                name={a.name}
                                department={a.department}
                                studentId={a.studentId}
                                link={`/clubs/${id}/joinRequest/${a.requestId}`}
                            />
                        ))
                    ) : (
                        <p>가입 신청 정보가 없습니다.</p>
                    )
                }
            </div>
        </div>
    );
}

function List({memberImageURL, name, department, studentId, link}) {
    const navigate = useNavigate();
    return (
        <div className="member_request_item">
            <img src={memberImageURL} alt={name} onClick={() => navigate(link)}/>
            <div className="member_info" onClick={() => navigate(link)}>
                <p className="name">{name}</p>
                <p className="major_studentNum">{department} {studentId}</p>
            </div>
        </div>
    );
}

export default Member_request;