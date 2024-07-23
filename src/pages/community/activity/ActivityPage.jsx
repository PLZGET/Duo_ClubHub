import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function ActivityPage() {
    const [clubActivities, setClubActivities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllClubActivities = async () => {
            try {
                // 1. 먼저 모든 동아리 목록을 가져옵니다.
                const clubsResponse = await axios.get('https://zmffjq.store/clubs');
                const clubs = clubsResponse.data;

                // 2. 각 동아리의 활동 내용을 가져옵니다.
                const activitiesPromises = clubs.map(club =>
                    axios.get(`https://zmffjq.store/board/3/clubs/${club.clubId}/posts`)
                );

                const activitiesResponses = await Promise.all(activitiesPromises);

                // 3. 동아리 정보와 활동 내용을 결합합니다.
                const allActivities = clubs.map((club, index) => ({
                    clubId: club.clubId,
                    clubName: club.clubName,
                    clubImgUrl: club.clubImgUrl, // clubImgUrl 추가
                    posts: activitiesResponses[index].data
                })).filter(club => club.posts.length > 0); // 활동 내용이 있는 동아리만 필터링

                setClubActivities(allActivities);
            } catch (error) {
                console.error('Error fetching club activities:', error);
            }
        };

        fetchAllClubActivities();
    }, []);

    const handleInActivity = (clubId, postId) => {
        navigate(`/board/3/clubs/${clubId}/posts/${postId}`);
    };

    return (
        <div className="club-activity">
            {clubActivities.length > 0 ? (
                clubActivities.map(club => (
                    <div key={club.clubId}>
                        <h2>{club.clubName}</h2>
                        {club.posts.map(post => (
                            <div
                                key={post.postId}
                                onClick={() => handleInActivity(club.clubId, post.postId)}
                                style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ccc' }}
                                className="activity-info"
                            >
                                <img src={club.clubImgUrl} alt={club.clubName} className="clubs-logo" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
                                    <h3 style={{ fontSize: "20px", fontWeight: 'bold' }}>{post.title}</h3>
                                    <span style={{ marginLeft: '10px', color: '#666' }}>
                                        {new Date(post.createdAt).toLocaleDateString()} {club.clubName} 활동입니다.
                                    </span>
                                </div>
                            </div>
                        ))}
                        <hr />
                    </div>
                ))
            ) : (
                <p>동아리 활동 내용이 없습니다.</p>
            )}
        </div>
    );
}

export default ActivityPage;