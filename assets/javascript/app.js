var count = 0;
var correctAnswer;
var answerChoices;
var jasonData;
var intervalID;
var timer = 20;
var timerDiv = document.getElementById("timer");
var right = 0;
var wrong = 0;
var skipped = 0;
var rightDiv = document.getElementById("right");
var wrongDiv = document.getElementById("wrong");
var skipDiv = document.getElementById("skipped");
var pauseButton = document.getElementById("pause");
var resumeButton = document.getElementById("resume");

//Fisher-Yates shuffle
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function nextObject(){

  console.log("nextObject called");

  timer = 20;

  if(count > 4){
    return gameOver();
  }

  var newArr = jasonData[count].incorrect_answers;
  newArr.push(jasonData[count].correct_answer);
  newArr = shuffle(newArr);
  correctAnswer = jasonData[count].correct_answer;
  answerChoices = document.getElementsByClassName("answer-choice");
  timerDiv.innerHTML = "<p>Timer: " + timer + "</p>";
  document.getElementById("category").innerHTML = jasonData[count].category;
  document.getElementById("question").innerHTML = jasonData[count].question;

  for(i = 0;i < newArr.length;i++){
    document.getElementById('answer'+ i).innerHTML = newArr[i];
  }

  answerOnClick(answerChoices);

  start();

}

function answerOnClick(answers){
    Array.prototype.forEach.call(answers, function(element){
    element.onclick = function(){
      if(element.innerHTML === correctAnswer){
        stop();
        alertMessage("Correct!");
        timer = 20;
        count++;
        right++;
        rightDiv.innerHTML = "<p>Correct: " + right;
      } else {
        stop();
        alertMessage("Wrong!");
        timer = 20;
        count++;
        wrong++;
        wrongDiv.innerHTML = "<p>Wrong: " + wrong;
      }
    }
  })
}

function disableAnswerOnClick(answers){
  Array.prototype.forEach.call(answers, function(element){
    element.onclick = function(){
      alertMessagePaused("Paused!");
    }
  })
}

function start(){
  intervalID = setInterval(countDown, 1000);
}

function countDown(){
  timer--;
  timerDiv.innerHTML = "<p>Timer: " + timer + "</p>";
  if (timer === 0){
    stop();
    alertMessage("You're out of time");
    timer = 20;
    count++;
    skipped++;
    skipDiv.innerHTML = "<p>Skipped: " + skipped + "</p>";
  }
}

function stop(){
  clearInterval(intervalID);
}

function callTrivia(category, difficulty){
  $.ajax({
    url:'https://opentdb.com/api.php?amount=5',
    data: {
      category: category,
      difficulty: difficulty,
      type: 'multiple'
    }
  }).done(function(returnData){
    jasonData = returnData.results;
    console.log(jasonData);
    console.log(returnData.results[count]);
    nextObject();
  });
}

function gameOver(){
  timer = 20;
  timerDiv.innerHTML = "<p>Timer: " + timer + "</p>";
  pauseButton.disabled = true;
  resumeButton.disabled = true;
  alertMessage("You ran out of questions, choose another category!");
}

function alertMessage(message){
  document.getElementById("alertDiv").innerHTML = "<div id='game-alert' class='text-center'><h3>" + message + "</h3><h4>The answer is: " + correctAnswer + "</div>";
  document.getElementById("alertDiv").onclick = function(){
    setTimeout(nextObject, 500);
    document.getElementById("game-alert").style.display = 'none';
  }
}

function alertMessagePaused(message){
  document.getElementById("alertDiv").innerHTML = "<div id='game-alert' class='text-center'><h3>" + message + "</h3></div>";
  document.getElementById("alertDiv").onclick = function(){
    document.getElementById("game-alert").style.display = 'none';
  }
}

document.addEventListener("DOMContentLoaded", function(){
  var selectBox = document.getElementById("select-box");
  var difficultyBox = document.getElementById("difficulty-box");
  var selectButton = document.getElementById("select-button");
  var nextButton = document.getElementById("next-button");
  var pauseButton = document.getElementById("pause");
  var resumeButton = document.getElementById("resume");

  pauseButton.disabled = true;
  resumeButton.disabled = true;
    
  selectButton.onclick = function(){
    if (document.getElementById("game-alert")){
      document.getElementById("game-alert").style.display = 'none';
    }
    stop();
    pauseButton.disabled = false;
    count = 0;
    var index1 = selectBox.selectedIndex;
    var index2 = difficultyBox.selectedIndex;
    callTrivia(selectBox.item(index1).id, difficultyBox.item(index2).id);
  }

  pauseButton.onclick = function(){
    disableAnswerOnClick(answerChoices);
    resumeButton.disabled = false;
    stop();
  }

  resumeButton.onclick = function(){
    answerOnClick(answerChoices);
    resumeButton.disabled = true;
    start();
  }

});