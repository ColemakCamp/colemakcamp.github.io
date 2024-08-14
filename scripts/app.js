/* Set global variables */

// the string of text that shows the words for the user to type
let prompt = document.querySelector('.prompt'),
    wordChain = document.querySelector('#wordChain'),
    answer = document.querySelector('#answer'),
    scoreText = document.querySelector('#scoreText'),
    timeText = document.querySelector('#timeText'),
    resetButton = document.querySelector('#resetButton'),
    accuracyText = document.querySelector('#accuracyText'),
    wpmText = document.querySelector('#wpmText'),
    testResults = document.querySelector('#testResults'),
    input = document.querySelector('#userInput'),
    fakeInput = document.querySelector('#fakeInput'),
    inputKeyboard = document.querySelector('#inputKeyboard'), // the main typing area
        // inputShiftKeyboard = document.querySelector('#inputShiftKeyboard'), // keyboard layout customization ui
    customInput = document.querySelector('.customInput'), // the dom element representing the shift keys in customization ui
    buttons = document.querySelectorAll('ul.nav li'),
    currentWord = document.querySelector('#currentWord'),
    layout = document.querySelector('#layout'), // layout (NEW)
    keyboard = document.querySelector('#keyboard'), // keyboard (NEW)
    mappingStatusButton = document.querySelector('#keymapping'),
    mappingStatusText = document.querySelector('#maptip'),
    saveButton = document.querySelector('.saveButton'), // save button on the custom layout ui
    discardButton = document.querySelector('.discardButton'), // discard button on the custom layout ui
    openUIButton = document.querySelector('.openUIButton'), // open button for the custom layout ui
    customUIKeyInput = document.querySelector('#customUIKeyInput'), // custom ui input field for custom keys
    subSection = document.querySelector('#sub'); // section containing custom input dialogue

// containers and maths
let promptOffset = 0,
    score, // tracks the current number of correct words the user has typed
    scoreMax = localStorage.getItem('scoreMax') || 50, // total number of words the user must type
    timeMax = localStorage.getItem('timeMax') || 60, // time limit for continuous typing
    wordMax = localStorage.getItem('wordMax') || 50, // word limit for continuous typing
    seconds = 0, // tracks the number of seconds%minutes*60 the current test has been running for 
    minutes = 0, // tracks the number of minutes the current test has been running for
    gameON = false, // set to true when user starts typing in input field
    correct = 0, // number of correct keystrokes during a game
    errors = 0, // number of typing errors during a game
    currentLevel = localStorage.getItem('currentLevel') || 1, // int representation of the current level, which determines which letter set to test
    correctAnswer, // string representation of the current correct word
    letterIndex = 0, // Keeps track of where in a word the user is; Increment with every keystroke except ' ', return, and backspace; Decrement for backspace, and reset for the other 2
    onlyLower = !localStorage.getItem('onlyLower') || localStorage.getItem('onlyLower') === 'true', // If only lower is true, include only words without capital letters
    answerString = '', // A string representation of the words for the current test. After a correct word is typed, it is removed from the beginning of answerString. By the end of the test, there should be no words in answerString
    keyboardMap = layoutMaps['colemak'],
    letterDictionary = levelDictionaries['colemak'],
    currentLayout = localStorage.getItem('currentLayout') || 'colemak',
    currentKeyboard = localStorage.getItem('currentKeyboard') || 'ansi',
    shiftDown = false, // tracks whether the shift key is currently being pushed
    fullSentenceMode = false, // if true, all prompts will be replace with sentences
    fullSentenceModeEnabled = localStorage.getItem('fullSentenceModeEnabled') === 'true',
    requireBackspaceCorrection = !localStorage.getItem('requireBackspaceCorrection') || localStorage.getItem('requireBackspaceCorrection') === 'true',
    timeLimitMode = localStorage.getItem('timeLimitMode') === 'true',
    wordScrollingMode = !localStorage.getItem('wordScrollingMode') || localStorage.getItem('wordScrollingMode') === 'true', // true by default.
    showCheatsheet = !localStorage.getItem('showCheatsheet') || localStorage.getItem('showCheatsheet') === 'true', // true by default.
    playSoundOnClick = localStorage.getItem('playSoundOnClick') === 'true',
    playSoundOnError = localStorage.getItem('playSoundOnError') === 'true',
    deleteFirstLine = false, // make this true every time we finish typing a line
    deleteLatestWord = false, // if true, delete last word typed. Set to true whenever a word is finished
    sentenceStartIndex = -1, // keeps track of where we are in full sentence mode
    sentenceEndIndex,
    lineLength = 19,
    lineIndex = 0, // tracks which line of the prompt we are currently on
    wordIndex = 0, // tracks which word you are on (ONLY IN PARAGRAPH MODE)
    idCount = 0,
    answerWordArray = [];

let specialKeys = ["Pause", "ScrollLock", "Insert", "PageUp", "PageDown", "Delete", "End", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "Escape", "Tab", "CapsLock", "Control", "Alt", "ContextMenu", "Home", "ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", "NumLock", "Backspace", "Shift", " ", "Enter", "OS" ], // list of all keys we typically want to ignore
    punctuation = localStorage.getItem('punctuation') || '', // this contains punctuation to include in our test sets. Set to empty at first
    requiredLetters = '', //levelDictionaries[currentLayout]['lvl'+currentLevel]+punctuation;; // keeps track of letters that still need to be used in the current level
    initialCustomKeyboardState = '', // saves a temporary copy of a keyboard layout that a user can return to by discarding changes
    initialCustomLevelsState = ''; // saves a temporary copy of custom levels that a user can return to by discarding changes

// menu config containers
let preferenceButton = document.querySelector('.settings'),
    capitalLettersAllowed = document.querySelector('.capitalLettersAllowed'),
    fullSentenceModeToggle = document.querySelector('.fullSentenceMode'),
    fullSentenceModeLevelButton = document.querySelector('.lvl8'),
    requireBackspaceCorrectionToggle = document.querySelector('.requireBackspaceCorrectionToggle'),
    wordLimitModeButton = document.querySelector('.wordLimitModeButton'),
    wordLimitModeInput = document.querySelector('.wordLimitModeInput'),
    timeLimitModeButton = document.querySelector('.timeLimitModeButton'),
    timeLimitModeInput = document.querySelector('.timeLimitModeInput'),
    wordScrollingModeButton = document.querySelector('.wordScrollingModeButton'),
    punctuationModeButton = document.querySelector('.punctuationModeButton'),
    showCheatsheetButton = document.querySelector('.showCheatsheetButton'),
    playSoundOnClickButton = document.querySelector('.playSoundOnClick'),
    playSoundOnErrorButton = document.querySelector('.playSoundOnError');

start();
init();

// this is the true init, which is only called once. Init will have to be renamed
// Call to initialize
function start() {
    //document.querySelector('.cheatsheet').innerHTML = keyboardDivs;
    inputKeyboard.innerHTML = customLayout[currentKeyboard];
    // scoreMax = wordLimitModeInput.value;
    //customInput.style.display = 'flex';

    if (!wordScrollingMode) {
        toggleWordScrollingModeUI();
    }

    if (fullSentenceModeEnabled) {
        toggleFullSentenceModeUI();
    }

    if (timeLimitMode) {
        toggleTimeLimitModeUI();
    }

    // if true, user keyboard input will be mapped to the chosen layout. No mapping otherwise
    if (localStorage.getItem('keyRemapping') === 'true') {
        mappingStatusButton.setAttribute('data-value','on');
    }

    //layout.value = currentLayout;
    layout.setAttribute('data-value', currentLayout);
    //keyboard.value = currentKeyboard;
    keyboard.setAttribute('data-value', currentKeyboard);

    navInit();

    if (localStorage.getItem('preferenceMenu')) {
        openMenu();
    }

    if (!showCheatsheet) {
        document.querySelector('.cheatsheet').classList.add('dispose');
    }

    switchLevel(currentLevel);

    updateLayoutUI();
}

// Initate the Nav
// As a separate function to simplify updating ticks
function navInit() {
    if (!onlyLower === true) {
        capitalLettersAllowed.classList.add('active');
    } else {
        capitalLettersAllowed.classList.remove('active');
    }

    if (punctuation !== "") {
        punctuationModeButton.classList.add('active');
    } else {
        punctuationModeButton.classList.remove('active');
    }

    if (requireBackspaceCorrection === true) {
        requireBackspaceCorrectionToggle.classList.add('active');
    } else {
        requireBackspaceCorrectionToggle.classList.remove('active');
    }

    if (fullSentenceModeEnabled === true) {
        fullSentenceModeToggle.classList.add('active');
    } else {
        fullSentenceModeToggle.classList.remove('active');
    }

    if (wordScrollingMode === true) {
        wordScrollingModeButton.classList.add('active');
    } else {
        wordScrollingModeButton.classList.remove('active');
    }

    if (timeLimitMode === true) {
        timeLimitModeButton.classList.add('active');
    } else {
        timeLimitModeButton.classList.remove('active');
    }

    if (!timeLimitMode === true) {
        wordLimitModeButton.classList.add('active');
    } else {
        wordLimitModeButton.classList.remove('active');
    }

    if (showCheatsheet === true) {
        showCheatsheetButton.classList.add('active');
    } else {
        showCheatsheetButton.classList.remove('active');
    }

    if (playSoundOnClick === true) {
        playSoundOnClickButton.classList.add('active');
    } else {
        playSoundOnClickButton.classList.remove('active');
    }

    if (playSoundOnError === true) {
        playSoundOnErrorButton.classList.add('active');
    } else {
        playSoundOnErrorButton.classList.remove('active');
    }

    wordLimitModeInput.value = wordMax;
    timeLimitModeInput.value = timeMax;
}

// some of the stuff in this function should probably be put into reset and we should examine when reset is called
// the rest should be in start(), which works like an actual init function should
// RENAME AND REFACTOR THIS PLEASE
function init() {
    createTestSets();
    reset();
    updateCheatsheetStyling(currentLevel);
}


/*________________Timers and Listeners___________________*/

// makes the clock tic
setInterval(()=> {
    if(gameON) {
        if(!timeLimitMode){
            seconds++;
            if(seconds >= 60) {
                seconds = 0;
                minutes++;
            }
        } else {
            // clock counting down
            seconds--;
            if(seconds <= 0 && minutes <=0){
                endGame();
            }
            if(seconds < 0) {
                seconds = 59;
                minutes--;
            }
        }
        resetTimeText();
    }
}, 1000);

// starts the timer when there is any change to the input field
input.addEventListener('keydown', (e)=> {
    gameON = true;
});


/*___________________________________________________________*/
/*____________________preference menu________________________*/

/* function openMenu() {
    preferenceMenu.style.right = 0;
    localStorage.setItem('preferenceMenu', 'open');
} */

function openMenu() {
    let content = document.querySelector('content'),
        menubar = document.querySelector('menubar'),
        prefbtn = document.querySelector('.config .settings');

    menubar.classList.remove('dispose');
    prefbtn.classList.add('active');
    setTimeout(function() {
        content.classList.remove('hidemenu');
    }, 10);
}

/* function closeMenu() {
    preferenceMenu.style.right = '-37vh';
    localStorage.removeItem('preferenceMenu');
} */

function closeMenu() {
    let content = document.querySelector('content'),
        menubar = document.querySelector('menubar'),
        prefbtn = document.querySelector('.config .settings');

    content.classList.add('hidemenu');
    setTimeout(function() {
        menubar.classList.add('dispose');
        prefbtn.classList.remove('active');
    }, 100);
}

function toggleMenu() {
    let content = document.querySelector('content');

    if (content.classList.contains('hidemenu')) {
        openMenu();
    } else {
        closeMenu();
    }
}

// close preference menu on escape key. While we're at it, also close custom
// ui menu
document.addEventListener('keydown', (e)=> {
    // if(e.keyCode == 27) {
    if (e.key === "Escape") {
        closeMenu();

        // close custom ui menu
        if (customInput.classList.contains('show')) {
            discardButton.click();
            // customInput.classList.remove('show');
            // remove active class from current key
            clearSelectedInput();
            init();
        }
        /* if(customInput.style.transform != 'scaleX(0)'){
            customInput.style.transform = 'scaleX(0)';
            // remove active class from current key
            clearSelectedInput();
            init();
        } */
    }
});

// listener for preference menu button
preferenceButton.addEventListener('click', ()=> {
    //openMenu();
    toggleMenu();
});

// listener for preference menu close button
/* closePreferenceButton.addEventListener('click', ()=> {
    closeMenu();
}); */

// capital letters allowed
capitalLettersAllowed.addEventListener('click', ()=> {
    onlyLower = !onlyLower;
    localStorage.setItem('onlyLower', onlyLower);
    reset();
});

requireBackspaceCorrectionToggle.addEventListener('click', ()=> {
    requireBackspaceCorrection = !requireBackspaceCorrection;
    localStorage.setItem('requireBackspaceCorrection', requireBackspaceCorrection);
    reset();
});

// full sentence mode
function toggleFullSentenceModeUI() {
    fullSentenceModeLevelButton.classList.toggle('visible');
}

fullSentenceModeToggle.addEventListener('click', ()=> {
    fullSentenceModeEnabled = !fullSentenceModeEnabled;
    localStorage.setItem('fullSentenceModeEnabled', fullSentenceModeEnabled);
    toggleFullSentenceModeUI();
    if (fullSentenceModeEnabled) {
        switchLevel(8);
    } else {
        switchLevel(1);
    }
    reset();
});

// Toggle display of time limit mode input field
function toggleTimeLimitModeUI() {
    seconds = timeLimitModeInput.value % 60;
    minutes = Math.floor(timeLimitModeInput.value / 60);
    scoreText.style.display = 'none';

    // make the word list long enough so that no human typer can reach the end
    // scoreMax = timeLimitModeInput.value * 4;
    scoreMax = timeMax * 10;

    // toggle value of word limit mode button
    // wordLimitModeButton.checked = !wordLimitModeButton.checked;

    // toggle display of input fields
    timeLimitModeInput.classList.toggle('dispose');
    wordLimitModeInput.classList.toggle('dispose');
}

// time limit mode button; if this is checked, uncheck button for word limit and vice versa
timeLimitModeButton.addEventListener('click', ()=> {
    if(timeLimitMode == true) {
        // timeLimitModeButton.checked = true;
    } else {
        // change mode logic here
        timeLimitMode = true;
        toggleTimeLimitModeUI();
        localStorage.setItem('timeLimitMode', timeLimitMode);
        reset();
    }
});

// time limit mode field
timeLimitModeInput.addEventListener('change', ()=> {
    let wholeSecond = Math.floor(timeLimitModeInput.value);

    scoreMax = wholeSecond*10;
    
    if(wholeSecond < 1  || wholeSecond > 10000) {
        wholeSecond = 60
    }

    // set the dom element to a whole number (in case the user puts in a decimal)
    timeLimitModeInput.value = wholeSecond;
    timeMax = wholeSecond;
    localStorage.setItem('timeMax', timeMax);

    seconds = wholeSecond % 60;
    minutes = Math.floor(wholeSecond / 60);


    gameON = false;
    resetTimeText();
});

// word Limit mode butto; if this is checked, uncheck button for time limit and vice versa
// Toggle display of word limit mode input field
wordLimitModeButton.addEventListener('click', ()=> {
    if(timeLimitMode == false) {
        // wordLimitModeButton.checked = true;
    } else {
        // change mode logic here
        timeLimitMode = false;
        seconds = 0;
        minutes = 0;
        scoreText.style.display = 'flex';

        // set score max back to the chosen value
        //scoreMax = wordLimitModeInput.value;
        scoreMax = wordMax;

        // toggle value of time limit mode button
        //timeLimitModeButton.checked = !timeLimitModeButton.checked;

        // toggle display of input fields
        timeLimitModeInput.classList.toggle('dispose');
        wordLimitModeInput.classList.toggle('dispose');

        localStorage.setItem('timeLimitMode', timeLimitMode);

        reset();
    }
});

// word Limit input field
wordLimitModeInput.addEventListener('change', ()=> {
    if(wordLimitModeInput.value > 10 && wordLimitModeInput.value <= 500){
        wordLimitModeInput.value = Math.ceil(wordLimitModeInput.value / 10) * 10;
        scoreMax = wordLimitModeInput.value;
        wordMax = wordLimitModeInput.value;
    }else if (wordLimitModeInput.value > 500){
        scoreMax = 500;
        wordMax = 500;
        wordLimitModeInput.value = 500;
    }else {
        scoreMax = 10;
        wordMax = 10;
        wordLimitModeInput.value = 10;
    }

    localStorage.setItem('scoreMax', scoreMax);
    localStorage.setItem('wordMax', scoreMax);

    reset();
});

// word scrolling mode
function toggleWordScrollingModeUI() {
    prompt.classList.toggle('paragraph');
    // remove fade from parent
    document.querySelector('#fadeElement').classList.toggle('fade');
}

wordScrollingModeButton.addEventListener('click', ()=> {
    wordScrollingMode = !wordScrollingMode;
    localStorage.setItem('wordScrollingMode', wordScrollingMode);
    toggleWordScrollingModeUI();
    reset();
});

// punctuation mode
punctuationModeButton.addEventListener('click', ()=> {
    console.log('punctuation mode toggled');
    // if turning punctuation mode on
    if(punctuation == '') {
        punctuation = "'.-";
    }else { // if turning punctuation mode off
        punctuation = '';
    }

    localStorage.setItem('punctuation', punctuation);

    createTestSets();
    updateCheatsheetStyling(currentLevel);
    reset();
});

// show cheatsheet toggle
showCheatsheetButton.addEventListener('click', ()=> {
    if(showCheatsheet){
        // hide display for cheatsheet
        document.querySelector('.cheatsheet').classList.add('dispose');
    }else{
        // show display for cheatsheet
        document.querySelector('.cheatsheet').classList.remove('dispose');
    }

    showCheatsheet = !showCheatsheet;
    localStorage.setItem('showCheatsheet', showCheatsheet);
    navInit();
});

// play sound on click toggle
playSoundOnClickButton.addEventListener('click', ()=> {
    playSoundOnClick = !playSoundOnClick;
    localStorage.setItem('playSoundOnClick', playSoundOnClick);
    navInit();
});

// play sound on error toggle
playSoundOnErrorButton.addEventListener('click', ()=> {
    playSoundOnError = !playSoundOnError;
    localStorage.setItem('playSoundOnError', playSoundOnError);
    navInit();
});

/*______________________preference menu______________________*/
/*___________________________________________________________*/

/*___________________________________________________________*/
/*___________________________sound___________________________*/

const errorSound = new Audio('sounds/error.wav');

const clickSounds = [
    {
      sounds: [
        new Audio('sounds/click1.wav'),
        new Audio('sounds/click1.wav'),
      ],
      counter: 0,
    },
    {
      sounds: [
        new Audio('sounds/click2.wav'),
        new Audio('sounds/click2.wav'),
      ],
      counter: 0,
    },
    {
      sounds: [
        new Audio('sounds/click3.wav'),
        new Audio('sounds/click3.wav'),
      ],
      counter: 0,
    },
    {
      sounds: [
        new Audio('sounds/click4.wav'),
        new Audio('sounds/click4.wav'),
      ],
      counter: 0,
    },
    {
      sounds: [
        new Audio('sounds/click5.wav'),
        new Audio('sounds/click5.wav'),
      ],
      counter: 0,
    },
    {
      sounds: [
        new Audio('sounds/click6.wav'),
        new Audio('sounds/click6.wav'),
      ],
      counter: 0,
    },
];

function playClickSound() {
  if (!playSoundOnClick) return;

  const rand = Math.floor(Math.random() * 6);
  const randomSound = clickSounds[rand];

  // the duplicated sounds are used to prevent the sound from cutting off
  randomSound.counter++;
  if (randomSound.counter === 2) randomSound.counter = 0;

  randomSound.sounds[randomSound.counter].currentTime = 0;
  randomSound.sounds[randomSound.counter].play();
}

function playErrorSound() {
  if (!playSoundOnError) return;
  errorSound.currentTime = 0;
  errorSound.play();
}

/*___________________________sound___________________________*/
/*___________________________________________________________*/

/*___________________________________________________________*/
/*______________listeners for custom ui input________________*/

function updateLayoutUI() {
    let cSheet;
    switch (currentKeyboard) {
        case 'ansi':
            cSheet = document.querySelector('.cheatsheet');
            cSheet.parentNode.classList.add('ansi');
            cSheet.parentNode.classList.remove('iso','ortho');
            cSheet.innerHTML = ansiDivs;
            customInput.classList.add('ansi');
            customInput.classList.remove('iso','ortho');
            inputKeyboard.innerHTML = customLayout.ansi;

            layoutMaps.colemakdh.KeyZ = 'x';
            layoutMaps.colemakdh.KeyX = 'c';
            layoutMaps.colemakdh.KeyC = 'd';
            layoutMaps.colemakdh.KeyV = 'v';
            layoutMaps.colemakdh.KeyB = 'z';

            layoutMaps.colemakdhs.KeyZ = 'x';
            layoutMaps.colemakdhs.KeyX = 'c';
            layoutMaps.colemakdhs.KeyC = 'd';
            layoutMaps.colemakdhs.KeyV = 'v';
            layoutMaps.colemakdhs.KeyB = 'z';

            layoutMaps.tarmakdh.KeyZ = 'x';
            layoutMaps.tarmakdh.KeyX = 'c';
            layoutMaps.tarmakdh.KeyC = 'd';
            layoutMaps.tarmakdh.KeyV = 'v';
            layoutMaps.tarmakdh.KeyB = 'z';
            levelDictionaries.tarmakdh.lvl1 = 'qwagv';
            levelDictionaries.tarmakdh.lvl3 = 'ftbzxc';

            layoutMaps.canary.KeyZ = 'j';
            layoutMaps.canary.KeyX = 'v';
            layoutMaps.canary.KeyC = 'd';
            layoutMaps.canary.KeyV = 'g';
            layoutMaps.canary.KeyB = 'q';
            layoutMaps.canary.KeyN = 'm';
            layoutMaps.canary.KeyG = 'b';
            layoutMaps.canary.KeyH = 'f';
            layoutMaps.canary.KeyT = 'k';
            layoutMaps.canary.KeyU = 'x';
            break;
        case 'iso':
            cSheet = document.querySelector('.cheatsheet');
            cSheet.parentNode.classList.add('iso');
            cSheet.parentNode.classList.remove('ansi','ortho');
            cSheet.innerHTML = isoDivs;
            customInput.classList.add('iso');
            customInput.classList.remove('ansi','ortho');
            inputKeyboard.innerHTML = customLayout.iso;

            layoutMaps.colemakdh.IntlBackslash = 'z';
            layoutMaps.colemakdh.KeyZ = 'x';
            layoutMaps.colemakdh.KeyX = 'c';
            layoutMaps.colemakdh.KeyC = 'd';
            layoutMaps.colemakdh.KeyV = 'v';
            delete layoutMaps.colemakdh.KeyB;

            layoutMaps.colemakdhs.IntlBackslash = 'z';
            layoutMaps.colemakdhs.KeyZ = 'x';
            layoutMaps.colemakdhs.KeyX = 'c';
            layoutMaps.colemakdhs.KeyC = 'd';
            layoutMaps.colemakdhs.KeyV = 'v';
            delete layoutMaps.colemakdhs.KeyB;

            layoutMaps.tarmakdh.IntlBackslash = 'z';
            layoutMaps.tarmakdh.KeyZ = 'x';
            layoutMaps.tarmakdh.KeyX = 'c';
            layoutMaps.tarmakdh.KeyC = 'd';
            layoutMaps.tarmakdh.KeyV = 'v';
            delete layoutMaps.tarmakdh.KeyB;
            levelDictionaries.tarmakdh.lvl1 = 'qwagv';
            levelDictionaries.tarmakdh.lvl3 = 'ftbzxc';

            layoutMaps.canary.IntlBackslash = 'q';
            layoutMaps.canary.KeyZ = 'j';
            layoutMaps.canary.KeyX = 'v';
            layoutMaps.canary.KeyC = 'd';
            layoutMaps.canary.KeyV = 'g';
            delete layoutMaps.canary.KeyB;
            layoutMaps.canary.KeyN = 'm';
            layoutMaps.canary.KeyG = 'b';
            layoutMaps.canary.KeyH = 'f';
            layoutMaps.canary.KeyT = 'k';
            layoutMaps.canary.KeyU = 'x';
            break;
        case 'ortho':
            cSheet = document.querySelector('.cheatsheet');
            cSheet.parentNode.classList.add('ortho');
            cSheet.parentNode.classList.remove('ansi','iso');
            cSheet.innerHTML = orthoDivs;
            customInput.classList.add('ortho');
            customInput.classList.remove('ansi','iso');
            inputKeyboard.innerHTML = customLayout.ortho;

            layoutMaps.colemakdh.KeyZ = 'z';
            layoutMaps.colemakdh.KeyX = 'x';
            layoutMaps.colemakdh.KeyC = 'c';
            layoutMaps.colemakdh.KeyV = 'd';
            layoutMaps.colemakdh.KeyB = 'v';

            layoutMaps.colemakdhs.KeyZ = 'z';
            layoutMaps.colemakdhs.KeyX = 'x';
            layoutMaps.colemakdhs.KeyC = 'c';
            layoutMaps.colemakdhs.KeyV = 'd';
            layoutMaps.colemakdhs.KeyB = 'v';

            layoutMaps.tarmakdh.KeyZ = 'z';
            layoutMaps.tarmakdh.KeyX = 'x';
            layoutMaps.tarmakdh.KeyC = 'c';
            layoutMaps.tarmakdh.KeyV = 'd';
            layoutMaps.tarmakdh.KeyB = 'v';
            levelDictionaries.tarmakdh.lvl1 = 'qwagzxc';
            levelDictionaries.tarmakdh.lvl3 = 'ftbv';

            layoutMaps.canary.KeyZ = 'q';
            layoutMaps.canary.KeyX = 'j';
            layoutMaps.canary.KeyC = 'v';
            layoutMaps.canary.KeyV = 'd';
            layoutMaps.canary.KeyB = 'k';
            layoutMaps.canary.KeyN = 'x';
            layoutMaps.canary.KeyG = 'g';
            layoutMaps.canary.KeyH = 'm';
            layoutMaps.canary.KeyT = 'b';
            layoutMaps.canary.KeyU = 'f';
            break;
    }

    // if custom input is selected, show the ui for custom keyboards
    if(currentLayout == 'custom') {
        openUIButton.classList.remove('dispose');
        //openUIButton.style.display = 'block';
        startCustomKeyboardEditing();
    }else {
        //customInput.style.transform = 'scaleX(0)';
        customInput.classList.remove('show');
        //openUIButton.style.display = 'none';
        openUIButton.classList.add('dispose');
    }

    // level labels
    for (let i = 1; i <= 6; i++) {
        if(currentLayout.match(/tarmak/)) {
            document.querySelector('.lvl'+i).innerHTML = `<span>${(i-1)}</span><label>Step</label>`; // = /* 'Step '+ */(i-1);
        } else {
            document.querySelector('.lvl'+i).innerHTML = `<span>${i}</span><label>Level</label>`; // = /* 'Level '+ */i;
        }
    }

    // change keyboard map and key dictionary
    keyboardMap = layoutMaps[currentLayout];
    console.log(currentLayout);
    console.log(currentKeyboard);
    letterDictionary = levelDictionaries[currentLayout];

    if(currentLayout == 'custom'){
        customUIKeyInput.focus();
    }

}

// function for layout change
function changeLayout(value) {
    currentLayout = value;
    layout.setAttribute('data-value', value);
    localStorage.setItem('currentLayout', currentLayout);
    updateLayoutUI();
    // reset everything
    init();
    updateSelectors();
}

// function for keyboard change
function changeKeyboard(value) {
    currentKeyboard = value;
    keyboard.setAttribute('data-value', value);
    localStorage.setItem('currentKeyboard', currentKeyboard);
    updateLayoutUI();
    // reset everything
    init();
    updateSelectors();
}

// listener for custom layout ui open button
openUIButton.addEventListener('click', ()=> {
    startCustomKeyboardEditing(true);
});

// called whenever a user opens the custom editor. Sets correct displays and saves an initial state
// of the keyboard to refer back to if the user wants to discard changes
function startCustomKeyboardEditing(user) {
    if (!localStorage.customLevelDictionary || !localStorage.customLayoutMap) {
        initialCustomKeyboardState = Object.assign({}, layoutMaps['custom']);
        initialCustomLevelsState = Object.assign({}, levelDictionaries['custom']);
    } else {
        initialCustomKeyboardState = Object.assign({}, getJSON('customLayoutMap'));
        initialCustomLevelsState = Object.assign({}, getJSON('customLevelDictionary'));
    }
    // customInput.style.display = 'flex';

    loadCustomLayout(initialCustomKeyboardState);
    loadCustomLevels(initialCustomLevelsState);

    if (user !== true && localStorage.customLevelDictionary && localStorage.customLayoutMap) {
        return;
    }

    subSection.classList.remove('dispose');
    setTimeout(function() {
        customInput.classList.add('show');
        document.querySelector('.currentCustomLevel').click();
    }, 10);

    // customInput.style.transform = 'scaleX(1)';
    let k = document.querySelector('.defaultSelectedKey');
    selectInputKey(k);
}

// selects an input key on the custom keyboard and applies the correct styling
function selectInputKey(k){
    // clear previous styling
    clearSelectedInput();

    k.classList.add('selectedInputKey');
    if(k.children[0].innerHTML == '') {
        k.children[0].innerHTML = '_';
    }
    //k.children[0].classList.add('pulse');
    customUIKeyInput.focus();
}

// listener for the custom layout ui 'done' button
saveButton.addEventListener('click', ()=> {
    storeCustomLayout();
    //customInput.style.transform = 'scaleX(0)';
    customInput.classList.remove('show');
    setTimeout(function() {
        subSection.classList.add('dispose');
    }, 200);
    // remove active class from current key
    clearSelectedInput();
    init();
});

// listener for the custom layout ui 'done' button
discardButton.addEventListener('click', ()=> {
    //customInput.style.transform = 'scaleX(0)';
    customInput.classList.remove('show');
    setTimeout(function() {
        subSection.classList.add('dispose');
    }, 200);
    // remove active class from current key
    clearSelectedInput();


    // load the old layout to revert changes, aka discard changes
    loadCustomLayout(initialCustomKeyboardState);
    loadCustomLevels(initialCustomLevelsState);

    console.log(levelDictionaries.custom);

    init();
});

// general click listener
document.addEventListener('click', function (e) {
    // add key listeners for each of the keys the custom input ui
    // When clicked, a key becomes 'selectedInputKey' and all others lose
    // this class. 
    k = e.target.closest('row.custom > key.grey');
    if (k) {
        // change focus to the customUIKeyInput field
        customUIKeyInput.focus();

        // remove 'selectedInputKey' from any keys previously clicked
        clearSelectedInput();

        k.classList.add('selectedInputKey');
        if (k.children[0].innerHTML == '' || k.children[0].innerHTML == ' ') {
            k.children[0].innerHTML = '_';
        }
        //k.children[0].classList.add('pulse');
    } else {
        clearSelectedInput();
    }

    
    // listener for customUILevelButtons
    // k = e.target.closest('.customUILevelButton');
    k = e.target.closest('ul.customLevels li');

    if (k) {
        // remove styling from other buttons
        // let currentSelectedLevel = document.querySelector('.currentCustomUILevel');
        let currentSelectedLevel = document.querySelector('.currentCustomLevel');
        if(currentSelectedLevel){
            // currentSelectedLevel.classList.remove('currentCustomUILevel');
            currentSelectedLevel.classList.remove('currentCustomLevel');
        }
        
        // add styling to selected button
        customUIKeyInput.focus();
        // k.classList.add('currentCustomUILevel');
        k.classList.add('currentCustomLevel');
        // set new dom element
        // currentSelectedLevel = document.querySelector('.currentCustomUILevel');
        currentSelectedLevel = document.querySelector('.currentCustomLevel');

        // remove styling from all keys that don't correspond with selected level button
        // add styling to keys that correspond with selected level button
        let allCKeys = document.querySelectorAll('row.custom > key');
        for(n of allCKeys) {
            if(n.children[0].innerHTML != 0 &&
                levelDictionaries['custom'][currentSelectedLevel.getAttribute('data-level')].includes(n.children[0].innerHTML)) {
                    n.classList.add('active');
            } else {
                n.classList.remove('active');
            }
        }

    }

}, false);


// listener for custom input field. Updates on any input, clearing the current selected
// input key, and setting the new value
customUIKeyInput.addEventListener('keydown', (e)=> {
    let k = document.querySelector('.selectedInputKey');

    // if there was already a value for this key, remove it from all levels
    if(k.children[0].innerHTML != '_') {
        removeKeyFromLevels(k);
    }


    // if key entered is not shift, control, space, caps, enter, backspace, escape, 
    // or delete, left or right arrows, update dom element and key mapping value
    if (/*e.keyCode != 16*/ e.key !== "Shift" &&
        /*e.keyCode != 17*/ e.key !== "Control" &&
        /*e.keyCode != 27*/ e.key !== "Escape" &&
        /*e.keyCode != 46*/ e.key !== "Delete" &&
        /*e.keyCode != 32*/ e.key !== " " &&
        /*e.keyCode != 8 */ e.key !== "Backspace" &&
        /*e.keyCode != 20*/ e.key !== "CapsLock" &&
        /*e.keyCode != 13*/ e.key !== "Enter" &&
        /*e.keyCode != 37*/ e.key !== "ArrowLeft" &&
        /*e.keyCode != 39*/ e.key !== "ArrowRight" &&
        /*e.keyCode != 38*/ e.key !== "ArrowUp" &&
        /*e.keyCode != 40*/ e.key !== "ArrowDown") {
        // let currentUILev = document.querySelector('.currentCustomUILevel').innerHTML;
        let currentUILev = document.querySelector('.currentCustomLevel').getAttribute('data-level');
        k.children[0].innerHTML = e.key;
    
        // // if we are not already on shift layer, add to dom element shift layer
        // if(!shiftDown) {
        //     // document.querySelector('#shift' + k.id).children[0].innerHTML = e.key.toUpperCase();
        // }
        k.classList.add('active');

        // new keyMapping Data
        if(k.id){
            let keyCode = k.id.toString().replace('custom','');
            keyCode = keyCode.toString().replace('shift','');
            if(!shiftDown) {
                layoutMaps.custom[keyCode] = e.key;
            }

            layoutMaps.custom.shiftLayer[keyCode] = e.key.toUpperCase();
        }

        //new levels data
        levelDictionaries['custom'][currentUILev]+= e.key;
        levelDictionaries['custom']['lvl7']+= e.key;
        //console.log('new key ' + currentUILev + e.key);

        // associate the key element with the current selected level

        // this updates the main keyboard in real time. Could be ommited if performance needs a boost
        // updateCheatsheetStyling(currentLevel);
        
        // switch to next input key
        switchSelectedInputKey('right');
    } else if (/*e.keyCode == 8 */ e.key === "Backspace" ||
               /*e.keyCode == 46*/ e.key === "Delete" ) {
        // switchSelectedInputKey('left');
        // if backspace, remove letter from the ui element and the keyboard map
        k.children[0].innerHTML = '_';
        k.classList.remove('active');
        layoutMaps.custom.shiftLayer[k.id] = ' ';

        // remove deleted letter from keymapping and levels
        if(k.id){
            //console.log('key added to mapping ' + e.key);
            layoutMaps.custom[k.id] = ' ';
            removeKeyFromLevels(k);
        }
    }else if (/*e.keyCode == 37*/ e.key === "ArrowLeft") {
        switchSelectedInputKey('left');
    }else if (/*e.keyCode == 39*/ e.key === "ArrowRight") {
        console.log('right');
        switchSelectedInputKey('right');
    }else if (/*e.keyCode == 38*/ e.key === "ArrowUp") {
        // console.log('up');
        switchSelectedInputKey('up');
    }else if (/*e.keyCode == 40*/ e.key === "ArrowDown") {
        // console.log('down');
        switchSelectedInputKey('down');
    }

    // clear input field
    customUIKeyInput.value = '';
});

// given a key object, k, remove a value of the letter on k from all levels
function removeKeyFromLevels(k) {
    let lvls = Object.keys(levelDictionaries['custom']);
    for(lvl of lvls) {
        let keyCode = k.id.toString().replace('custom','');
        //console.log(levelDictionaries.custom.lvl[keyCode]);
        // replace any instances of letter previously found on key
        levelDictionaries['custom'][lvl] = levelDictionaries['custom'][lvl].replace(k.children[0].innerHTML, '');
        // replace mapping for letter previously found on key
        layoutMaps['custom'][keyCode] = ' ';
    }
}

// sets the custom keyboard layout to be equal to the json parameter passed in
function loadCustomLayout(newCustomLayout) {
    console.log('new layout');
    layoutMaps.custom = Object.assign({},newCustomLayout);
    keyboardMap = layoutMaps.custom;

    let customKeys = document.querySelectorAll('row.custom > key');
    // load letters onto the custom ui input keyboard
    customKeys.forEach((cKey)=> {
        let currentKeyName = cKey.id.substring(6);
        // console.log(currentKeyName);
        
        // if the value of the new layout key is not undefined, set it to the corresponding dom element
        if(keyboardMap[currentKeyName]){
            // if key is blank, remove active styling
            if(keyboardMap[currentKeyName] == ' '){
                cKey.classList.remove('active');
            }
            cKey.innerHTML = `<span>${keyboardMap[currentKeyName]}</span>`;
        }    
    });
}

// sets the custom levels to be equal to the json parameter passed in
function loadCustomLevels(newCustomLevels) {
    levelDictionaries.custom = Object.assign({},newCustomLevels);
    letterDictionary = levelDictionaries['custom'];
}

// switches the focus to the next input key, determined by the direction parameter
// Parameter is either left, right, up, or down
function switchSelectedInputKey(direction) {
    function selInKey() {
        return document.querySelector('.selectedInputKey');
    }
    let k; // the key to jump to
    if(direction == 'right'){
        k = selInKey().nextElementSibling;
        if (k.classList.contains('skip')) {
            k = k.nextElementSibling;
        }
    }else if(direction == 'left'){
        k = selInKey().previousElementSibling;
        if (k.classList.contains('skip')) {
            k = k.previousElementSibling;
        }
    }else if(direction == 'up'){
        let keyPosition;
        let currentKey = selInKey();
        for(let i = 0; i < currentKey.parentElement.children.length; i++) {
              if (currentKey.parentElement.children[i] == currentKey) {
                  console.log('found! ' + i);
                  keyPosition = i;
                  break;
              }
          }
        if (selInKey().parentElement.previousElementSibling.children[keyPosition].classList.contains('grey')) {
            k = selInKey().parentElement.previousElementSibling.children[keyPosition];
        } else {
            k = selInKey();
        }
    }else if(direction == 'down'){
        let keyPosition;
        let currentKey = selInKey();
        for(let i = 0; i < currentKey.parentElement.children.length; i++) {
              if (currentKey.parentElement.children[i] == currentKey) {
                  console.log('found! ' + i);
                  keyPosition = i;
                  break;
              }
          }
        if (selInKey().parentElement.nextElementSibling.children[keyPosition].classList.contains('grey')) {
            k = selInKey().parentElement.nextElementSibling.children[keyPosition];
        } else {
            k = selInKey();
        }
    }

    if (k.classList.contains('finalKey') || k.classList.contains('firstKey')){
        //if first or last valid key on keyboard, don't change keysz
        k = selInKey();
    } else if (k.classList.contains('rowEnd')) {
        // if last valid key on row, move down a row
        k = selInKey().parentElement.nextElementSibling.children[1];
    } else if (k.classList.contains('rowStart')) {
        // if first valid key on row, move up a row
        k = selInKey().parentElement.previousElementSibling.children[selInKey().parentElement.previousElementSibling.children.length - 2];
    }

        clearSelectedInput();
        k.classList.add('selectedInputKey');
        if(k.children[0].innerHTML == '') {
            k.children[0].innerHTML = '_';
        }
        //k.children[0].classList.add('pulse');
}

// remove 'selectedInputKey' from any keys previously clicked
function clearSelectedInput() {
    let k = document.querySelectorAll('.selectedInputKey');
    
    for (let x = 0; x < k.length; x++) {
        k[x].classList.remove('selectedInputKey');
        //k[x].children[0].classList.remove('pulse');
        console.log(k[x].children[0].innerHTML);
        if (k[x].children[0].innerHTML == '_'){
            k[x].children[0].innerHTML = '';
        }
    }
}

// returns true if the letters typed SO FAR are correct
function checkAnswerToIndex() {
    // user input
    // let inputVal = input.value;
    let inputVal = fakeInput.innerText;

    // console.log('checking input ' +inputVal.slice(0,letterIndex) + '!');
    // console.log(correctAnswer.slice(0,letterIndex)+ '!');
    return inputVal.slice(0,letterIndex) == correctAnswer.slice(0,letterIndex);
}

// add event listeners to level buttons
for (let x = 0; x < buttons.length; x++) {
    buttons[x].addEventListener('click', function() {
        let lev = x + 1;
        switchLevel(lev);
    });
}

// switches to level 
function switchLevel(lev) {
    localStorage.setItem('currentLevel', lev);
    console.log(lev);
        // stop timer
        gameON = false;

        // clear input field
        document.querySelector('#userInput').value = '';

        // clear highlighted buttons
        clearCurrentLevelStyle();
        // console.log('.lvl'+lev);
        document.querySelector('.lvl'+lev).classList.add('currentLevel');
        
        // set full sentence mode to true
        if(lev == 8) {
            fullSentenceMode = true;
        } else {
            fullSentenceMode = false;
        }

        if(lev == 8) {
            lev = 7;
        }

        // window[] here allows us to select the variable levelN, instead of
        // setting currentLevelList to a string
        currentLevel = lev;
        
        // reset everything
        reset();

        // take care of styling for the cheatsheet
        updateCheatsheetStyling(lev);
}

// updates all styling for the cheatsheet by first resetting all keys,
// then styling those in active levels. takes the current level (int) as a parameter
function updateCheatsheetStyling(level) {

    // loop through all buttons
    let allKeys = document.querySelectorAll('row:not(.custom) > key');
    for(n of allKeys) {
        //reset all keys to default
        n.classList.add('inactive');
        n.classList.remove('active');
        n.classList.remove('homeRow');
        n.classList.remove('currentLevelKeys');
        n.classList.remove('punctuation');
        n.innerHTML='<span></span>';
        
        // set of keys to loop through the letter dictionary, which
        // contains info about which levels each key appears at
        let objKeys = Object.keys(letterDictionary);

        // check active levels and apply styling
        for(let i = 0; i < level; i++) {

            // the letter that will appear on the key
            let letter = keyboardMap[n.id];

            let lettersToCheck = letterDictionary[objKeys[i]]+punctuation;

            if(lettersToCheck.includes(letter)){
                n.innerHTML=`<span>${letter}</span>`;
                n.classList.remove('inactive');
                if(punctuation.includes(letter)){
                    n.classList.remove('active');
                    n.classList.add('punctuation');
                }else if(i==0){
                    n.classList.add('homeRow');
                }else if(i==6){
                    // all words selected
                }else if(i == level-1){
                    n.classList.remove('active');
                    n.classList.add('currentLevelKeys');
                }else {
                    n.classList.add('active');
                }
            }
        }

    }
}

// resetButton listener
resetButton.addEventListener('click', ()=> {
    console.log('reset button called');
    reset();
});


/*________________OTHER FUNCTIONS___________________*/

// resets everything to the beginning of game state. Run when the reset
// button is called or when a level is changed
// Set a new prompt word and change variable text
function reset() {
    // reset nav first
    navInit();

    deleteFirstLine        = false; // make this true every time we finish typing a line
    deleteLatestWord    = false;

     prompt.innerHTML = '';
     answerString = '';
     input.value = '';
     fakeInput.innerText = '';
     answerWordArray = [];


    idCount = 0; 

    sentenceStartIndex = -1;


    // stop the timer
    gameON = false;


    console.log('reset called');
    // set current letter index back to 0
    letterIndex = 0;
    wordIndex = 0;
    lineIndex = 0;

    // prompt offset back to 0
    promptOffset = 0;
    prompt.style.left = 0;

    // set correct and errors counts to 0
    correct = 0;
    errors = 0;

    // set to -1 before each game because score is incremented every time we call
    // updateScoreText(), including on first load
    score = -1;

    requiredLetters = (levelDictionaries[currentLayout]['lvl'+currentLevel]+punctuation).split('');

    // reset clock
    if(!timeLimitMode) {
        minutes = 0;
        seconds = 0;
    } else {
        seconds = timeLimitModeInput.value%60;
        minutes = Math.floor(timeLimitModeInput.value/60);
    }

    // reset timeText
    resetTimeText();

    // set mapping to off

    // set accuracyText to be transparent
    testResults.classList.add('transparent');

    // no display for reset button during game
    resetButton.classList.add('dispose');

    //set prompt to visible
    prompt.classList.remove('dispose');


    for(let i = 1; i <=3 ; i++){
        addLineToPrompt();
        if(i == 1) {
            correctAnswer = answerWordArray[0];
        }
    }

    answerLetterArray = answerString.split('');
    //reset prompt

    // change the 0/50 text
    updateScoreText();

    // change focus to the input field
    input.focus();
}

// generates a new line, adds it to prompt, and to answerWordArray
function addLineToPrompt(){
    let lineToAdd = generateLine(scoreMax-score-answerWordArray.length-1);
    answerString += lineToAdd;
    prompt.innerHTML += convertLineToHTML(lineToAdd);
    answerWordArray = answerWordArray.concat(lineToAdd.split(' '));
}

// takes an array of letter and turns them into html elements representing lines
// and words. These will be used as the prompt, which can then be styled accordingly
function convertLineToHTML(letters) {
    let promptString = '';

    promptString = `<span class='line'><span class='word' id='id${idCount}'>`;
    // loop through all letters in prompt
    for(i = 0; i <= letters.length; i++) {
        //console.log(letters[i]);

         // if last word in the list, close out the final word span tag
        if(i == letters.length){
            promptString += '</span> </span>';
            idCount++;
        }else if(letters[i] == ' '){
        // if letter is a space, that means we have a new word
            //console.log('new word');
            idCount++;
            promptString += ' </span>'
            promptString += `<span class='word' id='id${idCount}'>`;
        }else {
            promptString += `<span>`+letters[i]+`</span>`;
        }
    }
    return promptString;
}

function checkAnswer() {
    // console.log('correct answer: ' + correctAnswer);
    // user input
    // let inputVal = input.value;

    let inputVal = fakeInput.innerText;

    return inputVal == correctAnswer;
}

function endGame() {
    // erase prompt
    prompt.classList.toggle('dispose');

    // make resetButton visible
    resetButton.classList.remove('dispose');

    // pause timer
    gameON = false;

    // calculate wpm
    let wpm;
    if(!timeLimitMode) {
        wpm = (((correct+errors)/5)/(minutes+(seconds/60))).toFixed(2);
    } else {
        wpm = (((correct+errors)/5)/(timeLimitModeInput.value/60)).toFixed(2);
    }
    // set accuracyText
    accuracyText.innerHTML='Accuracy: ' + ((100*correct)/(correct+errors)).toFixed(2) + '%';
    wpmText.innerHTML = 'WPM: ' + wpm;
    // make accuracy visible
    testResults.classList.toggle('transparent');

    // set correct and errors counts to 0
    correct = 0;
    errors = 0;

    // change focus to resetButton
    resetButton.focus();


    // update scoreText
    updateScoreText();
    // clear input field
    // document.querySelector('#userInput').value = '';
    input.value = '';
    fakeInput.innerText = '';
    // set letter index (where in the word the user currently is)
    // to the beginning of the word
    letterIndex = 0;
}

// generates a single line to be appended to the answer array
// if a line with a maximum number of words is desired, pass it in as a parameter
function generateLine(maxWords) {
    let str = '';

    if(fullSentenceMode) {
        // let rand = Math.floor(Math.random()*35);
        let rand = 0;
        if(sentenceStartIndex == -1) {
            sentenceStartIndex = getPosition(sentence, '.', rand)+1;
            sentenceEndIndex = sentence.substring(sentenceStartIndex + lineLength+2).indexOf(' ') + 
                                sentenceStartIndex +lineLength+1;
            str = sentence.substring(sentenceStartIndex, sentenceEndIndex+1);
        }else{

            sentenceStartIndex = sentenceEndIndex+1;
            sentenceEndIndex = sentence.substring(sentenceStartIndex + lineLength+2).indexOf(' ') + 
                                sentenceStartIndex +lineLength+1;
            str = sentence.substring(sentenceStartIndex, sentenceEndIndex+1);
            console.log(sentenceStartIndex);
            console.log(sentenceEndIndex);
        }
        str = str.substring(1);
        return str;
    }


    if(wordLists['lvl'+currentLevel].length > 0){
        let startingLetters = levelDictionaries[currentLayout]['lvl'+currentLevel]+punctuation;

        //requiredLetters = startingLetters.split(''); 
    
        // if this counter hits a high enough number, there are likely no words matching the search
        // criteria. If that happens, reset required letters
        let circuitBreaker = 0;

        let wordsCreated = 0;

        for(let i = 0; i < lineLength; i = i) {
            if(wordsCreated >= maxWords){
                break;
            }

            let rand = Math.floor(Math.random()*wordLists['lvl'+currentLevel].length);
            let wordToAdd = wordLists['lvl'+currentLevel][rand];


            //console.log('in circuit ' + circuitBreaker);
            if(circuitBreaker > 12000) {
                if(circuitBreaker > 30000){
                    str+= levelDictionaries[currentLayout]['lvl'+currentLevel] + ' ';
                    i+= wordToAdd.length;
                    wordsCreated++;    
                    circuitBreaker = 0;
                    requiredLetters = startingLetters.split(''); 
                    console.log('taking too long to find proper word');
                }else {
                    requiredLetters = startingLetters.split(''); 
                }
            }

            // if the word does not contain any required letters, throw it out and choose again
            if(!contains(wordToAdd, requiredLetters)) {

                // console.log(wordToAdd + ' doesnt have any required letters from ' + requiredLetters);
            }else if(onlyLower && containsUpperCase(wordToAdd)) {
                // if only lower case is allowed and the word to add contains an uppercase,
                // throw out the word and try again
                
            }else {
                // if last word of the line, don't add a space
                str += wordToAdd + ' ';
                i+= wordToAdd.length;
                wordsCreated++;
            

                // remove any new key letters from our required list
                removeIncludedLetters(requiredLetters, wordToAdd);
                                // if we have used all required letters, reset it
                if(requiredLetters.length == 0 ) {
                    requiredLetters = startingLetters.split(''); 
                }
            }

            circuitBreaker++;
            // if we're having trouble finding a word with a require letter, reset 'required letters'
            if(circuitBreaker > 7000) {
                // console.log('couldnt find word with ' + requiredLetters);
                wordToAdd = randomLetterJumble();
                str += wordToAdd + ' ';
                i+= wordToAdd.length;
                wordsCreated++;
                requiredLetters = startingLetters.split('');
            }
        }
    }else {
        let startingLetters = levelDictionaries[currentLayout]['lvl'+currentLevel]+punctuation;
        // if there are no words with the required letters, all words should be set to the
        // current list of required letters
        let wordsCreated = 0;
        if(levelDictionaries[currentLayout]['lvl'+currentLevel].length == 0){
            str = '';
        }else {
            for(let i = 0; i < lineLength; i = i) {
                wordToAdd = randomLetterJumble();
                str+= wordToAdd+ ' ';
                i+= wordToAdd.length;
                console.log('i: ' + i);
                wordsCreated++;
                if(wordsCreated >= maxWords){
                    break;
                }
            }
        }
    }

    // line should not end in a space. Remove the final space char
    str = str.substring(0, str.length - 1);
    return str;
}

// creates a random jumble of letters to be used when no words are found for a target letter
function randomLetterJumble(){
    let randWordLength = Math.floor(Math.random()*5)+1;
    let jumble = '';
    for(let i = 0; i < randWordLength; i++){
        let rand = Math.floor(Math.random()*levelDictionaries[currentLayout]['lvl'+currentLevel].length);
        jumble+= levelDictionaries[currentLayout]['lvl'+currentLevel][rand];
    }

    return jumble;
}


// takes an array and removes any required letters that are found in 'word'
// for example, if required letters == ['a', 'b', 'c', 'd'] and word=='cat', this
// function will turn requiredLetters into ['b', 'd'] 
function removeIncludedLetters(requiredLetters, word) {
    word.split('').forEach((l)=> {
        if(requiredLetters.includes(l)){
            requiredLetters.splice(requiredLetters.indexOf(l),1);
            // console.log('removal: '+ word+ ' ' + l + ' '+ requiredLetters);
        }
    });
}

// if 'word' contains an uppercase letter, return true. Else return false
function containsUpperCase(word) {
    let upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = false;
    word.split('').forEach((letter)=> {
        if(upperCase.includes(letter)) {
            // console.log('upperCase ' + letter);
            result = true;
        }
    });
    return result;
}

// updates the correct answer and manipulates the dom
// called every time a correct word is typed
function handleCorrectWord() {
    // make sure no 'incorrect' styling still exists
    // input.style.color = 'var(--text-color)';//'black';
    fakeInput.classList.remove('red');

    //remove the first word from the answer string
    answerWordArray.shift();

    if(prompt.children[0].children.length-1 == 0 || wordIndex >= prompt.children[0].children.length-1){
        console.log('new line ' + prompt);
        lineIndex++;
        
        // when we reach the end of a line, generate a new one IF 
        // we are more than  2 lines from from the end. This ensures that
        // no extra words are generated when we near the end of the test

        addLineToPrompt();

        //make the first line of the prompt transparent
        if(!wordScrollingMode){
            prompt.removeChild(prompt.children[0]);
            wordIndex = -1;
        }
    }

    // let cur = document.querySelector('#id' + (score+1));

    if (wordScrollingMode) {
        deleteLatestWord = true;
        // update display
        prompt.classList.add('smoothScroll');
        // set the offset value of the next word
        promptOffset += prompt.children[0].children[0].offsetWidth;
        // move prompt left
        prompt.style.left = '-' + promptOffset+ 'px';        
        // make already typed words transparent
        prompt.children[0].firstChild.style.opacity = 0;
    } else {
        // if in paragraph mode, increase word index
        wordIndex++;
    }


    // save the correct answer to a variable before removing it 
    // from the answer string
    correctAnswer = answerWordArray[0];
}

// updates the numerator and denominator of the scoretext on 
// the document
function updateScoreText() {
    scoreText.innerHTML = ++score + '/' + scoreMax;
}

function resetTimeText() {
    let mins = minutes, secs = seconds;

    if (minutes.toString().length === 1) {
        mins = '0' + minutes;
    }
    if (seconds.toString().length === 1) {
        secs = '0' + seconds;
    }
    
    // timeText.innerHTML = minutes + 'm :' + seconds + ' s';
    timeText.innerText = mins + ':' + secs;
}

// removes currentLevel styles from all buttons. Use every time the 
// level is changed
function clearCurrentLevelStyle() {
    for(button of buttons) {
        button.classList.remove('currentLevel');
    }
}

// set the word list for each level
function createTestSets(){
    let objKeys = Object.keys(wordLists); // the level keys of each of the wordLists
    let includedLetters = punctuation; // the list of letters to be included in each level

    // for each level, add new letters to the test set and create a new list
    for(let i = 0; i < objKeys.length; i++) {
        let requiredLetters;
        
        
        // if 'all words' on a custom layout, don't add letters from the dictionary, because 
        // level 7 contains the whole alphabet, and the user might not have asigned every letter to
        // a key. Instead, this level should be the same as the previous, just with every letter required
        if(currentLayout != 'custom' || i != 6){
            requiredLetters = levelDictionaries[currentLayout]['lvl'+(i+1)]+punctuation;
            includedLetters += letterDictionary[objKeys[i]];
        }else {
            requiredLetters = includedLetters;
        }

        wordLists[objKeys[i]] = [];
        //console.log('level ' +(i+1) + ': ' + wordLists[objKeys[i]]);
        wordLists[objKeys[i]] = generateList(includedLetters, requiredLetters);
        // if(i == 6) console.log('level ' +(i+1) + ': ' + wordLists[objKeys[i]]);
    }
}

// fixes a small bug in mozilla
document.addEventListener('keyup', (e)=> {
    e.preventDefault();
    //console.log('prevented');
});