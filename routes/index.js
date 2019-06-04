var express = require('express');
var router = express.Router();
var path=require('path');
var passport = require('passport');
var User=require('../models/user');
var bodyParser = require('body-parser');
var fs = require('fs');


router.post('/login', passport.authenticate('login', {
    successRedirect : '/',
    failureRedirect : '/signin', //로그인 실패시 redirect할 url주소
    failureFlash : true
}));
router.post('/signup', passport.authenticate('signup', {
    successRedirect : '/signin',
    failureRedirect : '/signup', //가입 실패시 redirect할 url주소
    failureFlash : true
}));
router.post('/editProfile', isLoggedIn, (req,res)=>{
    User.findOneAndUpdate(
      {userid:req.user.userid},
      {$set:{name:req.body.name, password:new User().generateHash(req.body.password)}},
      (err,doc)=>{
        if(err){
          res.redirect('/edit');
        }
        else {
          res.redirect('/');
        }
      }
    );
});
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    res.redirect('/');
});

//로그인 확인
function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/signin');
    }
}

/* GET home page. */
router.get('/', function(req, res, next) {
    var isLogin = req.isAuthenticated();
    var user = req.user;
    if(user){
      var name = user.name;
      var solvedQuiz = user.solvedQuiz;
      var score = user.scores;
      var days = user.loginCount;
      var rank = 0;
    }
    var main = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <title>Quiz</title>
        <link rel="stylesheet" href="stylesheets/mainCss.css">
        <link rel="stylesheet" href="stylesheets/basic.css">
        <script src="scripts/basicJs.js"></script>
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/moonspam/NanumSquare@1.0/nanumsquare.css">
    </head>
    <body onload="loginCheck(${isLogin})">

    <header style="z-index: 1">
        <img src="images/list.png" id="listBtn" onclick="openBox()">
        <a href="/" style="text-decoration: none;"><h1 id="title">Quiz</h1></a>
        <a href="signup" class="login" id="signUpBtn">회원가입</a>
        <a href="signin" class="login" id="signInBtn">로그인</a>
    </header>

    <div id="secondTitle">
        <p id="hello">Hi Quiz!</p>
    </div>

    <article>

        <section id="box">
            <span id="profileName">${name}</span>
            <span>님 환영합니다!</span><br>
            <div style="margin-top: 10px">
                <span>푼 문제 수: </span>
                <span class="profileComment">${solvedQuiz}</span>
                <span>개</span><br>
                <span>점수 : </span>
                <span class="profileComment" id="profileSolved">${score}</span>
                <span>점 ( 상위 </span>
                <span class="profileComment" id="profileRank">${rank}%</span>
                <span>)</span><br>
                <span>가입한지 </span>
                <span class="profileComment" id="profileDay">${days}</span>
                <span>일</span>
            </div>
        </section>

        <hr>

        <h2>퀴즈 풀기</h2><br>

        <a href="knowledge/1"><button class="category" onmouseover="categoryMouseOver(this)" onmouseout="categoryMouseOut(this)">상식</button></a>
        <span class="divide"></span>
        <a href="IT/1"><button class="category" onmouseover="categoryMouseOver(this)" onmouseout="categoryMouseOut(this)">IT</button></a>
        <span class="divide"></span>
        <a href="capital/1"><button class="category" onmouseover="categoryMouseOver(this)" onmouseout="categoryMouseOut(this)">수도</button></a>
        <br><br><br><br><br><br>
        <a href="english/1"><button class="category" onmouseover="categoryMouseOver(this)" onmouseout="categoryMouseOut(this)">영어</button></a>
        <span class="divide"></span>
        <a href="az/1"><button class="category" onmouseover="categoryMouseOver(this)" onmouseout="categoryMouseOut(this)">넌센스</button></a>
        <span class="divide"></span>
        <a href="science/1"><button class="category" onmouseover="categoryMouseOver(this)" onmouseout="categoryMouseOut(this)">과학</button></a>
        <br><br><br><br><br><br>
        <a href="enter/1"><button class="category" onmouseover="categoryMouseOver(this)" onmouseout="categoryMouseOut(this)">연예</button></a>
        <span class="divide"></span>
        <a href="math/1"><button class="category" onmouseover="categoryMouseOver(this)" onmouseout="categoryMouseOut(this)">수학</button></a>
        <span class="divide"></span>
        <a href="social/1"><button class="category" onmouseover="categoryMouseOver(this)" onmouseout="categoryMouseOut(this)">사회</button></a>
        <br><br><br><br><br><br>
        <button id="ready">준비중</button>

    </article>

    <footer>
        <span id="footer">제작 : 10509 김수빈<br>제작 기간 : 2018/11/15 ~ 2018/12/03<br>Copyright 2018, Comsiil. All right reserved.</span>
    </footer>

    <nav>
        <section id="listBox">
            <img src="images/list.png" alt="" id="listBtn2" onclick="closeBox()">
            <h1 id="titleInBox">Quiz</h1>
            <h2 id="userName">${name}</h2>
            <hr>
            <h2 class="listIndex">Quiz</h2>
            <a href="knowledge/1"><p class="quizIndex">상식</p></a>
            <a href="IT/1"><p class="quizIndex">IT</p></a>
            <a href="capital/1"><p class="quizIndex">수도</p></a>
            <a href="az/1"><p class="quizIndex">넌센스</p></a>
            <a href="science/1"><p class="quizIndex">과학</p></a>
            <a href="english/1"><p class="quizIndex">영어</p></a>
            <a href="enter/1"><p class="quizIndex">연예</p></a>
            <a href="social/1"><p class="quizIndex">사회</p></a>
            <a href="math/1"><p class="quizIndex">수학</p></a>
        </section>
    </nav>

    </body>

    <script>
        function categoryMouseOver(button) {
            button.style.fontWeight = "800";
        }
        function categoryMouseOut(button) {
            button.style.fontWeight = "500";
        }
    </script>

    </html>
    `;
    res.send(main);
});
router.get('/signin', function(req, res, next) {
    console.log(req.flash('loginMessage')[0]);
    console.log(req.flash('signupMessage')[0]);
    res.sendFile(path.join(__dirname,'html','/signin.html'));
});
router.get('/signup', function(req, res, next) {
    console.log(req.flash('loginMessage')[0]);
    console.log(req.flash('signupMessage')[0]);
    res.sendFile(path.join(__dirname,'html','/signup.html'));
});
router.get('/edit', isLoggedIn, function (req,res){
  var edit=`
  <!DOCTYPE html>
  <html lang="ko">

  <head>
    <meta charset="UTF-8">
    <title>Quiz</title>
    <link rel="stylesheet" href="stylesheets/edit.css">
    <link rel="stylesheet" href="stylesheets/basic.css">
    <script src="scripts/basicJs.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/moonspam/NanumSquare@1.0/nanumsquare.css">
  </head>

  <body onload="loginCheck(${req.isAuthenticated()})">

    <header>
      <img src="images/list.png" id="listBtn" onclick="openBox()">
      <a href="/" id="gotoMain"><h1 id="title">Quiz</h1></a>
      <a href="/signup" class="login" id="signUpBtn">회원가입</a>
      <a href="/signin" class="login" id="signInBtn">로그인</a>
    </header>

    <article>
      <section id="box" style="margin-top: 150px">
        <span id="editTitle">Edit</span><br>
        <div style="margin-top: 50px">
          <form action="/editProfile" method="POST" id="edit">
            <table>
                  <tr>
                      <td>
                          <label for="name">닉네임</label>
                      </td>
                      <td><input style="font-family: san-serif" type="text" id="name" placeholder="닉네임" autofocus size="30" required height="300px" name="name"></td>
                  </tr>
                  <tr>
                      <td>
                          <label for="password">비밀번호&nbsp;&nbsp;</label>
                      </td>
                      <td>
                          <input style="font-family: san-serif" type="password" id="password" placeholder="비밀번호" size="30" required name="password">
                      </td>
                  </tr>
                  <tr>
                      <td>
                          <button type="submit" id="submit" onmouseover="changeColor()" onmouseout="backColor()">정보 변경</button>
                      </td>
                  </tr>
              </table>
          </form>
        </div>
      </section>

    </article>
    <nav>
      <section id="listBox">
        <img src="images/list.png" alt="" id="listBtn2" onclick="closeBox()">
        <h1 id="titleInBox">Quiz</h1>
        <span id="userName">${req.user.name}</span>
        <hr>
        <h2 class="listIndex">Quiz</h2>
        <a href="/knowledge/1"><p class="quizIndex">상식</p></a>
        <a href="/IT/1"><p class="quizIndex">IT</p></a>
        <a href="/captial/1"><p class="quizIndex">수도</p></a>
        <a href="/az/1"><p class="quizIndex">넌센스</p></a>
        <a href="/science/1"><p class="quizIndex">과학</p></a>
        <a href="/english/1"><p class="quizIndex">영어</p></a>
        <a href="/enter/1"><p class="quizIndex">연예</p></a>
        <a href="/social/1"><p class="quizIndex">사회</p></a>
        <a href="/math/1"><p class="quizIndex">수학</p></a>
      </section>
    </nav>
    <footer style="position: fixed; bottom: 0; width: 100%;">
      <span id="footer">제작 : 10509 김수빈<br>제작 기간 : 2018/11/15 ~ 2018/12/03<br><br><br>Copyright 2018, Comsiil. All right reserved.</span>
    </footer>

  </body>

  <script>
    function openBox() {
      document.getElementById("listBox").style.width = "300px"
      document.getElementById("listBtn2").style.width = "40px"
    }

    function closeBox() {
      document.getElementById("listBox").style.width = "0px"
      document.getElementById("listBtn2").style.width = "0px"
    }

    function changeColor() {
      var a = document.getElementById("submit");
      a.style.color = "#00a44a";
      a.style.backgroundColor = "white";
    }

    function backColor() {
      var a = document.getElementById("submit");
      a.style.color = "white";
      a.style.backgroundColor = "#00a44a";
    }
  </script>

  </html>
  `;
  res.send(edit);
});
router.get('/:quizGenre/:quizNumber', isLoggedIn, (req,res)=>{
  var solving=`
  <!DOCTYPE html>
  <html lang="ko">
  <head>
      <meta charset="UTF-8">
      <title>Quiz</title>
      <link rel="stylesheet" href="../stylesheets/mainCss.css">
      <link rel="stylesheet" href="../stylesheets/basic.css">
      <script src="../scripts/basicJs.js"></script>
      <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/moonspam/NanumSquare@1.0/nanumsquare.css">
      <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
      <style>
          .scoreExplain {
              float: right;
          }
      </style>
  </head>

  <body onload="loginCheck(); setQuiz();">
  <header>
      <img src="../images/list.png" id="listBtn" onclick="openBox()">
      <a href="../" style="text-decoration: none;"><h1 id="title">Quiz</h1></a>
      <a href="../signup" class="login" id="signUpBtn">회원가입</a>
      <a href="../signin" class="login" id="signInBtn">로그인</a>
  </header>

  <article id="currentScore" style="margin-bottom: 0;">
      <span id="currentScoreText">현재 점수 : </span><span id="currentScoreScore">0점</span>
  </article>

  <article style="margin-top: 0">
    <section id="box" style="margin-bottom: 10px">
        <span style="color: #00a44a; font-weight: bold; font-size: 25pt;">#</span>
        <h1 id="num" style="display: inline;">1</h1>
        <span class="scoreExplain">점]</span>
        <span id="score">0</span>
        <span class="scoreExplain">[</span>
        <p id="sentence">문제를 불러 오는 중입니다...</p>
    </section>
      <br>
      <table>
        <tr>
            <td class="select" onclick="checkAnswer(1)">
                <span>①</span>
                <span id="choice1"></span>
            </td>
        </tr>
        <tr>
            <td class="select" onclick="checkAnswer(2)">
                <span>②</span>
                <span id="choice2"></span>
            </td>
        </tr>
        <tr>
            <td class="select" onclick="checkAnswer(3)">
                <span>③</span>
                <span id="choice3"></span>
            </td>
        </tr>
        <tr>
            <td class="select" onclick="checkAnswer(4)">
                <span>④</span>
                <span id="choice4"></span>
            </td>
        </tr>
        <tr>
            <td class="select" onclick="checkAnswer(5)">
                <span>⑤</span>
                <span id="choice5"></span>
            </td>
        </tr>
    </table>
      <p style="font-size: 15pt; color: #00a44a; font-weight: bold;">제한 시간</p>
      <div id="timerBar">10</div>
  </article>

  <footer style="position: fixed; bottom: 0; width: 100%;">
      <span id="footer">제작 : 10509 김수빈<br>제작 기간 : 2018/11/15 ~ 2018/12/03<br>Copyright 2018, Comsiil. All right reserved.</span>
  </footer>

  <nav>
      <section id="listBox">
          <img src="../images/list.png" alt="" id="listBtn2" onclick="closeBox()">
          <h1 id="titleInBox">Quiz</h1>
          <h2 id="userName">${req.user.name}</h2>
          <hr>
          <h2 class="listIndex">Quiz</h2>
          <a href="../knowledge/1"><p class="quizIndex">상식</p></a>
          <a href="../IT/1"><p class="quizIndex">IT</p></a>
          <a href="../capital/1"><p class="quizIndex">수도</p></a>
          <a href="../az/1"><p class="quizIndex">넌센스</p></a>
          <a href="../science/1"><p class="quizIndex">과학</p></a>
          <a href="../english/1"><p class="quizIndex">영어</p></a>
          <a href="../enter/1"><p class="quizIndex">연예</p></a>
          <a href="../social/1"><p class="quizIndex">사회</p></a>
          <a href="../math/1"><p class="quizIndex">수학</p></a>
      </section>
  </nav>

  </body>

  <script>
    var count = 1;
    var currentScore = 0;
    var solvedQuiz = 0;

    var timerBar = document.getElementById("timerBar");
    var timerBarPercent = 90;
    var time = 10;
    var timerID = setInterval("timer()", 1000);

    var quiz = null;

    function setQuiz() {
        quiz = getQuizInfo(window.location.pathname.split('/')[1], count);
        if(quiz){
          document.getElementById("num").innerHTML = count;
          document.getElementById("score").innerHTML = quiz['score'];
          document.getElementById("sentence").innerHTML = quiz['sentence'];
          document.getElementById("currentScoreScore").innerHTML = currentScore;
          document.getElementById("choice1").innerHTML = quiz['choices'][0];
          document.getElementById("choice2").innerHTML = quiz['choices'][1];
          document.getElementById("choice3").innerHTML = quiz['choices'][2];
          document.getElementById("choice4").innerHTML = quiz['choices'][3];
          document.getElementById("choice5").innerHTML = quiz['choices'][4];
          count++;
        }
        else{
          $.ajax({
            url:window.location.protocol+"//"+window.location.host+"/save",
            data:{"score":currentScore,"solvedQuiz":solvedQuiz},
            type:'POST',
            success:function(data){
              window.open('../result', '_self');
            },
            async:false
          });
        }
    }

    function checkAnswer(choice) {
        if(choice == quiz['answer']) {
            currentScore += quiz['score'];
            solvedQuiz++;
            timerBarPercent = -10;
            timer();
        }
        else {
            alert('틀렸습니다!');
            timerBarPercent = -10;
            timer();
        }
    }

    function timer() {
        document.getElementById("timerBar").innerHTML = --time;
        timerBar.style.width = timerBarPercent + "%";
        timerBarPercent -= 10;
        if(timerBarPercent == -20) {
            clearInterval(timerID);

            document.getElementById("currentScoreScore").innerHTML = currentScore;
            quiz = getQuizInfo(window.location.pathname.split('/')[1], count);
            if(quiz){
              document.getElementById("num").innerHTML = count;
              document.getElementById("score").innerHTML = quiz['score'];
              document.getElementById("sentence").innerHTML = quiz['sentence'];
              document.getElementById("choice1").innerHTML = quiz['choices'][0];
              document.getElementById("choice2").innerHTML = quiz['choices'][1];
              document.getElementById("choice3").innerHTML = quiz['choices'][2];
              document.getElementById("choice4").innerHTML = quiz['choices'][3];
              document.getElementById("choice5").innerHTML = quiz['choices'][4];
              count++;
              timerBar.style.width = "100%";
              timerBar.innerHTML = "10";
              timerBarPercent = 90;
              time = 10;
              timerID = setInterval("timer()", 1000);
            }
            else{
              $.ajax({
                url:window.location.protocol+"//"+window.location.host+"/save",
                data:{"score":currentScore,"solvedQuiz":solvedQuiz},
                type:'POST',
                success:function(data){
                  window.open('../result', '_self');
                },
                async:false
              });
            }
        }
    }

    function getQuizInfo(quizGenre, quizNumber){
      var result;
        $.ajax({
            url:window.location.protocol+"//"+window.location.host+"/"+quizGenre+"/"+quizNumber,
            type:'POST',
            dataType:'json',
            success:function(data){
                console.log(data);
                result = data;
            },
            async:false
        });
        return result;
    }

  </script>

  </html>
  `;
  res.send(solving);
});
router.post('/:quizGenre/:quizNumber', (req,res)=>{
  //Get Quiz Info
  var obj = JSON.parse(fs.readFileSync(path.join(__dirname, req.params.quizGenre,'quiz.json'), 'utf8'));
  var quiz = obj[req.params.quizNumber];
  res.json(quiz);
});
router.post('/save', isLoggedIn, (req,res)=>{
  User.findOneAndUpdate(
    {userid:req.user.userid},
    {$set:{scores:eval(req.user.scores+"+"+req.body.score), solvedQuiz:eval(req.user.solvedQuiz+"+"+req.body.solvedQuiz), lastScore:req.body.score, lastSolvedQuiz:req.body.solvedQuiz}},
    (err,doc)=>{
      if(err){
        console.log(err);
      }
      else {
        console.log("변경됨");
      }
    }
  );
  res.end();
});
router.get('/result', isLoggedIn, (req, res)=>{
  var lastSolvedQuiz = req.user.lastSolvedQuiz;
  var lastScore = req.user.lastScore;
  var result = `
  <!DOCTYPE html>
  <html lang="ko">

  <head>
    <meta charset="UTF-8">
    <title>Quiz</title>
    <link rel="stylesheet" href="stylesheets/result.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/moonspam/NanumSquare@1.0/nanumsquare.css">
    <link rel="stylesheet" href="stylesheets/basic.css">
    <script src="scripts/basicJs.js"></script>
  </head>

  <body onload="loginCheck(${req.isAuthenticated()})">

    <header>
      <img src="/images/list.png" id="listBtn" onclick="openBox()">
      <a href="/" id="gotoMain"><h1 id="title">Quiz</h1></a>
      <a href="/signup" class="login" id="signUpBtn" style="margin-right: 10%">회원가입</a>&nbsp;
      <a href="/signin" class="login" id="signInBtn">로그인</a>
    </header>

    <article>
      <section id="box" style="margin-top: 150px;">
        <span id="resultTitle">Result</span><br>
        <div style="margin-top: 50px">
            <table>
              <tr>
                <td>
                  <label for="hitNumber" id="hitNumber">${lastSolvedQuiz}</label>
                  <label for="hitNumber" id="hNComment">개를 맞추셨습니다</label>
                </td>
              </tr>
              <tr>
                <td>
                  <label for="score" id="score">${lastScore}</label>
                  <label for="score" id="sComment">점</label>
                </td>
              </tr>
              <tr>
                <td>
                  <a href="/"><button type="submit" id="submit" onmouseover="changeColor()" onmouseout="backColor()">메인으로 가기</button></a>
                </td>
              </tr>
            </table>
        </div>
      </section>

    </article>
    <nav>
      <section id="listBox">
        <img src="/images/list.png" alt="" id="listBtn2" onclick="closeBox()">
        <h1 id="titleInBox">Quiz</h1>
        <span id="userName">${req.user.name}</span>
        <hr>
        <h2 class="listIndex">Quiz</h2>
        <a href="/knowlege/1"><p class="quizIndex">상식</p></a>
        <a href="/IT/1"><p class="quizIndex">IT</p></a>
        <a href="/capital/1"><p class="quizIndex">수도</p></a>
        <a href="/az/1"><p class="quizIndex">넌센스</p></a>
        <a href="/science/1"><p class="quizIndex">과학</p></a>
        <a href="/english/1"><p class="quizIndex">영어</p></a>
        <a href="/enter/1"><p class="quizIndex">연예</p></a>
        <a href="/social/1"><p class="quizIndex">사회</p></a>
      </section>
    </nav>
    <footer style="position: fixed; bottom: 0; width: 100%;">
      <span id="footer">제작 : 10509 김수빈<br>제작 기간 : 2018/11/15 ~ 2018/12/03<br><br><br>Copyright 2018, Comsiil. All right reserved.</span>
    </footer>

  </body>

  <script>
    function openBox() {
      document.getElementById("listBox").style.width = "300px"
      document.getElementById("listBtn2").style.width = "40px"
    }

    function closeBox() {
      document.getElementById("listBox").style.width = "0px"
      document.getElementById("listBtn2").style.width = "0px"
    }

    function changeColor() {
      var a = document.getElementById("submit");
      a.style.color = "#00a44a";
      a.style.backgroundColor = "white";
    }

    function backColor() {
      var a = document.getElementById("submit");
      a.style.color = "white";
      a.style.backgroundColor = "#00a44a";
    }
  </script>

  </html>
  `;
  res.send(result);
});
module.exports = router;
