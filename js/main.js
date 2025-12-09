document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initEventsPage();
  initQuiz();
  initMapInteractions();
  initReportForm();
  initPledgeForm();
});

/* THEME TOGGLE */
function initThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  const stored = localStorage.getItem("theme");
  if (stored === "dark") {
    document.body.classList.add("dark-mode");
  }

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const mode = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", mode);
  });
}


/* EVENTS PAGE: RENDER + FILTER */
function initEventsPage() {
  const eventsContainer = document.getElementById("eventsList");
  const filterSelect = document.getElementById("eventFilter");
  if (!eventsContainer || !filterSelect) return;

  const events = [
    {
      title: "Bayou Desiard Shoreline Cleanup",
      type: "waterway",
      date: "2025-02-15",
      time: "9:00 AM – 11:30 AM",
      location: "Bayou Desiard near ULM",
      description:
        "Help remove litter along the bayou banks to protect wildlife and improve water quality.",
    },
    {
      title: "Campus Green Litter Sweep",
      type: "park",
      date: "2025-02-22",
      time: "3:00 PM – 5:00 PM",
      location: "ULM Campus Green",
      description:
        "Join fellow students to collect trash around common hangout spots and walkways.",
    },
    {
      title: "Neighborhood Trail Cleanup",
      type: "trail",
      date: "2025-03-01",
      time: "8:30 AM – 10:30 AM",
      location: "Riverwalk Trail",
      description:
        "Walk the trail and pick up bottles, cans, and other debris along the path.",
    },
    {
      title: "Community Park Refresh Day",
      type: "park",
      date: "2025-03-08",
      time: "10:00 AM – 1:00 PM",
      location: "Monroe Neighborhood Park",
      description:
        "Family-friendly cleanup event with bags, gloves, and snacks provided.",
    },
  ];

  function renderEvents(filterType) {
    eventsContainer.innerHTML = "";

    const filtered =
      filterType === "all"
        ? events
        : events.filter((event) => event.type === filterType);

    if (filtered.length === 0) {
      eventsContainer.innerHTML =
        "<p>No events found for this type. Try another filter.</p>";
      return;
    }

    filtered.forEach((event) => {
      const card = document.createElement("article");
      card.className = "card event-card";
      card.innerHTML = `
        <h3>${event.title}</h3>
        <p class="event-meta">${formatDate(event.date)} • ${event.time}</p>
        <p class="event-meta">${event.location}</p>
        <p>${event.description}</p>
        <button class="btn primary-btn event-signup-btn">Sign Up</button>
      `;
      eventsContainer.appendChild(card);
    });

    // attach handlers for new buttons
    const buttons = eventsContainer.querySelectorAll(".event-signup-btn");
    buttons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        const e = filtered[index];
        alert(
          `Thanks for your interest!\n\nYou signed up (simulated) for:\n"${e.title}" at ${e.location} on ${formatDate(
            e.date
          )}.`
        );
      });
    });
  }

  filterSelect.addEventListener("change", () => {
    renderEvents(filterSelect.value);
  });

  renderEvents("all");
}

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* QUIZ */
function initQuiz() {
  const quiz = document.getElementById("quiz");
  const submitBtn = document.getElementById("submitQuiz");
  const resultEl = document.getElementById("quizResult");
  if (!quiz || !submitBtn || !resultEl) return;

  submitBtn.addEventListener("click", () => {
    const questions = quiz.querySelectorAll(".quiz-question");
    let score = 0;

    questions.forEach((q, index) => {
      const correct = q.dataset.answer;
      const name = `q${index + 1}`;
      const checked = quiz.querySelector(`input[name="${name}"]:checked`);
      if (checked && checked.value === correct) {
        score++;
      }
    });

    resultEl.textContent = `You scored ${score} out of ${questions.length}. ${
      score === questions.length
        ? "Perfect! You're a recycling pro."
        : score >= 2
        ? "Nice job! A few tweaks and you'll be a sustainability expert."
        : "Keep learning—every small step helps our community."
    }`;
  });
}

/* MAP INTERACTIONS */
function initMapInteractions() {
  const buttons = document.querySelectorAll(".map-point");
  const info = document.getElementById("mapInfo");
  if (!buttons.length || !info) return;

  const messages = {
    "Bayou Desiard":
      "Litter here washes directly into the water, harming fish, birds, and overall water quality.",
    "ULM Campus Green":
      "Food wrappers and bottles left after events can blow into drains and the bayou.",
    "Neighborhood Park":
      "Broken glass and plastic litter can make play areas unsafe for children and pets.",
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const loc = btn.dataset.location;
      info.textContent = messages[loc] || `Pollution at ${loc} harms our community.`;
    });
  });
}

/* REPORT POLLUTED AREA FORM */
function initReportForm() {
  const form = document.getElementById("reportForm");
  const list = document.getElementById("reportedList");
  if (!form || !list) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const locationInput = document.getElementById("reportLocation");
    const descInput = document.getElementById("reportDescription");

    const location = locationInput.value.trim();
    const description = descInput.value.trim();
    if (!location || !description) return;

    const li = document.createElement("li");
    li.textContent = `${location}: ${description}`;
    list.prepend(li);

    form.reset();
  });
}

/* PLEDGE FORM + MODAL */
function initPledgeForm() {
  const form = document.getElementById("pledgeForm");
  const confirmation = document.getElementById("pledgeConfirmation");
  const modal = document.getElementById("pledgeModal");
  const closeModal = document.getElementById("closeModal");
  const modalMessage = document.getElementById("modalMessage");

  if (!form || !confirmation) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("pledgeName").value.trim() || "Friend";
    const email = document.getElementById("pledgeEmail").value.trim();

    const interests = Array.from(
      form.querySelectorAll('input[name="interest"]:checked')
    ).map((i) => i.value);

    confirmation.textContent = `Thanks, ${name}! This site can’t send emails, but we’ve recorded your pledge to support future cleanup efforts.`;

    if (modal && modalMessage) {
      modalMessage.textContent = `Thanks, ${name}! You’re now part of the Cleanup Crew. When real events are organized, someone could email you at ${email} with details about ${
        interests.length ? interests.join(", ") : "local cleanup opportunities"
      }.`;
      modal.classList.add("show");
      modal.setAttribute("aria-hidden", "false");
    }

    form.reset();
  });

  if (closeModal && modal) {
    closeModal.addEventListener("click", () => {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
      }
    });
  }
}
