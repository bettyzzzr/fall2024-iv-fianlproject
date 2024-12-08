import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import Dropdown from "./dropdown";

const Heatmap = ({ data, metric, onCellClick }) => {
  const svgRef = useRef();
  const legendRef = useRef(); // For the legend

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const legendSvg = d3.select(legendRef.current);
    svg.selectAll("*").remove();
    legendSvg.selectAll("*").remove();

    const width = 800;
    const height = 400;
    const margin = { top: 50, right: 20, bottom: 30, left: 100 };

    // Filter years from 2003 to 2023 and sort
    const years = Array.from(new Set(data.map((d) => d.Year)))
      .filter((year) => year >= 2003 && year <= 2023)
      .sort((a, b) => a - b);

    // Sort countries by total emission in descending order
    const countries = Array.from(new Set(data.map((d) => d.Country)))
      .sort((a, b) => {
        const totalA = data
          .filter((d) => d.Country === a)
          .reduce((sum, d) => sum + d.Total, 0);
        const totalB = data
          .filter((d) => d.Country === b)
          .reduce((sum, d) => sum + d.Total, 0);
        return totalB - totalA;
      });

    // Scales
    const x = d3.scaleBand().domain(years).range([margin.left, width - margin.right]).padding(0.1);
    const y = d3.scaleBand().domain(countries).range([margin.top, height - margin.bottom]).padding(0.1);

    // Separate color scales
    const color =
      metric === "Population"
        ? d3.scaleSequential(d3.interpolateGreens).domain(d3.extent(data, (d) => +d[metric]))
        : d3.scaleSequential(d3.interpolateBlues).domain(d3.extent(data, (d) => +d[metric]));

    // Create heatmap rectangles
    svg
      .append("g")
      .selectAll("rect")
      .data(data.filter((d) => years.includes(d.Year)))
      .join("rect")
      .attr("x", (d) => x(d.Year))
      .attr("y", (d) => y(d.Country))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", (d) => color(+d[metric]))
      .on("click", (event, d) => onCellClick(d));

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Add y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Add title for y-axis
    svg
      .append("text")
      .attr("x", margin.left - 50)
      .attr("y", margin.top - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text("Countries");

    // Add dynamic legend
    const legendWidth = 300;
    const legendHeight = 20;
    const legendScale = d3
      .scaleLinear()
      .domain(color.domain())
      .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale).ticks(5);

    const gradientId = "heatmap-gradient";

    // Add gradient to legend
    legendSvg
      .append("defs")
      .append("linearGradient")
      .attr("id", gradientId)
      .selectAll("stop")
      .data(color.ticks().map((t, i, nodes) => ({ offset: `${(i / (nodes.length - 1)) * 100}%`, color: color(t) })))
      .join("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color);

    legendSvg
      .append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", `url(#${gradientId})`);

    legendSvg
      .append("g")
      .attr("transform", `translate(0,${legendHeight})`)
      .call(legendAxis);

    legendSvg
      .append("text")
      .attr("x", legendWidth / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text(metric);
  }, [data, metric, onCellClick]);

  return (
    <div>
      <svg ref={svgRef} width={800} height={400}></svg>
      <svg ref={legendRef} width={300} height={50}></svg>
    </div>
  );
};

export default Heatmap;
