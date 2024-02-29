import dotenv from "dotenv";

dotenv.config();

// Define a function to get the Google Maps API key
const getGoogleMapsApiKey = () => {
  // Get the API key from the environment variables
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  // If the API key is not provided, throw an error
  if (!apiKey) {
    throw new Error("Google Maps API key is not provided.");
  }
  // Return the API key
  return apiKey;
};

// Export the function
export { getGoogleMapsApiKey };
