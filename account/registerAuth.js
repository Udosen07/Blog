// Password Toggler
const passwordInput = document.getElementById("password");
const togglePasswordButton = document.getElementById("toggle-password");
const toggleIcon = togglePasswordButton.querySelector("i");

// Keep track of whether the password is currently visible or hidden
let isPasswordVisible = false;

// Add an event listener to the button
togglePasswordButton.addEventListener("click", function () {
  // Toggle the password visibility
  isPasswordVisible = !isPasswordVisible;

  if (isPasswordVisible) {
    // If the password is visible, change the type to "text" and update the icon to "eye-slash"
    passwordInput.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
    togglePasswordButton.setAttribute("aria-label", "Hide Password");
  } else {
    // If the password is hidden, change the type to "password" and update the icon to "eye"
    passwordInput.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
    togglePasswordButton.setAttribute("aria-label", "Show Password");
  }
});

// Register api integration
async function handleRegisterFormSubmission(event) {
  event.preventDefault(); // Prevent the form from submitting in the traditional way

  const form = event.target;

  // Retrieve values from the form inputs
  const name = form.querySelector("#userName").value;
  const email = form.querySelector("#email").value;
  const password = form.querySelector("#password").value;
  const loadingSpinner = document.getElementById("loadingSpinner");
  const errorMessage = document.getElementById("errorMessage");
  const submitButton = form.querySelector("button[type='submit']");

  loadingSpinner.style.display = "block"; // Show loading spinner
  errorMessage.style.display = "none"; // Hide error messages
  submitButton.disabled = true; // Disable submit button
  // Create an object with the form data
  const registerData = {
    name,
    email,
    password,
  };

  try {
    // Use fetch with async/await to send a POST request
    const response = await fetch("https://v2.api.noroff.dev/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData), // Convert the data object to a JSON string
    });

    if (response.ok) {
      const result = await response.json(); // Parse the JSON response
      console.log("Registration successful:", result);
      alert("Registration successful! Redirecting to login...");
      window.location.href = "login.html"; // Redirect to the login page
    } else {
      throw new Error("Registration failed");
    }
  } catch (error) {
    console.error("Error:", error);
    errorMessage.innerText = `Registration failed: ${error.message}`;
    errorMessage.style.display = "block"; // Show error message
  } finally {
    loadingSpinner.style.display = "none"; // Hide loading spinner
    submitButton.disabled = false; // Re-enable the submit button
  }
}

// Add event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  // Add event listener to the form's submission event
  const form = document.querySelector("#registerForm");
  form.addEventListener("submit", handleRegisterFormSubmission); // Use the async function
});
