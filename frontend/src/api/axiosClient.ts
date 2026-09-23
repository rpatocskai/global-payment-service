import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Global error handler interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ha a backend RFC 9457 ProblemDetail struktúrát küld vissza
    if (error.response && error.response.data) {
      const problemDetail = error.response.data;
      console.error(
        `API Error [${problemDetail.title}]: ${problemDetail.detail}`,
      );

      // TODO It could be display the error in GLOBAL state or toast notification
      return Promise.reject(problemDetail);
    }

    console.error("Network or unknown error:", error.message);
    return Promise.reject({ detail: "Server not available." });
  },
);

export default axiosClient;
