import React from 'react';
import {useNavigate} from 'react-router-dom';
import Header_center from "../../components/header/Header_center.jsx";
import './login_styles/signup.css'
import '../../styles/App.css'
import {FaArrowLeft} from "react-icons/fa6";

function Modal({onClose}) {
    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <p>가입이 완료되었습니다!</p>
                    <p>로그인 화면으로 돌아갑니다.</p>
                </div>
                <hr/>
                <button onClick={onClose}>OK</button>
            </div>
        </div>
    )
}


function signup () {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [username, setUserName] = React.useState('');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [name, setName] = React.useState('');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [department, setDepartment] = React.useState('');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [password, setPassword] = React.useState('');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [confirmPassword, setConfirmPassword] = React.useState('');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [duplicateId, setDuplicateId] = React.useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate = useNavigate();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [showModal, setShowModal] = React.useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [phone, setPhone] = React.useState('');

    const handleDuplicateCheck = () => {
        setDuplicateId(true);
    }

    const handleBackClick = () => {
        window.history.back();
    }


    // 회원가입 API 나중에 개발.
    const handleSignUp = async () => {
        try {
            if(password !== confirmPassword) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }

            const formData = new FormData();
            formData.append('name', name);
            formData.append('username', username);
            formData.append('password', password);
            formData.append('department', department);
            formData.append('phone', phone);

            const response = await fetch('https://zmffjq.store/signup', {
                method: 'POST',
                body: formData
            });

            if(response.status === 200) {
                localStorage.setItem('userInfo', JSON.stringify({name, username}))
                setShowModal(true);
            } else {
                throw new Error('회원가입에 실패했습니다.');
            }
        }catch(error){
            console.log('회원가입 중 에러 발생:',error);
            alert('회원가입 중 에러가 발생하였습니다.');
        }
    }

    const handleModalClose = () => {
        setShowModal(false);
        navigate('/login');
    }

    return(
        <div>
            <div className="header-container">
                <FaArrowLeft onClick={handleBackClick} style={{ cursor: 'pointer', marginTop:'30px', marginLeft:'35px'}}/>
                <div className="signup-header-center">
                    <Header_center/>
                </div>
            </div>
            <div className="signup-title">
                회원가입
            </div>
            <div className="signup-container">
                <div className="input-group">
                    <label htmlFor="student-name">이름</label>
                    <input
                        id="student-name"
                        type="text"
                        placeholder="이름을 입력해주세요."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="student-id">학번</label>
                    <div className="input-with-button">
                        <input
                            id="student-id"
                            type="id"
                            placeholder="학번을 입력해주세요."
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="input-group">
                    <label htmlFor="passowrd">비밀번호</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="비밀번호를 입력해주세요."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">비밀번호 확인</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="비밀번호를 다시 입력해주세요."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{
                            borderColor: password !== confirmPassword && confirmPassword !== '' ? 'red' : '',
                            borderWidth: password !== confirmPassword && confirmPassword !== '' ? '1px' : ''
                        }}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="student-major">학과</label>
                    <input
                        id="student-major"
                        type="text"
                        placeholder="학과를 입력해주세요."
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="phone">핸드폰 번호</label>
                    <input
                        id="phone"
                        type="text"
                        placeholder="010-0000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <button type="submit" className="signup-btn" onClick={handleSignUp}>가입하기</button>
                {showModal && (
                    <Modal onClose={handleModalClose}/>
                )}
            </div>
        </div>
    )
}

export default signup;