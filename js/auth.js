document.addEventListener("DOMContentLoaded", () => {
    const goToLogin = document.getElementById("goToLogin");
    const goToSignUp = document.getElementById("goToSignUp");
    const signUpForm = document.querySelector(".signup-form");
    const loginForm = document.querySelector(".login-form");
    const signUpEmail = document.getElementById("signUpEmail");
    const signUpUsername = document.getElementById("signUpUsername");
    const signUpPassword = document.getElementById("signUpPassword");
    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");
    const signUpButton = signUpForm.querySelector("button");
    const loginButton = loginForm.querySelector("button");


    goToLogin.addEventListener("click", (e) => {
      e.preventDefault();
      signUpForm.classList.add("hidden");
      loginForm.classList.remove("hidden");
    });
  
    goToSignUp.addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.classList.add("hidden");
      signUpForm.classList.remove("hidden");
    });
  
    // Handle sign-up process
    signUpButton.addEventListener("click", (e) => {
      e.preventDefault();
      const email = signUpEmail.value.trim();
      const username = signUpUsername.value.trim();
      const password = signUpPassword.value.trim();
  
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }
      if (username.length < 3) {
        alert("Username must be at least 3 characters long.");
        return;
      }
      if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W_]{8,}$/.test(password)) {
        alert("Password must be at least 8 characters long and include a number.");
        return;
      }
      const users = JSON.parse(localStorage.getItem("users")) || [];
      if (users.some(user => user.email === email)) {
        alert("Email already exists. Please use a different email.");
        return;
      }
      const hashedPassword = CryptoJS.SHA256(password).toString();
      users.push({ email, username, password: hashedPassword, bestScore: { moves: Infinity, time: Infinity } });
      localStorage.setItem("users", JSON.stringify(users));
  
      alert("Sign-Up Successful! You can now log in.");
      signUpForm.reset();
      goToLogin.click();
    });
  
    // Handle login process
    loginButton.addEventListener("click", (e) => {
      e.preventDefault();
      const email = loginEmail.value.trim();
      const password = loginPassword.value.trim();
      const hashedPassword = CryptoJS.SHA256(password).toString();
  
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(user => user.email === email && user.password === hashedPassword);
  
      if (user) {
        window.location.href = "./game.html"; // Redirect to the game page
        alert(`Welcome back, ${user.username}!`);
        localStorage.setItem('loggedInUser', JSON.stringify(user.username));
        loginForm.reset();
      } else {
        alert("Invalid email or password. Please try again.");
      }
    });
  });