/**
 * @fileoverview HomePage.js serves as the central interface for the HP MRI Web Application,
 * providing functionalities such as displaying proton images, adjusting EPSI plots,
 * and offering navigation to the About page. Version 1.2.1 introduces the ability to
 * select voxels for analysis and dynamically adjust the EPSI data threshold via a new slider control.
 *
 * @version 1.2.1
 * @author Benjamin Yoon
 * @date 2024-04-26
 */

import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ControlPanel from './components/ControlPanel';
import ButtonPanel from './components/ButtonPanel';
import PlotComponent from './components/PlotComponent';
import { Link } from 'react-router-dom';

function HomePage() {
  const [imageURL, setImageURL] = useState('');
  const [epsiData, setEpsiData] = useState({
    xEpsi: [], epsi: [], columns: 0, spectralData: [], rows: 0,
    lroFid: 0, lpeFid: 0, lroEpsi: 0, lpeEpsi: 0, plotShift: [0, 0]
  });
  const [showEpsi, setShowEpsi] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [epsiValue, setEpsiValue] = useState(3);
  const [selecting, setSelecting] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('A');
  const [groupA, setGroupA] = useState([]);
  const [groupB, setGroupB] = useState([]);
  const plotContainerRef = useRef(null);
  const [offsetSelectX, setOffsetSelectX] = useState(-263); // X offset for voxel selection
  const [offsetSelectY, setOffsetSelectY] = useState(-98); // Y offset for voxel selection
  const [scaleOffsetX, setScaleOffsetX] = useState(1.335); // Scale factor for columns during selection
  const [scaleOffsetY, setScaleOffsetY] = useState(1.875); // Scale factor for rows during selection
  const [threshold, setThreshold] = useState(0.2); // Initial threshold value for EPSI data filtering

  // Effect hook for initial data fetch and window resize event listener.
  useEffect(() => {
    fetchInitialData();
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Event handlers for UI control components.
  const handleSliderChange = (newValue, contrastValue) => sendSliderValueToBackend(newValue, contrastValue);
  const handleContrastChange = (sliderValue, newContrastValue) => sendSliderValueToBackend(sliderValue, newContrastValue);
  const handleEpsiChange = (newEpsiValue) => { setEpsiValue(newEpsiValue); sendEpsiValueToBackend(epsiValue); }
  const toggleEpsi = (newStatus) => { setShowEpsi(newStatus); sendEpsiValueToBackend(epsiValue); }

  // Event handlers for plot position adjustment.
  const moveLeft = () => setOffsetX(offsetX - 10);
  const moveRight = () => setOffsetX(offsetX + 10);
  const moveUp = () => setOffsetY(offsetY - 10);
  const moveDown = () => setOffsetY(offsetY + 10);
  const resetPlotShift = () => { setOffsetX(0); setOffsetY(0); };

  // File upload handler.
  const handleFileUpload = (files) => {
    const fileList = Array.from(files);
    const formData = new FormData(fileList.map(file => formData.append('files', file)));
    const uploadEndpoint = 'http://127.0.0.1:5000/api/upload';
    fetch(uploadEndpoint, { method: 'POST', body: formData })
      .then(response => response.json())
      .catch(error => console.error('Error uploading files:', error));
  };

  const handleVoxelSelect = (event) => {
    if (!selecting || !plotContainerRef.current) return;
    const plotRect = plotContainerRef.current.getBoundingClientRect();
    const xInsidePlot = event.clientX - plotRect.left - offsetSelectX;
    const yInsidePlot = event.clientY - plotRect.top - offsetSelectY;
    if (xInsidePlot >= 0 && xInsidePlot <= plotRect.width - offsetSelectX - 450 && yInsidePlot >= 0 && yInsidePlot <= plotRect.height - offsetSelectY - 370) {
      const scaleX = (epsiData.columns / plotRect.width) * scaleOffsetX;
      const scaleY = (epsiData.rows / plotRect.height) * scaleOffsetY;
      const column = Math.floor(xInsidePlot * scaleX);
      const row = Math.floor(yInsidePlot * scaleY);
      const voxel = { x: xInsidePlot, y: yInsidePlot, column, row };
      if (selectedGroup === 'A') {
        setGroupA([...groupA, voxel]);
      } else {
        setGroupB([...groupB, voxel]);
      }
    }
  };

  // Handler for changing the threshold
  const handleThresholdChange = (event) => setThreshold(event.target.value);

  // Data fetch functions for proton image and EPSI data.
  const fetchInitialData = () => {
    sendSliderValueToBackend(3, 1);
    sendEpsiValueToBackend(3);
  };

  const toggleSelecting = () => setSelecting(!selecting);

  const displayVoxels = (group) => (
    group.map((voxel, index) => (
      <div key={index}>{`(X: ${voxel.x.toFixed(2)}, Y: ${voxel.y.toFixed(2)}) (Column: ${voxel.column}, Row: ${voxel.row})`}</div>
    ))
  );

  const resetVoxels = () => {
    setGroupA([]);
    setGroupB([]);
  };

  /**
   * Fetches and updates the proton image based on slider input.
   * @param {number} newValue - The new value from the image slice slider.
   * @param {number} newContrastValue - The new value from the contrast slider.
   */
  const sendSliderValueToBackend = (newValue, newContrastValue) => {
    fetch(`http://127.0.0.1:5000/api/get_proton_picture/${newValue}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contrast: newContrastValue }),
    }).then(response => response.blob()).then(imageBlob => setImageURL(URL.createObjectURL(imageBlob)))
      .catch(error => console.error(error));
  };

  /**
   * Fetches and updates the EPSI plot based on slider input.
   * @param {number} newEpsiValue - The new value from the epsi plot slider.
   */
  const sendEpsiValueToBackend = (newEpsiValue) => {
    const url = `http://127.0.0.1:5000/api/get_epsi_data/${newEpsiValue}?threshold=${threshold}`;
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => setEpsiData(data))
      .catch(error => console.error('Error fetching EPSI data:', error));
  };

  // Render the HomePage component.
  return (
    <div className="App">
      <div className="top-panel">
        <ButtonPanel
          onEpsiChange={handleEpsiChange}
          toggleEpsi={toggleEpsi}
          onMoveUp={moveUp}
          onMoveLeft={moveLeft}
          onMoveDown={moveDown}
          onMoveRight={moveRight}
          onResetPlotShift={resetPlotShift}
          onFileUpload={handleFileUpload}
          onThresholdChange={handleThresholdChange}
          toggleSelecting={toggleSelecting}
          selecting={selecting}
          setSelectedGroup={setSelectedGroup}
          selectedGroup={selectedGroup}
          resetVoxels={resetVoxels}
          thresholdValue={threshold}
        />
      </div>
      <ControlPanel
        onSliderChange={handleSliderChange}
        onContrastChange={handleContrastChange}
        onEpsiChange={handleEpsiChange}
        epsiValue={epsiValue}
      />
      <div className="image-and-plot-container" onClick={handleVoxelSelect}>
        <div className="app-content">
        </div>
        <img src={imageURL} alt="Proton" className="proton-image" />
        <div className='plot-container' ref={plotContainerRef} style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}>
          <PlotComponent
            xEpsi={epsiData.xEpsi}
            epsi={epsiData.epsi}
            columns={epsiData.columns}
            spectralData={epsiData.spectralData}
            rows={epsiData.rows}
            lroFid={epsiData.lroFid}
            lpeFid={epsiData.lpeFid}
            lroEpsi={epsiData.lroEpsi}
            lpeEpsi={epsiData.lpeEpsi}
            plotShift={epsiData.plotShift}
            windowSize={windowSize}
            showEpsi={showEpsi}
          />
        </div>
        {selecting && (
          <div className="voxel-display">
            <h3>Group A</h3>
            {displayVoxels(groupA)}
            <h3>Group B</h3>
            {displayVoxels(groupB)}
          </div>
        )}
      </div>
      <footer>
        <Link to="/about">About</Link> • 2024 Universty of Pennsylvania Perelman School of Medicine
      </footer>
    </div>
  );
}

export default HomePage;
