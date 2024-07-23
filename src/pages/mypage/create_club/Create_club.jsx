import React, { useCallback, useState } from "react";
import './create_club.css';
import axios from "axios";
import Modal_ok from "../../../components/modal/Modal_ok.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { CiCirclePlus } from "react-icons/ci";

function Create_club() {
    const navigate = useNavigate();
    const { memberId } = useParams();
    const category_id = ["SPORT", "ACADEMIC", "CULTURE", "SERVICE", "NEW"];
    const category_list = ["체육", "학술", "문화", "봉사", "신설"];

    const apiClient = axios.create({
        baseURL: 'https://zmffjq.store',
        timeout: 10000, // 요청 타임아웃 설정 (10초)
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // 상태 정의
    const [clubData, setClubData] = useState({
        clubName: "",
        clubSlogan: "",
        description: "",
        clubType: "",
        clubImgUrl: ""
    });
    const [selectedFile, setSelectedFile] = useState(null);  // 이미지 파일 상태
    const [showOkModal, setShowOkModel] = useState(false);  // OK 모달창 띄우기
    const [modalMessage, setModalMessage] = useState("");   // 모달창에 띄울 메세지 전달
    const [onConfirm, setOnConfirm] = useState(() => () => {}); // OK 버튼 클릭 시 연결할 링크

    // 모달창 열기
    const handleOpenOkModal = useCallback((message, confirmCallback) => {
        setModalMessage(message);
        setOnConfirm(() => confirmCallback);
        setShowOkModel(true);
    }, []);

    // 모달창 닫기
    const handleCloseOkModal = () => setShowOkModel(false);

    // 입력 값 변경
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClubData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // 파일 선택
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setClubData(prevData => ({
            ...prevData,
            clubImgUrl: URL.createObjectURL(file)  // 선택한 이미지 파일의 URL 생성
        }));
    };

    // 카테고리 선택
    const handleClubTypeChange = (e) => {
        setClubData(prevData => ({
            ...prevData,
            clubType: e.target.id
        }));
    };

    const handleCreateClub = () => {
        // 클럽 데이터에서 필요한 필드를 추출
        const { clubName, clubSlogan, description, clubType, clubImgUrl } = clubData;
        // 모든 필드가 입력되었는지 확인
        if (!clubName || !clubSlogan || !description || !clubType) {
            handleOpenOkModal("모든 필드를 입력해주세요.", () => {});
            return;
        }

        // 요청 본문 구성
        const requestBody = {
            clubName,
            clubSlogan,
            description,
            clubType,
            clubImgUrl
        };

        // API 호출
        apiClient.post(`/clubs/create/${memberId}`, requestBody)
            .then(response => {
                handleOpenOkModal("동아리 생성이 완료되었습니다.", () => navigate(-1));
            })
            .catch(error => {
                console.error('동아리 생성 중 오류 발생:', error);
                handleOpenOkModal("동아리 회장은 생성할 수 없습니다.", () => {});
            });
    };

    return (
        <div className="Create_club">
            <div className="header">
                <FaArrowLeft
                    style={{ fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer', marginLeft: '15px' }}
                    onClick={() => navigate(-1)}
                />
                <p>동아리 만들기</p>
            </div>
            <div className="form">
                <div className="image">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        id="upload"
                    />
                    <label htmlFor="upload" className="image-label">
                        {selectedFile ? (
                            <img src={clubData.clubImgUrl} alt="club" style={{ width: "55px", height: "55px", borderRadius: "50%" }} />
                        ) : (
                            <CiCirclePlus style={{ fontSize: "55px", display: "flex", float: "left", position: "relative" }} />
                        )}
                    </label>
                    <div className="add_club_picture">
                        <p style={{ fontSize: "16px", fontWeight: "bold" }}>동아리 프로필 사진</p>
                        <p style={{ fontSize: "11px", color: "gray" }}>대표 이미지를 선택해주세요.</p>
                    </div>
                </div>
                <div className="add_club_info">
                    <p>동아리 이름</p>
                    <input
                        type="text"
                        name="clubName"
                        value={clubData.clubName}
                        onChange={handleInputChange}
                        placeholder="소수정예 전략 보드게임 동아리"
                    />
                    <p>동아리 슬로건</p>
                    <input
                        type="text"
                        name="clubSlogan"
                        value={clubData.clubSlogan}
                        onChange={handleInputChange}
                        placeholder="5기 곰돌이가 서울에 상륙하였습니다!"
                    />
                    <div style={{ marginBottom: "4px" }}>
                        <p style={{ marginBottom: "1px" }}>카테고리</p>
                        {
                            category_list.map((name, i) => {
                                return (
                                    <List
                                        key={category_id[i]}
                                        id={category_id[i]}
                                        name={name}
                                        onChange={handleClubTypeChange}
                                    />
                                )
                            })
                        }
                    </div>
                    <p>동아리 설명</p>
                    <textarea
                        name="description"
                        value={clubData.description}
                        onChange={handleInputChange}
                        placeholder="활동 내용, 활동 위치 등"
                    />
                </div>
                <button onClick={handleCreateClub}>만들기</button>
            </div>
            {showOkModal && <Modal_ok onClose={handleCloseOkModal} message={modalMessage} onConfirm={onConfirm} />}
        </div>
    )
}

function List({ id, name, onChange }) {
    return (
        <label className="category_radio">
            <input
                type="radio"
                id={id}
                name="club_category"
                onChange={onChange}
            />
            {name}
        </label>
    )
}

export default Create_club;