var express = require('express');
var router = express.Router();
var path=require('path');
var bodyParser = require('body-parser');
var fs = require('fs');

//로그인 확인
function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/signin');
    }
}



router.get('/solve', (req, res)=>{
  var obj = JSON.parse(fs.readFileSync(path.join(__dirname,'az','problem.json'), 'utf8'));
  var problem = obj[1][0];
  var choices_array = obj[1][1];
  var choices="";
  for(i in choices_array){
    choices+=(i+1)+"번. "+choices_array[i]+"<br>";
  }
  var solve = `
  ${problem}
  ${choices}
  `;
  res.send(solve);
});
router.post('/submit', (req,res)=>{
  var userAnswer = req.body.answer;
  var jeongdap = JSON.parse(fs.readFileSync(path.join(__dirname,'az','problem.json'), 'utf8'))[1][2];
  if(userAnswer == jeongdap){
    //TODO:add 1 to user's score
  }
});

module.exports = router;
