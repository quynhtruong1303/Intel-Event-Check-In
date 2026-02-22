const GOAL = 50;

let totalCount = 0;
let attendees = []; // { name, team }
const teamCounts = { water: 0, zero: 0, power: 0 };

const teamNames = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};
const teamEmojis = { water: "🌊", zero: "🌿", power: "⚡" };
const teamAlertClass = {
  water: "alert-info",
  zero: "alert-success",
  power: "alert-warning",
};
const avatarColors = { water: "#0284c7", zero: "#16a34a", power: "#ea580c" };

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
const attendeeSection = document.getElementById("attendeeSection");
const attendeeList = document.getElementById("attendeeList");
const winningTeamMsg = document.getElementById("winningTeamMsg");

// Bootstrap component instances
const toastEl = document.getElementById("checkInToast");
const toastMessageEl = document.getElementById("toastMessage");
const goalModal = new bootstrap.Modal(document.getElementById("goalModal"));

// ── Local Storage ────────────────────────────────────────────────────────────

function saveToStorage() {
  localStorage.setItem("checkin_total", totalCount);
  localStorage.setItem("checkin_teams", JSON.stringify(teamCounts));
  localStorage.setItem("checkin_attendees", JSON.stringify(attendees));
}

function loadFromStorage() {
  const savedTotal = localStorage.getItem("checkin_total");
  if (!savedTotal) return;

  totalCount = parseInt(savedTotal);

  const savedTeams = JSON.parse(localStorage.getItem("checkin_teams") || "{}");
  Object.assign(teamCounts, savedTeams);

  attendees = JSON.parse(localStorage.getItem("checkin_attendees") || "[]");

  // Restore UI
  attendeeCount.textContent = totalCount;
  Object.keys(teamCounts).forEach((team) => {
    teamCountEls[team].textContent = teamCounts[team];
  });
  updateProgress();
  renderAttendeeList();
}

// ── Progress Bar ─────────────────────────────────────────────────────────────

function updateProgress() {
  const percent = Math.min((totalCount / GOAL) * 100, 100);
  progressBar.style.width = percent + "%";
  progressContainer.setAttribute("aria-valuenow", percent);

  if (totalCount >= GOAL) {
    progressBar.classList.remove("progress-bar-animated");
    progressBar.style.backgroundImage =
      "linear-gradient(90deg, #16a34a, #22c55e)";
  }
}

// ── Toast ────────────────────────────────────────────────────────────────────

function showToast(message, type = "success") {
  const colours = {
    success: { bg: "#0071c5", text: "#ffffff" },
    warning: { bg: "#f59e0b", text: "#ffffff" },
  };
  const { bg, text } = colours[type];
  toastEl.style.backgroundColor = bg;
  toastEl.style.color = text;
  toastMessageEl.innerHTML = message;
  bootstrap.Toast.getOrCreateInstance(toastEl).show();
}

// ── Attendee List ────────────────────────────────────────────────────────────

function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function renderAttendeeList() {
  if (attendees.length === 0) {
    attendeeSection.style.display = "none";
    return;
  }

  attendeeSection.style.display = "block";

  // Newest first
  attendeeList.innerHTML = [...attendees]
    .reverse()
    .map(
      ({ name, team }) => `
      <li class="attendee-item">
        <div class="attendee-avatar" style="background-color:${avatarColors[team]}">${getInitials(name)}</div>
        <span class="attendee-name">${name}</span>
        <span class="attendee-badge badge-${team}">${teamEmojis[team]} ${teamNames[team]}</span>
      </li>`
    )
    .join("");
}

// ── Winning Team ─────────────────────────────────────────────────────────────

function showCelebration() {
  const maxCount = Math.max(...Object.values(teamCounts));
  const leaders = Object.keys(teamCounts).filter(
    (t) => teamCounts[t] === maxCount
  );

  if (leaders.length === 1) {
    const winner = leaders[0];
    winningTeamMsg.innerHTML = `${teamEmojis[winner]} <strong>${teamNames[winner]}</strong> led the charge with <strong>${teamCounts[winner]}</strong> attendees!`;
  } else {
    const names = leaders
      .map((t) => `${teamEmojis[t]} <strong>${teamNames[t]}</strong>`)
      .join(" and ");
    winningTeamMsg.innerHTML = `It's a tie! ${names} are neck and neck with <strong>${maxCount}</strong> attendees each!`;
  }

  goalModal.show();
}

// ── Form Submit ──────────────────────────────────────────────────────────────

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;

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

  // Update counts
  totalCount++;
  teamCounts[team]++;
  attendees.push({ name, team });

  // Update UI
  attendeeCount.textContent = totalCount;
  teamCountEls[team].textContent = teamCounts[team];
  updateProgress();

  // Greeting
  greeting.innerHTML = `<i class="fas fa-circle-check fs-5 me-2"></i>Welcome, <strong>${name}</strong>! You are checked in to <strong>${teamNames[team]}</strong>.`;
  greeting.className = `alert ${teamAlertClass[team]} d-flex align-items-center gap-1 fw-semibold`;
  greeting.style.display = "flex";

  // Attendee list
  renderAttendeeList();

  // Persist
  saveToStorage();

  // Toast
  showToast(
    `<i class="fas fa-check-circle me-2"></i><strong>${name}</strong> checked in to <strong>${teamNames[team]}</strong>!`
  );

  // Goal celebration
  if (totalCount === GOAL) {
    showCelebration();
  }

  form.reset();
  nameInput.focus();
});

// ── Reset ────────────────────────────────────────────────────────────────────

function resetAll() {
  totalCount = 0;
  attendees = [];
  Object.keys(teamCounts).forEach((t) => (teamCounts[t] = 0));
  localStorage.clear();

  attendeeCount.textContent = 0;
  Object.keys(teamCountEls).forEach((t) => (teamCountEls[t].textContent = 0));

  progressBar.style.width = "0%";
  progressBar.classList.add("progress-bar-animated");
  progressBar.style.backgroundImage = "";
  progressContainer.setAttribute("aria-valuenow", 0);

  greeting.style.display = "none";
  attendeeSection.style.display = "none";
  attendeeList.innerHTML = "";
}

document.getElementById("resetBtn").addEventListener("click", resetAll);

// ── Init ─────────────────────────────────────────────────────────────────────

document.getElementById("goalLabel").textContent = GOAL;
loadFromStorage();
