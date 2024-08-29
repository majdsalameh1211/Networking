// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://web-final-m-m-2.vercel.app/' // Ensure this matches your backend port
});

export default instance;
