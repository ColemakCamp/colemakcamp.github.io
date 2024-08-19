// Keydown event fires before any character is placed in the input field
input.addEventListener('keydown', function(e) {
    // Assume for every key store that it is not unknown
    window.unknownKey = false;
    // Mark keydown as unknown on mobile phone browsers
    if (e.key === "Unidentified" || e.key === "Process") {
        window.unknownKey = true;
    } else {
        // Detect Enter or Space
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            processEnter(); // Process Enter
        }

        // Detect Tab, Escape, and F5
        if (e.key === "Tab" || e.key === "Escape") {
            e.preventDefault();
            reset();
        }
        if (e.key === "F5") {
            window.location.reload(true);
        }

        // Detect Backspace
        if (e.key === "Backspace") {
            e.preventDefault();
            if (e.ctrlKey) {
                processBackspace(true);
            } else {
                processBackspace(false);
            }
        }

        // Regular keydown effect + keymapping
        let char = e.code;
        if (localStorage.getItem('keyRemapping') === 'true' && char in keyboardMap) {
            if (!e.shiftKey) {
                fakeInput.innerText += processMapping(false, char);
            } else {
                fakeInput.innerText += processMapping(true, char);
            }
        } else {
            if (!specialKeys.includes(e.key)) {
                fakeInput.innerText += e.key;
            }
        }
    }
});

// Input event fires when a character is placed in or removed from the input field
input.addEventListener('input', function() {
    if (!window.unknownKey) {return;}

    // Detect Space
    if (input.value.slice(-1) === " ") {
        input.value = input.value.slice(0,-1);
        // Process Enter
        processEnter();
    } else {
        // Non-space characters need separate handling
        processUnknown(input.value);
    }
});

// Legacy code to prevent browser hickups in firefox
input.addEventListener('keyup', function(e) {
    e.preventDefault();
});

// Observes the cosmetic input field instead of the actual input field
let fakeObserver = new MutationObserver(function() {
    // Update letterIndex value
    processIndex();

    // Last word doesn't need a space
    processLastWord();

    // Removes first line on the first letter of the first word of a new line
    if (deleteLatestWord) {
        processNewLine();
    }

    // Update prompt in green, grey, or red color based on accuracy
    if (checkAnswerToIndex()) {
        processCorrectSoFar();
    } else {
        processErrorFound();
    }

    // Add grey to written letters
    colorMeGrey();

    // Clear remnant colors when fakeInput is empty
    clearColors();

});
fakeObserver.observe(fakeInput, {childList: true});


/* --- ---  ---  ---   ---   ---    ---    ---   ---   ---  ---  --- --- --- */


// Process Backspace on Desktop
function processBackspace(control) {
    if (control) {
        input.value = '';
        fakeInput.innerText = '';
    } else {
        input.value = input.value.slice(0,-1);
        fakeInput.innerText = fakeInput.innerText.slice(0,-1);
    }
}

// Handle mobile inputs
function processUnknown(key) {
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

    // Empty container for the cosmetic text
    let print = '';

    // Go through every character in the input field
    // Output the expected character in the container
    for (let x = 0; x < key.length; x++) {
        // Confirm that the character exists in the list
        if (key[x] in keysList) {
            let char = keysList[key[x]][0],
                shift = keysList[key[x]][1];

            // Process mapping if required, otherwise simply use the same character
            if (localStorage.getItem('keyRemapping') === 'true' && char in keyboardMap) {
                print += processMapping(shift, char);
            } else {
                print += key[x];
            }
        }
    }

    // Place the container value in the cosmetic input field
    fakeInput.innerText = print;
}

// Mapping input based on layout
function processMapping(shift, char) {
    if (shift) {
        if (keyboardMap.shiftLayer == 'default') {
            // fakeInput.innerText += keyboardMap[char].toUpperCase();
            return keyboardMap[char].toUpperCase();
        } else {
            // fakeInput.innerText += keyboardMap.shiftLayer[char];
            return keyboardMap.shiftLayer[char];
        }
    } else {
        // fakeInput.innerText += keyboardMap[char];
        return keyboardMap[char];
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
    // prompt.style.left = '-' + promptOffset + 'px';
    prompt.style.left = '';
    deleteLatestWord = false;
}

// When on the final word, no Space or Enter required to end the game
function processLastWord() {
    if (!timeLimitMode && score == (scoreMax - 1) && checkAnswer() && gameON) {
        console.log('game over');
        endGame();
    }
}

// Process Enter key (also a trailing Space in input)
function processEnter() {
    if (checkAnswer() && gameON) {
        // Handles correct word
        handleCorrectWord();

        // Updates scores on the screen
        updateScoreText();

        // Ends game if score has reached max score
        if (score >= scoreMax) {
            endGame();
        }

        // Wipes both input fields
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

// Update letter index value
function processIndex() {
    letterIndex = fakeInput.innerText.length;
}

// Used up characters turn grey
function colorMeGrey() {
    if (letterIndex === 0) {return;}

    let wordLetters = prompt.querySelector('.line:not(.done)').children[wordIndex].children;

    for (let x = 0; x < letterIndex; x++) {
        try {
            wordLetters[x].classList.add('grey');
        } catch {}
    }
}

// Process assuming that the written characters are correct
function processCorrectSoFar() {
    fakeInput.classList.remove('red');
    playClickSound();
    correct++;
    // if letter (in the prompt) exists, color it green
    try {
        prompt.querySelector('.line:not(.done)').children[wordIndex].children[letterIndex - 1].classList.add('grey');
        prompt.querySelector('.line:not(.done)').children[wordIndex].children[letterIndex - 1].classList.remove('red');
        prompt.querySelector('.line:not(.done)').children[wordIndex].children[letterIndex - 1].style.color = 'var(--green)';
        prompt.querySelector('.line:not(.done)').children[wordIndex].children[letterIndex].style.color = '';
    } catch {}
}

// Process assuming that the written characters are incorrect
function processErrorFound() {
    fakeInput.classList.add('red');
    playErrorSound();
    errors++;
    try {
        prompt.querySelector('.line:not(.done)').children[wordIndex].children[letterIndex - 1].classList.add('grey');
        prompt.querySelector('.line:not(.done)').children[wordIndex].children[letterIndex - 1].style.color = 'var(--red)';
    } catch {}

    if (!requireBackspaceCorrection && !checkAnswerToIndex()) {
        // ignore input if the wrong char was typed
        // (negate need to backspace errors - akin to KeyBr.com's behaviour)
        letterIndex--;
        input.value = input.value.slice(0,-1);
        fakeInput.innerText = fakeInput.innerText.slice(0,-1);

        prompt.querySelector('.line:not(.done)').children[wordIndex].children[letterIndex].classList.add('red');

        // letter index cannot be < 0
        if (letterIndex < 0) {
            letterIndex = 0;
        }
    } else {
        try {
            prompt.querySelector('.line:not(.done)').children[wordIndex].children[letterIndex].style.color = '';
        } catch {}
    }
}

// Remove lingering color when fakeInput is empty
function clearColors() {
    if (letterIndex !== 0) {return;}

    let linger = prompt.querySelector('.line:not(.done)').children[wordIndex].querySelectorAll('span[style]');

    for (let x = 0; x < linger.length; x++) {
        linger[x].style.color = '';
    }
}
