document.getElementById("waitlist-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  
  // Simulate success response (you can replace this with real backend later)
  document.getElementById("form-response").textContent = `Thanks for joining the waitlist, ${email}!`;

  // Optionally clear the input
  this.reset();
});
