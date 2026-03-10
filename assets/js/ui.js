'use strict';

let rightOptionIndex;
//let isLearnMode;
let isHistorySave = true;
let defaultRank;

let state = {
  currentIndex: 0,
  currentTestLength : 0,  
  isMistakes: false,
  rightAnswersCount : 0,
  wrongAnswers: []
};



const answerButtons = document.querySelectorAll('.option-button');
const navigationContainer = document.getElementById('navigation-block');
const divLevels = document.getElementById('levels-buttons-block');
const testButtonsContainer = document.getElementById('test-buttons-block');
const btnMenu = document.getElementById('button-menu');
const listPageContainer = document.getElementById('questions-list-page');
const tglLearnMode = document.getElementById('learn-mode-toggle');
const btnQuestion = document.getElementById('question-button');
const pQuestionsCounter = document.getElementById('questions-counter');
const questionsCounter = document.getElementById('questions-counter-block');
const testResultsContainer = document.getElementById('test-result-block');
const tglLevel5 = document.getElementById('level-5-toggle');
const tglLevel6 = document.getElementById('level-6-toggle');
const divDropdownMenu = document.getElementById('dropdown-menu-block');
const divMenuButton = document.getElementById('menu-button-block');
const divNext = document.getElementById('button-next-block');
const divHome = document.getElementById('button-home-block');
const btnNext = document.getElementById('button-next');
const btnHome = document.getElementById('button-home');
const helpSection = document.getElementById('help-block');
const btnIncreaseFontSize = document.getElementById('font-increase');
const btnDecreaseFontSize = document.getElementById('font-decrease');
const btnDefaultFontSize = document.getElementById('font-default');
const lbFontSizeSample = document.getElementById('font-size-sample');
const tglTheme =  document.getElementById('theme-toggle'); 
const pTestTitle = document.getElementById('test-title');
const docBody = document.body;

const modalListContainer = document.getElementById('mod-content');
const col1 = document.getElementById('col1');
const col2 = document.getElementById('col2');
const answerListContainer = document.getElementById('answer-list-block');

const divListBlock = document.getElementById('questions-list-block');////

const btnHideList = document.getElementById('btn-hide-list');

btnHideList.addEventListener('click', hideListBlock);

class CurrentTest {
   constructor(test, id) {
     this.index = test
     this.id = id
   }
}

const currentTest = new CurrentTest();


//навешиваем на кнопки вариантов событие клик
document.querySelectorAll('.option-button').forEach(button => {
    button.addEventListener('click', handleClick);
});


let questionQuantity; 
let questionNumber = 1;


//клик по кнопке варианта ответа
function handleClick(event) { 
  
  const button = event.target; 
  const isMistakeMode = state.isMistakes;    
  const isAnswerCorrect = button.dataset.success;  
  const userAnswerId = Number(button.dataset.answerId);  

  if(isMistakeMode) {  

    state.rightAnswersCount++;

    handleMistakeMode(isAnswerCorrect, userAnswerId);

    if (state.wrongAnswers.length === 0) {
      
      return handleTestCompletion();

    }   

    if (state.currentIndex === state.wrongAnswers.length) {
     //alert('по новой')
      state.currentIndex = 0;
      state.rightAnswersCount = 0;
      state.currentTestLength = state.wrongAnswers.length;
      saveTestHistory(state);

    }   

    return navigateToNextQuestion(state.wrongAnswers[state.currentIndex][0]);
  }

  handleNormalMode(isAnswerCorrect, userAnswerId);

  state.currentIndex++;

  renderQuestionCounter(`Вопрос: ${state.currentIndex + 1}/${questionQuantity}`);
  
  if (state.currentIndex === state.currentTestLength) {
    
    return handleTestCompletion(); 
  } 
  navigateToNextQuestion(state.currentIndex);
}


function handleNormalMode(isCorrect, answerId){  

  if(isCorrect === 'false') { 

    state.wrongAnswers.push([state.currentIndex, answerId]);   

  }  

  saveTestHistory(state);  

}

function handleMistakeMode(isCorrect, answerId){    

  const questionIndex = state.wrongAnswers[state.currentIndex][0];

  if (isCorrect === 'false') {
   
    state.wrongAnswers.splice(state.currentIndex, 1, [questionIndex, answerId]);

    state.currentIndex++;

  } else {

    state.wrongAnswers.splice(state.currentIndex, 1);       

  }
  
  if(questionNumber === questionQuantity){

    questionNumber = 1;

    questionQuantity = state.wrongAnswers.length;

  }else{

    questionNumber++;
  }
  
  renderQuestionCounter(`Работа над ошибками\n\nВопрос: ${questionNumber}/${questionQuantity}`);

  saveTestHistory(state);

}



function renderQuestionCounter(text){  

  pQuestionsCounter.textContent  =  text;

}


 function handleTestCompletion() {
  
  showResultsPage();

  const isTestCompleted = true;

  showTestResult(isTestCompleted);

  if (state.wrongAnswers.length === 0) {
    clearTestState();
    return;
  }

  state.isMistakes = true;
  state.currentIndex = 0;
  state.currentTestLength = state.wrongAnswers.length;
   
  questionNumber = 1;

  saveTestHistory(state);
}

function navigateToNextQuestion(index) {  
  const block = getCurrentQuestionBlock(index);
  fillQuestionBlock(block, !state.isMistakes); 
  
}


function fillQuestionBlock(questionBlock, isShuffle) {   
  
  const REQUIRED_OPTIONS = 4;

  let answers = Array.isArray(questionBlock.answers)
    ? questionBlock.answers.map(a => ({ ...a }))
    : [];

    
  for (let i = REQUIRED_OPTIONS - 1; i >= answers.length; i--) {
    answers.push({
      text: 'Нет варианта ответа (*)',
      correct: false,
      id: i
    });
  }
  
  if(isShuffle) {    
    answers = shuffleArray(answers);   
  }

  clearOptionsHighlight(answerButtons);  

  answerButtons.forEach((button, index) => {        
    const a = answers[index];     
    button.textContent = a.text; 
    button.dataset.success = a.success;
    button.dataset.answerId = a.id;
    button.disabled = false;     
  }); 
   
  btnQuestion.textContent = questionBlock.question;
 
  
}





// function shuffleArray(array) {
//   const arr = [...array]; // создаём копию, чтобы не мутировать оригинал
//   for (let i = arr.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [arr[i], arr[j]] = [arr[j], arr[i]]; // обмен через деструктуризацию
//   }
//   return arr;
// }

function shuffleArray(array) {
  const arr = array.map(item => ({ ...item }));

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}


function setTrainingMode(optionIndex) {

  document.getElementById('button_next').style.display = "inline-block";

  let borderColor = '';

  if (currentTest.test[currentIndex][1][optionIndex][1] == 1) {

    borderColor = "var(--right-answer-border)";

  } else {

    borderColor = "var(--wrong-answer-border)";

    document.getElementById('option' + rightOptionIndex).style.border = "var(--right-answer-border)";
  }

    document.getElementById('option' + optionIndex).style.border = borderColor;  

  for (let element of divTest.children) {

    element.disabled = true;

  }

}



function calcRightAnswers(completedQuestions, mistakesQuantity ) {  
  const rightAnswersQuantity = completedQuestions - mistakesQuantity;
  const percent = Math.round(rightAnswersQuantity * 100 / completedQuestions); 
  return { rightAnswers: rightAnswersQuantity, errorsPercent: percent };
}

function getTestHistory(testId) {
  const testHistory = localStorage.getItem(testId);
  if(!testHistory) return;
  return JSON.parse(testHistory);
}


function createTestReport(isMistakes, isTestCompleted, statistic){

  let textArray = [];
  let testState = isTestCompleted ? "завершен" : "остановлен";

  if(isMistakes){
    textArray.push(
      `Тест ${testState}`,
      `Пройдено вопросов: ${statistic.completedQuestions} из ${state.currentTestLength}`,
      `Правильных ответов: ${statistic.rightAnswers} из ${statistic.completedQuestions} (${statistic.errorsPercent}%)`,
      'Ваши ошибки:'
    );
    
  }else{
    textArray.push(
      'Тест успешно пройден!',
      'Результат — 100%'
    );     
  }
  return textArray;
}

////////////////////////////////////////////////////////

function showTestResult(isTestCompleted) {


  const history = getTestHistory(currentTest.id); 

  // if (!history) {    
  //   console.error('История теста не найдена');
  //   return;
  // } 

  let completedQuestions = state.currentIndex;

  if(state.isMistakes)
  {
    completedQuestions = state.rightAnswersCount;
    
  }


  let textArray = [];

  let buttons = [];  

  if(history.wrongAnswers.length > 0){   

    
    
    
    let mistakesQuantity = history.wrongAnswers.length;

    //alert(completedQuestions + " --- " + mistakesQuantity)


    if(state.isMistakes) {

      ///let rightAnswersCount = state.currentTestLength - state.wrongAnswers.length;
     // alert(state.rightAnswersCount + " --- " + mistakesQuantity)

      mistakesQuantity = state.rightAnswersCount - (state.currentTestLength - state.wrongAnswers.length);

      //mistakesQuantity = state.currentIndex;
      
    }

   // alert(completedQuestions + " --- " + mistakesQuantity)

    const { rightAnswers, errorsPercent } = calcRightAnswers(completedQuestions, mistakesQuantity);   

   // alert(rightAnswers + " --- " + errorsPercent)

    textArray = createTestReport(true, isTestCompleted, {      
      completedQuestions : completedQuestions,
      rightAnswers : rightAnswers,
      errorsPercent : errorsPercent,      
    });   

    // buttons = createMistakesButtons(mistakesQuantity, history.wrongAnswers);

    buttons = createMistakesButtons(history.wrongAnswers);

  }else{
   
    clearTestState();
    textArray = createTestReport(false, isTestCompleted, {});     
    localStorage.removeItem(currentTest.id); 
  } 

  //alert(textArray)

  renderResult(textArray, buttons);   
}


function renderResult(textArray, buttons) {
  testResultsContainer.innerHTML = '';
  printTestResult(textArray);  
  if(buttons.length <= 0) return;
  testResultsContainer.appendChild(buttons);  
}


function printTestResult(arrayText){    
  arrayText.forEach(text => {
    const line = document.createElement('p');
    line.textContent = text;
    line.className = 'p-result';     
    testResultsContainer.appendChild(line);
  })    
}


function createMistakesButtons(mistakesArray) {  
  // function createMistakesButtons(mistakesQuantity, mistakes) {     
  const mistakes = mistakesArray.length;
  const mistakeButtons = document.createElement('p');   
  for (let i = 0; i < mistakes; i++) {    
    const btn = document.createElement('button');
    btn.id = `erBtn${i}`;
    btn.value = i;
    btn.dataset.questionIndex = mistakesArray[i][0];
    btn.dataset.userOption = mistakesArray[i][1];
    btn.className = 'error-button';   
    btn.textContent = i + 1;      

    btn.addEventListener('click', function() {      
      showSelectedMistake(this.id);
    });

    mistakeButtons.appendChild(btn);
  }  
 return mistakeButtons;
}



function showSelectedMistake(btnId) {   

  const targetBtn = document.getElementById(btnId);
  const btns = document.querySelectorAll('.error-button');
  
  btns.forEach(btn => btn.classList.toggle('active-button', btn === targetBtn));
    
  const questionIndex = targetBtn.dataset.questionIndex;   
  const questionBlock = testBases[currentTest.id].testBody[questionIndex];    
  
  [testResultsContainer, testButtonsContainer].forEach(container => 
    container.classList.remove('hidden')
  );
  
  fillQuestionBlock(questionBlock, false);  
  highlightOptions(targetBtn); 
  lockOptionButtons('.option-button'); 
}

function highlightOptions(targetBtn) {
  const selectedAnswer = targetBtn.dataset.userOption;  
  // const answerButtons = document.querySelectorAll('.option-button');
  const correctAnswerId = 'option0';
  clearOptionsHighlight(answerButtons)
  answerButtons.forEach(button => {
    // button.classList.remove('correct', 'incorrect');    
    if (button.id === correctAnswerId) {    
      button.classList.add('correct');      
    }    
    if (button.id === `option${selectedAnswer}`) {
      button.classList.add('incorrect');
    }
  }); 
}

function clearOptionsHighlight(buttons){
  buttons.forEach(button => {
    button.classList.remove('correct', 'incorrect'); 
  })
}


function lockOptionButtons(selector) {
  document.querySelectorAll(selector).forEach(node => {
    node.disabled = true;
  });
}


function getCurrentQuestionBlock(questionIndex) {  
  const questionBlock = testBases[currentTest.id].testBody[questionIndex];
  return questionBlock;
}

btnHome.addEventListener("click", function(event) {    
  const btnText = event.target.textContent;  
  if (btnText === "Завершить") {
   
    handleFinishButtonClick();

  } else if (btnText === "На главную") {
    //handleMainPageButtonClick();
    showMainPage();
  }
});

function handleFinishButtonClick() {  
 
  questionNumber = 1;

  if (!state.wrongAnswers.length || state.rightAnswersCount === 0) {         
    showMainPage();     
    return;
  }   
 
  showResultsPage();

  const isTestCompleted = false;
  
  showTestResult(isTestCompleted);

   if(state.isMistakes){

    state.currentIndex = 0;
    state.rightAnswersCount = 0;

  }

  saveTestHistory(state);
}


btnNext.addEventListener("click", function() {

  const questionBlock = getCurrentQuestionBlock(state.currentIndex);
  fillQuestionBlock(questionBlock, true);
  btnNext.classList.add('hidden');

})



function saveTestHistory(testInfo) {     

  localStorage.setItem(currentTest.id, JSON.stringify(testInfo));   

}

function clearTestState() {

  state.currentIndex = 0;
  state.wrongAnswers = [];
  state.isMistakes = false;
  state.currentTestLength = 0;

};

// function isTestCompleted() {

//   return state.currentTestLength === state.currentIndex;
// }



function runLernMode(){

  if(optionIndex != rightOptionIndex){
    setTrainingMode(optionIndex);
    currentIndex++;
    return;
  }
}


function showMainPage() {

  const elementsToHide = [
    
    testButtonsContainer,
    navigationContainer,
    testResultsContainer,
    questionsCounter,
    helpSection,
    listPageContainer,
    divDropdownMenu    
      
  ];

  const elementsToShow = [
    
    divMenuButton,
    divLevels
    
  ];

  hideElements(elementsToHide);

  showElements(elementsToShow); 

  removeButtons();

  createLevelsButtons(); 

  pTestTitle.textContent = "";

}

function testButtonClick(event) { 
  
  const target = event.target;
  currentTest.id = target.id;  
  chooseTest(currentTest.id, target.textContent);   
 
}



function getCurrentTestLength(testId, history){   

  if (!history || !history.isMistakes) {
    return testBases[testId].testBody.length;
  }

  if (history.isMistakes && history.wrongAnswers) {
    return history.wrongAnswers.length;
  }
}



function chooseTest(testId, testName) {  
  
  const history = getTestHistory(testId);  

  questionNumber = 1;

  state.currentTestLength = getCurrentTestLength(testId, history);

  questionQuantity = state.currentTestLength;

  //let counterText = `Вопрос: 1/${state.currentTestLength}`;

  let counterText;

  // Инициализируем индексы с учетом истории
  let { currentIndex = 0, questionIndex = 0 } = history || {};   

   // Определяем индекс вопроса на основе ошибок
  if (history?.isMistakes) {
    questionIndex = history.wrongAnswers?.[0]?.[0] || 0;

   // alert(questionNumber)

    counterText = `Работа над ошибками\n\nВопрос: ${questionNumber}/${questionQuantity}`;


  } else {
    currentIndex = history?.currentIndex || 0;
    questionIndex = currentIndex;

    counterText = `Вопрос: ${currentIndex + 1}/${state.currentTestLength}`;

  }

  state.currentIndex = currentIndex;

  //alert(state.currentIndex)

  showChosenTest(testName, counterText);  

  const questionBlock = getCurrentQuestionBlock(questionIndex);
  fillQuestionBlock(questionBlock, true);
 
}


function showResultsPage() {  

  const elementsToHide =[
    testButtonsContainer,
    pQuestionsCounter
  ]

  const elementsToShow =[   
    divHome,
    testResultsContainer
  ]


  hideElements(elementsToHide);
  showElements(elementsToShow);

  btnHome.textContent = "На главную";
  btnHome.value = "mainpage";

}


function hideElements(elementsArray){
  elementsArray.forEach(element => {
      element.classList.add('hidden');
  });

   
}

function showElements(elementsArray){  
  elementsArray.forEach(element => {
    element.classList.remove('hidden');
  });

}



function showChosenTest(testName, counterText) {
  const elementsToHide = [
    divLevels,
    divMenuButton,    
    divNext
  ]

  const elementsToShow = [ 
    testButtonsContainer,
    pQuestionsCounter,
    questionsCounter,
    navigationContainer,
    divHome   
  ]

  hideElements(elementsToHide);
  showElements(elementsToShow);  

 

  renderQuestionCounter(counterText);

  pTestTitle.textContent = testName;
  btnHome.textContent = "Завершить";
  btnHome.value = "complite";
}

//////////////////////////////////////////////////////////////////////list///////////////////

pTestTitle.addEventListener("click", showQuestionsList)

function showQuestionsList() {

  const questions = testBases[currentTest.id].testBody;    
  
  questions.forEach((question, index) => {
    const p = document.createElement('p');
    p.id = index;
    p.className = 'question-in-list';
    p.textContent = `${index + 1}) ${question.question}`;
    divListBlock.appendChild(p);
    
  });

   listPageContainer.classList.remove('hidden');
 

}  
  
function hideListBlock() {    
  divListBlock.innerHTML = ""; 
  listPageContainer.classList.add('hidden'); 
}


// Функция для очистки DOM-элемента
const clearNode = (node) => {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
};

// Функция для создания параграфа с ответом
const createAnswerParagraph = (answer) => {
    const p = document.createElement('p');
    p.id = answer.id;
    p.innerHTML = `${answer.id + 1}) ${answer.text}`;
    return p;
};

// Функция для создания параграфа с меткой
const createLabelParagraph = (answer) => {
    const p = document.createElement('p');
    if (answer.success) {
        p.innerHTML = '&#10004;';
    }
    return p;
};

// Основная функция обработки клика
const handleQuestionsListClick = (event) => {
  const target = event.target;  
  if (!target.classList.contains('question-in-list')) return;  
  // Получаем данные
  const answers = testBases[currentTest.id].testBody[target.id].answers;  
  // Очищаем блоки
  clearNode(col1);
  clearNode(col2);
  // Заполняем ответы
  answers.forEach((answer) => {
      col1.appendChild(createLabelParagraph(answer));
      col2.appendChild(createAnswerParagraph(answer));
  });    
    
  modalListContainer.appendChild(answerListContainer);
  modal.style.display = 'block';      
  
};

// Добавляем обработчик
document.addEventListener('click', handleQuestionsListClick);

// Get the modal
const modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
const span = document.querySelector(".close-modal");

// Добавляем обработчики событий
span.addEventListener('click', closeModal);

// Функция для открытия модального окна
function openModal() {
  modal.style.display = 'block';
}

// Функция для закрытия модального окна
function closeModal() {
  modal.style.display = 'none';
}

// Закрываем модальное окно при клике вне его
window.addEventListener('click', (event) => {
  if (event.target === modal) {
      closeModal();
  }
});
  
