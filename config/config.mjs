const API_BASE_URL = window.location.origin.includes("5500")
  ? "http://localhost:3000"
  : "http://13.206.194.247:3000"; // your EC2 IP or domain

export default API_BASE_URL;