document.addEventListener('DOMContentLoaded', (event) => {
    const currentTimeDisplay = document.getElementById('currentTime');
    const timerCountdown = document.getElementById('timerCountdown');
    const timeZoneTimeDisplay = document.getElementById('timeZoneTime');
    const timetableForm = document.getElementById('timetableForm');
    const timetableList = document.getElementById('timetableList');
    const timezoneSelect = document.getElementById('timezoneSelect');
    const timerInput = document.getElementById('timerInput');
    const setTimerBtn = document.getElementById('setTimerBtn');
    const hourToggle = document.getElementById('24hourToggle');

    let is24Hour = false;
    let timer;
    let timetable = [];

    const showCurrentTime = () => {
        const now = new Date();
        currentTimeDisplay.textContent = formatTime(now, is24Hour);
    };

    const formatTime = (date, is24Hour) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let ampm = '';

        if (!is24Hour) {
            ampm = hours >= 12 ? ' PM' : ' AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
        }

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        return `${hours}:${minutes}:${seconds}${ampm}`;
    };

    const startTimer = (time) => {
        clearInterval(timer);
        const endTime = new Date();
        const [hours, minutes] = time.split(':');
        endTime.setHours(hours);
        endTime.setMinutes(minutes);
        endTime.setSeconds(0);

        const countdown = () => {
            const now = new Date();
            const remainingTime = endTime - now;

            if (remainingTime <= 0) {
                clearInterval(timer);
                alert('Timer finished!');
                return;
            }

            const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) /
            (1000));

            timerCountdown.textContent = `Time Remaining: ${hours}h ${minutes}m ${seconds}s`;
        };

        countdown();
        timer = setInterval(countdown, 1000);
    };

    const showTimeZoneTime = (timeZone) => {
        const now = new Date().toLocaleString("en-US", { timeZone });
        const time = new Date(now);
        timeZoneTimeDisplay.textContent = `Current time in ${timeZone}: ${formatTime(time, is24Hour)}`;
    };

    const addTaskToTimetable = (taskName, taskTime) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.textContent = `${taskName} at ${taskTime}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => {
            clearInterval(task.interval);
            timetable = timetable.filter(t => t !== task);
            listItem.remove();
        };

        listItem.appendChild(deleteBtn);
        timetableList.appendChild(listItem);

        const task = {
            name: taskName,
            time: taskTime,
            interval: setInterval(() => {
                const now = new Date();
                const [taskHours, taskMinutes] = taskTime.split(':');
                const taskEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), taskHours, taskMinutes, 0);
                const timeBeforeEnd = taskEnd - now - 30000; // 30 seconds before task end

                if (timeBeforeEnd <= 0) {
                    alert(`Task "${taskName}" is about to end!`);
                    clearInterval(task.interval);
                }
            }, 1000)
        };

        timetable.push(task);
    };

    // Event Listeners
    setTimerBtn.addEventListener('click', () => {
        const time = timerInput.value;
        if (time) {
            startTimer(time);
        } else {
            alert('Please set a valid time.');
        }
    });

    hourToggle.addEventListener('change', (event) => {
        is24Hour = event.target.checked;
        showCurrentTime();
        const timeZone = timezoneSelect.value;
        showTimeZoneTime(timeZone);
    });

    timezoneSelect.addEventListener('change', (event) => {
        const timeZone = event.target.value;
        showTimeZoneTime(timeZone);
    });

    timetableForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const taskName = document.getElementById('taskName').value;
        const taskTime = document.getElementById('taskTime').value;
        if (taskName && taskTime) {
            addTaskToTimetable(taskName, taskTime);
        } else {
            alert('Please fill out both fields.');
        }
        timetableForm.reset();
    });

    // Initialize
    setInterval(showCurrentTime, 1000);
    showTimeZoneTime(timezoneSelect.value);
});
