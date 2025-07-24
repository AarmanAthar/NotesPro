// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        window.location.href = 'dashboard.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        // Validate credentials
        if (users[username] && users[username].password === password) {
            // Store user info in localStorage
            localStorage.setItem('loggedInUser', JSON.stringify({
                username: username,
                name: users[username].name,
                subscribed: users[username].subscribed,
                email: users[username].email
            }));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Show error message
            loginError.classList.remove('hidden');
            
            // Hide error after 3 seconds
            setTimeout(() => {
                loginError.classList.add('hidden');
            }, 3000);
        }
    });

    // Add some interactive effects
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('transform', 'scale-105');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('transform', 'scale-105');
        });
    });
});