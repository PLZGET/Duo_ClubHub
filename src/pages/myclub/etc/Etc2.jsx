import React, { useState, useEffect } from 'react';
import '../DetailHeader/myclubheader.css';
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { FaRegPlusSquare } from "react-icons/fa";
import { RiCheckboxBlankCircleLine, RiCheckboxCircleLine } from "react-icons/ri";
import './etc.css';

function Etc2() {
    const navigate = useNavigate();

    const initialSettlement = {
        "7월 19일 회식": false,
        "유니폼 구입": false,
        "MT 참가비": false,
    };

    const [settlement, setSettlement] = useState(initialSettlement);

    useEffect(() => {
        const savedSettlement = localStorage.getItem('settlement');
        if (savedSettlement) {
            setSettlement(JSON.parse(savedSettlement));
        }
    }, []);

    const toggleSettlement = (item) => {
        setSettlement((prev) => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    const saveSettlement = () => {
        localStorage.setItem('settlement', JSON.stringify(settlement));
        alert('정산 상태가 저장되었습니다.');
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <div>
            <div className="header_container">
                <FaArrowLeft
                    style={{ fontSize: '24px', cursor: 'pointer' }}
                    onClick={handleBackClick}
                />
                <div style={{ fontSize: '20px', fontWeight: "bold", marginRight: "10px" }}>정산</div>
                <FaRegPlusSquare
                    style={{ fontSize: '24px', cursor: 'pointer' }}
                />
            </div>
            <div className="aaa" style={{display: "flex", flexDirection: "column"}}>
                {Object.keys(initialSettlement).map((item) => (
                    <div className="etc2-container" key={item} style={{ display: 'flex', alignItems: 'center', justifyContent: "center", marginBottom: '10px'}}>
                        <div style={{alignItems: "flex-start", marginRight: '10px'}}>
                            <div style={{ fontSize: "18.5px", fontWeight: "bold", marginBottom: "10px" }}>{item}</div>
                            <div style={{fontSize: "17px", marginBottom: "15px"}}>
                                {item === "7월 19일 회식" && "인원: 30명 | 비용: 900,000원 | 1인: 31,666원"}
                                {item === "유니폼 구입" && "인원: 20명 | 비용: 500,000원 | 1인: 25,000원"}
                                {item === "MT 참가비" && "인원: 25명 | 비용: 800,000원 | 1인: 32,000원"}
                            </div>
                        </div>
                        <div style={{marginLeft: "50px"}} onClick={() => toggleSettlement(item)}>
                            {settlement[item] ? (
                                <RiCheckboxCircleLine style={{ fontSize: '28px', cursor: 'pointer' }} />
                            ) : (
                                <RiCheckboxBlankCircleLine style={{ fontSize: '28px', cursor: 'pointer' }} />
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={saveSettlement}
                className="att-complete-button"
            >
                완료
            </button>
        </div>
    );
}

export default Etc2;
