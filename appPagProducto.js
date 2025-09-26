// Form validation
const form = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const messageError = document.getElementById("messageError");

form.addEventListener("submit", function(event) {
  event.preventDefault();
  let valid = true;

  if (nameInput.value.trim() === "") {
    nameError.textContent = "El nombre es obligatorio.";
    valid = false;
  } else {
    nameError.textContent = "";
  }

  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!emailInput.value.match(emailPattern)) {
    emailError.textContent = "Introduce un correo válido.";
    valid = false;
  } else {
    emailError.textContent = "";
  }

  if (messageInput.value.trim() === "") {
    messageError.textContent = "El mensaje es obligatorio.";
    valid = false;
  } else {
    messageError.textContent = "";
  }

  if (valid) {
    showModal();
    launchConfetti();
    form.reset();
  }
});

// Modal
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModal");

function showModal() {
  modal.style.display = "flex";
}

closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Confetti
const confettiContainer = document.getElementById("confetti-container");
const subscribeBtn = document.getElementById("subscribeBtn");

subscribeBtn.addEventListener("click", launchConfetti);

function launchConfetti() {
  for (let i = 0; i < 15; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor = randomColor();
    confetti.style.animationDuration = (Math.random() * 2 + 2) + "s";
    confettiContainer.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 3000);
  }
}

function randomColor() {
  const colors = ["#ffd700", "#ff4500", "#4a90e2", "#32cd32", "#ff69b4"];
  return colors[Math.floor(Math.random() * colors.length)];
}
