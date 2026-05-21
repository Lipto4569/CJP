// ==========================================
// 1. DYNAMIC CSS INJECTION
// ==========================================
const style = document.createElement('style');
style.textContent = `
    .timer-section-wrapper {
        background-color: #000000;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 50px 0; /* Space below the contact form */
        width: 100%;
        scroll-margin-top: 20px; /* Prevents the timer from snapping tightly to the top of the screen */
    }

    .timer-container {
        display: flex;
        align-items: center;
        gap: 10px;
        user-select: none;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .time-group {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .cards-wrapper {
        display: flex;
        gap: 4px;
    }

    /* Individual red cards for each single digit */
    .digit-card {
        background-color: #ff0000;
        color: #ffffff;
        font-size: 3rem;
        font-weight: bold;
        padding: 10px 15px;
        border-radius: 8px;
        min-width: 35px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(255, 0, 0, 0.4);
    }

    /* Labels below the cards */
    .timer-label {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-top: 8px;
        color: #aaaaaa;
    }

    /* Colon separator styling */
    .timer-separator {
        font-size: 3rem;
        font-weight: bold;
        color: #ff0000;
        margin-bottom: 25px; 
        padding: 0 5px;
    }
`;
document.head.appendChild(style);

// ==========================================
// 2. DYNAMIC HTML GENERATION & PLACEMENT
// ==========================================
const contactDiv = document.querySelector('.contact');

if (contactDiv) {
    const timerSection = document.createElement('div');
    timerSection.className = 'timer-section-wrapper';
    timerSection.id = 'countdown-timer-section'; // Added ID so we can target it with the button

    const timerContainer = document.createElement('div');
    timerContainer.className = 'timer-container';

    function createTimeGroup(id, labelText) {
        const group = document.createElement('div');
        group.className = 'time-group';

        const wrapper = document.createElement('div');
        wrapper.className = 'cards-wrapper';
        wrapper.id = id;

        const label = document.createElement('div');
        label.className = 'timer-label';
        label.textContent = labelText;

        group.appendChild(wrapper);
        group.appendChild(label);
        return group;
    }

    function createSeparator() {
        const sep = document.createElement('div');
        sep.className = 'timer-separator';
        sep.textContent = ':';
        return sep;
    }

    const daysGroup = createTimeGroup('days-group', 'Days');
    const hoursGroup = createTimeGroup('hours-group', 'Hours');
    const minsGroup = createTimeGroup('mins-group', 'Minutes');
    const secsGroup = createTimeGroup('secs-group', 'Seconds');

    timerContainer.appendChild(daysGroup);
    timerContainer.appendChild(createSeparator());
    timerContainer.appendChild(hoursGroup);
    timerContainer.appendChild(createSeparator());
    timerContainer.appendChild(minsGroup);
    timerContainer.appendChild(createSeparator());
    timerContainer.appendChild(secsGroup);

    timerSection.appendChild(timerContainer);
    contactDiv.insertAdjacentElement('afterend', timerSection);
}

// ==========================================
// 3. SMOOTH SCROLL LOGIC FOR BUTTONS
// ==========================================
// Target your "Next Meet Up" button
const meetupButton = document.querySelector('.meet_up');

if (meetupButton) {
    meetupButton.addEventListener('click', () => {
        const timerTarget = document.getElementById('countdown-timer-section');
        if (timerTarget) {
            timerTarget.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ==========================================
// 4. COUNTDOWN CORE LOGIC (Target: May 21, 2027)
// ==========================================
const targetDate = new Date("May 21, 2027 00:00:00").getTime();

function updateGroupCards(elementId, value, padLength = 2) {
    const container = document.getElementById(elementId);
    if (!container) return;
    
    const stringValue = String(value).padStart(padLength, '0');
    
    let cardsHTML = '';
    for (let char of stringValue) {
        cardsHTML += `<div class="digit-card">${char}</div>`;
    }
    container.innerHTML = cardsHTML;
}

function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
        clearInterval(intervalId);
        updateGroupCards('days-group', 0, 3);
        updateGroupCards('hours-group', 0);
        updateGroupCards('mins-group', 0);
        updateGroupCards('secs-group', 0);
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    updateGroupCards('days-group', days, 3); 
    updateGroupCards('hours-group', hours);
    updateGroupCards('mins-group', minutes);
    updateGroupCards('secs-group', seconds);
}

updateCountdown();
const intervalId = setInterval(updateCountdown, 1000);