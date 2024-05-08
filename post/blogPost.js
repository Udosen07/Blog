// Function to get the query parameter by name
function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Get the post ID from the query parameters
const postId = getQueryParameter("id");
const username = localStorage.getItem("username");

// Function to fetch the blog post details
function fetchBlogPost(postId, username) {
  // Replace with your API endpoint
  const apiUrl = `https://v2.api.noroff.dev/blog/posts/${username}/${postId}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const post = data.data; // Extracting the post data from the response

      // Accessing post properties
      const title = post.title;
      const body = post.body;
      const imageUrl = post.media.url; // URL of the post image
      const authorName = post.author.name;
      const date = post.created;

      // Displaying post details
      const postDetail = document.getElementById("post-detail");
      postDetail.innerHTML = `
              <h1>${title}</h1>
              <img src="${imageUrl}" alt="">
              <div class="updates">
              <h3>Author: ${authorName}</h3>
              <div><!-- Link to the edit page with the current post's ID -->
              <button class="editBtn"><a href="./edit.html?id=${postId}">Edit</a></button>
              <!-- Button to delete the post -->
              <button id="delete-post" class="deleteBtn">Delete</button></div>
              </div>
              
              <h3>Date: ${date}</h3>
              <p>${body}</p>
              
              
          `;

      // Event listener for delete button
      document.getElementById("delete-post").addEventListener("click", () => {
        // Confirm delete action
        if (confirm("Are you sure you want to delete this post?")) {
          const token = localStorage.getItem("token");
          // Send DELETE request to the API
          fetch(apiUrl, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => {
              if (response.ok) {
                alert("Post deleted successfully.");
                // Redirect to another page, e.g., the list of posts
                window.location.href = "../index.html";
              } else {
                alert("Failed to delete the post.");
              }
            })
            .catch((error) => {
              console.error("Error deleting the post:", error);
              alert("Error deleting the post.");
            });
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching blog post:", error);
      document.getElementById("post-detail").innerText = "Failed to load post.";
    });
}

// Fetch the blog post when the page loads
document.addEventListener("DOMContentLoaded", () => {
  if (postId && username) {
    fetchBlogPost(postId, username);
  } else {
    document.getElementById("post-detail").innerText =
      "Invalid post ID or username.";
  }
});