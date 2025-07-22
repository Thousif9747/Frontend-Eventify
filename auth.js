document.addEventListener('DOMContentLoaded', function() {
    // Toggle logic
    const showLoginBtn = document.getElementById('show-login');
    const showSignupBtn = document.getElementById('show-signup');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    showLoginBtn.onclick = function() {
        showLoginBtn.classList.add('active');
        showSignupBtn.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    };
    showSignupBtn.onclick = function() {
        showSignupBtn.classList.add('active');
        showLoginBtn.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    };

    function getUsers() {
        const u = localStorage.getItem('users');
        if (u) try { return JSON.parse(u); } catch { return []; }
        return [];
    }
    function saveUsers(users) { localStorage.setItem('users', JSON.stringify(users)); }
    function setSessionUser(username) { localStorage.setItem('sessionUser', username); }

    // Login logic
    if (loginForm) {
        loginForm.onsubmit = function(e) {
            e.preventDefault();
            const username = loginForm.loginUsername.value.trim();
            const password = loginForm.loginPassword.value;
            let users = getUsers();
            if (users.find(u => u.username === username && u.password === password)) {
                alert('Login successful!');
                setSessionUser(username);
                window.location.href = 'events.html';
            } else {
                alert('Invalid username or password.');
            }
        };
    }
    // Signup logic
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
            setSessionUser(username);
            window.location.href = 'events.html';
        };
    }
}); 