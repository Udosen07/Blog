// Password Toggler
const passwordInput = document.getElementById("password");
const togglePasswordButton = document.getElementById("toggle-password");
const toggleIcon = togglePasswordButton.getElementsByClassName("toggle-password");

// Keep track of whether the password is currently visible or hidden
let isPasswordVisible = false;

// Add an event listener to the button
togglePasswordButton.addEventListener("click", function () {
  // Toggle the password visibility
  isPasswordVisible = !isPasswordVisible;

  if (isPasswordVisible) {
    // If the password is visible, change the type to "text" and update the icon to "eye"
    passwordInput.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
    togglePasswordButton.setAttribute("aria-label", "Hide Password");
  } else {
    // If the password is hidden, change the type to "password" and update the icon to "eye-slash"
    passwordInput.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
    togglePasswordButton.setAttribute("aria-label", "Show Password");
  }
});

// Login api integration
async function handleLoginFormSubmission(event) {
  event.preventDefault(); // Prevent the form from submitting in the traditional way

  const form = event.target;

  // Retrieve values from the form inputs
  const email = form.querySelector("#email").value;
  const password = form.querySelector("#password").value;
  const loadingSpinner = document.getElementById("loadingSpinner");
  const errorMessage = document.getElementById("errorMessage");
  const submitButton = form.querySelector("button[type='submit']");

  loadingSpinner.style.display = "block"; // Show loading spinner
  errorMessage.style.display = "none"; // Hide error messages
  submitButton.disabled = true; // Disable submit button
  // Create an object with the form data
  const loginData = {
    email,
    password,
  };

  try {
    // Use fetch with async/await to send a POST request
    const response = await fetch("https://v2.api.noroff.dev/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData), // Convert the data object to a JSON string
    });

    if (response.ok) {
      const result = await response.json(); // Parse the JSON response
      console.log("Login successful:", result);
      localStorage.setItem("username", result.data.name);
      localStorage.setItem("token", result.data.accessToken);
      window.location.href = "../index.html"; // Redirect to the login page
    } else {
      throw new Error("Login failed");
    }
  } catch (error) {
    console.error("Error:", error);
    errorMessage.innerText = `Login failed: ${error.message}`;
    errorMessage.style.display = "block"; // Show error message
  } finally {
    loadingSpinner.style.display = "none"; // Hide loading spinner
    submitButton.disabled = false; // Re-enable the submit button
  }
}

// Add event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  // Add event listener to the form's submission event
  const form = document.querySelector("#loginForm");
  form.addEventListener("submit", handleLoginFormSubmission); // Use the async function
});
