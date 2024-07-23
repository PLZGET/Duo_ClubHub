import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import '../../styles/App.css'
import './myclubmain.css';
import Header_left from "../../components/header/Header_left.jsx";
import Footer from '../../components/footer/Footer.jsx';
import axios from "axios";

const MyclubMain = () => {
    const [clubs, setClubs] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        ///const memberId = queryParams.get('memberId');
        let memberId = queryParams.get('memberId') || localStorage.getItem('memberId');

        if (!memberId) {
            // memberId가 없으면 로그인 페이지로 리다이렉트
            navigate('/login');
            return;
        } else {
            localStorage.setItem('memberId', memberId);
        }

        const fetchClubs = async () => {
            try {
                const response = await axios.get(`https://zmffjq.store/clubs?memberId=${memberId}`, {
                    params: { memberId }
                });
                if (Array.isArray(response.data)) {
                    setClubs(response.data);
                } else {
                    setClubs([response.data]);
                }
            } catch (error) {
                console.error('동아리 목록을 가져오는 중 에러 발생', error);
            }
        };
        fetchClubs();
    }, [location, navigate]);

    const handleClubClick = (clubId) => {
        const club = clubs.find(club => club.clubId === clubId);
        const queryParams = new URLSearchParams(location.search);
        ///const memberId = queryParams.get('memberId');
        const memberId = queryParams.get('memberId') || localStorage.getItem('memberId');
        navigate(`/clubs/${clubId}/myclub`, { state: { clubName: club.clubName, memberId } });
    };

    return (
        <div className="myclub-detail-container">
            <Header_left/>
            <div className="myclub-main-container">
                <div className="club-list">
                    {clubs.length > 0 && clubs.map(club => (
                        <li key={club.clubId} className="club-item"
                            onClick={() => handleClubClick(club.clubId)}>
                            <div className="club-image">
                                <img src={club.clubImgUrl} alt={club.clubName}/>
                            </div>
                            <span className="club-name">{club.clubName}</span>
                        </li>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default MyclubMain;