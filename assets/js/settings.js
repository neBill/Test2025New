'use strict';

const lev5Toggle = document.getElementById('lev5');
const lev6Toggle = document.getElementById('lev6');
const themeToggle =  document.getElementById('theme'); 
const shuffleToggle = document.getElementById('shuffle');
const learnModeToggle = document.getElementById('learn_mode');
const divDropdownMenu = document.getElementById("drop-down-menu");
const divHelp = document.getElementById("help_block");
//const divTestsButtons = document.getElementById('levels');
const btnIncreaseFontSize = document.getElementById('font-increase');
const btnDecreaseFontSize = document.getElementById('font-decrease');
const btnDefaultFontSize = document.getElementById('font-default');
const fontSizeSample = document.getElementById('fontsizeSample');




let currentFontSize = 20; // default fallback


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

  document.body.style.setProperty("--btn-font-size", `${fontSize}px`);
 
  fontSizeSample.style.fontSize = `${fontSize}px`;

  currentFontSize = fontSize;
}


btnIncreaseFontSize.addEventListener('click', increaseFontSize);

btnDecreaseFontSize.addEventListener('click', decreaseFontSize);

btnDefaultFontSize.addEventListener('click', defaultFontSize);



function clearCaches(){   

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


window.addEventListener("load", ()=>{  

  //set saved  settings
  if(localStorage.getItem('settings')) {   

    setSettings(JSON.parse(localStorage.getItem('settings')));  
        
  } else {

    //set end save default settings
    setSettings(defaultSettings);  
    localStorage.setItem("settings", JSON.stringify(defaultSettings));
    
  }    
 
  createTestButtons();
  
});

//лечение выхода из приложения при нажании кнопки назад в андроид
window.addEventListener('load', function() {

    window.history.pushState({}, '')
});
  
window.addEventListener('popstate', function() {
   
    btnHome.click();
    
    window.history.pushState({}, '')
});



lev5Toggle.addEventListener('change', function() {   

  setRankToggles('rank5')
  
});

lev6Toggle.addEventListener('change', function() {  

  setRankToggles('rank6')
  
});


const testsList = {
   
  rank5 : { 
    st5_1 : [test_5s_block_1, "5p Стандарт 1"],
    st5_2 : [test_5s_block_2, "5p Стандарт 2"],
    ex5 : [test_5ex, "5р эксперт"],
    ot_1 : [test_ot_block_1, "Охрана труда 1"],
    ot_2 : [test_ot_block_2, "Охрана труда 2"],
    ot5_2025 : [test_otrp, "ОT 2025"],
  },    
    
  rank6 : {      
    st6_1 : [test_6s_block_1, "6p Стандарт 1"],
    st6_2 : [test_6s_block_2, "6p Стандарт 2"],
    st6_3 : [test_6s_block_3, "6p Стандарт 3"],
    st6_4 : [test_6s_block_4, "6p Стандарт 4"],
    ex6 : [test_6e_block_1, "6р Эксперт"],
    ot_1 : [test_ot_block_1, "Охрана труда 1"],
    ot_2 : [test_ot_block_2, "Охрана труда 2"],
    ot6_2025 : [test_otrp, "ОT 2025"],
    tmp : [temp, "TEMP"],  
  },

}


// function createTestButtons(){ 
  
//   Object.keys(testsList[defaultRank]).forEach(key => {

//     const testButton = document.createElement('button');

//     testButton.id = key;

//     testButton.className = "test_button";

//     testButton.textContent = testsList[defaultRank][key][1]

//     divTestsButtons.appendChild(testButton);

//   });

//   ///////////////////////
//   //divTestsButtons.appendChild(testButton);

//   const testButton = document.createElement('button');

//   testButton.id = "tempRemove";

//   testButton.className = "test_button";

//   testButton.textContent = "DelHistory";

//   // testButton.onclick = clearHistory();

//   divTestsButtons.appendChild(testButton);


//   /////////////////////////////////

//   const tempButton = document.createElement('button');

//   tempButton.id = "tempBtn";

//   tempButton.className = "test_button";

//   tempButton.textContent = "New";

//   // testButton.onclick = clearHistory();

//   divTestsButtons.appendChild(tempButton);

//   //const tm = Object.keys(testBases)



// }


function createTestButtons(){ 
  
  Object.keys(testBases).forEach(key => {

    const testButton = document.createElement('button');

   // alert(testBases[key].testTitle)

    testButton.id = key;

    testButton.className = "test_button";


    //alert(testBases[key][0])

    testButton.textContent = testBases[key].testTitle;

    divLevels.appendChild(testButton);

  });

 

  //const tm = Object.keys(testBases)



}

function removeButtons() {
    
  divLevelss.innerHTML = '';
  
}


function showHideMenu() {

  const visibility = window.getComputedStyle(divDropdownMenu).display;  

  divDropdownMenu.style.display = visibility === "none" ? 'block' : 'none';
  
  if(divDropdownMenu.style.display === "none") {   

    const currentSettings = {

      isLearnMode : learnModeToggle.checked,
      isShuffle : shuffleToggle.checked,
      isDarkTheme : themeToggle.checked,
      defRank : defaultRank,
      fontSize : currentFontSize,
      
    }

    const isSettings = localStorage.getItem("settings");

    const settings = isSettings ? currentSettings : defaultSettings

    setSettings(settings)

    saveData('settings', settings);    

    removeButtons();

    createTestButtons();

  }

}

function removeSettings() {
  
  localStorage.removeItem("settings");
  

}


function hideHelpPage() {

  divHelp.style.display = "none";  

}

function showHelpPage() {

  divHelp.style.display = "block"; 

  showHideMenu();

}




function saveData(key, valueObject ){   

  localStorage.setItem(key, JSON.stringify(valueObject));

}


function setSettings(settings) {

  themeToggle.checked = settings.isDarkTheme; 
  
  shuffleToggle.checked = settings.isShuffle;

  learnModeToggle.checked = settings.isLearnMode;  

  defaultRank = settings.defRank;

  currentFontSize = settings.fontSize;

  document.body.style.setProperty("--btn-font-size", `${settings.fontSize}px`);

  let theme;

  themeToggle.checked == true  ? theme = 'dark-theme' : theme = 'light-theme';  

  //const theme = settings.isDarkTheme ? 'dark-theme' : 'light-theme';

  document.body.className = theme;

}


function setRankToggles(rank){  

  lev6Toggle.checked = rank === 'rank6';
  lev5Toggle.checked = rank !== 'rank6';
  defaultRank = rank;

  // const isRank6 = rank === 'rank6';
  // lev6Toggle.checked = isRank6;
  // lev5Toggle.checked = !isRank6;
  // defaultRank = rank;

}

const defaultSettings = {

  isLearnMode : false,
  isShuffle : false,
  isDarkTheme : false,
  defRank : 'rank6', 
  fontSize : 20,
  
}

