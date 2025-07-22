const events = [
    {
        id: 1,
        name: "Music Concert",
        date: "2024-07-15",
        venue: "City Hall",
        description: "Enjoy live music from top artists!",
         image: "music.jpeg"
    },
    {
        id: 2,
        name: "Art Exhibition",
        date: "2024-08-01",
        venue: "Art Gallery",
        description: "Explore modern art from local artists.",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Tech Conference",
        date: "2024-09-10",
        venue: "Convention Center",
        description: "Join tech leaders and innovators.",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80"
    }
];

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function loadEvents() {
    const stored = localStorage.getItem('events');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return [...events];
        }
    }
    return [...events];
}

function saveEvents(evts) {
    localStorage.setItem('events', JSON.stringify(evts));
}

const EVENTS_PER_PAGE = 6;
let currentPage = 1;
function renderEvents(filter = '', category = '', page = 1) {
    const eventList = document.getElementById('event-list');
    const pagination = document.getElementById('pagination');
    if (!eventList) return;
    eventList.innerHTML = '';
    let evts = loadEvents().filter(event => {
        if (category && event.category !== category) return false;
        if (!filter) return true;
        const f = filter.toLowerCase();
        return event.name.toLowerCase().includes(f) || event.venue.toLowerCase().includes(f);
    });
    const totalPages = Math.max(1, Math.ceil(evts.length / EVENTS_PER_PAGE));
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    currentPage = page;
    const start = (page - 1) * EVENTS_PER_PAGE;
    const end = start + EVENTS_PER_PAGE;
    const pageEvents = evts.slice(start, end);
    pageEvents.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <img src="${event.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'}" alt="${event.name}" class="event-image"/>
            <div style="display:flex;align-items:center;gap:0.7em;margin:1em 1.2em 0 1.2em;">
                <span class="category-tag category-${(event.category||'').toLowerCase()}">${event.category || 'Other'}</span>
            </div>
            <h3>${event.name}</h3>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Venue:</strong> ${event.venue}</p>
            <p>${event.description}</p>
            <button class="book-btn" data-event-id="${event.id}">Book</button>
            <button class="delete-event-btn" data-id="${event.id}" style="margin-top:6px; background:#eee; color:#f53803; border:none; border-radius:50%; width:28px; height:28px; font-size:1.1em; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; box-shadow:0 1px 4px rgba(0,0,0,0.06);">&#10006;</button>
        `;
        eventList.appendChild(card);
    });
    // Pagination controls
    if (pagination) {
        pagination.innerHTML = '';
        if (totalPages > 1) {
            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement('button');
                btn.textContent = i;
                btn.className = 'button' + (i === page ? ' button-primary' : '');
                btn.style.minWidth = '2.5em';
                btn.onclick = () => renderEvents(filter, category, i);
                pagination.appendChild(btn);
            }
        }
    }
    // Add delete event listeners
    document.querySelectorAll('.delete-event-btn').forEach(btn => {
        btn.onclick = function() {
            const id = parseInt(this.getAttribute('data-id'));
            if (confirm('Are you sure you want to delete this event?')) {
                const updated = loadEvents().filter(e => e.id !== id);
                saveEvents(updated);
                renderEvents(document.getElementById('event-search')?.value || '', document.getElementById('category-filter')?.value || '', currentPage);
            }
        };
    });
    // Book button logic: navigate to event.html with event id
    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            const eventId = btn.getAttribute('data-event-id');
            window.location.href = `event.html?id=${eventId}`;
        };
    });
}

// Toast notification logic
function showToast(message, duration = 2500) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
}
// Spinner logic
function showSpinner(show = true) {
    const spinner = document.getElementById('global-spinner');
    if (!spinner) return;
    spinner.style.display = show ? 'block' : 'none';
}

function showMainContent(loggedIn) {
    const mainContent = document.getElementById('main-content');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    if (loggedIn) {
        if (mainContent) mainContent.style.display = '';
        if (loginModal) loginModal.style.display = 'none';
        if (signupModal) signupModal.style.display = 'none';
    } else {
        if (mainContent) mainContent.style.display = 'none';
        if (loginModal) loginModal.style.display = 'flex';
        if (signupModal) signupModal.style.display = 'none';
    }
}
function isLoggedIn() {
    return !!localStorage.getItem('sessionUser');
}
document.addEventListener('DOMContentLoaded', function() {
    // Animate main content on page load
    const main = document.querySelector('main');
    if (main) main.classList.add('fade-in');
    // Render events from localStorage or default
    renderEvents();

    // Event search functionality
    const eventSearch = document.getElementById('event-search');
    const categoryFilter = document.getElementById('category-filter');

    if (eventSearch) {
        eventSearch.addEventListener('input', function() {
            renderEvents(eventSearch.value, categoryFilter?.value || '', 1);
        });
    }

    // Category filter logic
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            renderEvents(eventSearch?.value || '', categoryFilter.value, 1);
        });
    }

    // Navbar Add Event button opens modal
    const navAddEvent = document.getElementById('nav-add-event');
    const addEventModal = document.getElementById('add-event-modal');
    const addEventForm = document.getElementById('add-event-form');
    const cancelAddEvent = document.getElementById('cancel-add-event');
    if (navAddEvent && addEventModal) {
        navAddEvent.onclick = () => { addEventModal.style.display = 'flex'; };
    }
    if (addEventModal && addEventForm && cancelAddEvent) {
        cancelAddEvent.onclick = () => { addEventModal.style.display = 'none'; addEventForm.reset(); };
        addEventForm.onsubmit = function(e) {
            e.preventDefault();
            const evts = loadEvents();
            const newId = evts.length > 0 ? Math.max(...evts.map(e => e.id)) + 1 : 1;
            const newEvent = {
                id: newId,
                name: addEventForm.name.value.trim(),
                date: addEventForm.date.value,
                venue: addEventForm.venue.value.trim(),
                description: addEventForm.description.value.trim(),
                image: addEventForm.image.value.trim() || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
                category: addEventForm.category.value || 'Other'
            };
            evts.push(newEvent);
            saveEvents(evts);
            const eventSearch = document.getElementById('event-search');
            if (eventSearch) eventSearch.value = '';
            renderEvents('', categoryFilter?.value || '', 1);
            addEventModal.style.display = 'none';
            addEventForm.reset();
            showToast('Event added successfully!');
        };
        addEventModal.onclick = function(e) {
            if (e.target === addEventModal) {
                addEventModal.style.display = 'none';
                addEventForm.reset();
            }
        };
    }

    const eventDetailsCard = document.getElementById('event-details-card');
    if (eventDetailsCard) {
        const eventId = getQueryParam('id');
        const event = loadEvents().find(e => e.id == eventId);
        if (event) {
            document.title = event.name + " - Event Details";
            eventDetailsCard.innerHTML = `
                <img src="${event.image}" alt="${event.name}" class="event-image"/>
                <h2>${event.name}</h2>
                <p><strong>Date:</strong> ${event.date}</p>
                <p><strong>Venue:</strong> ${event.venue}</p>
                <p>${event.description}</p>
                    <form id="booking-form" autocomplete="off">
                        <div class="form-group">
                        <span class="form-icon">👤</span>
                        <input type="text" name="name" required placeholder=" " />
                        <label>Name</label>
                    </div>
                    <div class="form-group">
                        <span class="form-icon">✉️</span>
                        <input type="email" name="email" required placeholder=" " />
                        <label>Email</label>
                        </div>
                        <div class="form-group">
                        <span class="form-icon">📱</span>
                        <input type="tel" name="phone" required pattern="[0-9]{10,15}" placeholder=" " />
                        <label>Phone Number</label>
                        </div>
                        <div class="form-group">
                        <span class="form-icon">🎟️</span>
                        <input type="number" name="tickets" min="1" value="1" required placeholder=" " />
                        <label>Tickets</label>
                        </div>
                    <button type="submit">Book Now</button>
                    </form>
            `;
            const bookingForm = document.getElementById('booking-form');
            bookingForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = bookingForm.name.value;
                const email = bookingForm.email.value;
                const tickets = bookingForm.tickets.value;
                const phone = bookingForm.phone.value.trim();

                // Phone validation
                if (!/^\d{10}$/.test(phone)) {
                    showToast('Please enter a valid 10-digit phone number.');
                    bookingForm.phone.focus();
                    return;
                }

                const booking = {
                    name,
                    email,
                    tickets,
                    eventName: event.name,
                    eventDate: event.date,
                    eventVenue: event.venue,
                    phone
                };
                showSpinner(true);
                fetch('https://backend-eventify-production.up.railway.app/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(booking)
                })
                .then(res => {
                    showSpinner(false);
                    if (res.ok) {
                        localStorage.setItem('booking', JSON.stringify(booking));
                        showToast('Booking successful!');
                        setTimeout(() => window.location.href = 'confirmation.html', 800);
                    } else {
                        showToast('Booking failed. Please try again.');
                    }
                })
                .catch(() => {
                    showSpinner(false);
                    showToast('Booking failed. Please try again.');
                });
            });
        } else {
            eventDetailsCard.innerHTML = "<p>Event not found.</p>";
        }
    }

    const confirmationDetails = document.getElementById('confirmation-details');
    if (confirmationDetails) {
        const booking = JSON.parse(localStorage.getItem('booking'));
        if (booking) {
            confirmationDetails.innerHTML = `
                <h2>Thank you for your booking, ${booking.name}!</h2>
                <p><strong>Event:</strong> ${booking.eventName}</p>
                <p><strong>Tickets:</strong> ${booking.tickets}</p>
                <p><strong>Email:</strong> ${booking.email}</p>
            `;
        } else {
            confirmationDetails.innerHTML = "<p>No booking found.</p>";
        }
    }

    // Login/Signup modal logic
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const navLogin = document.getElementById('nav-login');
    const navSignup = document.getElementById('nav-signup');
    const cancelLogin = document.getElementById('cancel-login');
    const cancelSignup = document.getElementById('cancel-signup');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (navLogin && loginModal) navLogin.onclick = () => { loginModal.style.display = 'flex'; };
    if (navSignup && signupModal) navSignup.onclick = () => { signupModal.style.display = 'flex'; };
    if (cancelLogin && loginModal && loginForm) cancelLogin.onclick = () => { loginModal.style.display = 'none'; loginForm.reset(); };
    if (cancelSignup && signupModal && signupForm) cancelSignup.onclick = () => { signupModal.style.display = 'none'; signupForm.reset(); };
    if (loginModal && loginForm) loginModal.onclick = e => { if (e.target === loginModal) { loginModal.style.display = 'none'; loginForm.reset(); } };
    if (signupModal && signupForm) signupModal.onclick = e => { if (e.target === signupModal) { signupModal.style.display = 'none'; signupForm.reset(); } };

    // LocalStorage user management
    function getUsers() {
        const u = localStorage.getItem('users');
        if (u) try { return JSON.parse(u); } catch { return []; }
        return [];
    }
    function saveUsers(users) { localStorage.setItem('users', JSON.stringify(users)); }

    // Sign Up
    if (signupForm) {
        signupForm.onsubmit = function(e) {
            e.preventDefault();
            const username = signupForm.signupUsername.value.trim();
            const password = signupForm.signupPassword.value;
            const confirm = signupForm.signupConfirmPassword.value;
            if (password !== confirm) {
                alert('Passwords do not match.');
                return;
            }
            let users = getUsers();
            if (users.find(u => u.username === username)) {
                alert('Username already exists.');
                return;
            }
            users.push({ username, password });
            saveUsers(users);
            alert('Sign up successful! You can now log in.');
            signupModal.style.display = 'none';
            signupForm.reset();
            showToast('Sign up successful!');
        };
    }

    // Login
    if (loginForm) {
        loginForm.onsubmit = function(e) {
            e.preventDefault();
            const username = loginForm.loginUsername.value.trim();
            const password = loginForm.loginPassword.value;
            let users = getUsers();
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                alert('Login successful!');
                setSessionUser(username);
                loginModal.style.display = 'none';
                loginForm.reset();
                updateNavbarAuth();
                showToast('Login successful!');
            } else {
                alert('Invalid username or password.');
            }
        };
    }

    // Session management
    function setSessionUser(username) {
        localStorage.setItem('sessionUser', username);
    }
    function getSessionUser() {
        return localStorage.getItem('sessionUser');
    }
    function clearSessionUser() {
        localStorage.removeItem('sessionUser');
    }

    function updateNavbarAuth() {
        const navLogin = document.getElementById('nav-login');
        const navSignup = document.getElementById('nav-signup');
        const navAddEvent = document.getElementById('nav-add-event');
        let navUser = document.getElementById('nav-user');
        let navLogout = document.getElementById('nav-logout');
        const user = getSessionUser();
        if (user) {
            if (navLogin) navLogin.style.display = 'none';
            if (navSignup) navSignup.style.display = 'none';
            if (navAddEvent) navAddEvent.style.display = 'inline-block';

            if (!navUser) {
                navUser = document.createElement('span');
                navUser.id = 'nav-user';
                navUser.className = 'nav-user';
                const navRight = document.querySelector('.nav-right');
                if (navRight) navRight.appendChild(navUser);
            }
            
            const initials = user.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
            navUser.innerHTML = `<span class="user-avatar">${initials}</span> <span class="user-name">${user}</span>`;

            if (!navLogout) {
                navLogout = document.createElement('button');
                navLogout.id = 'nav-logout';
                navLogout.textContent = 'Logout';
                navLogout.className = 'nav-button';
                const navRight = document.querySelector('.nav-right');
                if (navRight) navRight.appendChild(navLogout);

                navLogout.onclick = function() {
                    clearSessionUser();
                    updateNavbarAuth();
                    renderEvents(document.getElementById('event-search')?.value || '', document.getElementById('category-filter')?.value || '', currentPage);
                    showToast('Logged out!');
                };
            }
            if (navLogout) navLogout.style.display = 'inline-block';
            
        } else {
            if (navLogin) navLogin.style.display = 'inline-block';
            if (navSignup) navSignup.style.display = 'inline-block';
            if (navAddEvent) navAddEvent.style.display = 'none';
            if (navUser) navUser.remove();
            if (navLogout) navLogout.remove();
        }
    }

    // On page load, update navbar
    updateNavbarAuth();
}); 
