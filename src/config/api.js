// Vercel'deki Environment Variable ismine (REACT_APP_API_BASE_URL) duyarlı hale getirdik
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://check-system-backend.onrender.com';

export default API_BASE_URL;
