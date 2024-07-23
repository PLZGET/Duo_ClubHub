const images = require.context("../images", false, /\.(png|jpe?g|svg)$/);

let member_info_data = [
    {
        memberId: 101,
        memberImageURL: images("./member1.png"),
        name: "도라에몽",
        studentId: 2021000001,
        department: "컴퓨터공학부",
        role: "회장",
        phone: "010-0000-0001",
        password: 1234,
        content: "지원 동기 1",
        link: "/clubs/:id/joinRequest/101"
    },
    {
        memberId: 102,
        memberImageURL: images("./member2.png"),
        name: "진구",
        studentId: 2021000002,
        department: "컴퓨터공학부",
        role: "부회장",
        phone: "010-0000-0002",
        password: 1234,
        content: "지원 동기 2",
        link: "/clubs/:id/joinRequest/102"
    },
    {
        memberId: 103,
        memberImageURL: images("./member3.png"),
        name: "퉁퉁이",
        studentId: 2021100003,
        department: "컴퓨터공학부",
        role: "일반",
        phone: "010-0000-0003",
        password: 1234,
        content: "지원 동기 3",
        link: "/clubs/:id/joinRequest/103"
    },
    {
        memberId: 104,
        memberImageURL: images("./member4.png"),
        name: "비실이",
        studentId: 2021100004,
        department: "컴퓨터공학부",
        role: "일반",
        phone: "010-0000-0004",
        password: 1234,
        content: "지원 동기 4",
        link: "/clubs/:id/joinRequest/104"
    }
];

export default member_info_data;