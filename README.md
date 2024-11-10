Earth App 🌍
Earth App is an educational app that provides real-time information about Earth and environmental phenomena, including weather, earthquakes, air quality, and more. The app utilizes various APIs to deliver a comprehensive, interactive experience for users interested in learning about Earth's environmental data.

Table of Contents
Features
Installation
Usage
Technologies Used
Contributing
License
Features
Real-Time Weather Information: Get current weather details for any location.
Earthquake Alerts: View recent earthquakes around the world.
Air Quality Index: Access air quality levels in various cities and understand potential health impacts.
Geolocation: Automatically detect the user’s location to provide relevant environmental data.
Interactive Maps: Explore data points on an interactive map for a more immersive experience.
Installation
Prerequisites
Ensure you have Node.js and npm installed on your system.
You will need API keys from:
OpenWeather API for weather information.
USGS Earthquake API for earthquake data.
AirVisual API for air quality index data.
Clone the Repository
To clone this repository, open your terminal and run:

bash
Copy code
git clone https://github.com/sucheta-acharya/Earth_App.git
cd Earth_App
Install Dependencies
Install the necessary npm packages:


```npm install```
Set Up Environment Variables
Create a .env file in the root directory and add the following API keys:


```OPENWEATHER_API_KEY=your_openweather_api_key
USGS_API_KEY=your_usgs_api_key
AIRVISUAL_API_KEY=your_airvisual_api_key```
Start the Application
Run the app locally:

```npm start```
The app should now be running on http://localhost:3000.

Usage
Open the App: Once started, navigate to http://localhost:3000 in your browser.
Explore Features:
Use the search feature to find information on specific locations.
View real-time weather details, recent earthquake activity, and air quality data.
Explore the interactive map for geolocation-based insights.
Customize Data: Adjust settings to view data for specific locations, dates, and environmental parameters.
Technologies Used
Frontend: React.js
Backend: Node.js, Express.js
APIs:
OpenWeather API
USGS Earthquake API
AirVisual API
Mapping & Geolocation: Leaflet.js
Contributing
We welcome contributions! If you’d like to contribute to Earth App, please follow these steps:

Fork the repository.
Create a new branch: git checkout -b feature-name.
Make your changes and commit them: git commit -m 'Add some feature'.
Push to the branch: git push origin feature-name.
Open a pull request to the main branch.
Please make sure to test your changes before submitting a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for more details.