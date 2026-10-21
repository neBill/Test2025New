'use strict';


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


// btnIncreaseFontSize.addEventListener('click', increaseFontSize);

// btnDecreaseFontSize.addEventListener('click', decreaseFontSize);

// btnDefaultFontSize.addEventListener('click', defaultFontSize);

$('font-increase').addEventListener('click', increaseFontSize);

$('font-decrease').addEventListener('click', decreaseFontSize);

$('font-default').addEventListener('click', defaultFontSize);


//слушатель на блоке кнопок ошибок
$('mistakes-buttons-block').addEventListener('click', (e) => {
  const btn = e.target.closest('.error-button');
  if (!btn) return; 
 
  showSelectedMistake(btn.id)

});


function $(id) {
  return document.getElementById(id);
}

//btnMenu.addEventListener("click",() => toggleSettingsPage());

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

$('settings-page-button').addEventListener('click', ()=> toggleSettingsPage())

// $('show-main-page-button').addEventListener('click', ()=> {

//   checkSettingsAndApply();  

//   showPage('default-test-selector');

//   showSettingsButton(true);

// })


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

$('show-main-page-button').addEventListener('click', ()=> {


  const optionsContainer  = $('show-mistaken-option-block')

  optionsContainer.innerHTML = ''

  checkSettingsAndApply();  

  //showPage('default-test-selector');

  showSettingsButton(true);

})


 $('theme-toggle').addEventListener('change', changeTheme)

 function changeTheme(e){   

  
// Получаем актуальное состояние самого переключателя
  const toggleState = e.currentTarget.checked; // true или false

  // Читаем текущие настройки
  let settings = JSON.parse(localStorage.getItem('settings'));  
 
  // Обновляем настройку
  settings.isDarkTheme = toggleState;

  // Сохраняем обратно
  localStorage.setItem('settings', JSON.stringify(settings));

  // console.log('Настройки:', settings);
  // console.log('Тёмная тема:', settings.isDarkTheme);

  // Дальше применяем тему к странице, например:
 // applyTheme(settings.isDarkTheme);
  updateTheme(settings.isDarkTheme)

 }










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


// function updateSettingsButtonVisibility(isVisible) { 
//   if (isVisible) {
//     btnMenu.classList.remove('hidden');
//   } else {
//     btnMenu.classList.add('hidden');
//   }
// }

function showSettingsButton(isVisible){
  const button = $('settings-page-button')
  
  if(button){
    button.classList.toggle('hidden', !isVisible);
  }
}


function checkSettingsAndApply() {
  const raw = localStorage.getItem('settings');

  if (!raw) {
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
    showPage('default-test-selector');
    return;
  }

  let savedSettings;

  try {
    savedSettings = JSON.parse(raw);
  } catch (e) {
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
    showPage('default-test-selector');
    return;
  }

  if (savedSettings && Array.isArray(savedSettings.selectedTests)) {
    if (savedSettings.selectedTests.length === 0) {
      showPage('default-test-selector');
    } else {

      removeButtons();
      createTestsSelector(savedSettings.selectedTests);
      showPage('test-selector');
    }
    setSettings(savedSettings);
  } else {
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
    showPage('default-test-selector');
  }
}



// function checkSettingsAndApply() {

//   const settings = localStorage.getItem('settings');
//   let savedSettings = null;  

//   if (settings) {
    
//     try {
//       savedSettings = JSON.parse(settings);      
//     } catch (e) {      
//       savedSettings = null;
//     }
//   }
  
//   if (savedSettings && Array.isArray(savedSettings.selectedTests)) {
//     if (savedSettings.selectedTests.length === 0) {    
//       showPage('default-test-selector'); // показываем список тестов
//     } else {
//       createTestsSelector(savedSettings.selectedTests);     
//       showPage('test-selector'); // показываем список тестов
//     }

//     setSettings(savedSettings);
//   } else {
//     // Нет настроек или они битые — применяем дефолт   
//     setSettings(defaultSettings);
//     saveSettings(defaultSettings); // сохраняем дефолт, чтобы дальше было с чем работать
//     showPage('default-test-selector'); // показываем список тестов    
//   }

// }





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

// function showSettingsButton(isVisible){
//   const button = $('settings-page-button')
//   console.log(isVisible)
//   if(button){
//     button.classList.toggle('hidden', !isVisible);
//   }
// }

///////////////////////////////////////////////////////////////////////////////////////////

// function showMainPage() {

//   const elementsToHide = [
    
//     divTestPage,
//     navigationContainer,
//     testResultsContainer,
//     questionsCounter,
//     helpSection,
//     listPageContainer,
//     divMainSettings,
//     divProfilePage   
      
//   ];

//   const elementsToShow = [    
    
//     divTestsSelector,
//     //btnMenu

    
//   ];

//   //updateSettingsButtonVisibility(true)

//   showSettingsButton(true)

//   // hideElements(elementsToHide);

//   // showElements(elementsToShow); 

//   showHidePages(elementsToShow, elementsToHide);

//   //removeButtons();  

//   //createLevelsButtons(testBases); 

//   pTestTitle.textContent = "";

  

// }

// function showResultsPage() {  

//   showPage('test-result-page')

//   // const elementsToHide =[
//   //   divTestPage,
//   //   // pQuestionsCounter
//   // ]

//   // const elementsToShow =[   
//   //   divHome,
//   //   testResultsContainer
//   // ]


//   // hideElements(elementsToHide);
//   // showElements(elementsToShow);

//  // showHidePages(elementsToShow, elementsToHide);

//   // btnHome.textContent = "На главную";
//   // btnHome.value = "mainpage";

// }

  

// function showChosenTest(testName, counterText) {
//   const elementsToHide = [
//     divTestsSelector,       
//     divNext,   
//   ]

//   const elementsToShow = [ 
//     divTestPage,
//     pQuestionsCounter,
//     questionsCounter,
//     navigationContainer,
//     divHome   
//   ]

//   showHidePages(elementsToShow, elementsToHide);
  
//   showSettingsButton(false)  

//   renderQuestionCounter(counterText);

//   pTestTitle.textContent = testName;
//   btnHome.textContent = "Завершить";
//   btnHome.value = "complite";
 
// }

function showChosenTest(testName, counterText) {
  // const elementsToHide = [
  //   divTestsSelector,       
  //   divNext,   
  // ]

  // const elementsToShow = [ 
  //   divTestPage,
  //   pQuestionsCounter,
  //   questionsCounter,
  //   navigationContainer,
  //   divHome   
  // ]

  // showHidePages(elementsToShow, elementsToHide);
  
  showSettingsButton(false)  

  renderQuestionCounter(counterText);

  pTestTitle.textContent = testName;
  btnHome.textContent = "Завершить";
  btnHome.value = "complite";

  showPage('test-page'); 
 
}






// function showHidePages(arrayToShow, arrayToHide){
 
//   arrayToShow.forEach(element => {
//       element.classList.remove('hidden');
//   });
//    arrayToHide.forEach(element => {
//       element.classList.add('hidden');
//   });


   
// }



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

// const toggleSettingsPage = () => {
//   const isSettingsHidden = divMainSettings?.classList.contains('hidden');
  
//   if (isSettingsHidden) {
//     showSettingsPage();
//   } else {
//     hideSettingsPage();
//     removeButtons?.();
//     checkSettingsAndApply?.();
//   }
// };


////////////////////////////////////



function removeSettings() {  
  localStorage.removeItem("settings");  
  // setSettings(defaultSettings);

 

  // 2. Сразу ставим дефолтные настройки
  // Важно: сохраняем как строку, как ты делал в changeTheme
  localStorage.setItem('settings', JSON.stringify(defaultSettings));

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

