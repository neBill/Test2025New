'use strict';

 let rightOptionIndex;
 //let isLearnMode;
 let isHistorySave = true;
 let defaultRank;

let state = {
  currentIndex: 0,
  currentTestLength : 0,  
  isMistakes: false,
  isTestCompleted : false,
  isShuffle: true,
  wrongAnswers: [],
  retryQuestions : []
};

// 



///////////////////////pages////////////////////////////////
const divTestsSelector = document.getElementById('test-selector');
const divProfilePage = document.getElementById('test-profile');
const divMainSettings = document.getElementById('main-settings');
const answerButtons = document.querySelectorAll('.option-button');
const navigationContainer = document.getElementById('navigation-block');
//const divTestsSelector = document.getElementById('test-selector');
const divTestPage = document.getElementById('test-page');
//const btnMenu = document.getElementById('settings-page-button');
const listPageContainer = document.getElementById('questions-list-page');
const tglLearnMode = document.getElementById('learn-mode-toggle');
const btnQuestion = document.getElementById('question-button');
const pQuestionsCounter = document.getElementById('questions-counter');
const questionsCounter = document.getElementById('questions-counter-block');
const testResultsContainer = document.getElementById('test-result-page');
// const tglLevel5 = document.getElementById('level-5-toggle');
// const tglLevel6 = document.getElementById('level-6-toggle');
// const divMainSettings = document.getElementById('main-settings');
//const btnGoBack = document.getElementById('go-back');
const btnShowMainPage= document.getElementById('show-main-page-button');
const divNext = document.getElementById('button-next-block');
const divHome = document.getElementById('button-home-block');
const btnNext = document.getElementById('button-next');
const btnHome = document.getElementById('button-home');
const btnCompleteTest = document.getElementById('complete-test-button');
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
const divListBlock = document.getElementById('questions-list-block');
const btnHideList = document.getElementById('btn-hide-list');
const btnShowProfilePage = document.getElementById('settings-profile-page-button');
//const btnMainOpenProfilePage = document.getElementById('main-profile-page-button');

const divDefaultTestSelector = document.getElementById('default-test-selector');

const btnRemoveHistory = document.getElementById('history-remover');
const btnRemoveSettings = document.getElementById('settings-remover');
const btnRemoveCache = document.getElementById('cache-remover');
const btnShowHelp = document.getElementById('show-help');
const divChooseProfiles = document.getElementById('checkbox-container');


// const checkedCheckBoxes = getSelectedValues(divChooseProfiles);   

//     console.log(checkedCheckBoxes[0])


const CORRECT_ANSWER_ID = 0;
//const selectedTests = 'selectedTests'
const SELECTED_TESTS = 'selectedTests';


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


//клик по кнопке варианта ответа
function handleClick(event) { 
  
  const button = event.target;           
  const userAnswerId = Number(button.dataset.answerId);  


  updateTestState(state, userAnswerId);
  navigateToNext(state);

  //let isAnswerCorrect = false;

  // if(userAnswerId === CORRECT_ANSWER_ID){
  //   isAnswerCorrect = true; 
  // } 


  //const isAnswerCorrect = (answerId) => answerId === CORRECT_ANSWER_ID;


  //if(!isAnswerCorrect()) {     
    // state.wrongAnswers.push([state.currentIndex, userAnswerId]);
  //  state.wrongAnswers.push({qId : state.currentIndex, aId : userAnswerId});  
    
 // }   

 // state.currentIndex++;
  //saveTestHistory(state);    

  // Обновление состояния с явным разделением операций
  // const updateTestState = (state, userAnswerId) => {
  // if (!isAnswerCorrect(userAnswerId)) {
  //   state.wrongAnswers.push({
  //     qId: state.currentIndex,
  //     aId: userAnswerId
  //   });
  // }

  // state.currentIndex++;
  // saveTestHistory(state);
    //};





  //state.isMistakes ? runMistakeMod() : runNormalMod();  
}


const isAnswerCorrect = (answerId) => answerId === CORRECT_ANSWER_ID;

// Обновление состояния с явным разделением операций
const updateTestState = (state, userAnswerId) => {
if (!isAnswerCorrect(userAnswerId)) {
  state.wrongAnswers.push({
    qId: state.currentIndex,
    aId: userAnswerId
  });
}

state.currentIndex++;
saveTestHistory(state);
};

// Унифицированная навигация
const navigateToNext = (state) => {
  const { currentIndex, currentTestLength, retryQuestions, isMistakes } = state;

  // Определяем лимит в зависимости от режима
  const maxIndex = isMistakes ? retryQuestions.length : currentTestLength;

  if (currentIndex >= maxIndex) {
    return handleTestCompletion(state);
  }

  // Получаем ID вопроса для навигации
  const nextQuestionId = isMistakes
    ? retryQuestions[currentIndex].qId
    : currentIndex;

  navigateToNextQuestion(nextQuestionId);

  // Обновляем счётчик с учётом режима
  const modeLabel = isMistakes ? 'Работа над ошибками' : 'Вопрос';
  renderQuestionCounter(`${modeLabel}: ${currentIndex + 1}/${maxIndex}`);
};


// function runNormalMod(){  

//   renderQuestionCounter(`Вопрос: ${state.currentIndex + 1}/${state.currentTestLength}`);
  
//   if (state.currentIndex === state.currentTestLength) {
    
//     return handleTestCompletion(); 
//   } 

//   navigateToNextQuestion(state.currentIndex);

// }

// function runMistakeMod(){  

//   renderQuestionCounter(`Работа над ошибками\n\nВопрос: ${state.currentIndex + 1}/${state.currentTestLength}`);    

//   if (state.currentIndex === state.retryQuestions.length) {   
    
//     return handleTestCompletion();

//   }     

 

//    return navigateToNextQuestion(state.retryQuestions[state.currentIndex].qId);

// }


// function handleTestCompletion() {  
const handleTestCompletion = (state) => {

   state.isTestCompleted = true;

  if(state.wrongAnswers.length > 0){

    state.isMistakes = true;      

    showResultsPage(); 

    showTestResult(state);   

    state.retryQuestions = JSON.parse(JSON.stringify(state.wrongAnswers));

    state.wrongAnswers.length = 0;  

    state.currentIndex = 0;

    saveTestHistory(state);


  }else{
    
    showResultsPage();     

    printTestResult(createSuccessReport()); 

    clearTestState();  

    localStorage.removeItem(currentTest.id);

  }

   
}

// // Обработка завершения теста
// const handleTestCompletion = (state) => {
//   state.isTestCompleted = true;

//   if (state.wrongAnswers.length > 0) {
//     // Режим работы над ошибками
//     state.isMistakes = true;
//     state.retryQuestions = [...state.wrongAnswers]; // Быстрый shallow-клон
//     state.wrongAnswers = [];
//     state.currentIndex = 0;

//     showResultsPage();
//     showTestResult(state);
//     saveTestHistory(state);
//   } else {
//     // Успешное завершение
//     showResultsPage();
//     printTestResult(createSuccessReport());
//     clearTestState();
//     localStorage.removeItem(currentTest.id);
//   }
// };


function navigateToNextQuestion(index) {  
  const questionBlock = getCurrentQuestionBlock(index);
  fillQuestionBlock(questionBlock); 
  
}


function renderQuestionCounter(text){  

  pQuestionsCounter.textContent  =  text;

}


   
function fillQuestionBlock(questionBlock) {  
  
  const REQUIRED_OPTIONS = 4;

  //console.log('questionBlock', questionBlock);


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
  
   if(state.isShuffle) {    
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


function calcRightAnswers(totalQ, incorrectQ) {    
    
  const correctAnswers = totalQ - incorrectQ;  
  const percent = Math.round(correctAnswers * 100 / totalQ); 
  return { correctAnswers: correctAnswers, errorsPercent: percent };

}


// const createSuccessReport = (testParams) => [
const createSuccessReport = () => [
  'Тест успешно пройден!',
 // `Пройдено вопросов: ${testParams.currentIndex} из ${testParams.currentTestLength}`,
  'Результат — 100%'
];

const createUnSuccessReport = (testParams) => {


  const totalQ = testParams.currentIndex;

  const incorrectQ = testParams.wrongAnswers.length;

  const { correctAnswers, errorsPercent } = calcRightAnswers(totalQ, incorrectQ);

  
  
  const array = [
    `Тест ${testParams.isTestCompleted ? "завершен" : "остановлен"}`,
    `Пройдено вопросов: ${totalQ} из ${testParams.currentTestLength}`,
    `Правильных ответов: ${correctAnswers} из ${totalQ} (${errorsPercent}%)`,
    'Ваши ошибки:'
  ]
  return array

};




function showTestResult(testParams){  

  state.isShuffle = false;

  let testReport;

  let buttons = [];  

  buttons = createMistakesButtons(testParams.wrongAnswers); 

  testReport = createUnSuccessReport(testParams);    

  const mistakesButtons = $('mistakes-buttons-block')

  // $'testResultsContainer'.innerHTML = '';

  mistakesButtons.innerHTML = '';

  printTestResult(testReport);

  mistakesButtons.appendChild(buttons);  

}



 
function printTestResult(arrayText ){    
  
  const testInfoContainer = $('test-info-block')
  testInfoContainer.innerHTML = '';


  arrayText.forEach(text => {
    const line = document.createElement('p');
    line.textContent = text;
    line.className = 'p-result';     
    testInfoContainer.appendChild(line);
  })     

 
}


function createMistakesButtons(mistakesArray) {  
      
  const mistakes = mistakesArray.length;
  const mistakeButtons = document.createElement('p');   
  for (let i = 0; i < mistakes; i++) {    
    const btn = document.createElement('button');
    btn.id = `erBtn${i}`;
    btn.value = i;
    btn.dataset.questionIndex = mistakesArray[i].qId;
    btn.dataset.userOption = mistakesArray[i].aId;
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
  
  
  
  [testResultsContainer, divTestPage].forEach(container => 
    container.classList.remove('hidden')
  );
  
  fillQuestionBlock(questionBlock);  
  highlightOptions(targetBtn); 
  lockOptionButtons('.option-button'); 
}



function highlightOptions(targetBtn) {
  const selectedAnswer = targetBtn.dataset.userOption;  
  
  const correctAnswerId = 'option0';
  clearOptionsHighlight(answerButtons)
  answerButtons.forEach(button => {
      
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


//btnCompleteTest.addEventListener("click", handleStopTest())   

// btnHome.addEventListener("click", function(event) {    
//   const btnText = event.target.textContent;  
//   if (btnText === "Завершить") {
   
//     handleStopTest();

//   } else if (btnText === "На главную") {
    
//     showMainPage();
//   }
// });

// btnCompleteTest.addEventListener("click", handleStopTest) 
    
  // if (mainButtonMode.RESULTS) {
   
    // handleStopTest();

  // } else if (mainButtonMode.HOME) {
    
  //   showMainPage();
  // }
//});

//btnShowMainPage.addEventListener("click", showMainPage()) 



//$('settings-page-button').addEventListener('click', ()=> toggleSettingsPage())

 
btnCompleteTest.addEventListener("click", handleStopTest) 

function handleStopTest() {     
 
  if (state.wrongAnswers.length === 0) {  
    
    removeButtons?.();

    showSettingsButton(true);

    checkSettingsAndApply();    
    
    return;
  }

  

  showPage('test-result-page')

  showTestResult(state); 

  saveTestHistory(state);
}


btnNext.addEventListener("click", function() {

  const questionBlock = getCurrentQuestionBlock(state.currentIndex);
  fillQuestionBlock(questionBlock);
  btnNext.classList.add('hidden');

})



function saveTestHistory(testInfo) {     

  localStorage.setItem(currentTest.id, JSON.stringify(testInfo));   

}



function runLernMode(){

  if(optionIndex != rightOptionIndex){
    setTrainingMode(optionIndex);
    currentIndex++;
    return;
  }
}


// function showMainPage() {

//   const elementsToHide = [
    
//     testButtonsContainer,
//     navigationContainer,
//     testResultsContainer,
//     questionsCounter,
//     helpSection,
//     listPageContainer,
//     divMainSettings   
      
//   ];

//   const elementsToShow = [
    
//     // divMenuButton,
//     divTestsSelector,
//     btnMenu
    
//   ];

//   hideElements(elementsToHide);

//   showElements(elementsToShow); 

//   removeButtons();  

//   createLevelsButtons(); 

//   pTestTitle.textContent = "";

//   //alert('(')

// }

function testButtonClick(event) { 

  
  
  const testTitle = event.target.textContent;
  currentTest.id = event.target.id;  
  chooseTest(currentTest.id, testTitle);   

 
 
}

function clearTestState() {
  
  state.currentIndex = 0,
  state.currentTestLength = 0,  
  state.isMistakes = false,
  state.isTestCompleted = false,
  state.wrongAnswers = [],
  state.retryQuestions = []  

};



function getTestState(testId) {
  if(localStorage.getItem(testId)) {
    return JSON.parse(localStorage.getItem(testId));    
  }else{
    return state;
  }
}



function chooseTest(testId, testTitle) {  

  clearTestState();

  let questionCounterText;
  let questionIndex;

  state.isTestCompleted = false;  

  state.isShuffle = true;

  state = getTestState(testId);  

  state.isTestCompleted = false;

  if(state.currentTestLength === 0)
  {
    state.currentTestLength = testBases[testId].testBody.length;
  }

  if(state.isMistakes){

    state.currentTestLength = state.retryQuestions.length;
    
    // questionIndex = state.retryQuestions[state.currentIndex][0];   

    questionIndex = state.retryQuestions[state.currentIndex].qId; 

    questionCounterText = `Работа над ошибками\n\nВопрос: ${state.currentIndex + 1}/${state.currentTestLength}`;    

  }else{

    questionCounterText = `Вопрос: ${state.currentIndex + 1}/${state.currentTestLength}`;

    questionIndex = state.currentIndex;

  }

  showChosenTest(testTitle, questionCounterText);  

  const questionBlock = getCurrentQuestionBlock(questionIndex);

  fillQuestionBlock(questionBlock); 
 
}


// function showResultsPage() {  

//   const elementsToHide =[
//     testButtonsContainer,
//     pQuestionsCounter
//   ]

//   const elementsToShow =[   
//     divHome,
//     testResultsContainer
//   ]


//   hideElements(elementsToHide);
//   showElements(elementsToShow);

//   btnHome.textContent = "На главную";
//   btnHome.value = "mainpage";

// }


// function hideElements(elementsArray){
//   elementsArray.forEach(element => {
//       element.classList.add('hidden');
//   });

   
// }

// function showElements(elementsArray){  
//   elementsArray.forEach(element => {
//     element.classList.remove('hidden');
//   });

// }



// function showChosenTest(testName, counterText) {
//   const elementsToHide = [
//     divTestsSelector,
//     // divMenuButton,    
//     divNext,
//     btnMenu
//   ]

//   const elementsToShow = [ 
//     testButtonsContainer,
//     pQuestionsCounter,
//     questionsCounter,
//     navigationContainer,
//     divHome   
//   ]

//   hideElements(elementsToHide);
//   showElements(elementsToShow);  

 

//   renderQuestionCounter(counterText);

//   pTestTitle.textContent = testName;
//   btnHome.textContent = "Завершить";
//   btnHome.value = "complite";
// }

// btnMenu.addEventListener("click", showHideMenu)

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
  
