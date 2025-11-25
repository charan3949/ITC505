// Simple sanitization to help prevent basic XSS in this lab
function sanitizeInput(value) {
  if (!value) return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

function isValidEmail(email) {
  // Basic email regex for demo purposes
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registrationForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Clear previous errors and message
    const errorIds = [
      "firstNameError",
      "lastNameError",
      "emailError",
      "passwordError",
      "confirmPasswordError"
    ];
    errorIds.forEach(id => {
      document.getElementById(id).textContent = "";
    });
    const formMessage = document.getElementById("formMessage");
    formMessage.textContent = "";

    // Raw values (for validation)
    const rawFirstName = document.getElementById("firstName").value.trim();
    const rawLastName = document.getElementById("lastName").value.trim();
    const rawEmail = document.getElementById("email").value.trim();
    const rawPassword = document.getElementById("password").value;
    const rawConfirmPassword = document.getElementById("confirmPassword").value;

    // Sanitized values (for safe display)
    const firstName = sanitizeInput(rawFirstName);
    const lastName = sanitizeInput(rawLastName);
    const email = sanitizeInput(rawEmail);

    let hasError = false;

    // Empty checks
    if (!rawFirstName) {
      document.getElementById("firstNameError").textContent = "First name is required.";
      hasError = true;
    }
    if (!rawLastName) {
      document.getElementById("lastNameError").textContent = "Last name is required.";
      hasError = true;
    }
    if (!rawEmail) {
      document.getElementById("emailError").textContent = "Email is required.";
      hasError = true;
    } else if (!isValidEmail(rawEmail)) {
      document.getElementById("emailError").textContent = "Please enter a valid email address.";
      hasError = true;
    }

    if (!rawPassword) {
      document.getElementById("passwordError").textContent = "Password is required.";
      hasError = true;
    } else if (rawPassword.length < 8) {
      document.getElementById("passwordError").textContent = "Password must be at least 8 characters.";
      hasError = true;
    }

    if (!rawConfirmPassword) {
      document.getElementById("confirmPasswordError").textContent = "Please confirm your password.";
      hasError = true;
    } else if (rawPassword !== rawConfirmPassword) {
      document.getElementById("confirmPasswordError").textContent = "Passwords do not match.";
      hasError = true;
    }

    // Simple XSS pattern block (for demo)
    const combinedLower = (rawFirstName + rawLastName + rawEmail).toLowerCase();
    if (
      combinedLower.includes("<script") ||
      combinedLower.includes("onerror=") ||
      combinedLower.includes("javascript:")
    ) {
      document.getElementById("firstNameError").textContent =
        "Potentially dangerous characters detected in input.";
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Safe success message
    formMessage.textContent =
      "Registration successful for " + firstName + " " + lastName + " (" + email + ").";

    // Optionally reset form (uncomment if needed)
    // form.reset();
  });
});
