document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:8080/bookings')
        .then(res => res.json())
        .then(bookings => {
            const tbody = document.querySelector('#bookings-table tbody');
            tbody.innerHTML = '';
            if (bookings.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No bookings found.</td></tr>';
            } else {
                bookings.forEach(b => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td data-label="ID">${b.id}</td>
                        <td data-label="Event">${b.eventName}</td>
                        <td data-label="Date">${b.eventDate}</td>
                        <td data-label="Venue">${b.eventVenue}</td>
                        <td data-label="Name">${b.name}</td>
                        <td data-label="Email">${b.email}</td>
                        <td data-label="Phone">${b.phone || ''}</td>
                        <td data-label="Tickets">${b.tickets}</td>
                    `;
                    tbody.appendChild(row);
                });
            }
        })
        .catch(() => {
            const tbody = document.querySelector('#bookings-table tbody');
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:red;">Failed to load bookings.</td></tr>';
        });
});
