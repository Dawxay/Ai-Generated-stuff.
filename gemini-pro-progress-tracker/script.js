document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.course-container input[type="checkbox"]');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const celebration = document.getElementById('celebration');
    const timeInput = document.getElementById('time-input');
    const addTimeBtn = document.getElementById('add-time-btn');
    const timeEstimate = document.getElementById('time-estimate');

    const totalCheckboxes = checkboxes.length;
    let recordedTimes = [];

    function updateProgress() {
        const checkedCheckboxes = document.querySelectorAll('.course-container input[type="checkbox"]:checked').length;
        const progress = (checkedCheckboxes / totalCheckboxes) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;

        if (progress === 100) {
            celebration.style.display = 'block';
            confetti({
                particleCount: 200,
                spread: 90,
                origin: { y: 0.6 }
            });
        } else {
            celebration.style.display = 'none';
        }
    }

    function handleCheckboxClick(e) {
        const checkbox = e.target;
        const parentLi = checkbox.parentElement;
        const childUl = parentLi.querySelector('ul');

        if (childUl) {
            const childCheckboxes = childUl.querySelectorAll('input[type="checkbox"]');
            childCheckboxes.forEach(childCheckbox => {
                childCheckbox.checked = checkbox.checked;
            });
        }

        const parentUl = parentLi.parentElement;
        if (parentUl && parentUl.classList.contains('main-list') === false) {
            const parentLiOfParent = parentUl.parentElement;
            const parentCheckbox = parentLiOfParent.querySelector('input[type="checkbox"]');
            const siblingCheckboxes = Array.from(parentUl.querySelectorAll('input[type="checkbox"]'));
            const allChecked = siblingCheckboxes.every(cb => cb.checked);

            if (allChecked) {
                parentCheckbox.checked = true;
                confetti({
                    particleCount: 50,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            } else {
                parentCheckbox.checked = false;
            }
        }

        updateProgress();
        updateEstimate();
    }

    function addTime() {
        const time = parseInt(timeInput.value, 10);
        if (!isNaN(time) && time > 0) {
            recordedTimes.push(time);
            timeInput.value = '';
            updateEstimate();
        } else {
            alert('Please enter a valid number of minutes.');
        }
    }

    function updateEstimate() {
        if (recordedTimes.length === 0) {
            timeEstimate.textContent = 'Enter some times to get an estimate.';
            return;
        }

        const averageTime = recordedTimes.reduce((a, b) => a + b, 0) / recordedTimes.length;
        const remainingCheckboxes = totalCheckboxes - document.querySelectorAll('.course-container input[type="checkbox"]:checked').length;
        const estimatedTime = Math.round(averageTime * remainingCheckboxes);

        let sentiment = "You're making great progress!";
        if (averageTime > 60) {
            sentiment = "This is a challenging course, but you're getting through it!";
        } else if (averageTime < 20) {
            sentiment = "You're flying through this course!";
        }

        if (remainingCheckboxes > 0) {
            const hours = Math.floor(estimatedTime / 60);
            const minutes = estimatedTime % 60;
            timeEstimate.textContent = `${sentiment} Estimated time to finish: ${hours} hours and ${minutes} minutes.`;
        } else {
            timeEstimate.textContent = 'Congratulations on completing the course!';
        }
    }

    checkboxes.forEach(checkbox => checkbox.addEventListener('change', handleCheckboxClick));
    addTimeBtn.addEventListener('click', addTime);

    updateProgress();
    updateEstimate();
});