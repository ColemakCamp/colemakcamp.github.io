// Initiate Tippy
tippy('[data-tippy-content]', {
    theme: 'camptip'
});

// Remove Tippy Attributes after Initiation
(function() {
    let tippys = document.querySelectorAll('[data-tippy-content]');

    for (let x = 0; x < tippys.length; x++) {
        tippys[x].removeAttribute('data-tippy-content');
        tippys[x].removeAttribute('data-tippy-placement');
    }
})();