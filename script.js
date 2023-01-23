$(document).ready(function () {
  var currentQuestionIndex = 0;
  var questionsData;
  var wrongCounter = 0;
  var totalQuestions = 0;
  var displayedQuestions = [];
  var randomIndex = 0;
  var questionNum = 0;
  var jsonFile = "qs.json";
  $.getJSON(jsonFile, function (data) {
    questionsData = data;
    totalQuestions = questionsData.length;
    displayQuestion();
  });
  function displayQuestion() {
    randomIndex = Math.floor(Math.random() * totalQuestions);
    while (displayedQuestions.indexOf(randomIndex) !== -1) {
      randomIndex = Math.floor(Math.random() * totalQuestions);
    }
    displayedQuestions.push(randomIndex);
    $("#question").html(questionsData[randomIndex].Questions);
    $("#labelA").html(questionsData[randomIndex].A);
    $("#labelB").html(questionsData[randomIndex].B);
    $("#labelC").html(questionsData[randomIndex].C);
    $("#labelD").html(questionsData[randomIndex].D);
    $(".answer input").prop("checked", false);
    $("#result").html("");
    $("#counter1").html("Question:" + (questionNum + 1));
    $("#counter").html("Your score is: " + (questionNum - wrongCounter) + " out of " + totalQuestions);
  }
  $("#submit-button").click(function () {
    var selectedAnswer = $(".answer input:checked");
    if (selectedAnswer.length) {
      var selectedAnswerValue = $(".answer input:checked + label").text();
      if (selectedAnswerValue.charAt(0) === questionsData[randomIndex].Answer) {
        $("#result").html("Correct!");
        $("#result").css("color", "green");
        questionNum += 1
        if (displayedQuestions.length === totalQuestions) {
          setTimeout(() => { document.location.reload(); }, 4000);
          $("#counter").html("Your score is: " + (totalQuestions - wrongCounter) + " out of " + totalQuestions);
          alert("Your score is: " + (totalQuestions - wrongCounter) + " out of " + totalQuestions);
        }
        else {
          setTimeout(() => { currentQuestionIndex++; displayQuestion(); }, 1000);
        }
      } else {
        $("#result").html("Incorrect. The correct answer is " + questionsData[randomIndex].Answer);
        $("#result").css("color", "red");
        wrongCounter++;
      }
    } else {
      $("#result").html("Please select an answer");
      $("#result").css("color", "blue");
    }
  });
  $(".answer input").change(function () {
    if (this.checked) {
      $(".answer input").not(this).prop("checked", false)
    }
  });
});


