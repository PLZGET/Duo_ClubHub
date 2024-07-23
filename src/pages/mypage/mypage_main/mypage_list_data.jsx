import { CiViewList } from "react-icons/ci";
import { TbUserEdit } from "react-icons/tb";
import { FiUserPlus, FiUserX } from "react-icons/fi";

let list_data = [
    {
        name: "작성한 글 보기",
        icon: <CiViewList />,
        link: "/post_list/:memberId"
    },
    {
        name: "정보 수정",
        icon: <TbUserEdit />,
        link: "/edit_info/:memberId"
    },
    {
        name: "동아리 만들기",
        icon: <FiUserPlus />,
        link: "/clubs/create/:memberId"
    },
    {
        name: "회원 탈퇴",
        icon: <FiUserX/>,
        isDelete: true,
        message: "정말 회원 탈퇴하시겠습니까?<br />모든 데이터가 삭제됩니다."
    }
];

export default list_data;