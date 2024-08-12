/* hide away the real input box from the user and show a fake input instead*/

// Place focus on real input on clicked on text or fake input
document.addEventListener('click', function(e) {
    let textStuff = document.querySelector('.typingArea .prompt');

    if (e.target == textStuff || e.target == fakeInput || textStuff.contains(e.target)) {
        input.focus();
        fakeInput.classList.add('showCaret');
    } else {
        fakeInput.classList.remove('showCaret');
    }
});

// Auto scroll to end
function scrollEnd() {
    fakeInput.scrollLeft = fakeInput.scrollLeftMax;
}

// Make caret static while typing
function caretHits() {
    fakeInput.setAttribute('data-hits', parseInt(fakeInput.getAttribute('data-hits')) + 1);

    // automatically starts flashing if user doesn't keep writing
    setTimeout(function() {
        if (parseInt(fakeInput.getAttribute('data-hits')) > 0) {
            fakeInput.setAttribute('data-hits', parseInt(fakeInput.getAttribute('data-hits')) - 1);
        }
    }, 800);
}

input.addEventListener('keydown', function(e) {
    if (e.key === "Backspace" || !specialKeys.includes(e.key)) {
        caretHits();
        scrollEnd();
    }
});

input.addEventListener('compositionupdate', function() {
    caretHits();
    scrollEnd();
});

