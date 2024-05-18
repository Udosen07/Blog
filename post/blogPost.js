// Function to get the query parameter by name
function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Get the post ID from the query parameters
const postId = getQueryParameter("id");
const savedUsername = localStorage.getItem("username");
const defaultUsername = "Queen";
let username = savedUsername === null ? defaultUsername : savedUsername;

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
      
      <div class="backgroundImg" style="background-image: url('${imageUrl}');">
      <div class="updates"><!-- Link to the edit page with the current post's ID -->
      
              <button class="editBtn"><a href="./edit.html?id=${postId}"><i class="fa-solid fa-pen"></i></a></button>
              <!-- Button to delete the post -->
              <button id="delete-post" class="deleteBtn"><i class="fa-solid fa-trash-can"></i></button></div>
              <div class="blogHead">
              <h1>${title}</h1>
              <div class="blogDes">
              
              <h3>${date}</h3>
              <h3>by: ${authorName}</h3>              
              
              
              </div>
              </div>
              </div>
              
              <p class="blogBody">${body}</p>
              
              
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
      const updatesElement = document.querySelector(".updates");
      if (username === savedUsername) {
        updatesElement.style.display = "flex";
      } else {
        updatesElement.style.display = "none";
      }
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
