// Toggle between login and signup forms
function toggleForm() {
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    loginContainer.classList.toggle('active');
    signupContainer.classList.toggle('active');
}

// Show login form by default
document.getElementById('login-container').classList.add('active');

// Basic front-end validation
document.getElementById('login-form').addEventListener('submit', function(e){
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    if(email && password) {
        alert('Login Successful!');
    } else {
        alert('Please fill all fields.');
    }
});

document.getElementById('signup-form').addEventListener('submit', function(e){
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    if(username && email && password) {
        alert('Sign Up Successful!');
    } else {
        alert('Please fill all fields.');
    }
});
