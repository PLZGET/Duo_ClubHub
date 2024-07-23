import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './activity.css';
import { FaArrowLeft } from "react-icons/fa6";
import dm from "../../../images/DM.png";

function ActivityDetailPage() {
    const navigate = useNavigate();
    const { clubId, postId } = useParams();
    const [post, setPost] = useState(null);
    const [clubImgUrl, setClubImgUrl] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postResponse, clubsResponse] = await Promise.all([
                    axios.get(`https://zmffjq.store/board/3/clubs/${clubId}/posts/${postId}`),
                    axios.get('https://zmffjq.store/clubs')
                ]);

                const postData = postResponse.data;
                const attachmentNames = postData.attachmentNames || [];

                setPost({
                    ...postData.post,
                    attachmentNames: attachmentNames
                });

                const clubs = clubsResponse.data;
                const currentClub = clubs.find(club => club.clubId === parseInt(clubId));
                if (currentClub) {
                    setClubImgUrl(currentClub.clubImgUrl);
                }
            } catch (error) {
                console.error('Error fetching post detail or club info:', error);
            }
        };

        fetchData();
    }, [clubId, postId]);

    const handleBack = () => {
        navigate('/community');
    };

    if (!post || !clubImgUrl) {
        return <div>Loading...</div>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    return (
        <div>
            <div className="header">
                <FaArrowLeft
                    style={{ fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer', marginLeft: '15px' }}
                    onClick={handleBack}/>
                <p>활동 내용</p>
            </div>
            <div className="detail-info">
                <img src={clubImgUrl} alt="club" className="clubs-logo" />
                <h2 style={{
                    fontSize: "20px",
                    fontWeight: 'bold',
                    marginLeft: '10px',
                    marginTop: '10px'
                }}>{post.clubName}</h2>
            </div>
            <div className="post-content">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                {post.attachmentFlag === 'Y' && post.attachmentNames && post.attachmentNames.length > 0 && (
                    <div className="attachments">
                        {post.attachmentNames.map((url, index) => (
                            <img key={index} src={url} alt={`첨부 이미지 ${index + 1}`} style={{ maxWidth: '100%', marginBottom: '10px' }} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ActivityDetailPage;