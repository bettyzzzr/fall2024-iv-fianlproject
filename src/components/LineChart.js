import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const LineChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    console.log("Raw Data passed to LineChart:", data);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 60, bottom: 50, left: 60 };

    // 确保数据完整性：为缺失值设置默认值
    const preparedData = data.map((d) => ({
      Year: d.Year,
      GDP: isNaN(+d.GDP) ? 0 : +d.GDP,
      Total: isNaN(+d.Total) ? 0 : +d.Total,
    }));
    console.log("Prepared Data:", preparedData);

    // 定义 x 轴 (Year)
    const x = d3
      .scaleTime()
      .domain(d3.extent(preparedData, (d) => new Date(d.Year.toString())))
      .range([margin.left, width - margin.right]);

    // 定义 y 轴 - GDP
    const yGDP = d3
      .scaleLinear()
      .domain([0, d3.max(preparedData, (d) => d.GDP)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // 定义 y 轴 - Total Emission
    const yTotal = d3
      .scaleLinear()
      .domain([0, d3.max(preparedData, (d) => d.Total)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // 绘制 GDP 曲线
    const gdpLine = d3
      .line()
      .x((d) => x(new Date(d.Year)))
      .y((d) => yGDP(d.GDP));

    svg
      .append("path")
      .datum(preparedData)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("d", gdpLine);

    // 绘制 Total Emission 曲线
    const totalLine = d3
      .line()
      .x((d) => x(new Date(d.Year)))
      .y((d) => yTotal(d.Total));

    svg
      .append("path")
      .datum(preparedData)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("d", totalLine);

    // 添加 x 轴
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // 添加 y 轴 - GDP
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yGDP))
      .append("text")
      .attr("x", -margin.left / 2)
      .attr("y", margin.top)
      .attr("transform", "rotate(-90)")
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .text("GDP (Hundred Million)");

    // 添加 y 轴 - Total Emission
    svg
      .append("g")
      .attr("transform", `translate(${width - margin.right},0)`)
      .call(d3.axisRight(yTotal))
      .append("text")
      .attr("x", -margin.right / 2)
      .attr("y", height / 2)
      .attr("transform", "rotate(90)")
      .attr("fill", "blue")
      .attr("text-anchor", "middle")
      .text("Total Emission (MT)");

    // 添加图例
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 150}, ${margin.top})`);

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
      .attr("y", 25)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "blue");

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 37)
      .text("Total Emission")
      .style("font-size", "12px");
  }, [data]);

  return <svg ref={svgRef} width={800} height={400}></svg>;
};

export default LineChart;
