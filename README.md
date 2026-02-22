# Intel Sustainability Summit: Event Check-in App

A browser-based check-in system for the Intel Team Sustainability Summit. Attendees check in by entering their name and selecting a team, and the app tracks attendance in real time.

## Features

- **Personalized greeting** — displays a welcome message with the attendee's name and team on each check-in, colour-coded to match their team
- **Attendance counter** — tracks and displays the total number of check-ins toward a goal of 50
- **Progress bar** — animated striped bar fills as attendees check in; turns green and stops animating when the goal is reached
- **Team attendance tracker** — live count for each of the three teams: 🌊 Team Water Wise, 🌿 Team Net Zero, ⚡ Team Renewables
- **Attendee list** — shows all checked-in attendees with avatar initials, name, and a colour-coded team badge (newest first)
- **Goal celebration modal** — pops up when the attendance goal is hit, naming the winning team or calling out a tie
- **LocalStorage persistence** — counts and the attendee list survive page refreshes and browser restarts
- **Reset button** — clears all counts and localStorage to start over
- **Toast notifications** — Bootstrap toasts confirm each check-in and surface validation errors

## Tech Stack

- HTML, CSS, JavaScript
- [Bootstrap 5.3](https://getbootstrap.com/) — toast, modal, progress bar, utility classes
- [Font Awesome 6.4](https://fontawesome.com/) — icons
- Browser `localStorage` — persistence

## Getting Started

Open `index.html` directly in a browser, or create a Codespace from this repo.
