const GOAL = 50;

let totalCount = 0;
const teamCounts = { water: 0, zero: 0, power: 0 };
const teamNames = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

const teamAlertClass = {
  water: "alert-info",
  zero: "alert-success",
  power: "alert-warning",
};

// DOM references
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const progressContainer = progressBar.parentElement;
const teamCountEls = {
  water: document.getElementById("waterCount"),
  zero: document.getElementById("zeroCount"),
  power: document.getElementById("powerCount"),
};

// Bootstrap component instances
const toastEl = document.getElementById("checkInToast");
const toastMessageEl = document.getElementById("toastMessage");
const goalModal = new bootstrap.Modal(document.getElementById("goalModal"));

// Show a Bootstrap toast with dynamic message and colour
function showToast(message, type = "success") {
  const colours = {
    success: { bg: "#0071c5", text: "#ffffff" },
    warning: { bg: "#f59e0b", text: "#ffffff" },
  };
  const { bg, text } = colours[type];
  toastEl.style.backgroundColor = bg;
  toastEl.style.color = text;
  toastMessageEl.innerHTML = message;

  // Re-use existing instance or create a new one each time
  bootstrap.Toast.getOrCreateInstance(toastEl).show();
}

// Update the progress bar width and ARIA value
function updateProgress() {
  const percent = Math.min((totalCount / GOAL) * 100, 100);
  progressBar.style.width = percent + "%";
  progressContainer.setAttribute("aria-valuenow", percent);

  // Stop the stripe animation and turn bar green when goal is hit
  if (totalCount >= GOAL) {
    progressBar.classList.remove("progress-bar-animated");
    progressBar.style.backgroundImage = "linear-gradient(90deg, #16a34a, #22c55e)";
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;

  // Validation — show warning toast if fields are missing
  if (!name && !team) {
    showToast(
      '<i class="fas fa-exclamation-circle me-2"></i>Please enter a name and select a team.',
      "warning"
    );
    nameInput.focus();
    return;
  }
  if (!name) {
    showToast(
      '<i class="fas fa-exclamation-circle me-2"></i>Please enter the attendee\'s name.',
      "warning"
    );
    nameInput.focus();
    return;
  }
  if (!team) {
    showToast(
      '<i class="fas fa-exclamation-circle me-2"></i>Please select a team.',
      "warning"
    );
    teamSelect.focus();
    return;
  }

  // Update total count
  totalCount++;
  attendeeCount.textContent = totalCount;

  // Update team count
  teamCounts[team]++;
  teamCountEls[team].textContent = teamCounts[team];

  // Update progress bar
  updateProgress();

  // Show personalized greeting in the page
  greeting.innerHTML = `<i class="fas fa-circle-check fs-5 me-2"></i>Welcome, <strong>${name}</strong>! You are checked in to <strong>${teamNames[team]}</strong>.`;
  greeting.className = `alert ${teamAlertClass[team]} d-flex align-items-center gap-1 fw-semibold`;
  greeting.style.display = "flex";

  // Show success toast
  showToast(
    `<i class="fas fa-check-circle me-2"></i><strong>${name}</strong> checked in to <strong>${teamNames[team]}</strong>!`
  );

  // Celebrate when goal is reached
  if (totalCount === GOAL) {
    goalModal.show();
  }

  // Reset form and return focus to name field
  form.reset();
  nameInput.focus();
});
