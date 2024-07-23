import React, {useEffect, useState} from "react";
import './member_info_fix_list.css';
import {useNavigate, useParams} from "react-router-dom";
import {FaArrowLeft} from "react-icons/fa6";
import member_info_data from "../../../../data/member_info_data.jsx";
import { FaPlus } from "react-icons/fa6";
import memberInfo from "../../data/memberInfo.jsx";
import axios from "axios";

function Member_info_fix_list() {
    const navigate = useNavigate();
//    let [list] = useState(member_info_data);
    const [list, setList] = useState([]);
//    const { memberId } = useParams();
    const { id } = useParams();

    const apiClient = axios.create({
        baseURL: 'https://zmffjq.store', // .env 파일에서 API URL 가져오기
        timeout: 10000, // 요청 타임아웃 설정 (10초)
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // 회원 정보를 조회하는 API 호출
    useEffect(() => {
        apiClient.get(`/clubs/${id}/clubMember`)
            .then(response => {
                setList(response.data);
            })
            .catch(error => {
                console.error('Error fetching member data:', error);
            });
    }, [id]);

    return (
        <div className="Member_info_fix">
            <div className="header">
                <FaArrowLeft
                    style={{fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer', marginLeft: '15px'}}
                    onClick={() => navigate(-1)}
                />
                <p>회원 정보 수정</p>
            </div>
            <div className="member_info_list">
                <h2>멤버 리스트</h2>
                {
                    list.map((member, i) => {
                        return (
                            <List key={i} memberImageurl={member.memberImageurl} name={member.name} role={member.role} memberId={member.memberId}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

function List({ memberImageurl, name, role, memberId }) {
    const navigate = useNavigate();
    const { id } = useParams();
    return (
        <div className="member_info_item">
            <img src={memberImageurl} alt={name} />
            <div className="member_info">
                <p className="name">{name}</p>
                <p className="role">{role}</p>
            </div>
            <FaPlus className="plus_icon" onClick={() => navigate(`/clubs/${id}/memberInfoFix/` + memberId)}/>
        </div>
    );
}

export default Member_info_fix_list;