import React, { useState } from 'react';
import './calendar.css'; // 이 파일에 스타일을 정의해야 합니다

const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(5); // 6월부터 시작 (0-indexed)
    const [currentYear, setCurrentYear] = useState(2024);

    const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월",
        "7월", "8월", "9월", "10월", "11월", "12월"];

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const events = [
        { dates: [26, 27, 28, 29, 30], type: 'dance', description: '댄스 동아리 교내 공연' },
        { dates: [12, 13, 14], type: 'board-game', description: '보드게임 동아리 부원 모집' },
        { dates: [1, 2, 3, 4, 5], type: 'stock', description: '주식 동아리 주식 대회 접수' },
    ];

    const getEventType = (day) => {
        for (let event of events) {
            if (event.dates.includes(day)) {
                return event.type;
            }
        }
        return '';
    };

    const renderCalendar = () => {
        let days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="day empty"></div>);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            const eventType = getEventType(i);
            days.push(
                <div key={i} className={`day ${eventType}`}>
                    {i}
                </div>
            );
        }
        return days;
    };

    const changeMonth = (delta) => {
        let newMonth = currentMonth + delta;
        let newYear = currentYear;
        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    return (
        <div className="calendar-container">
            <div className="calendar-cont">
            <div className="calendar-header">
                <button onClick={() => changeMonth(-1)}>&lt;</button>
                <h2 style={{
                    width: '120%'
                }}>{currentYear}년 {monthNames[currentMonth]}</h2>
                <button onClick={() => changeMonth(1)}>&gt;</button>
                <button className="add-event">+</button>
            </div>
            <div className="weekdays">
                <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
            </div>
            <div className="calendar">
                {renderCalendar()}
            </div>
            </div>
            <div className="calendar-legend">
                <p><span className="legend dance"></span> 26 ~ 30 댄스 동아리 교내 공연</p>
                <p><span className="legend board-game"></span> 12 ~ 14 보드게임 동아리 부원 모집</p>
                <p><span className="legend stock"></span> 1 ~ 5 주식 동아리 주식 대회 접수</p>
            </div>
        </div>
    );
};

export default Calendar;