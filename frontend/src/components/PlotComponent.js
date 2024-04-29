/**
 * @fileoverview PlotComponent.js manages the rendering of HP MRI data plots using Plotly.js.
 * It updates dynamically based on prop changes and handles user interactions and window resizing. 
 * Version 1.2.2 introduces enhancements for supporting multiple magnet types.
 *
 * @version 1.2.2
 * @author Benjamin Yoon
 * @date 2024-04-29
 */

import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js';

/**
 * Renders dynamic HP MRI data plots using Plotly.js.
 * @param {Object} props Component properties for configuring the plot.
 */
function PlotComponent({ xValues, data, columns, spectralData, rows, longitudinalScale, perpendicularScale, longitudinalMeasurement, perpendicularMeasurement, plotShift, windowSize, showHpMriData }) {
    const plotContainerRef = useRef(null);

    // Effect hook to redraw plot when dependencies change.
    useEffect(() => {
        updatePlot();
    }, [windowSize, showHpMriData, xValues, data, columns, rows, longitudinalScale, perpendicularScale, longitudinalMeasurement, perpendicularMeasurement, plotShift]);

    /**
     * Updates the plot based on the current state and props.
     */
    const updatePlot = () => {
        try {
            const domain = calculateDomain(longitudinalScale, longitudinalMeasurement, plotShift[0], columns, perpendicularScale, perpendicularMeasurement, plotShift[1], rows);
            const processedData = data.map(value => (value < 0.01 || value > 9.99) ? null : value);
            const gridData = prepareGridData(domain, columns, rows);
            const plotData = showHpMriData ? [...gridData, createLineData(xValues, processedData)] : gridData;

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
 * Calculates the domain for the plot based on specified parameters.
 * @param {number} longitudinalScale Longitudinal fiducial length.
 * @param {number} longitudinalMeasurement Longitudinal EPSI length.
 * @param {number} plotShiftX Horizontal shift amount.
 * @param {number} columns Number of grid columns.
 * @param {number} perpendicularScale Perpendicular fiducial length.
 * @param {number} perpendicularMeasurement Perpendicular EPSI length.
 * @param {number} plotShiftY Vertical shift amount.
 * @param {number} rows Number of grid rows.
 * @returns {Object} Domain object with x and y arrays.
 */
function calculateDomain(longitudinalScale, longitudinalMeasurement, plotShiftX, columns, perpendicularScale, perpendicularMeasurement, plotShiftY, rows) {
    return {
        x: [
            ((longitudinalScale - longitudinalMeasurement) / 2 + plotShiftX * longitudinalMeasurement / columns) / longitudinalScale,
            ((longitudinalScale - longitudinalMeasurement) / 2 + plotShiftX * longitudinalMeasurement / columns) / longitudinalScale + longitudinalMeasurement / longitudinalScale
        ],
        y: [
            ((perpendicularScale - perpendicularMeasurement) / 2 + plotShiftY * perpendicularMeasurement / rows) / perpendicularScale,
            ((perpendicularScale - perpendicularMeasurement) / 2 + plotShiftY * perpendicularMeasurement / rows) / perpendicularScale + perpendicularMeasurement / perpendicularScale
        ]
    };
}

/**
 * Prepares grid data for plotting based on domain and grid size.
 * @param {Object} domain Plot domain.
 * @param {number} columns Grid columns.
 * @param {number} rows Grid rows.
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
 * Creates line data for the HP MRI plot.
 * @param {Array} xValues X data for the plot.
 * @param {Array} processedData Processed Y data for the plot.
 * @returns {Object} Line data object for plotting.
 */
function createLineData(xValues, processedData) {
    return {
        x: xValues,
        y: processedData,
        type: 'scatter',
        mode: 'lines',
        line: { color: '#34C759', width: 1 },
        connectgaps: false,
        xaxis: 'x',
        yaxis: 'y'
    };
}

/**
 * Configures the layout of the plot based on domain and container dimensions.
 * @param {Object} domain Plot domain.
 * @param {number} columns Number of columns in the grid.
 * @param {Array} spectralData Spectral data for width calculation.
 * @param {number} rows Number of rows in the grid.
 * @param {Object} plotContainerRef Reference to the plot container.
 * @param {Array} gridData Grid data for plotting.
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
