const API_URL = "https://hp-api.onrender.com/api";
// The troll replaces the photo when the API gives none.
const DEFAULT_IMAGE = "./images/troll.jpg";

// The API is external input: escape it before it goes into innerHTML.
function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
