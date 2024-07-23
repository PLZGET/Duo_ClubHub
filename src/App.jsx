import React, {useEffect} from 'react';
import './styles/App.css';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Logo from './pages/login/start_logo.jsx';
import Login from './pages/login/login.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Create_club from "./pages/mypage/create_club/Create_club.jsx";
import SignUp from './pages/login/signup.jsx';
import Mypage from './pages/mypage/mypage_main/Mypage.jsx';
import Written_post from "./pages/mypage/written_post/Written_post.jsx";
import Written_post_detail from "./pages/mypage/written_post/Written_post_detail.jsx";
import Edit_info from "./pages/mypage/edit_info/Edit_info.jsx";
import Member_info_fix_list from "./pages/myclub/member_manage/member_info_fix_list/Member_info_fix_list.jsx";
import Member_info_fix from "./pages/myclub/member_manage/member_info_fix/Member_info_fix.jsx";
import MainPage from './pages/main/MainPage.jsx'
import ClubDetailPage from "./pages/main/ClubDetailPage.jsx";
import Community_Main from "./pages/community/Community_Main.jsx";
import PostDetail from "./pages/community/PostDetail.jsx";
import ActivityPage from "./pages/community/activity/ActivityPage.jsx";
import ActivityDetailPage from "./pages/community/activity/ActivityDetailPage.jsx";
import Member_request from "./pages/myclub/member_manage/member_request/Member_request.jsx";
import Member_request_detail from "./pages/myclub/member_manage/member_request/Member_request_detail.jsx";
import MyclubMain from "./pages/myclub/MyclubMain.jsx";
import MyclubDetail from "./pages/myclub/MyclubDetail.jsx";
import Etc1 from "./pages/myclub/etc/Etc1.jsx";
import Atd from "./pages/myclub/etc/Atd.jsx";
import Etc2 from "./pages/myclub/etc/Etc2.jsx";
import Etc3 from "./pages/myclub/etc/Etc3.jsx";
import NoticeList from "./pages/myclub/notice/NoticeList.jsx";
import NoticeWrite from "./pages/myclub/notice/WriteAndEdit/NoticeWrite.jsx";
import FreeBoardList from "./pages/myclub/freeboard/FreeBoardList.jsx";
import NoticeDetail from "./pages/myclub/notice/NoticeDetail.jsx";
import FreeBoardDetail from "./pages/myclub/freeboard/FreeBoardDetail.jsx";
import FreeBoardWrite from "./pages/myclub/freeboard/WriteAndEdit/FreeBoardWrite.jsx";
import NoticeEdit from "./pages/myclub/notice/WriteAndEdit/NoticeEdit.jsx";
import FreeBoardEdit from "./pages/myclub/freeboard/WriteAndEdit/FreeBoardEdit.jsx"
import ClubInfoEdit from "./pages/myclub/DetailHeader/club_manage/ClubInfoEdit.jsx";
import BoardEdit from "./pages/mypage/written_post/BoardEdit.jsx";

//2인팟

function App() {
    const [showLogo, setShowLogo] = React.useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLogo(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    function setScreenSize() {
        let vh = window.innerHeight * 0.01;
        let vw = window.innerWidth * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
        document.documentElement.style.setProperty("--vw", `${vw}px`);
    }

    useEffect(() => {
        setScreenSize();
        window.addEventListener('resize', setScreenSize);


        return () => window.removeEventListener('resize', setScreenSize);
    }, []);

    useEffect(() => {
        console.log("showLogo:", showLogo);
    }, [showLogo]);

    return (
        <Router>
            <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
                <div className="App">
                        <Routes>
                            <Route path="/" element={showLogo ? <Logo /> : <Login />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/members/:memberId" element={<Mypage />} />
                            <Route path="/post_list/:memberId" element={<Written_post />} />
                            <Route path="/posts/:memberId/:postId" element={<Written_post_detail />} />
                            <Route path="/posts_edit/:postId/" element={<BoardEdit />} />
                            <Route path="/edit_info/:memberId" element={<Edit_info />} />
                            <Route path="/clubs/create/:memberId" element={<Create_club />} />
                            <Route path="/clubs/:id/memberInfoFixList" element={<Member_info_fix_list />} />
                            <Route path="/clubs/:id/memberInfoFix/:memberId" element={<Member_info_fix />} />
                            <Route path="/main" element={<MainPage />} />
                            <Route path="/clubs/:clubName" element={<ClubDetailPage />} />
                            <Route path="/community" element={<Community_Main />} />
                            <Route path="/board/1/posts/:postId" element={<PostDetail/>}/>
                            <Route path="/board/3/clubs/:clubId/posts" element={<ActivityPage />} />
                            <Route path="/board/3/clubs/:clubId/posts/:postId" element={<ActivityDetailPage />} />
                            <Route path="/clubs/:id/joinRequest" element={<Member_request />} />
                            <Route path="/clubs/:id/joinRequest/:requestId" element={<Member_request_detail />} />
                            <Route path="/activity_detail" element={<ActivityDetailPage />}/>

                            //내동아리 라우팅
                            <Route path="/clubs" element={<MyclubMain />} />
                            <Route path="/clubs/:id/myclub" element={<MyclubDetail />} />
                            <Route path="/clubs/:id/noticelist" element={<NoticeList />} />
                            <Route path="/clubs/:id/noticelist/noticewrite" element={<NoticeWrite />} />
                            <Route path="/clubs/:clubId/board/2/posts/:postId" element={<NoticeDetail />} />
                            <Route path="/clubs/:clubId/board/2/posts/:postId/edit" element={<NoticeEdit />} />
                            <Route path="/clubs/:id/freeboardlist" element={<FreeBoardList />} />
                            <Route path="/clubs/:id/freeboardlist/freeboardwrite" element={<FreeBoardWrite />} />
                            <Route path="/clubs/:clubId/board/4/posts/:postId" element={<FreeBoardDetail />} />
                            <Route path="/clubs/:clubId/board/4/posts/:postId/edit" element={<FreeBoardEdit />} />
                            <Route path="/clubs/etc1" element={<Etc1 />} />
                            <Route path="/clubs/etc1/atd" element={<Atd />} />
                            <Route path="/clubs/etc2" element={<Etc2 />} />
                            <Route path="/clubs/etc3" element={<Etc3 />} />
                            <Route path="/clubs/:id/changeclubinfo" element={<ClubInfoEdit />} />
                        </Routes>
                    </div>
                </GoogleOAuthProvider>
            </Router>
    );
}

export default App;