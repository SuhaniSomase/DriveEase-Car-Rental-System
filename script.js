
"use strict";

// -------------------- CAR DATA --------------------

const cars = [
  {
    id: "car1",
    name: "BMW 3 Series",
    category: "Luxury",
    price: 6500,
    fuel: "Petrol",
    seats: 5,
    transmission: "Automatic",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80",
    description: "Luxury and performance in perfect harmony."
  },
  {
    id: "car2",
    name: "Hyundai Creta",
    category: "SUV",
    price: 2800,
    fuel: "Petrol",
    seats: 5,
    transmission: "Manual",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
    description: "A comfortable companion for every road."
  },
  {
    id: "car3",
    name: "Honda City",
    category: "Sedan",
    price: 2400,
    fuel: "Petrol",
    seats: 5,
    transmission: "Automatic",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80",
    description: "Elegant, smooth, and ready for the city."
  },
  {
    id: "car4",
    name: "Range Rover Evoque",
    category: "Luxury",
    price: 8500,
    fuel: "Diesel",
    seats: 5,
    transmission: "Automatic",
    image: "https://images.unsplash.com/photo-1518987048-93e29699e79a?auto=format&fit=crop&w=900&q=80",
    description: "Premium comfort with an adventurous spirit."
  },
  {
    id: "car5",
    name: "Tata Nexon",
    category: "SUV",
    price: 2200,
    fuel: "Petrol",
    seats: 5,
    transmission: "Manual",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80",
    description: "Smart, versatile, and perfect for getaways."
  },
  {
    id: "car6",
    name: "Maruti Swift",
    category: "Hatchback",
    price: 1500,
    fuel: "Petrol",
    seats: 5,
    transmission: "Manual",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80",
    description: "A compact ride for everyday adventures."
  }
];

// -------------------- ELEMENTS --------------------

const $ = (selector) => document.querySelector(selector);

const carGrid = $("#carGrid");
const carSelect = $("#carSelect");
const searchInput = $("#searchInput");
const categoryFilter = $("#categoryFilter");
const priceFilter = $("#priceFilter");
const bookingForm = $("#bookingForm");
const startDate = $("#startDate");
const endDate = $("#endDate");
const estimatedTotal = $("#estimatedTotal");
const dateHint = $("#dateHint");
const bookingHistory = $("#bookingHistory");
const emptyHistory = $("#emptyHistory");
const emptyCars = $("#emptyCars");
const toast = $("#toast");

let bookings = loadBookings();
let toastTimeout;

// -------------------- SAFE STORAGE --------------------

function loadBookings() {
  try {
    const saved = JSON.parse(localStorage.getItem("driveEaseBookings") || "[]");
    return Array.isArray(saved) ? saved.filter(isValidBooking) : [];
  } catch {
    return [];
  }
}

function isValidBooking(booking) {
  return booking &&
    typeof booking.id === "string" &&
    typeof booking.carId === "string" &&
    typeof booking.name === "string" &&
    typeof booking.phone === "string" &&
    typeof booking.start === "string" &&
    typeof booking.end === "string" &&
    booking.start <= booking.end &&
    Number.isFinite(booking.total) &&
    booking.total >= 0 &&
    cars.some(car => car.id === booking.carId);
}

function saveBookings() {
  try {
    localStorage.setItem("driveEaseBookings", JSON.stringify(bookings));
    return true;
  } catch {
    showToast("Unable to save data. Check your browser storage.");
    return false;
  }
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function formatPrice(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day))
    .toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    });
}

function getCar(carId) {
  return cars.find(car => car.id === carId);
}

function todayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// -------------------- NOTIFICATIONS --------------------

function showToast(message) {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add("show");

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// -------------------- DISPLAY CARS --------------------

function renderCars() {
  const search = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const price = priceFilter.value;

  const filteredCars = cars.filter(car => {
    const matchesSearch = `${car.name} ${car.category}`
      .toLowerCase().includes(search);

    const matchesCategory =
      category === "all" || car.category === category;

    const matchesPrice =
      price === "all" ||
      (price === "low" && car.price < 3000) ||
      (price === "mid" && car.price >= 3000 && car.price <= 5000) ||
      (price === "high" && car.price > 5000);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  carGrid.innerHTML = filteredCars.map(car => `
    <article class="car-card">
      <div class="car-image-wrap">
        <img
          class="car-image"
          src="${car.image}"
          alt="${escapeHTML(car.name)}"
          loading="lazy"
          onerror="this.style.display='none'"
        >
        <span class="car-category">${escapeHTML(car.category)}</span>
      </div>
      <div class="car-body">
        <h3>${escapeHTML(car.name)}</h3>
        <p class="car-description">${escapeHTML(car.description)}</p>
        <div class="car-specs">
          <span><i class="fa-solid fa-users"></i> ${car.seats} Seats</span>
          <span><i class="fa-solid fa-gas-pump"></i> ${escapeHTML(car.fuel)}</span>
          <span><i class="fa-solid fa-gears"></i> ${escapeHTML(car.transmission)}</span>
        </div>
        <div class="car-bottom">
          <div class="car-price">
            <strong>${formatPrice(car.price)}</strong>
            <small>/ day</small>
          </div>
          <button class="btn btn-primary book-car" data-car-id="${car.id}">
            Book Now <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </article>
  `).join("");

  $("#carCount").textContent =
    `${filteredCars.length} ${filteredCars.length === 1 ? "vehicle" : "vehicles"}`;

  emptyCars.hidden = filteredCars.length !== 0;
}

// -------------------- BOOKING FORM --------------------

function populateCarOptions() {
  carSelect.innerHTML = `
    <option value="">Choose your car</option>
    ${cars.map(car => `
      <option value="${car.id}">
        ${escapeHTML(car.name)} — ${formatPrice(car.price)}/day
      </option>
    `).join("")}
  `;
}

function getRentalDays(start, end) {
  const startTime = Date.parse(`${start}T00:00:00Z`);
  const endTime = Date.parse(`${end}T00:00:00Z`);

  return Math.round((endTime - startTime) / 86400000) + 1;
}

function updateDateLimits() {
  const today = todayString();
  startDate.min = today;
  endDate.min = startDate.value && startDate.value >= today
    ? startDate.value
    : today;

  if (endDate.value && endDate.value < endDate.min) {
    endDate.value = "";
  }

  updateEstimate();
}

function updateEstimate() {
  const car = getCar(carSelect.value);
  const start = startDate.value;
  const end = endDate.value;

  if (!car || !start || !end || start < todayString() || end < start) {
    estimatedTotal.textContent = "₹0";
    dateHint.textContent = "Choose a car and valid rental dates to calculate the total.";
    return;
  }

  const days = getRentalDays(start, end);
  estimatedTotal.textContent = formatPrice(car.price * days);
  dateHint.textContent =
    `${days} ${days === 1 ? "day" : "days"} × ${formatPrice(car.price)} per day.`;
}

// Check if any saved booking overlaps with the selected car and dates.
function hasOverlap(carId, start, end) {
  return bookings.some(booking =>
    booking.carId === carId &&
    start <= booking.end &&
    end >= booking.start
  );
}

function handleBooking(event) {
  event.preventDefault();

  const name = $("#customerName").value.trim();
  const phone = $("#customerPhone").value.trim();
  const car = getCar(carSelect.value);
  const start = startDate.value;
  const end = endDate.value;

  if (name.length < 2) {
    showToast("Please enter your full name.");
    return;
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    showToast("Enter a valid 10-digit Indian mobile number.");
    return;
  }

  if (!car) {
    showToast("Please select a car.");
    return;
  }

  if (!start || !end || start < todayString() || end < start) {
    showToast("Please select valid pickup and return dates.");
    return;
  }

  if (hasOverlap(car.id, start, end)) {
    showToast("This car is already booked for overlapping dates. Please choose different dates or another car.");
    dateHint.textContent =
      "Date conflict detected. Choose different dates for this car.";
    return;
  }

  const days = getRentalDays(start, end);
  const booking = {
    id: (crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`),
    name,
    phone,
    carId: car.id,
    start,
    end,
    days,
    total: car.price * days
  };

  bookings.unshift(booking);

  if (!saveBookings()) {
    bookings.shift();
    return;
  }

  renderHistory();
  bookingForm.reset();
  updateDateLimits();

  showToast(`Booking request saved successfully for ${car.name}!`);

  $("#history").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

// -------------------- BOOKING HISTORY --------------------

function renderHistory() {
  $("#bookingCount").textContent =
    `${bookings.length} ${bookings.length === 1 ? "booking" : "bookings"}`;

  emptyHistory.hidden = bookings.length !== 0;

  bookingHistory.innerHTML = bookings.map(booking => {
    const car = getCar(booking.carId);

    return `
      <article class="history-card">
        <img
          src="${car.image}"
          alt="${escapeHTML(car.name)}"
          loading="lazy"
          onerror="this.style.display='none'"
        >
        <div>
          <h3>${escapeHTML(car.name)}</h3>
          <p><i class="fa-regular fa-user"></i> ${escapeHTML(booking.name)}</p>
          <p><i class="fa-regular fa-calendar"></i>
            ${formatDate(booking.start)} – ${formatDate(booking.end)}
          </p>
          <p><i class="fa-solid fa-clock"></i>
            ${booking.days || getRentalDays(booking.start, booking.end)}
            ${getRentalDays(booking.start, booking.end) === 1 ? "day" : "days"}
          </p>
          <p class="history-price">${formatPrice(booking.total)}</p>
          <span class="status-label">Request Saved</span>
          <br>
          <button class="btn btn-outline cancel-booking"
            data-booking-id="${escapeHTML(booking.id)}">
            <i class="fa-solid fa-xmark"></i> Cancel Booking
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function cancelBooking(bookingId) {
  const booking = bookings.find(item => item.id === bookingId);
  if (!booking) return;

  const confirmed = confirm(
    `Cancel the booking for ${getCar(booking.carId).name} from ${formatDate(booking.start)} to ${formatDate(booking.end)}?`
  );

  if (!confirmed) return;

  const previousBookings = bookings;
  bookings = bookings.filter(item => item.id !== bookingId);

  if (!saveBookings()) {
    bookings = previousBookings;
    return;
  }

  renderHistory();
  showToast("Booking cancelled successfully.");
}

// -------------------- DARK / LIGHT MODE --------------------

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");

  $("#themeToggle").innerHTML = theme === "dark"
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';

  $("#themeToggle").setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
}

function toggleTheme() {
  const nextTheme = document.body.classList.contains("dark")
    ? "light"
    : "dark";

  try {
    localStorage.setItem("driveEaseTheme", nextTheme);
  } catch {
    // Theme still works for this page session.
  }

  applyTheme(nextTheme);
}

// -------------------- MOBILE NAVIGATION --------------------

function closeMenu() {
  $("#navLinks").classList.remove("open");
  $("#menuToggle").setAttribute("aria-expanded", "false");
  $("#menuToggle").innerHTML = '<i class="fa-solid fa-bars"></i>';
}

// -------------------- EVENT LISTENERS --------------------

searchInput.addEventListener("input", renderCars);
categoryFilter.addEventListener("change", renderCars);
priceFilter.addEventListener("change", renderCars);

carSelect.addEventListener("change", updateEstimate);
startDate.addEventListener("change", updateDateLimits);
endDate.addEventListener("change", updateEstimate);

bookingForm.addEventListener("submit", handleBooking);

carGrid.addEventListener("click", event => {
  const button = event.target.closest(".book-car");
  if (!button) return;

  carSelect.value = button.dataset.carId;
  updateEstimate();

  $("#booking").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  carSelect.focus({ preventScroll: true });
});

bookingHistory.addEventListener("click", event => {
  const button = event.target.closest(".cancel-booking");
  if (button) cancelBooking(button.dataset.bookingId);
});

$("#themeToggle").addEventListener("click", toggleTheme);

$("#menuToggle").addEventListener("click", () => {
  const isOpen = $("#navLinks").classList.toggle("open");

  $("#menuToggle").setAttribute("aria-expanded", String(isOpen));
  $("#menuToggle").innerHTML = isOpen
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});

$("#navLinks").addEventListener("click", event => {
  if (event.target.closest("a")) closeMenu();
});

// -------------------- INITIALIZE APP --------------------

function initializeApp() {
  populateCarOptions();

  try {
    const savedTheme = localStorage.getItem("driveEaseTheme");
    applyTheme(savedTheme === "dark" ? "dark" : "light");
  } catch {
    applyTheme("light");
  }

  $("#currentYear").textContent = new Date().getFullYear();

  updateDateLimits();
  renderCars();
  renderHistory();
}

initializeApp();
