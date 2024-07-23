import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import { IoIosCheckmarkCircleOutline, IoIosCheckmarkCircle } from "react-icons/io";
import './atd.css';

function Atd() {
    const navigate = useNavigate();
    const location = useLocation();
    const { date } = location.state || {};

    const [members, setMembers] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const savedMembers = localStorage.getItem(`attendance_${date}`);
        if (savedMembers) {
            setMembers(JSON.parse(savedMembers));
        } else {
            // 초기 데이터 설정
            setMembers([
                { name: '김진구', isPresent: false },
                { name: '김네오', isPresent: false },
                { name: '어피치', isPresent: false },
                { name: '최자두', isPresent: false },
                { name: '프로도', isPresent: false },
                { name: '홍길동', isPresent: false },
            ]);
        }
    }, [date]);

    const handleBackClick = () => {
        navigate(-1);
    };

    const toggleAttendance = (index) => {
        setMembers(members.map((member, i) =>
            i === index ? { ...member, isPresent: !member.isPresent } : member
        ));
    };

    const saveAttendance = () => {
        localStorage.setItem(`attendance_${date}`, JSON.stringify(members));
        alert('출석 상태가 저장되었습니다.');
        //setTimeout(() => setMessage(''), 2000);
    };

    return (
        <div>
            <div className="header_container" style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px"}}>
                <FaArrowLeft
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{fontSize: '20px', fontWeight: "bold", marginRight: "21px"}}>회원 출석 관리</div>
                <div></div>
            </div>
            {date && <div className="date-display">{date}</div>}
            <div className="atd-member-list">
                {members.map((member, index) => (
                    <div key={index} className="atd-member-item">
                        <div className="atd-member-info">
                            <span className="atd-member-name">{member.name}</span>
                            <div className="atd-toggle-button" onClick={() => toggleAttendance(index)}>
                                {member.isPresent ?
                                    <IoIosCheckmarkCircle className="atd-check-icon present"/> :
                                    <IoIosCheckmarkCircleOutline className="atd-check-icon"/>
                                }
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button className="att-complete-button" onClick={saveAttendance}>완료</button>
        </div>
    );
}

export default Atd;