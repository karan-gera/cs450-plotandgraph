import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const Child2 = ({ width = 600, height = 400 }) => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);

  // Load CSV data and process it to calculate average tip per day
  useEffect(() => {
    d3.csv('tips.csv').then((csvData) => {
      // Group data by 'day' and calculate average tip for each day
      const dayGroups = d3.group(csvData, (d) => d.day);
      const averagedData = Array.from(dayGroups, ([key, values]) => ({
        day: key,
        averageTip: d3.mean(values, (d) => +d.tip) // Calculate average tip
      }));
      setData(averagedData); // Set the processed data
    });
  }, []);

  useEffect(() => {
    if (data.length === 0) return; // Wait for data to load

    // Set up chart dimensions and margins
    const margin = { top: 40, right: 30, bottom: 50, left: 50 }; // Added extra top margin for the title
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.day)) // Use the day names as domain
      .range([0, chartWidth])
      .padding(0.2); // Space between bars

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.averageTip)]) // Max average tip as the domain upper limit
      .range([chartHeight, 0]);

    // Select the SVG element
    const svg = d3.select(svgRef.current);

    // Remove any previous content before re-rendering
    svg.selectAll('*').remove();

    // Append a group element for the bar chart with margins
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

    // Add the bars
    chart
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.day))
      .attr('y', (d) => yScale(d.averageTip))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => chartHeight - yScale(d.averageTip))
      .attr('fill', '#69b3a2'); // Change the bar color to #69b3a2

    // Add x-axis label
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height - 5)
      .style('text-anchor', 'middle')
      .text('Day');

    // Add y-axis label
    svg
      .append('text')
      .attr('x', -height / 2)
      .attr('y', 15)
      .attr('transform', 'rotate(-90)')
      .style('text-anchor', 'middle')
      .text('Average Tip');

    // Add title
    svg
      .append('text')
      .attr('x', chartWidth / 2 + margin.left) // Center the title based on the chart width
      .attr('y', margin.top / 2) // Place title above the chart
      .style('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Bar Chart: Average Tip per Day');
  }, [data, height, width]);

  return (
    <svg ref={svgRef} width={width} height={height}></svg>
  );
};

export default Child2;
