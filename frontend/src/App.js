/**
 * @fileoverview App.js serves as the main routing component for the HP MRI Web Application.
 * It manages navigation between the HomePage and the AboutPage, reflecting updates in version 1.2.2.
 * This version adds support for multiple magnet types, dataset uploading, and enhanced data threshold adjustments.
 * Previous functionalities included navigation setup, app theming, and AWS deployment.
 *
 * @author Benjamin Yoon
 * @date 2024-04-29
 * @version 1.2.2
 */

import './App.css'; // Importing global CSS styles for the app.
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Router components from react-router-dom for SPA routing.
import HomePage from './HomePage'; // Importing the HomePage component.
import AboutPage from './AboutPage'; // Importing the AboutPage component.

/**
 * The main functional component for the HP MRI Web Application that configures routes.
 * @returns {JSX.Element} The router component with defined routes.
 */
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} /> // Route for the HomePage, serving as the default route.
                <Route path="/about" element={<AboutPage />} /> // Route for the AboutPage, providing additional app details.
            </Routes>
        </Router>
    );
}

export default App; // Exporting the App component for use in the main index.js entry file.
