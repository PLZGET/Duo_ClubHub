import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { FaRegPlusSquare } from "react-icons/fa";
import { RiCheckboxBlankCircleLine, RiCheckboxCircleLine } from "react-icons/ri";

function Etc3() {
    const navigate = useNavigate();
    const [votes, setVotes] = useState({
        dinner: [false, false, false],
        mtDate: [false, false, false, false, false]
    });

    const handleBackClick = () => {
        navigate(-1);
    };

    const toggleVote = (category, index) => {
        setVotes(prevVotes => ({
            ...prevVotes,
            [category]: prevVotes[category].map((item, i) => i === index ? !item : item)
        }));
    };

    const handleCompleteClick = () => {
        if (votes.dinner.every(option => !option) && votes.mtDate.every(option => !option)) {
            alert('투표 항목을 선택해주세요.');
        } else {
            console.log('Selected Dinner:', votes.dinner);
            console.log('Selected MT Date:', votes.mtDate);
            alert('투표가 완료되었습니다.');
        }
    };

    return (
        <div>
            <div className="header_container">
                <FaArrowLeft
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{ fontSize: '20px', fontWeight: "bold", marginRight: "10px" }}>투표</div>
                <FaRegPlusSquare
                    style={{ fontSize: '24px', cursor: 'pointer' }}
                />
            </div>
            <div className="scroll-container">
                <div className="aaa">
                    <div className="bbb" style={{ flexDirection: "column", alignItems: "center" }}>
                        <div style={{ fontSize: "21px", fontWeight: "bold", marginBottom: "20px"}}>7월 19일 회식 장소</div>
                        {['포차천국', '파파존스', '피자스쿨'].map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                <div style={{ fontSize: "17px", marginRight: '10px', marginBottom: "10px" }}>{index + 1}. {item}</div>
                                <div style={{marginLeft: "35px", marginBottom: '6.5px'}} onClick={() => toggleVote('dinner', index)}>
                                    {votes.dinner[index] ? (
                                        <RiCheckboxCircleLine style={{ fontSize: '28px', cursor: 'pointer' }} />
                                    ) : (
                                        <RiCheckboxBlankCircleLine style={{ fontSize: '28px', cursor: 'pointer' }} />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bbb" style={{flexDirection: "column", alignItems: "center"}}>
                        <div style={{fontSize: "21px", fontWeight: "bold", marginBottom: "20px"}}>MT 날짜</div>
                        {['07/19 (금)', '07/11 (목)', '07/06 (토)', '06/26 (수)', '06/20 (목)'].map((item, index) => (
                            <div key={index} style={{display: 'flex', alignItems: 'center', marginBottom: '5px'}}>
                                <div style={{fontSize: "17px", marginRight: '10px', marginBottom: "10px"}}>{index + 1}. {item}</div>
                                <div style={{marginLeft: "35px", marginBottom: '6.5px'}} onClick={() => toggleVote('mtDate', index)}>
                                    {votes.mtDate[index] ? (
                                        <RiCheckboxCircleLine style={{fontSize: '28px', cursor: 'pointer'}}/>
                                    ) : (
                                        <RiCheckboxBlankCircleLine style={{fontSize: '28px', cursor: 'pointer'}}/>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <button
                onClick={handleCompleteClick}
                className="att-complete-button"
            >
                완료
            </button>
        </div>
    );
}

export default Etc3;
