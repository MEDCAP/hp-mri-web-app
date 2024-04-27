/**
 * @fileoverview PlotComponent.js manages the rendering of EPSI data plots using Plotly.js,
 * dynamically updating to reflect prop changes and handling user interactions and window resizing.
 *
 * @version 1.2.1
 * @author Benjamin Yoon
 * @date 2024-04-26
 */

import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js';

/**
 * Renders dynamic EPSI data plots using Plotly.js.
 * @param {Object} props Component props.
 */
function PlotComponent({ xEpsi, epsi, columns, spectralData, rows, lroFid, lpeFid, lroEpsi, lpeEpsi, plotShift, windowSize, showEpsi }) {
    const plotContainerRef = useRef(null);

    // Redraws plot when dependencies change.
    useEffect(() => {
        updatePlot();
    }, [windowSize, showEpsi, xEpsi, epsi, columns, rows, lroFid, lpeFid, lroEpsi, lpeEpsi, plotShift]);

    /**
     * Updates the plot based on the current state and props.
     */
    const updatePlot = () => {
        try {
            const domain = calculateDomain(lroFid, lroEpsi, plotShift[0], columns, lpeFid, lpeEpsi, plotShift[1], rows);
            const processedEpsi = epsi.map(value => (value < 0.01 || value > 9.99) ? null : value);
            const gridData = prepareGridData(domain, columns, rows);
            const plotData = showEpsi ? [...gridData, createLineData(xEpsi, processedEpsi)] : gridData;

            const layout = configureLayout(domain, columns, spectralData, rows, plotContainerRef, gridData);
            Plotly.react(plotContainerRef.current, plotData, layout, { staticPlot: true });
        } catch (error) {
            console.error('Error updating plot:', error);
        }
    };

    return (
        <div className="plot-container" style={{ width: '100%', height: '100%' }}>
            <div ref={plotContainerRef} style={{ width: '100%', height: '100%' }}></div>
        </div>
    );
}

/**
 * Calculates the domain for the plot based on given parameters.
 * @param {number} lroFid - Longitudinal fiducial length.
 * @param {number} lroEpsi - Longitudinal EPSI length.
 * @param {number} plotShiftX - Shift in the X direction.
 * @param {number} columns - Number of columns in the grid.
 * @param {number} lpeFid - Perpendicular fiducial length.
 * @param {number} lpeEpsi - Perpendicular EPSI length.
 * @param {number} plotShiftY - Shift in the Y direction.
 * @param {number} rows - Number of rows in the grid.
 * @returns {Object} Domain object with x and y arrays.
 */
function calculateDomain(lroFid, lroEpsi, plotShiftX, columns, lpeFid, lpeEpsi, plotShiftY, rows) {
    return {
        x: [
            ((lroFid - lroEpsi) / 2 + plotShiftX * lroEpsi / columns) / lroFid,
            ((lroFid - lroEpsi) / 2 + plotShiftX * lroEpsi / columns) / lroFid + lroEpsi / lroFid
        ],
        y: [
            ((lpeFid - lpeEpsi) / 2 + plotShiftY * lpeEpsi / rows) / lpeFid,
            ((lpeFid - lpeEpsi) / 2 + plotShiftY * lpeEpsi / rows) / lpeFid + lpeEpsi / lpeFid
        ]
    };
}

/**
 * Prepares grid data for plotting based on the domain and grid size.
 * @param {Object} domain - Plot domain.
 * @param {number} columns - Grid columns.
 * @param {number} rows - Grid rows.
 * @returns {Array} Array of grid data for plotting.
 */
function prepareGridData(domain, columns, rows) {
    const gridData = [];
    for (let i = 0; i <= columns; i++) {
        gridData.push({
            type: 'line',
            x0: domain.x[0] + (i / columns) * (domain.x[1] - domain.x[0]),
            y0: domain.y[0],
            x1: domain.x[0] + (i / columns) * (domain.x[1] - domain.x[0]),
            y1: domain.y[1],
            line: { color: 'white', width: 1, dash: 'dash' },
            xref: 'paper', yref: 'paper'
        });
    }
    for (let j = 0; j <= rows; j++) {
        gridData.push({
            type: 'line',
            x0: domain.x[0],
            y0: domain.y[0] + (j / rows) * (domain.y[1] - domain.y[0]),
            x1: domain.x[1],
            y1: domain.y[0] + (j / rows) * (domain.y[1] - domain.y[0]),
            line: { color: 'white', width: 1, dash: 'dash' },
            xref: 'paper', yref: 'paper'
        });
    }
    return gridData;
}

/**
 * Creates line data for the EPSI plot.
 * @param {Array} xEpsi - X data for the plot.
 * @param {Array} processedEpsi - Processed Y data for the plot.
 * @returns {Object} Line data object for plotting.
 */
function createLineData(xEpsi, processedEpsi) {
    return {
        x: xEpsi,
        y: processedEpsi,
        type: 'scatter',
        mode: 'lines',
        line: { color: '#FF00FF', width: 1 },
        connectgaps: false,
        xaxis: 'x',
        yaxis: 'y'
    };
}

/**
 * Configures the layout of the plot based on domain and container dimensions.
 * @param {Object} domain - Plot domain.
 * @param {number} columns - Number of columns in the grid.
 * @param {Array} spectralData - Spectral data for width calculation.
 * @param {number} rows - Number of rows in the grid.
 * @param {Object} plotContainerRef - Reference to the plot container.
 * @param {Array} gridData - Grid data for plotting.
 * @returns {Object} Layout configuration for the plot.
 */
function configureLayout(domain, columns, spectralData, rows, plotContainerRef, gridData) {
    return {
        showlegend: false,
        xaxis: {
            domain: domain.x,
            range: [0, columns * spectralData[0][0].length],
            showgrid: false,
            zeroline: false,
            showline: false,
            showticklabels: false,
            fixedrange: true
        },
        yaxis: {
            domain: domain.y,
            range: [0, rows],
            showgrid: false,
            zeroline: false,
            showline: false,
            showticklabels: false,
            fixedrange: true
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 },
        width: plotContainerRef.current.offsetWidth,
        height: plotContainerRef.current.offsetHeight,
        shapes: gridData.map(line => ({
            ...line,
            line: { ...line.line, color: 'rgba(255, 255, 255, 0.5)' }
        }))
    };
}

export default PlotComponent;
