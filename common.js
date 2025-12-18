// common.js - avatar & small helpers (language removed)

// Load Avatar (Profile Picture or Initials)
function loadAvatar() {
  const savedPic = localStorage.getItem("profilePic");
  const avatarEl = document.getElementById("user-avatar");

  if (!avatarEl) return; // skip if element not present

  if (savedPic) {
    avatarEl.innerHTML = `<img src="${savedPic}" style="width:100%;height:100%;border-radius:50%;">`;
  } else {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    avatarEl.textContent = user.name ? user.name.charAt(0).toUpperCase() : "U";
  }
}

// Set profile picture (store DataURL and refresh avatar)
function setProfilePic(dataUrl) {
  if (!dataUrl) return;
  localStorage.setItem("profilePic", dataUrl);
  loadAvatar();
}

// Clear stored profile picture and revert to initials
function clearProfilePic() {
  localStorage.removeItem("profilePic");
  loadAvatar();
}

// Expose helpers globally if other scripts want to call them
window.common = window.common || {};
window.common.loadAvatar = loadAvatar;
window.common.setProfilePic = setProfilePic;
window.common.clearProfilePic = clearProfilePic;

// Initialize avatar on page load
window.addEventListener("load", () => {
  loadAvatar();
});
