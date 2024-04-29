# HP MRI Web Application

## Introduction
The Hyperpolarized (HP) Magnetic Resonance Imaging (MRI) Web Application, spearheaded by Benjamin Yoon and Medcap Computing at the PIGI Lab (University of Pennsylvania Perelman School of Medicine), serves as a sophisticated tool for the visualization and analysis of HP MRI data, including Echo Planar Spectroscopic Imaging (EPSI). This application features an intuitive user interface that allows users to interactively adjust image slices, contrast levels, and dataset parameters, and visualize HP MRI data grids overlaid on proton images.

## Features
### Version 1.0.0
- **Initial Release:** Interactive sliders for adjusting image slices and contrast, alongside real-time HP MRI data grid overlays on proton images.

### Version 1.0.1
- **Responsive Design:** Dimensions automatically adjust based on screen resolution.
- **Enhanced Contrast Control:** Expanded range of contrast settings enhances image visualization.

### Version 1.1.0
- **Interactive Plot Shift Controls:** Introduces buttons and directional arrows for shifting the overlay plot relative to the proton image, including a reset button to default positioning.
- **HP MRI Data Axis Management:** Adds functionality for managing the HP MRI Data axis with grid retention; grid and image displayed by default.
- **Export Functionality:** Enables saving the current view as a PNG file.

### Version 1.1.1
- **Operational Enhancements:** Improves application functionality.
- **About Page and Branding Updates:** Adds an About page, updates the application's logo and title, and includes copyright information for Benjamin Yoon and PIGI Lab/Medcap Computing.
- **Data Management:** Enhances dataset upload capabilities for processing and visualization.

### Version 1.2.0
- **UI Refinement:** Enhances the user interface to improve aesthetics and usability, focusing on intuitive design and user interaction.
- **Official Title:** Named the Hyperpolarized (HP) Magnetic Resonance (MRI) Web Application.

### Version 1.2.1
- **Voxel Selection Tool:** Introduces the ability to select and highlight individual voxels within the HP MRI Data grid for detailed analysis.
- **Threshold Adjustment:** Implements a slider to dynamically adjust the minimum peak value of the HP MRI data visualization.

## Installation (Local)
To install the HP MRI Web Application locally, execute the following commands in your terminal:

```bash
# Clone the repository
git clone https://github.com/benjaminyoon/hp-mri-web-application-benjaminyoon.git hp-mri-web-app-local

# Navigate to the backend directory
cd hp-mri-web-app-local
cd backend

# Create and activate the virtual environment
python -m venv .venv
# On MacOS
source .venv/bin/activate
# On Windows
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Navigate to the frontend directory
cd ../frontend

# Install frontend dependencies
npm install
```

## Usage
To start the application locally, follow these steps each time you wish to run it:

```bash
# Start the backend server
cd hp-mri-web-app-local
cd backend
source .venv/bin/activate # On MacOS, or on Windows: .venv\Scripts\activate
python hp_mri_app.py

# In a separate terminal, start the frontend
cd hp-mri-web-app-local
cd frontend
npm start
```

Navigate to http://localhost:3000 in your web browser to access the HP MRI Web Application.

## License
This project is licensed under the MIT License - React (software)

## About PIGI Lab
PIGI Lab, located at the University of Pennsylvania Perelman School of Medicine, is dedicated to pioneering MRI technology and crafting innovative solutions across various disciplines. Discover more at www.pigilab.com.

## Author
Benjamin Yoon, the lead developer of the HP MRI Web Application and a B.S.E. student at the University of Pennsylvania, oversees the development and enhancements of the application. For inquiries or suggestions, please contact:

- **Email:** yoonb2002@gmail.com

© 2024 University of Pennsylvania Perelman School of Medicine, PIGI Lab. All rights reserved.
