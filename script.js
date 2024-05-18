document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  if (hamburger) {
    // Check if the hamburger menu exists
    hamburger.addEventListener("click", function () {
      const menu = document.getElementById("navLinks");
      if (menu) {
        menu.classList.toggle("active"); // Toggle the active class on the menu
      }
    });
  }

  const defaultUsernameText = "User"; // Default text when not logged in
  const username = localStorage.getItem("username") || defaultUsernameText;

  const navUsernameElement = document.querySelector("#nav-username");
  const navSignupElement = document.querySelector("#nav-signup");
  const navLoginElement = document.querySelector("#nav-login");
  const navCreateElement = document.querySelector("#nav-create");
  const navUserElement = document.querySelector("#nav-user");

  // Set the text of the user section
  navUsernameElement.textContent = username;

  if (username === defaultUsernameText) {
    // Not logged in: hide user section, show login and signup
    navUserElement.style.display = "none";
    navCreateElement.style.display = "none";
    navSignupElement.style.display = "block"; // Show signup
    navLoginElement.style.display = "block"; // Show login
  } else {
    // Logged in: show user section, hide login and signup
    navUserElement.style.display = "block"; // Show user section
    navCreateElement.style.display = "block";
    navSignupElement.style.display = "none"; // Hide signup
    navLoginElement.style.display = "none"; // Hide login
  }

  // Add logout functionality
  const logoutLink = document.querySelector(".logout");
  logoutLink.addEventListener("click", function () {
    // Clear local storage and reload the page
    localStorage.removeItem("username");
    localStorage.removeItem("accessToken"); // Optional if you're using tokens
    window.location.reload(); // Refresh the page to reflect changes
  });

  // carousel api integration
  const dataList = document.getElementById("blogCarousel");
  const name = localStorage.getItem("username") || "Queen";

  // Async function to fetch data from an API
  async function fetchData() {
    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/blog/posts/${name}`
      ); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const responseData = await response.json(); // Convert response to JSON
      const data = responseData.data; // Get the array from the "data" key

      // Use 'map' to create an array of list item elements
      const listItems = data.map((item) => {
        const li = document.createElement("li");
        li.className = "carousel-card"; // Add a class for styling

        // Create the inner content for the list item
        li.innerHTML = `
                
        <div class="cardImg" style="background-image: url('${item.media.url}');">
        <button class="blogBtn">
        <a href="./post/index.html?id=${item.id}">Read More</a> 
        <!-- Pass the ID as a URL parameter -->
    </button>
                
                <div class="blogDescription">
                    <p><i class="fa-solid fa-user"></i> ${item.author.name}</p>
                    <p><i class="fa-regular fa-calendar-days"></i> ${item.created}</p>
                </div>
            </div>
            <h2 class="blogTitle">${item.title}</h2>
            `;

        return li; // Return the list item element
      });

      // Clear the existing content and append the new list items
      dataList.innerHTML = ""; // Clear "Loading..." or other content
      listItems.forEach((li) => dataList.appendChild(li)); // Add the new items
    } catch (error) {
      console.error("Error fetching data:", error);
      dataList.innerHTML = "<li>Error loading data</li>"; // Display an error message if fetch fails
    }
  }

  // Fetch the data and update the list
  fetchData();

  fetchData().then(() => {
    const carouselTrack = document.querySelector(".carousel-track");
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");
    const carouselItems = document.querySelectorAll(".carousel-card");
    const totalItems = carouselItems.length;

    // Function to get the number of items per view based on screen size
    function getItemsPerView() {
      const screenWidth = window.innerWidth;
      if (screenWidth < 480) {
        // Smallest screen (example: below 480px)
        return 1;
      } else if (screenWidth < 750) {
        // Medium screen (example: between 480px and 750px)
        return 2;
      } else {
        // Larger screens (example: 750px and above)
        return 3;
      }
    }

    // Set the initial number of items per view
    let itemsPerView = getItemsPerView();

    // Recalculate item width in case it's affected by resizing
    function updateItemWidth() {
      if (carouselItems.length === 0) {
        return 0; // Avoid accessing undefined elements
      }
      return carouselItems[0].offsetWidth; // Get the current width of an item
    }

    let itemWidth = updateItemWidth(); // Initial width
    let maxOffset = (totalItems - itemsPerView) * itemWidth; // Initial maxOffset
    let currentOffset = 0;

    // Function to update the track position
    function updateTrackPosition() {
      carouselTrack.style.transform = `translateX(-${currentOffset}px)`;
    }

    // Function to update the carousel layout when the screen size changes
    function updateCarousel() {
      itemsPerView = getItemsPerView(); // Update items per view
      itemWidth = updateItemWidth(); // Update item width after resize
      maxOffset = (totalItems - itemsPerView) * itemWidth; // Recalculate maxOffset

      if (currentOffset > maxOffset) {
        currentOffset = maxOffset; // Ensure currentOffset does not exceed maxOffset
      }

      updateTrackPosition(); // Reposition the carousel
    }

    // Move carousel left
    function moveLeft() {
      currentOffset -= itemWidth * itemsPerView; // Move by the correct number of items
      if (currentOffset < 0) {
        currentOffset = maxOffset; // Loop to the end if beyond the first item
        carouselTrack.style.transition = "none";
        updateTrackPosition();
        setTimeout(() => {
          carouselTrack.style.transition = "transform 0.5s ease-in-out";
        }, 0);
      } else {
        updateTrackPosition(); // Normal transition
      }
    }

    // Move carousel right
    function moveRight() {
      currentOffset += itemWidth * itemsPerView; // Move by the correct number of items
      if (currentOffset > maxOffset) {
        currentOffset = 0; // Loop to the beginning if beyond the last item
        carouselTrack.style.transition = "none";
        updateTrackPosition();
        setTimeout(() => {
          carouselTrack.style.transition = "transform 0.5s ease-in-out";
        }, 0);
      } else {
        updateTrackPosition(); // Normal transition
      }
    }

    prevButton.addEventListener("click", moveLeft);
    nextButton.addEventListener("click", moveRight);

    window.addEventListener("resize", updateCarousel); // Update carousel on screen resize
    updateCarousel(); // Initial setup
  });

  // carousel api integration
  const gridList = document.getElementById("gridContainer");

  // Async function to fetch data from an API
  async function fetchGridData() {
    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/blog/posts/${name}`
      ); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const responseData = await response.json(); // Convert response to JSON
      const data = responseData.data; // Get the array from the "data" key

      // Use 'map' to create an array of list item elements
      const gridItems = data.map((item) => {
        const div = document.createElement("div");
        div.className = "gridCard"; // Add a class for styling

        // Create the inner content for the list item
        div.innerHTML = `
        <a href="./post/index.html?id=${item.id}"><div class="gridImg" style="background-image:url('${item.media.url}');">
        <div class="gridDescription">
        <h3>${item.title}</h3>
          <p><i class="fa-regular fa-calendar-days"></i> ${item.created}</p>
      </div>
      </div></a>

      
          `;
        return div; // Return the list item element
      });

      // Clear the existing content and append the new list items
      gridList.innerHTML = ""; // Clear "Loading..." or other content
      gridItems.forEach((div) => gridList.appendChild(div)); // Add the new items
    } catch (error) {
      console.error("Error fetching data:", error);
      gridList.innerHTML = "<li>Error loading data</li>"; // Display an error message if fetch fails
    }
  }

  // Fetch the data and update the list
  fetchGridData();
});
