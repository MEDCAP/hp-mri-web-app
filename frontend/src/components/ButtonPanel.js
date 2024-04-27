/**
 * @fileoverview ButtonPanel.js renders a panel containing interactive buttons for various
 * functionalities within the HP MRI Web Application. It allows users to toggle EPSI plot
 * visibility, adjust plot position, save the current state as an image, upload datasets,
 * and adjust the threshold for data display.
 *
 * @version 1.2.1
 * @author Benjamin Yoon
 * @date 2024-04-26
 */

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import saveIcon from './icons/saveicon.png';
import databaseIcon from './icons/database.png'
import right from './icons/right.png';
import up from './icons/up.png';
import left from './icons/left.png';
import down from './icons/down.png';
import reset from './icons/reset.png';

function ButtonPanel({
    toggleEpsi, onMoveUp, onMoveLeft, onMoveDown, onMoveRight, onResetPlotShift,
    onFileUpload, onThresholdChange, toggleSelecting, selecting, setSelectedGroup,
    selectedGroup, resetVoxels, thresholdValue
}) {
    const [isEpsiOn, setIsEpsiOn] = useState(false);
    const fileInputRef = useRef();

    /**
     * Toggles EPSI plot visibility.
     * @param {string} newStatus - 'on' to show the EPSI plot, 'off' to hide it.
     */
    const handleToggleEpsi = (newStatus) => {
        setIsEpsiOn(newStatus === 'on');
        toggleEpsi(newStatus === 'on');
    };

    /**
     * Handles directional movement of the EPSI plot.
     * @param {string} direction - The direction to move the plot ('up', 'down', 'left', 'right').
     */
    const handleMove = (direction) => {
        const movementActions = {
            'up': onMoveUp,
            'down': onMoveDown,
            'left': onMoveLeft,
            'right': onMoveRight
        };
        const action = movementActions[direction];
        if (action) {
            action();
        } else {
            console.error("Invalid direction");
        }
    };

    /**
     * Initiates a screen capture of the current application state and saves as PNG.
     */
    const handleSaveScreenshot = () => {
        html2canvas(document.body).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'screenshot.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    /**
     * Opens file upload dialog.
     */
    const handleFileSelect = () => {
        fileInputRef.current.click();
    };

    /**
     * Handles file selection for upload.
     * @param {Event} event - The file selection event.
     */
    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files) {
            onFileUpload(files);
        }
    };

    return (
        <div className="top-panel">
            <div className="icon-button-container">
                <button className="icon-button" onClick={handleFileSelect}>
                    <img src={databaseIcon} alt="Upload Icon" className="button-icon" />
                </button>
                <span className="button-text">Database</span>
                <input
                    type="file"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />
            </div>

            <div className="icon-button-container">
                <button className="icon-button" onClick={handleSaveScreenshot}>
                    <img src={saveIcon} alt="Save Icon" className="button-icon" />
                </button>
                <span className="button-text">Save</span>
            </div>

            <div className="epsi-radio-buttons">
                <label className="radio-button-label">
                    <input
                        type="radio"
                        name="epsiStatus"
                        value="on"
                        checked={isEpsiOn}
                        onChange={() => handleToggleEpsi('on')}
                    />
                    ON
                </label>
                <label className="radio-button-label">
                    <input
                        type="radio"
                        name="epsiStatus"
                        value="off"
                        checked={!isEpsiOn}
                        onChange={() => handleToggleEpsi('off')}
                    />
                    OFF
                </label>
                <span className="epsi-button-text">EPSI</span>
            </div>

            <div className="button-container">
                <div className="top-button-group">
                    <button className="button" onClick={() => handleMove('up')}>
                        <img src={up} alt="Up" />
                    </button>
                </div>
                <div className="bottom-button-group">
                    <button className="button" onClick={() => handleMove('left')}>
                        <img src={left} alt="Left" />
                    </button>
                    <button className="button" onClick={() => handleMove('down')}>
                        <img src={down} alt="Down" />
                    </button>
                    <button className="button" onClick={() => handleMove('right')}>
                        <img src={right} alt="Right" />
                    </button>
                </div>
                <span className="button-text-shift">Plot shift</span>
            </div>

            <div className="reset-button-container">
                <button className="reset-button" onClick={onResetPlotShift}>
                    <img src={reset} alt="Plot reset" className="button-reset" />
                </button>
                <span className="button-text-reset">Plot reset</span>
            </div>

            <div className="icon-button-container">
                <button className="get-voxels-button" onClick={toggleSelecting}>
                    {selecting ? 'Stop Selecting' : 'Get Voxels'}
                </button>
                <button className="get-voxels-button" onClick={resetVoxels}>
                    {'Reset'}
                </button>
                <div>
                    <label>
                        <input type="radio" checked={selectedGroup === 'A'} onChange={() => setSelectedGroup('A')} />
                        Group A
                    </label>
                    <label>
                        <input type="radio" checked={selectedGroup === 'B'} onChange={() => setSelectedGroup('B')} />
                        Group B
                    </label>
                </div>
                <span className="button-text">Functions</span>
            </div>

            <div className="slider-threshold">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={thresholdValue}
                    onChange={onThresholdChange}
                    className="image-slice-slider"
                />
                <label
                    style={{
                        position: 'absolute',
                        left: '-30px',
                        marginTop: '-20px',
                        color: '#6c6c70',
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontSize: '15px',
                        padding: '2px 5px',
                    }}
                >{thresholdValue}</label>
                <span className="slider-threshold-text">Threshold</span>
            </div>
        </div>
    );
}

export default ButtonPanel; 