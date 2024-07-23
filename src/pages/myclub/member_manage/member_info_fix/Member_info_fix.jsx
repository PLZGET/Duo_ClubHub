import React, { useEffect, useState } from "react";
import "./member_info_fix.css";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import Modal_confirm from "../../../../components/modal/Modal_confirm.jsx";
import Modal_ok from "../../../../components/modal/Modal_ok.jsx";
import axios from "axios";

function Member_info_fix() {
    const navigate = useNavigate();
    const { id, memberId } = useParams();  // id: 클럽 ID, memberId: 멤버 ID

    const [member, setMember] = useState(null);  // 멤버 정보 상태
    const [role, setRole] = useState('');  // 직책 상태
    const [showDeleteModal, setShowDeleteModal] = useState(false);  // 삭제 모달 상태
    const [showFixModal, setShowFixModal] = useState(false);  // 수정 모달 상태
    const [modalMessage, setModalMessage] = useState("");  // 모달 메시지
    const [isModalOpen, setIsModalOpen] = useState(false);
    const token = localStorage.getItem('token');

    // Axios 인스턴스 생성 및 설정
    const apiClient = axios.create({
        baseURL: 'https://zmffjq.store',  // 환경 변수에서 API URL 가져오기
        timeout: 10000,  // 요청 타임아웃 설정 (10초)
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,  // 인증 토큰 추가
        },
    });

    // 멤버 정보를 조회하는 API 호출
    useEffect(() => {
        apiClient.get(`/clubs/${id}/clubMember/${memberId}`)
            .then(response => {
                setMember(response.data);
                setRole(response.data.status === 'CLUB_PRESIDENT' ? '회장' : '일반');
            })
            .catch(error => {
                console.error('Error fetching member data:', error);
            });
    }, [id, memberId]);  // id와 memberId가 변경될 때마다 호출

    // 직책을 로컬 상태에서만 변경
    const handleRoleChange = (newRole) => {
        setRole(newRole);
    }

    // 직책을 서버에 업데이트하는 API 호출
    const handleFixMember = () => {
        setModalMessage("직책을 변경하시겠습니까?");
        setShowFixModal(true);
    }

    // Confirm the role change
    const handleConfirmFix = () => {
        const newStatus = role === '회장' ? 'CLUB_PRESIDENT' : 'CLUB_MEMBER';
        apiClient.post(`/clubs/${id}/clubMember/${memberId}/changeStatus`, { changeStatus: newStatus })
            .then(response => {
                console.log('Role updated:', response.data);
                navigate(`/clubs/${id}/memberInfoFixList`);  // 수정 후 멤버 리스트 페이지로 이동
            })
            .catch(error => {
                console.error('Error updating role:', error);
                setModalMessage("동아리 회장만 수정 가능합니다.");
                setIsModalOpen(true);
            })
            .finally(() => {
                setShowFixModal(false);
            });
    }

    // 멤버를 탈퇴시키는 API 호출
    const handleDeleteMember = () => {
        apiClient.delete(`/clubs/${id}/clubMember/${memberId}/deleteMember`)
            .then(response => {
                console.log('Member deleted:', response.data);
                navigate(`/clubs/${id}/memberInfoFixList`);  // 삭제 후 멤버 리스트 페이지로 이동
            })
            .catch(error => {
                console.error('Error deleting member:', error);
                setModalMessage("동아리 회장만 탈퇴 가능합니다.");
                setIsModalOpen(true);
            });
    }

    const handleModalClose = () => setIsModalOpen(false);
    
    const handleModalConfirm = () => navigate(-1);

    // 탈퇴 확인 모달 열기
    const handleOpenModal = (message) => {
        setModalMessage(message);
        setShowDeleteModal(true);
    }

    // 모달 닫기
    const handleCloseModal = () => setShowDeleteModal(false);

    return (
        <div className="Member_info_fix">
            <div className="header">
                <FaArrowLeft
                    style={{ fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer', marginLeft: '15px' }}
                    onClick={() => navigate(-1)}
                />
                <p>회원 정보 수정</p>
            </div>
            {member && (
                <div className="member_info_detail">
                    <img src={member.memberImageurl} alt={member.name} />
                    <p className="name">{member.name}</p>
                    <p className="studentNum">학번: {member.studentId}</p><br />
                    <div className="role">직책<br />
                        <button
                            className={`role-button ${role === '회장' ? 'role-president' : ''}`}
                            onClick={() => handleRoleChange('회장')}
                        >
                            회장
                        </button>
                        <button
                            className={`role-button ${role === '일반' ? 'role-general' : ''}`}
                            onClick={() => handleRoleChange('일반')}
                        >
                            일반
                        </button>
                    </div>
                    <div className="phone">
                        전화번호
                        <p className="phoneNum">{member.phone}</p>
                    </div>
                    <div className="major">전공<br />
                        <p className="majorName">{member.department}</p>
                    </div>
                </div>
            )}
            <div className="buttons">
                <button className="out" onClick={() => handleOpenModal("동아리에서 탈퇴시키겠습니까?")}>회원 탈퇴</button>
                <button className="fix" onClick={handleFixMember}>수정하기</button>
            </div>
            {showDeleteModal && <Modal_confirm onClose={handleCloseModal} message={modalMessage} link={`/clubs/${id}/memberInfoFixList`} onConfirm={handleDeleteMember} />}
            {showFixModal && <Modal_confirm onClose={() => setShowFixModal(false)} message={modalMessage} onConfirm={handleConfirmFix} />}
            {isModalOpen && <Modal_ok message={modalMessage} onClose={handleModalClose} onConfirm={handleModalConfirm} />}
        </div>
    );
}

export default Member_info_fix;