function openBox() {
    document.getElementById("listBox").style.width = "300px";
    document.getElementById("listBtn2").style.width = "40px";
}

function closeBox() {
    document.getElementById("listBox").style.width = "0px";
    document.getElementById("listBtn2").style.width = "0px";

}

function loginCheck(isLogin) {
    if(isLogin == false) {
        document.getElementById("box").innerHTML = "<p style='line-height: 70px; font-size: 15pt'>로그인 해주세요!</p>";
    }
    else {
        document.getElementById("signInBtn").innerHTML = "로그아웃";
        document.getElementById("signInBtn").href = "/logout";
        document.getElementById("signUpBtn").innerHTML = "회원 정보 수정";
        document.getElementById("signUpBtn").href = "/edit";
    }
}
