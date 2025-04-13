document.querySelectorAll('.danger-button').forEach(button => {
    let timerId = null;
    let activated = false;

    const actionCode = button.getAttribute('data-action');

    const startTimer = (event) => {
        activated = false;
        timerId = setTimeout(() => {
            activated = true;
            new Function(actionCode)();
        }, 2000);
    };

    const cancelTimer = () => {
        clearTimeout(timerId);
    };

    button.addEventListener('mousedown', startTimer);
    button.addEventListener('mouseup', cancelTimer);
    button.addEventListener('mouseleave', cancelTimer);

    button.addEventListener('touchstart', startTimer);
    button.addEventListener('touchend', cancelTimer);

    button.addEventListener('click', (e) => {
        if (!activated) e.preventDefault();
    });
});
