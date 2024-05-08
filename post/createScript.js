document.addEventListener("DOMContentLoaded", function () {
  // Add event listener to the form's submission event
  const form = document.querySelector("#createPost");
  form.addEventListener("submit", handleCreateFormSubmission); // Use the async function
});
async function handleCreateFormSubmission(event) {
  event.preventDefault(); // Prevent the form from submitting in the traditional way

  const form = event.target;
  const title = document.getElementById("title").value;
  const image = document.getElementById("image").value;
  const body = document.getElementById("content").value;
  const loadingSpinner = document.getElementById("loadingSpinner");
  const errorMessage = document.getElementById("errorMessage");
  const submitButton = form.querySelector("button[type='submit']");

  loadingSpinner.style.display = "block"; // Show loading spinner
  errorMessage.style.display = "none"; // Hide error messages
  submitButton.disabled = true; // Disable submit button

  const postData = {
    title,
    media: {
      url: image,
    },
    body,
  };
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/${username}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Blog post created:", data);
      alert("Blog post created successfully!");
      form.reset();
    } else {
      // throw new Error("Failed to create blog post");
      const errorData = await response.json(); // Parse the error JSON
      const errorMessages = errorData.errors.map((e) => e.message).join(", "); // Extract error messages

      // Display the error message from the server's response
      errorMessage.innerText = `Failed to create post: ${errorMessages}`;
      errorMessage.style.display = "block";
    }
  } catch (error) {
    console.error("Error creating blog post:", error);
    errorMessage.innerText = `creating post failed: ${error.message}`;
    errorMessage.style.display = "block"; // Show error message
  } finally {
    loadingSpinner.style.display = "none"; // Hide loading spinner
    submitButton.disabled = false; // Re-enable the submit button
  }
}
