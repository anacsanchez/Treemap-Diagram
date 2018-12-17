d3.json("https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json")
  .then(data => createTreemap(data))

const width = 1000;
const height = 800;
const padding = 80;


const title = d3.select("#treemap")
                .append("div")
                .attr("id", "title")
                .text("Video Game Sales")

const description = d3.select("#treemap")
                      .append("div")
                      .attr("id", "description")
                      .text("Top 100 Most Sold Games")

function createTreemap(data) {
  const treemapSvg = d3.select("#treemap")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
  const legend = d3.select("#treemap")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("id", "legend")

  const tooltip = d3.select("body")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("opacity", "0")
  const root = d3.hierarchy(data)

  root.sum(d => d.value)
      .sort((a,b) => b.height - a.height || b.value - a.value )

  const treemap = d3.treemap()
                    .size([width, height])
                    // .paddingOuter(5)

  treemap(root);
  const map = treemapSvg.selectAll("g")
                  .data(root.leaves())
                  .enter()
                  .append("g")
                  .attr("transform", d => `translate(${d.x0},${d.y0})`)
                  .on("mousemove", function(d) {
                    console.log(d3.mouse(this))
                    tooltip.style("opacity", "1")
                            .attr("data-value", d.data.value)
                            .html(`${d.data.name} <br />
                            Platform: ${d.data.category} <br />
                            Value: ${d.data.value}

                            `)
                            .style("top", `${d.y0 + d3.mouse(this)[1] + 10}px`)
                            .style("left", `${d.x0 + d3.mouse(this)[0]}px`)
                  })
                  .on("mouseout", function(d) {
                    tooltip.style("opacity", "0")
                  })

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10.concat(d3.schemePastel1))
                        .domain(root.children.map(d => d.data.name))
  map.append("rect")
      .attr("class", "tile")
      .attr("data-name", d => d.data.name)
      .attr("data-category", d => d.data.category)
      .attr("data-value", d => d.data.value)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => colorScale(d.data.category))
      .attr("stroke", "white")
      .attr("color","black")

  map.append("text")
      .text(d => d.data.name)
      .attr("font-size", ".75em")
      .attr("x", 0)
      .attr("y", 20)

  const legendItems = legend.selectAll("g")
        .data(root.children.map(d => d.data.name))
        .enter()
        .append("g")

  legendItems.append("rect")
              .attr("class", "legend-item")
              .attr("height", 20)
              .attr("width", 20)
              .attr("fill", d => colorScale(d))
              .attr("x", (d,i) => i * 50)
              .attr("y", 0)
              .attr("stroke", "black")

  legendItems.append("text")
              .attr("x", (d,i) => i * 50)
              .attr("y", 50)
              .text(d => d)
}
