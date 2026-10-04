'use strict';

//const { createElement } = require("react");


let currentFontSize = 20; 

function increaseFontSize() { 
  

  const newFontSize = currentFontSize + 1; 
  setFontSize(newFontSize);

}

function decreaseFontSize() { 
  const newFontSize = currentFontSize - 1;
  setFontSize(newFontSize);

}

function defaultFontSize() {  
  setFontSize(20)
}


function setFontSize(fontSize) {

  const MIN_FONT_SIZE = 17;
  const MAX_FONT_SIZE = 23;

  if (fontSize > MAX_FONT_SIZE || fontSize < MIN_FONT_SIZE) return;

  // if(fontSize > 23 || fontSize < 17) return;  

  docBody.style.setProperty("--btn-font-size", `${fontSize}px`);
 
  lbFontSizeSample.style.fontSize = `${fontSize}px`;

  currentFontSize = fontSize;
}


btnIncreaseFontSize.addEventListener('click', increaseFontSize);

btnDecreaseFontSize.addEventListener('click', decreaseFontSize);

btnDefaultFontSize.addEventListener('click', defaultFontSize);


// Глобально только то, что нужно часто и во многих местах
function $(id) {
  return document.getElementById(id);
}

btnMenu.addEventListener("click",() => toggleSettingsPage());

btnRemoveHistory.addEventListener("click",  clearHistory);

btnRemoveCache.addEventListener("click",  clearCache);

btnRemoveSettings.addEventListener("click",  removeSettings);

btnShowHelp.addEventListener("click",  showHelpPage);

//btnSaveSelectedTests.addEventListener("click",  saveSelectedTests);

 

$('go-back').addEventListener('click', ()=> {

  checkSettingsAndApply();  

  showPage('main-settings');

  showSettingsButton(true);

});

$('settings-profile-page-button').addEventListener('click', ()=> {  

  createProfilesList();

  showPage('test-profile'); 

  showSettingsButton(false);

});

$('main-profile-page-button').addEventListener('click', ()=> {  

  createProfilesList();

  showPage('test-profile');   

  showSettingsButton(false);

});




function clearCache(){   

  caches.open('offline-cache-v1').then(cache => {
    cache.keys().then(keys => {
      keys.forEach(request => {
        cache.delete(request);
      });
    });
  });
}

function clearHistory() {  

  for(let i = 0; i < localStorage.length; i++){
    
    if(localStorage.key(i) === "settings") continue

    localStorage.removeItem(localStorage.key(i));

  }

}

// function saveSelectedTests(){

//   const checkedCheckBoxes = getSelectedValues(divChooseProfiles);    

//   if(!checkedCheckBoxes.length ) {

//     console.log('Не выбрано')

//   }else{

//     const settings = JSON.parse(JSON.stringify(defaultSettings));

//     let testsList = [];


//     checkedCheckBoxes.forEach(element => {

//       testsList.push(element)

//       //console.log(element)
      
//     });

//     settings.selectedTests = testsList;

//     saveSettings(settings);


//     console.log(settings.selectedTests[0])



//   }

// }

window.addEventListener('load', () => {
 //checkSettingsAndApply(); 
  
  //startTestSelection();

  //showPage('default-test-selector-block'); // показываем список тестов 

  // removeButtons?.();
     checkSettingsAndApply?.();

    // showPage('test-selector'); // показываем список тестов
  
});


function updateSettingsButtonVisibility(isVisible) {
  // const btn = document.getElementById('settings-page-button');
  // if (!btn) return;

  if (isVisible) {
    btnMenu.classList.remove('hidden');
  } else {
    btnMenu.classList.add('hidden');
  }
}


function checkSettingsAndApply() {

  const settings = localStorage.getItem('settings');
  let savedSettings = null;

  // 2. Безопасный парсинг
  if (settings) {

    console.log("Настройки есть")
    try {
      savedSettings = JSON.parse(settings);
      console.log('Настройки загружены из localStorage');
    } catch (e) {
      console.error('Ошибка парсинга настроек, сбрасываем на дефолт', e);
      savedSettings = null;
    }
  }

  // 3. Единая логика применения настроек
  if (savedSettings && Array.isArray(savedSettings.selectedTests)) {
    if (savedSettings.selectedTests.length === 0) {
      //createDefaultTestsSelector();
      //ShowMainOpenProfilePageButton();

      console.log("Нет выбранных тестов")

      //startTestSelection();
      showPage('default-test-selector'); // показываем список тестов


    } else {
      createTestsSelector(savedSettings.selectedTests);

      console.log("Есть выбранные тесты")
      showPage('test-selector'); // показываем список тестов
    }

    setSettings(savedSettings);
  } else {
    // Нет настроек или они битые — применяем дефолт
    console.log("Настройки нет вообще");


    setSettings(defaultSettings);
    saveSettings(defaultSettings); // сохраняем дефолт, чтобы дальше было с чем работать

    showPage('default-test-selector'); // показываем список тестов

    
  }

}





//лечение выхода из приложения при нажании кнопки назад в андроид
window.addEventListener('load', function() {
    window.history.pushState({}, '')
});
  
window.addEventListener('popstate', function() {   
    btnHome.click();    
    window.history.pushState({}, '')
});



// tglLevel5.addEventListener('change', function() {   
//   setRankToggles('rank5')  
// });

// tglLevel6.addEventListener('change', function() {  
//   setRankToggles('rank6')  
// });


// const testsList = {
   
//   rank5 : { 
//     st5_1 : [test_5s_block_1, "5p Стандарт 1"],
//     st5_2 : [test_5s_block_2, "5p Стандарт 2"],
//     ex5 : [test_5ex, "5р эксперт"],
//     ot_1 : [test_ot_block_1, "Охрана труда 1"],
//     ot_2 : [test_ot_block_2, "Охрана труда 2"],
//     ot5_2025 : [test_otrp, "ОT 2025"],
//   },    
    
//   rank6 : {      
//     st6_1 : [test_6s_block_1, "6p Стандарт 1"],
//     st6_2 : [test_6s_block_2, "6p Стандарт 2"],
//     st6_3 : [test_6s_block_3, "6p Стандарт 3"],
//     st6_4 : [test_6s_block_4, "6p Стандарт 4"],
//     ex6 : [test_6e_block_1, "6р Эксперт"],
//     ot_1 : [test_ot_block_1, "Охрана труда 1"],
//     ot_2 : [test_ot_block_2, "Охрана труда 2"],
//     ot6_2025 : [test_otrp, "ОT 2025"],
//     tmp : [temp, "TEMP"],  
//   },

// }

// function createDefaultTestsSelector() { 

//   const button = document.createElement('button'); 
//   button.className = 'test-button';
//   button.textContent = 'Выбрать тесты'; 
//   button.id = 'testProfileSelectorButton'

//   button.addEventListener('click', function() {   

//     toggleProfilePage(); 
//     this.classList.add('hidden'); // скрываем визуально

//   });

//   divTestsSelector.appendChild(button);  
// }


function createTestsSelector(selectedTests){  

  selectedTests.forEach((item) => {     

    const text = testBases[item].testTitle

    const id = testBases[item].testId

    const testButton = createTestButton(id, text);
   
    testButton.addEventListener('click', testButtonClick);

    divTestsSelector.appendChild(testButton);   

 });
  
}

// function createTestButton(id, textContent, clickFunction){
function createTestButton(id, textContent){ 

  const button = document.createElement('button');   
  button.id = id;
  button.className = "test-button";     
  button.textContent = textContent;
  
  return button;

}



////////////////////////////////////////////////////////////////////////////
//Скрываем все страницы, Показываем нужную
function showPage(pageId) {
  // Скрываем все страницы
  document.querySelectorAll('.page-panel').forEach(el => el.classList.add('hidden'));
  // Показываем нужную  
  const page = $(pageId); 
  if (page) {
    page.classList.remove('hidden');
  }
  
}

// function startTestSelection() {  
//   showPage('default-test-selector-block'); // показываем список тестов  
// }

function showSettingsButton(isVisible){
  const button = $('settings-page-button')
  console.log(isVisible)
  if(button){
    button.classList.toggle('hidden', !isVisible);
  }
}

///////////////////////////////////////////////////////////////////////////////////////////

function showMainPage() {

  const elementsToHide = [
    
    testButtonsContainer,
    navigationContainer,
    testResultsContainer,
    questionsCounter,
    helpSection,
    listPageContainer,
    divMainSettings,
    divProfilePage   
      
  ];

  const elementsToShow = [    
    
    divTestsSelector,
    //btnMenu

    
  ];

  updateSettingsButtonVisibility(true)

  // hideElements(elementsToHide);

  // showElements(elementsToShow); 

  showHidePages(elementsToShow, elementsToHide);

  //removeButtons();  

  //createLevelsButtons(testBases); 

  pTestTitle.textContent = "";

  

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


  // hideElements(elementsToHide);
  // showElements(elementsToShow);

  showHidePages(elementsToShow, elementsToHide);

  btnHome.textContent = "На главную";
  btnHome.value = "mainpage";

}

  

function showChosenTest(testName, counterText) {
  const elementsToHide = [
    divTestsSelector,
    // divMenuButton,    
    divNext,
    //btnMenu
  ]



  const elementsToShow = [ 
    testButtonsContainer,
    pQuestionsCounter,
    questionsCounter,
    navigationContainer,
    divHome   
  ]

  // hideElements(elementsToHide);
  // showElements(elementsToShow);  

  showHidePages(elementsToShow, elementsToHide);

  updateSettingsButtonVisibility(false)

  

  //showHidePages();

  //console.log('тест выбран');
 

  renderQuestionCounter(counterText);

  pTestTitle.textContent = testName;
  btnHome.textContent = "Завершить";
  btnHome.value = "complite";

  // console.log('меню скрыто')
}


function showHidePages(arrayToShow, arrayToHide){
 
  arrayToShow.forEach(element => {
      element.classList.remove('hidden');
  });
   arrayToHide.forEach(element => {
      element.classList.add('hidden');
  });


   
}



function createProfilesList(){

  

  while (divChooseProfiles.firstChild) {
    divChooseProfiles.removeChild(divChooseProfiles.firstChild);
  }

  // testBases.forEach(key => {
  Object.keys(testBases).forEach(key => {
    // Создаём контейнер для чекбокса и подписи
    const label = document.createElement('label');
    label.style.display = 'block';
    label.style.marginBottom = '10px';

    // Создаём сам чекбокс
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = testBases[key].testTitle;
    checkbox.dataset.feature = testBases[key].testId;

    const id = testBases[key].testId.toString()
    

    // Сразу вешаем слушатель на этот конкретный input
    checkbox.addEventListener('change', checkboxChange)
      // {
      // const value = checkbox.checked;
      // console.log('Изменение:', key, value);

      // Сохранение
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');

    //console.log(testBases[key].testId)

    let checkedState = settings.selectedTests.indexOf(id);

    //console.log(checkedState)

    if(checkedState != -1){

      checkbox.checked = true;

    }

      // settings[key] = value;
      // localStorage.setItem('myAppSettings', JSON.stringify(settings));

      
    //});

    //console.log(testBases[key].testId)

    // Добавляем текст подписи
    const text = document.createTextNode(testBases[key].testTitle);

    // Собираем элементы вместе
    label.appendChild(checkbox);
    label.appendChild(text);
    divChooseProfiles.appendChild(label);
  });


}


function checkboxChange(e) {
  const el = e.target;
  const id = el.dataset.feature;
  const isChecked = el.checked; 

  // Получаем настройки, по умолчанию — пустой объект
  let settings = JSON.parse(localStorage.getItem('settings') || '{}');

  // Гарантируем, что selectedTests — это массив
  if (!Array.isArray(settings.selectedTests)) {
    settings.selectedTests = [];
  }

  if (isChecked) {
    // Добавляем только если ещё нет (защита от дублей)
    if (!settings.selectedTests.includes(id)) {
      settings.selectedTests.push(id);
    }
  } else {
    const index = settings.selectedTests.indexOf(id);
    if (index !== -1) {
      settings.selectedTests.splice(index, 1);
    }
    // Если index === -1 — значит, элемента не было, ничего не делаем
  }

  localStorage.setItem('settings', JSON.stringify(settings));

  settings = JSON.parse(localStorage.getItem('settings') || '{}');

  if(settings.selectedTests.length === 0){

    //показать кнопку выбора тестов
    console.log('тесты отсутствуют, чекбокс выбран')

    //createDefaultTestsSelector();

    //ShowMainOpenProfilePageButton();


  }else{

    //показать кнопки выбранных тестов

    //document.getElementById('testProfileSelectorButton').remove();

    //deleteButton()

    console.log('тесты в наличии')

    createTestsSelector(settings.selectedTests);
    

  }

  


}



function getSelectedValues(container) {
  //nst container = document.getElementById(containerId);
  const checkedCheckboxes = container.querySelectorAll('input[type="checkbox"]:checked');
  const selectedValues = Array.from(checkedCheckboxes).map(cb => cb.value);
  return selectedValues;
}



function removeButtons() {    
  divTestsSelector.innerHTML = '';  
}

//////////////////////////////

// function showSettingsPage() {
//   divMainSettings.classList.remove('hidden');
//   divTestsSelector.classList.add('hidden');
//   divDefaultTestSelectionBlock.classList.add('hidden');
// }

// function hideSettingsPage() {
//   divMainSettings.classList.add('hidden');
//   divTestsSelector.classList.remove('hidden'); 
//   //divDefaultTestSelectionBlock.classList.add('hidden');
  
//  //if tests are not chosen - show button 'choose'
//  //else - do not
  
//   //removeButtons();
//   //checkSettingsAndApply();
// }

// const toggleSettingsPage = () => {

//   const isSettingsHidden = divMainSettings.classList.contains('hidden');
//   if (isSettingsHidden) {
//     showSettingsPage();
//   } else {
//     hideSettingsPage();
//     removeButtons();
//     checkSettingsAndApply();
//   }
// };

//////////////////////////////////////

function toggleClass(element, className, shouldAdd) {
  if (!element) return;
  if (shouldAdd) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
}

function showSettingsPage() {
  toggleClass(divMainSettings, 'hidden', false);
  toggleClass(divTestsSelector, 'hidden', true);
  toggleClass(divDefaultTestSelector, 'hidden', true);
}

function hideSettingsPage() {
  toggleClass(divMainSettings, 'hidden', true);
  toggleClass(divTestsSelector, 'hidden', false);
  // Логику с кнопкой «выбрать» лучше вынести отдельно, см. ниже
}

const toggleSettingsPage = () => {
  const isSettingsHidden = divMainSettings?.classList.contains('hidden');
  
  if (isSettingsHidden) {
    showSettingsPage();
  } else {
    hideSettingsPage();
    removeButtons?.();
    checkSettingsAndApply?.();
  }
};


////////////////////////////////////



function removeSettings() {  
  localStorage.removeItem("settings");  
  setSettings(defaultSettings);


}


function hideHelpPage() {
  helpSection.classList.add('hidden'); 
}

function showHelpPage() {
  helpSection.classList.remove('hidden'); 
  showHideMenu();
}


function saveSettings(settings){  

  // const settings = {

  //   isLearnMode : tglLearnMode.checked, 
  //   isDarkTheme : tglTheme.checked,   
  //   fontSize : currentFontSize,
  //   selectedTests : []

  // }  

  localStorage.setItem('settings', JSON.stringify(settings));
}

function updateTheme(isDark) {
  tglTheme.checked = isDark;

  //console.log(isDark)
  docBody.className = isDark ? 'dark-theme' : 'light-theme';
}

function updateLearnMode(isLearn) {
  tglLearnMode.checked = isLearn;
}

function updateFontSize(size) {
  currentFontSize = size;
  docBody.style.setProperty('--btn-font-size', `${size}px`);
}

function setSettings(settings) {

  //console.log(settings.isDarkTheme)

  if (!tglTheme || !tglLearnMode || !docBody) return;

  //console.log(settings)



  updateTheme(settings.isDarkTheme);
  updateLearnMode(settings.isLearnMode);
  updateFontSize(settings.fontSize);
  //createTestsSelector(selectedTests, )
}


// function setSettings(settings) {

//   tglTheme.checked = settings.isDarkTheme;  
//   tglLearnMode.checked = settings.isLearnMode;   
//   currentFontSize = settings.fontSize; 

//   docBody.style.setProperty("--btn-font-size", `${settings.fontSize}px`);
//   let theme;
//   tglTheme.checked === true  ? theme = 'dark-theme' : theme = 'light-theme';  
  
//   docBody.className = theme;

// }


// function setRankToggles(rank){  

//   tglLevel6.checked = rank === 'rank6';
//   tglLevel5.checked = rank !== 'rank6';
//   defaultRank = rank;

//   // const isRank6 = rank === 'rank6';
//   // lev6Toggle.checked = isRank6;
//   // lev5Toggle.checked = !isRank6;
//   // defaultRank = rank;

// }

const defaultSettings = {
  isLearnMode : false, 
  isDarkTheme : false,   
  fontSize : 20,
  selectedTests : []
}

