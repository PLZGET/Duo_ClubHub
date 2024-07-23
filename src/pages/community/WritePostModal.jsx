import React, { useState } from 'react';
import axios from 'axios';
import './community_styles/writepostmodal.css';

function WritePostModal({ isOpen, onClose, onSubmit }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [clubName, setClubName] = useState('');
    const [files, setFiles] = useState([]);
    const [attachmentNames, setAttachmentNames] = useState([]);
    const [urlArray, setUrlArray] = useState([]);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        setAttachmentNames(selectedFiles.map(file => file.name));
    };

    const uploadFileToS3 = async (file) => {
        try {
            const filename = encodeURIComponent(file.name);
            const response = await axios.get(`https://zmffjq.store/presigned-url?filename=${filename}`);
            const presignedUrl = response.data;

            await fetch(presignedUrl, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file
            });

            const uploadedFileUrl = presignedUrl.split('?')[0];
            return uploadedFileUrl;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };

    const handleSubmit = async () => {
        if (title && content && clubName) {
            try {
                const uploadPromises = files.map(file => uploadFileToS3(file));
                const fileUrls = await Promise.all(uploadPromises);

                console.log('All uploaded file URLs:', fileUrls); // 모든 파일 URL을 콘솔에 찍기

                const postData = {
                    title,
                    content,
                    attachment_flag: files.length > 0 ? 'Y' : 'N',
                    attachment_names: fileUrls, // 업로드된 파일의 URL을 attachmentNames로 설정
                    club_name: clubName
                };
                const response = await fetch('https://zmffjq.store/board/1/posts', {
                    method: 'POST',
                    body: JSON.stringify(postData),
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });

                if (response.ok) {
                    const responseData = await response.json();
                    console.log('Post created successfully:', responseData);
                    setTitle('');
                    setContent('');
                    setClubName('');
                    setFiles([]);
                    setAttachmentNames([]);
                    setUrlArray([]);
                    onClose();
                } else {
                    throw new Error('Failed to create post with status: ' + response.status);
                }
            } catch (error) {
                console.error('Error submitting post:', error);
            }
        } else {
            alert('제목, 내용, 동아리 이름을 모두 입력해주세요.');
        }
    };

    return (
        <div className="post-edit-overlay">
            <div className="post-edit">
                <header className="edit-header">
                    <span onClick={onClose} className="edit-cancel">X</span>
                    <h2 className="edit-title">글쓰기</h2>
                    <span onClick={handleSubmit} className="edit-save">✓</span>
                </header>
                <hr style={{ marginTop: '-30px' }} />
                <div className="edit-form">
                    <input
                        type="text"
                        placeholder="제목"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ fontWeight: 'bold', fontSize: '18px', width: '100%', marginBottom: '10px', padding: '5px' }}
                    />
                    <input
                        type="text"
                        placeholder="동아리 이름"
                        value={clubName}
                        onChange={(e) => setClubName(e.target.value)}
                        style={{ fontSize: '16px', width: '100%', marginBottom: '10px', padding: '5px' }}
                    />
                    <hr />
                    <textarea
                        placeholder="내용을 입력하세요."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ fontSize: '16px', width: '100%', height: 'calc(100vh - 300px)', padding: '5px' }}
                    />
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        style={{ marginTop: '10px' }}
                    />
                </div>
            </div>
        </div>
    );
}

export default WritePostModal;
