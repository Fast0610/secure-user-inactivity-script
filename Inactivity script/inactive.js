// inactive.js
// Detects user inactivity → shows warning → forces user out
// Bulletproof timestamp-based approach (works even when tab is hidden)

// ──────────────────────────────────────────────────────────────────────────────
// CONFIG
// ──────────────────────────────────────────────────────────────────────────────
const INACTIVITY_MINUTES = 5;     // Minutes before warning
const COUNTDOWN_SECONDS  = 30;    // Seconds shown in warning countdown


// ──────────────────────────────────────────────────────────────────────────────
// TIME MATH
// ──────────────────────────────────────────────────────────────────────────────

const INACTIVITY_LIMIT = INACTIVITY_MINUTES * 60 * 1000;
const WARNING_LIMIT    = INACTIVITY_LIMIT + (COUNTDOWN_SECONDS * 1000);

// ──────────────────────────────────────────────────────────────────────────────
// STATE
// ──────────────────────────────────────────────────────────────────────────────
let lastActivityTime = Date.now();

let checkIntervalId   = null;
let countdownTimer    = null;
let warningOverlay    = null;
let warningActive     = false;
let logoutTriggered   = false;

// ──────────────────────────────────────────────────────────────────────────────
// ACTIVITY TRACKING
// ──────────────────────────────────────────────────────────────────────────────
function recordActivity() {
    if (warningActive) return;
    lastActivityTime = Date.now();
}

const ACTIVITY_EVENTS = [
    'mousemove',
    'mousedown',
    'keydown',
    'scroll',
    'touchstart'
];

ACTIVITY_EVENTS.forEach(event =>
    document.addEventListener(event, recordActivity, { passive: true })
);

// ──────────────────────────────────────────────────────────────────────────────
// INACTIVITY CHECKER (BULLETPROOF)
// ──────────────────────────────────────────────────────────────────────────────
function startInactivityChecker() {
    checkIntervalId = setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastActivityTime;

        if (!warningActive && elapsed >= INACTIVITY_LIMIT) {
            showWarning();
        }

        if (elapsed >= WARNING_LIMIT) {
            forceUserOut();
        }
    }, 1000);
}

// ──────────────────────────────────────────────────────────────────────────────
// WARNING UI
// ──────────────────────────────────────────────────────────────────────────────
function showWarning() {
    if (warningActive) return;
    
    warningActive = true;
    document.body.classList.add('warning-active');

    warningOverlay = document.createElement('div');
    warningOverlay.className = 'inactivity-overlay';
    warningOverlay.innerHTML = `
        <div class="inactivity-modal">
            <h2 class="inactivity-title">Inactivity Alert</h2>
            <p class="inactivity-text">
                Signing out in <span id="countdown"></span> seconds
            </p>
            <button id="staySignedIn" class="stay-button">
                Stay Signed In
            </button>
        </div>
    `;

    document.body.appendChild(warningOverlay);

    const countdownEl = warningOverlay.querySelector('#countdown');

    function updateCountdown() {
        const remaining =
            Math.ceil((WARNING_LIMIT - (Date.now() - lastActivityTime)) / 1000);

        countdownEl.textContent = Math.max(0, remaining);

        if (remaining <= 0) {
            clearInterval(countdownTimer);
        }
    }

    updateCountdown();
    countdownTimer = setInterval(updateCountdown, 250);

    warningOverlay
        .querySelector('#staySignedIn')
        .addEventListener('click', dismissWarning);
}

function dismissWarning() {
    lastActivityTime = Date.now();
    cleanupWarning();
}

function cleanupWarning() {
    clearInterval(countdownTimer);
    countdownTimer = null;

    if (warningOverlay) {
        warningOverlay.remove();
        warningOverlay = null;
    }

    warningActive = false;
    document.body.classList.remove('warning-active');
}

// ──────────────────────────────────────────────────────────────────────────────
// LOGOUT
// ──────────────────────────────────────────────────────────────────────────────
function forceUserOut() {
    if (logoutTriggered) return;
    logoutTriggered = true;

    // Your signout logic here
    location.reload();
}

// ──────────────────────────────────────────────────────────────────────────────
// VISIBILITY STATE
// ──────────────────────────────────────────────────────────────────────────────
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // alert("Now visible");
    const elapsed = Date.now() - lastActivityTime;

    if (elapsed >= WARNING_LIMIT) {
      location.reload();
    } else if (elapsed >= INACTIVITY_LIMIT) {
      showWarning();
    }
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// INIT
// ──────────────────────────────────────────────────────────────────────────────
document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', startInactivityChecker)
    : startInactivityChecker();

// ──────────────────────────────────────────────────────────────────────────────
// END OF SCRIPT - Thank you!
// ──────────────────────────────────────────────────────────────────────────────
