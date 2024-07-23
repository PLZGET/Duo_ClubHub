import React, {useEffect, useState} from 'react';
import Header_center from "../../components/header/Header_center.jsx";
import Footer from "../../components/footer/Footer.jsx";
import '../../styles/App.css';
import './main_styles/main.css';
import Search from "../../images/search.png";
import axios from 'axios';
import {useNavigate} from "react-router-dom";

function MainPage() {
    const [findClub, setFindClub] = useState('');
    const [allClubs, setAllClubs] = useState([]);
    const [filteredClubs, setFilteredClubs] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllClubs();
    }, []);

    useEffect(() => {
        setActiveIndex(0);
        setFilteredClubs(allClubs);
    }, [allClubs]);

    const fetchAllClubs = async () => {
        try {
            const response = await axios.get("https://zmffjq.store/clubs");
            setAllClubs(response.data);
            setFilteredClubs([]);
        } catch (error) {
            console.error("에러발생:", error);
        }
    }

    const handleMenuClick = (index, item) => {
        setActiveIndex(index);
        if (item === '전체') {
            setFilteredClubs(allClubs);
        } else {
            const clubType = getClubType(item);
            const filtered = allClubs.filter(club => club.clubType === clubType);
            setFilteredClubs(filtered);
        }
    }

    const getClubType = (menuItem) => {
        switch(menuItem) {
            case '체육': return 'SPORT';
            case '학술': return 'ACADEMIC';
            case '문화': return 'CULTURE';
            case '봉사': return 'SERVICE';
            case '신규': return 'NEW';
            default: return '';
        }
    }

    const handleSearch = () => {
        const searchResults = allClubs.filter(club =>
            club.clubName.toLowerCase().includes(findClub.toLowerCase()) ||
            club.description.toLowerCase().includes(findClub.toLowerCase())
        );
        setFilteredClubs(searchResults);
    }

    const handleClubClick = (clubName) => {
        navigate(`/clubs/${clubName}`);
    }

    return (
        <div className="main-container">
            <Header_center/>
            <div className="find-club-container">
                <div className="find-club">
                    <div className="search-input-container">
                        <input
                            type="text"
                            placeholder="원하시는 동아리를 찾아보세요!"
                            value={findClub}
                            onChange={(e) => setFindClub(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                        <img src={Search} alt="search" className="search-icon" onClick={handleSearch}/>
                    </div>
                </div>
            </div>
            <div className="menu-container">
                <div className="menu-scroll">
                    {['전체', '체육', '학술', '문화', '봉사', '신규'].map((item, index) => (
                        <div
                            key={index}
                            className={`menu-all ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => handleMenuClick(index, item)}
                            style={{border: activeIndex === index ? '2px solid black' : '2px solid lightgray'
                                ,  color: activeIndex === index ? 'black' : 'lightgray',
                                fontWeight: activeIndex === index ? '700' : '500',
                                width: '100px', marginTop:'20px'}}
                        >
                            <p>{item}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="clubs-container-wrapper">
                {filteredClubs.map((club) => (
                    <div key={club.clubId} className="clubs-container" onClick={() => handleClubClick(club.clubName)}>
                        <img src={club.clubImgUrl} alt={club.clubName} className="clubs-logos"/>
                        <div className="clubs-it">
                            <p className="clubs-title">{club.clubName}</p>
                            <p className="clubs-sm">{club.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <Footer/>
        </div>
    );
}

export default MainPage;