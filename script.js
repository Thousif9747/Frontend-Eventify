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

document.addEventListener('DOMContentLoaded', function() {
    const eventList = document.getElementById('event-list');
    if (eventList) {
        events.forEach(event => {
            const card = document.createElement('div');
            card.className = 'event-card';
            card.innerHTML = `
                <img src="${event.image}" alt="${event.name}" class="event-image"/>
                <h3>${event.name}</h3>
                <p><strong>Date:</strong> ${event.date}</p>
                <p><strong>Venue:</strong> ${event.venue}</p>
                <p>${event.description}</p>
                <a href="event.html?id=${event.id}" class="book-btn">Book</a>
            `;
            eventList.appendChild(card);
        });
    }

    const eventDetailsCard = document.getElementById('event-details-card');
    if (eventDetailsCard) {
        const eventId = getQueryParam('id');
        const event = events.find(e => e.id == eventId);
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
                const phone = bookingForm.phone.value;
                const booking = {
                    name,
                    email,
                    tickets,
                    eventName: event.name,
                    eventDate: event.date,
                    eventVenue: event.venue,
                    phone
                };
                fetch('https://backend-eventify-production.up.railway.app/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(booking)
                })
                .then(res => {
                    if (res.ok) {
                        localStorage.setItem('booking', JSON.stringify(booking));
                        window.location.href = 'confirmation.html';
                    } else {
                        alert('Booking failed. Please try again.');
                    }
                })
                .catch(() => alert('Booking failed. Please try again.'));
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
}); 