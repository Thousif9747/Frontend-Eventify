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
                        <td>${b.id}</td>
                        <td>${b.eventName}</td>
                        <td>${b.eventDate}</td>
                        <td>${b.eventVenue}</td>
                        <td>${b.name}</td>
                        <td>${b.email}</td>
                        <td>${b.phone || ''}</td>
                        <td>${b.tickets}</td>
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
