/**
 * @fileoverview AboutPage.js renders the About Page for the HP MRI Web Application. This component
 * provides details about the Penn Image-Guided Interventions (PIGI) Lab and introduces the development
 * team. Version 1.2.2 updates include refining the user interface and integrating additional
 * information about the lab's focus and team contributions.
 *
 * @version 1.2.2
 * @author Benjamin Yoon
 * @date 2024-04-29
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css'; // Importing CSS styles specific to the About Page.

/**
 * Functional component that renders the About Page content.
 * @returns {JSX.Element} The About Page component.
 */
function AboutPage() {
  return (
    <div className="about-page">
      <h1>About</h1>
      {/* Section about the PIGI Lab */}
      <section className="about-section">
        <h2>
          <a href="https://www.pigilab.com/" target="_blank" rel="noopener noreferrer" className="pigilab-link">
            PIGI Lab
          </a>
        </h2>
        <p>
          The Penn Image-Guided Interventions Lab, part of the Departments of Radiology and
          Cancer Biology at the Perelman School of Medicine, University of Pennsylvania,
          focuses on translational research that develops novel imaging approaches and
          advanced therapeutics in interventional radiology, aiming to bridge gaps from
          bench-to-bedside in diagnosis and treatment.
        </p>
      </section>
      {/* Section introducing the team */}
      <section className="author-section">
        <h2>Medcap Computing</h2>
        <h3>Terence P. Gade, MD, PhD</h3>
        <p>Co-Director of PIGI Lab, Assistant Professor of Radiology and Cancer Biology</p>
        <h3>Alexander “Shurik” Zavriyev, MS</h3>
        <p>PhD student, focusing on HP imaging applications in clinical models</p>
        <h3>Team Lead Developer: Benjamin Yoon</h3>
        <p>
          B.S.E. student at the University of Pennsylvania, developing impactful software solutions.
          Benjamin's work showcases his commitment to leveraging technology for transformative purposes.
        </p>
        <h3>Steve Kadlecek</h3>
        <h3>Zihao Zhou</h3>
      </section>
      {/* Link to navigate back to the main application page */}
      <Link to="/" className="back-to-home">Back to HP MRI Web Application</Link>
    </div>
  );
}

export default AboutPage; // Exporting the AboutPage component for routing in App.js.
