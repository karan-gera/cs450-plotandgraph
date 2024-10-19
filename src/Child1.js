import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const Child1 = ({ width = 600, height = 400 }) => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);

  // Load CSV data
  useEffect(() => {
    d3.csv('tips.csv').then((csvData) => {
      // Parse CSV data to numbers (for total_bill and tip)
      const parsedData = csvData.map((d) => ({
        x: +d.total_bill, // Convert total_bill to number
        y: +d.tip,        // Convert tip to number
      }));
      setData(parsedData); // Set the data state
    });
  }, []);

  useEffect(() => {
    if (data.length === 0) return; // Wait for data to load

    // Set up chart dimensions and margins
    const margin = { top: 40, right: 30, bottom: 40, left: 50 }; // Added extra top margin for the title
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create scales for the scatter plot
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.x)])
      .range([0, chartWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y)])
      .range([chartHeight, 0]);

    // Select the SVG element
    const svg = d3.select(svgRef.current);

    // Remove any previous content before re-rendering
    svg.selectAll('*').remove();

    // Append a group element for the scatter plot with margins
    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Add x-axis
    chart
      .append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale));

    // Add y-axis
    chart.append('g').call(d3.axisLeft(yScale));

    // Add the dots for the scatter plot
    chart
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.x))
      .attr('cy', (d) => yScale(d.y))
      .attr('r', 5) // Circle radius
      .style('fill', '#69b3a2'); // Change the circle color to #69b3a2

    // Add x-axis label
    svg
      .append('text')
      .attr('x', width / 2) // Center horizontally
      .attr('y', height - 5)
      .style('text-anchor', 'middle')
      .text('Total Bill');

    // Add y-axis label
    svg
      .append('text')
      .attr('x', -height / 2)
      .attr('y', 15)
      .attr('transform', 'rotate(-90)')
      .style('text-anchor', 'middle')
      .text('Tip');

    // Add title
    svg
      .append('text')
      .attr('x', chartWidth / 2 + margin.left) // Center the title based on the chart width
      .attr('y', margin.top / 2) // Place title above the chart
      .style('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Scatter Plot: Total Bill vs Tip');
  }, [data, height, width]);

  return (
    <svg ref={svgRef} width={width} height={height}></svg>
  );
};

export default Child1;
