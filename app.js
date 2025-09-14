document.querySelector(".upload-btn").addEventListener("click", () => {
  alert("Upload feature coming soon!");
});


// Explore Notes button click action
document.querySelectorAll(".explore-btn").forEach(button => {
  button.addEventListener("click", () => {
    alert("Redirecting to notes page...");
    // yaha pe apna actual "Browse Notes" page ka link de sakte hai
    // example: window.location.href = "browse-notes.html";
  });
});


//*recently added*

// View button click
document.querySelectorAll(".view-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    alert("Opening note preview...");
    // Example: window.location.href = "note-details.html";
  });
});

// Download button click
document.querySelectorAll(".download-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    alert("Downloading note...");
    // Example: trigger download function
  });
});

// View All Notes button
document.querySelector(".view-all-btn").addEventListener("click", () => {
  alert("Redirecting to all notes page...");
  // Example: window.location.href = "all-notes.html";
});


// Upload button functionality
document.querySelector(".cta-btn").addEventListener("click", () => {
  const noteTitle = document.querySelector(".cta-actions input").value.trim();
  if (noteTitle) {
    alert(`Uploading "${noteTitle}"...`);
    // Example: send to server
  } else {
    alert("Please enter a note title before uploading!");
  }
});

// Social links (optional click actions)
document.querySelectorAll(".social-links a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Redirecting to social page...");
    // Example: window.open(link.href, "_blank");
  });
});

