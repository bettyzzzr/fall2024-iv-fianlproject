import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const LineChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 60, bottom: 50, left: 60 };

    // Define x-axis (Year)
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.Year)))
      .range([margin.left, width - margin.right]);

    // Define y-axis for GDP
    const yGDP = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.GDP)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Define y-axis for Total Emission
    const yTotal = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.Total)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Line generator for GDP
    const gdpLine = d3
      .line()
      .x((d) => x(new Date(d.Year)))
      .y((d) => yGDP(+d.GDP));

    // Line generator for Total Emission
    const totalLine = d3
      .line()
      .x((d) => x(new Date(d.Year)))
      .y((d) => yTotal(+d.Total));

    // Draw GDP line (black)
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("d", gdpLine);

    // Draw Total Emission line (blue)
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("d", totalLine);

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Add y-axis for GDP
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yGDP))
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -50)
      .attr("transform", "rotate(-90)")
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .text("GDP (Trillions)");

    // Add y-axis for Total Emission
    svg
      .append("g")
      .attr("transform", `translate(${width - margin.right},0)`)
      .call(d3.axisRight(yTotal))
      .append("text")
      .attr("x", height / 2)
      .attr("y", 40)
      .attr("transform", "rotate(-90)")
      .attr("fill", "blue")
      .attr("text-anchor", "middle")
      .text("Total Emission (MT)");

    // Add legend
    const legend = svg.append("g").attr("transform", `translate(${width - 200}, ${margin.top})`);

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "black");
    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 12)
      .text("GDP")
      .style("font-size", "12px");

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 20)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "blue");
    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 32)
      .text("Total Emission")
      .style("font-size", "12px");
  }, [data]);

  return <svg ref={svgRef} width={800} height={400}></svg>;
};

export default LineChart;
