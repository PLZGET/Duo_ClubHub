import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from 'axios';
import "./clubinfoedit.css";
import { RiImageCircleLine } from "react-icons/ri";

axios.defaults.withCredentials = true;

function ClubInfoEdit() {
    const apiClient = axios.create({
        baseURL: 'https://zmffjq.store',
        timeout: 10000,
    });

    let { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [originalClubData, setOriginalClubData] = useState({
        clubImgUrl: '',
        clubName: '',
        clubSlogan: '',
        description: ''
    });

    const [clubData, setClubData] = useState({
        clubImgUrl: '',
        clubName: '',
        clubSlogan: '',
        description: ''
    });

    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        apiClient.get(`/clubs/${id}/changeClubInfo`)
            .then(response => {
                const { clubImgUrl, clubName, clubSlogan, description } = response.data;
                console.log('Fetched data:', response.data);
                setClubData({ clubImgUrl, clubName, clubSlogan, description });
                setOriginalClubData({ clubImgUrl, clubName, clubSlogan, description });
            })
            .catch(error => {
                console.error("동아리 정보 가져오는 중 에러 발생", error);
            });
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClubData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
        setClubData(prevState => ({
            ...prevState,
            clubImgUrl: URL.createObjectURL(file)
        }));
    };

    const handleBackClick = () => {
        navigate(`/clubs/${id}/myclub`, { state: { isMenuOpen: location.state?.isMenuOpen } });
    };

    const requestPresignedUrl = async (filename) => {
        try {
            const response = await apiClient.get(`/presigned-url?filename=${encodeURIComponent(filename)}`);
            return response.data;
        } catch (error) {
            console.error('Presigned URL 요청 실패:', error);
            throw error;
        }
    };

    const uploadImage = async (file) => {
        try {
            const presignedUrl = await requestPresignedUrl(file.name);
            await axios.put(presignedUrl, file, {
                headers: {
                    'Content-Type': file.type,
                },
                withCredentials: false
            });
            return presignedUrl.split("?")[0];
        } catch (error) {
            console.error('이미지 업로드 중 오류 발생', error);
            throw error;
        }
    };

    const handleSubmit = async () => {
        try {
            let imageUrl = clubData.clubImgUrl;

            if (selectedImage) {
                imageUrl = await uploadImage(selectedImage);
            }

            const updatedData = {
                clubName: clubData.clubName,
                clubSlogan: clubData.clubSlogan,
                description: clubData.description,
                clubImgUrl: imageUrl
            };

            await apiClient.post(`/clubs/${id}/changeClubInfo`, updatedData);
            console.log('성공적으로 변경되었습니다.');
            navigate(`/clubs/${id}/myclub`, { state: { isMenuOpen: location.state?.isMenuOpen } });
        } catch (error) {
            console.error('수정 중 오류가 발생했습니다.', error);
        }
    };

    return (
        <div>
            <div className="header_container">
                <FaArrowLeft
                    style={{ fontSize: '24px', cursor: 'pointer' }}
                    onClick={handleBackClick}
                />
                <div style={{ fontSize: '20px', fontWeight: "bold" }}>동아리 정보 수정</div>
                <div></div>
            </div>
            <div className="clubinfo-edit-container">
                <div className="edit-container">
                    {clubData.clubImgUrl ? (
                        <img
                            src={clubData.clubImgUrl}
                            alt="club logo"
                            style={{
                                width: '120px',
                                height: '120px',
                                cursor: 'pointer',
                                marginBottom: "10px",
                            }}
                            onClick={() => document.getElementById('imageInput').click()}
                        />
                    ) : (
                        <label htmlFor="imageInput"
                               style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <RiImageCircleLine
                                style={{ fontSize: '55px', cursor: 'pointer', marginBottom: "10px" }}
                            />
                        </label>
                    )}
                    <div style={{ fontSize: "16.5px" }}>변경할 대표 이미지를 선택하세요.</div>
                    <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />
                </div>
                <div className="edit-container-left">
                    <div className="edit-container-left-in">
                        <div className="edit-title">동아리 이름</div>
                        <input
                            type="text"
                            name="clubName"
                            value={clubData.clubName}
                            onChange={handleInputChange}
                            className="edit-input-box"
                            style={{ width: "35%", height: "35px", textAlign: "center" }}
                        />
                    </div>
                    <div className="edit-container-left-in">
                        <div className="edit-title">슬로건</div>
                        <textarea
                            name="clubSlogan"
                            value={clubData.clubSlogan}
                            onChange={handleInputChange}
                            className="edit-input-box"
                            style={{ width: "60%", height: "70px" }}
                        />
                    </div>
                    <div className="edit-container-left-in">
                        <div className="edit-title">설명</div>
                        <textarea
                            name="description"
                            value={clubData.description}
                            onChange={handleInputChange}
                            className="edit-input-box"
                            style={{ width: "60%", height: "170px" }}
                        ></textarea>
                    </div>
                </div>
                <button className="att-complete-button" style={{ marginBottom: "20px" }} onClick={handleSubmit}>완료
                </button>
            </div>
        </div>
    );
}

export default ClubInfoEdit;
