import React, { useCallback, useEffect, useState } from "react";
import './edit_info.css';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { MdOutlineCameraAlt } from "react-icons/md";
import Modal_ok from "../../../components/modal/Modal_ok.jsx";

function Edit_info() {
    const navigate = useNavigate();
    const { memberId } = useParams();

    const apiClient = axios.create({
        baseURL: 'https://zmffjq.store',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // member 데이터 관리
    const [data, setData] = useState({
        id: "",
        name: "",
        department: "",
        studentId: "",
        password: "",
        memberImageURL: "",
        phone: ""
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [showOkModal, setShowOkModel] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [onConfirm, setOnConfirm] = useState(() => () => {});

    // 회원 정보 조회
    useEffect(() => {
        apiClient.get(`/members/${memberId}`)
            .then(response => {
                setData({
                    id: response.data.id,
                    name: response.data.name,
                    department: response.data.department,
                    studentId: response.data.studentId,
                    password: response.data.password,
                    memberImageURL: response.data.memberImageURL,
                    phone: response.data.phone
                });
            })
            .catch(error => {
                console.error('회원 정보 조회 중 오류 발생:', error);
            });
    }, [memberId]);

    const Change = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleOpenOkModal = useCallback((message, confirmCallback) => {
        setModalMessage(message);
        setOnConfirm(() => confirmCallback);
        setShowOkModel(true);
    }, []);

    const handleCloseOkModal = () => setShowOkModel(false);

    const handleUpdateInfo = () => {
        const requestBody = {
            id: data.id,
            name: data.name,
            department: data.department,
            studentId: data.studentId,
            password: data.password,
            memberImageURL: data.memberImageURL,
            phone: data.phone
        };
        apiClient.post(`/members/${memberId}`, requestBody)
            .then(response => {
                // 로컬 스토리지의 userInfo 업데이트
                const updatedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
                updatedUserInfo.memberImageURL = data.memberImageURL;
                localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

                handleOpenOkModal("수정이 완료되었습니다.", () => navigate(-1));
            })
            .catch(error => {
                console.error('회원 정보 수정 중 오류 발생:', error);
                handleOpenOkModal("수정에 실패했습니다. 다시 시도해주세요.", () => {});
            });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setData(prevData => ({
            ...prevData,
            memberImageURL: URL.createObjectURL(file)  // 선택한 이미지 파일의 URL 생성
        }));
    };

    return (
        <div className="Edit_info">
            <div className="header">
                <FaArrowLeft
                    style={{ fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer', marginLeft: '15px' }}
                    onClick={() => navigate(-1)}
                />
                <p>정보 수정</p>
            </div>
            <div className="edit">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="upload"
                />
                <label htmlFor="upload" className="image-label">
                    <img src={data.memberImageURL} alt="profile" />
                    <MdOutlineCameraAlt className="camera_icon" />
                </label>
                <div className="information">
                    <div className="name">
                        <p>이름</p>
                        <input type="text" name="name" value={data.name} onChange={Change} />
                    </div>
                    <div className="major">
                        <p>학과</p>
                        <input type="text" name="department" value={data.department} onChange={Change} />
                    </div>
                    <div className="phone">
                        <p>전화번호</p>
                        <input type="text" name="phone" value={data.phone} onChange={Change} />
                    </div>
                    <div className="password">
                        <p>비밀번호 변경</p>
                        <input type="password" name="password" value={data.password} onChange={Change} />
                    </div>
                </div>
            </div>
            <button onClick={handleUpdateInfo}>수정하기</button>
            {showOkModal && <Modal_ok onClose={handleCloseOkModal} message={modalMessage} onConfirm={onConfirm} />}
        </div>
    );
}

export default Edit_info;