// When on the final word, no Space or Enter required to end the game
function processLastWord() {
    if (!timeLimitMode && score == (scoreMax - 1) && checkAnswer() && gameON) {
        console.log('game over');
        endGame();
    }
}

// Process Backspace, and update letterIndex accordingly
// Consider if CTRL is clicked or not
function processBackspace(ev) {
    ev.preventDefault();

    if (ev.ctrlKey) {
        if (checkAnswerToIndex()) {
            processCorrectSoFar("Backspace",true);
        } else {
            processErrorFound("Backspace",true);
        }
    } else {
        input.value = input.value.slice(0,-1);
        fakeInput.innerText = fakeInput.innerText.slice(0,-1);
        letterIndex--;

        if (checkAnswerToIndex()) {
            processCorrectSoFar("Backspace",false);
        } else {
            processErrorFound("Backspace",false);
        }
    }

    if (letterIndex < 0) {
        letterIndex = 0;
    }
}

// Erase characters, and color previously written characters in grey on the prompt
function processEraseLetter(what) {
    if (what) {
        for (let i = 0; i < letterIndex; i++) {
            if (prompt.children[0].children[wordIndex].children[i]) {
                prompt.children[0].children[wordIndex].children[i].style.color = 'var(--grey)';
            }
        }
        input.value = '';
        fakeInput.innerText = '';
        letterIndex = 0;
    } else {
        if (prompt.children[0].children[wordIndex].children[letterIndex]) {
            prompt.children[0].children[wordIndex].children[letterIndex].style.color = 'var(--grey)';
        }
    }
}

// Process assuming that the written characters are correct
function processCorrectSoFar(key,ctrl) {
    fakeInput.classList.remove('red');
    // no points awarded for backspace
    if (key === "Backspace") {
        playClickSound();
        processEraseLetter(ctrl);
    }
    
    if (!key) {
        playClickSound();
        correct++;
        // if letter (in the prompt) exists, color it green
        if (prompt.children[0].children[wordIndex].children[letterIndex-1]) {
            prompt.children[0].children[wordIndex].children[letterIndex-1].style.color = 'var(--green)';
        }
    }
}

// Process assuming that the written characters are incorrect
function processErrorFound(key,ctrl) {
    console.log('error');

    fakeInput.classList.add('red');
    // no points awarded for backspace
    if (key === "Backspace") {
        playClickSound();
        processEraseLetter(ctrl);
    }
    
    if (!key) {
        playErrorSound();
        errors++;
        if (prompt.children[0].children[wordIndex].children[letterIndex-1]) {
            prompt.children[0].children[wordIndex].children[letterIndex-1].style.color = 'var(--red)';
        }
    }

    if (!requireBackspaceCorrection && !checkAnswerToIndex()) {
        //ignore input if the wrong char was typed (negate need to backspace errors - akin to KeyBr.com's behaviour)
        letterIndex--;
        input.value = input.value.slice(0,-1);
        fakeInput.innerText = fakeInput.innerText.slice(0,-1);

        // letter index cannot be < 0
        if (letterIndex < 0) {
            letterIndex = 0;
        }
    }
}

// Update the letterIndex value
function processIndex(ev) {
    if (ev) {
        letterIndex++;
    } else if ((letterIndex !== input.value.length)) {
        letterIndex = input.value.length;
    }
}

// Process Enter key (also a trailing Space in input)
function processEnter(ev) {
    if (checkAnswer() && gameON) {
        if (ev) {
            ev.preventDefault();
        } else {
            input.value = input.value.slice(0,-1);
        }

        handleCorrectWord();

        updateScoreText();

        if (score >= scoreMax) {
            endGame();
        }

        input.value = '';
        fakeInput.innerText = '';

        letterIndex = 0;
    } else {
        console.log('error space');
        input.value += ' ';
        fakeInput.innerText += ' '; // used a non-breaking space due to flexbox
        letterIndex++;
    }
}

// Delete last line from prompt and set the offset back to 0
function processNewLine() {
    prompt.classList.remove('smoothScroll');
    prompt.firstChild.removeChild(prompt.firstChild.firstChild);
    if (prompt.firstChild.children.length == 0) {
        prompt.removeChild(prompt.firstChild);
    }
    promptOffset = 0;
    prompt.style.left = '-' + promptOffset+ 'px';
    deleteLatestWord = false;
}

// Main keydown event with references to other functions
input.addEventListener('keydown', function(e) {
    // Detect Enter and Backspace
    if (e.key === "Enter") {
        processEnter(e);
    }
    if (e.key === "Backspace") {
        window.backspaceKey = true;
        processBackspace(e);
    } else {
        window.backspaceKey = false;
    }

    // Detect Tab, Escape, and F5
    if (e.key === "Tab" || e.key === "Escape") {
        e.preventDefault();
        reset();
    }
    if (e.key === "F5") {
        window.location.reload(true);
    }

    // Detect Characters
    if (!specialKeys.includes(e.key)) {
        processIndex(e);
    }

    // Removes first line on the first letter of the first word of a new line
    if (deleteLatestWord) {
        processNewLine();
    }

    // Detect Unidentified
    if (e.key === "Unidentified") {
        window.unidentifiedKey = true;
    } else {
        window.unidentifiedKey = false;
    // Regular keydown effect + keymapping
        let char = e.code;
        if (localStorage.getItem('keyRemapping') === 'true' && char in keyboardMap && gameON) {
            if (!e.shiftKey) {
                processMapping(false, char);
            } else {
                processMapping(true, char);
            }
        } else {
            if (!specialKeys.includes(e.key) && e.key != 'Process') {
                if (e.key != 'Process') {
                    fakeInput.innerText += e.key;
                } else {
                    letterIndex--;
                }
            }
        }
    }

    // Update prompt in green, grey, or red color based on accuracy
    if (checkAnswerToIndex()) {
        processCorrectSoFar();
    } else {
        processErrorFound();
    }
});

// Input event for stuff that keydown event does not handle well
input.addEventListener('input', function() {
    // Detect if the last character is a Space or not
    if (input.value.match(/\s$/)) {
        processEnter();
    } else {
        processIndex();
    }

    // If an unidentified key was pressed and backspace was not pressed
    // This goes on to handle Mobile/Tablet inputs
    if (window.unidentifiedKey === true && window.backspaceKey === false) {
        processUnidentified(input.value.slice(-1));
    }
});

// Observe Fake Input
let fakeObserver = new MutationObserver(function() {
    processLastWord();
});
fakeObserver.observe(fakeInput, {childList: true});

// Mapping input based on layout
function processMapping(shift, char) {
    if (shift) {
        if (keyboardMap.shiftLayer == 'default') {
            fakeInput.innerText += keyboardMap[char].toUpperCase();
        } else {
            fakeInput.innerText += keyboardMap.shiftLayer[char];
        }
    } else {
        fakeInput.innerText += keyboardMap[char];
    }
}

// Handle mobile inputs
function processUnidentified(key) {
    // Keylist to compare mobile input to keydown events
    let keysList = {
        "q": ["KeyQ", false],
        "w": ["KeyW", false],
        "e": ["KeyE", false],
        "r": ["KeyR", false],
        "t": ["KeyT", false],
        "y": ["KeyY", false],
        "u": ["KeyU", false],
        "i": ["KeyI", false],
        "o": ["KeyO", false],
        "p": ["KeyP", false],
        "a": ["KeyA", false],
        "s": ["KeyS", false],
        "d": ["KeyD", false],
        "f": ["KeyF", false],
        "g": ["KeyG", false],
        "h": ["KeyH", false],
        "j": ["KeyJ", false],
        "k": ["KeyK", false],
        "l": ["KeyL", false],
        "z": ["KeyZ", false],
        "x": ["KeyX", false],
        "c": ["KeyC", false],
        "v": ["KeyV", false],
        "b": ["KeyB", false],
        "n": ["KeyN", false],
        "m": ["KeyM", false],
        ";": ["Semicolon", false],

        "Q": ["KeyQ", true],
        "W": ["KeyW", true],
        "E": ["KeyE", true],
        "R": ["KeyR", true],
        "T": ["KeyT", true],
        "Y": ["KeyY", true],
        "U": ["KeyU", true],
        "I": ["KeyI", true],
        "O": ["KeyO", true],
        "P": ["KeyP", true],
        "A": ["KeyA", true],
        "S": ["KeyS", true],
        "D": ["KeyD", true],
        "F": ["KeyF", true],
        "G": ["KeyG", true],
        "H": ["KeyH", true],
        "J": ["KeyJ", true],
        "K": ["KeyK", true],
        "L": ["KeyL", true],
        "Z": ["KeyZ", true],
        "X": ["KeyX", true],
        "C": ["KeyC", true],
        "V": ["KeyV", true],
        "B": ["KeyB", true],
        "N": ["KeyN", true],
        "M": ["KeyM", true],
        ":": ["Semicolon", true]
    };

    // Confirm that the character exists in the list
    if (!key in keysList) {return;}

    let char = keysList[key][0],
        shift = keysList[key][1];

    // Process mapping if required, otherwise simply use the same character
    if (localStorage.getItem('keyRemapping') === 'true' && char in keyboardMap && gameON) {
        processMapping(shift, char);
    } else {
        fakeInput.innerText += key;
    }

    // Update prompt in green, grey, or red color based on accuracy
    if (checkAnswerToIndex()) {
        processCorrectSoFar();
    } else {
        processErrorFound();
    }
}