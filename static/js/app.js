// const sample = 'objective_c';
var myData = [];
var myLabels = [];
var myJSON = {};



//function initMain(){
  function newSelection(sample){
   
  d3.json(`/language/${sample}`).then( (respMetadata) => {
    const widthCanvas = 600;
    const heightCanvas = 300;
    const margin = { top:20, bottom:20, left:40, right:20 };
    const graphWidth = widthCanvas - margin.left - margin.right;
    const graphHeight = heightCanvas - margin.top - margin.bottom;

    

    for (let [key,value] of Object.entries(respMetadata) ){
        myJSON = { year:key, v:+value };
        myData.push( myJSON );
    }

    const xScale = d3.scaleBand()
                .domain( myData.map( d => d.year ))
                .range([0,graphWidth])
                .paddingInner(0.1);

    const yScale = d3.scaleLinear()
                .domain([0, d3.max( myData, d => {return d.v; } )])
                .range([graphHeight,0]);
    
    const canvas = d3.select(".lienzo");
    d3.selectAll('svg').remove();
    const svg = canvas.append('svg')
                    .attr('width',widthCanvas)
                    .attr('height',heightCanvas);

    const graph = svg.append('g')
                  .attr('width',graphWidth)
                  .attr('height',graphHeight)
                  .attr('transform',`translate( ${margin.left} , ${margin.top} )`);
                
    const xAxisGroup = graph.append('g')
                          .attr('transform',`translate(0,${graphHeight})`);

    const yAxisGroup = graph.append('g');
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    
    xAxisGroup.call( xAxis );
    yAxisGroup.call( yAxis );


    graph.selectAll('rect').data(myData)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.year))
        .attr('y', d => yScale(d.v) )
        .attr('width', xScale.bandwidth )
        .attr('height', d => ( graphHeight - yScale(d.v) ) )
        .attr('fill','rgb(0,120,240)')
        .on("mouseover", function(d,i,n){
              d3.select(n[i])
                .transition()
                .duration(100)
                .style('fill','rgb(100,120,50)')
                .style("opacity", 0.6)
        })
        .on("mouseout", function(d,i,n){
              d3.select(n[i])
                .transition()
                .duration(100)
                .style('fill','rgb(0,120,240)')
                .style("opacity", 1)
        });
  
    });    

 

}

function init(){
     // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  /* Primero ejecutamos el servidor flask de python
     una vez que la página web es lanzada, se carga el app.js, este ejecuta
     su método init() (ver última línea) y dentro del método init()
     ejecutamos la sentencia siguiente d3.json("/names"), obligando a llamar
     una rutina de flask que nos devuelve un json con los datos de los códigos
     de las muestras para llenar el combo box o select text de nuestra web */
    d3.json("/whatLanguages").then((langNames) => {
        langNames.forEach((lang) => {
          selector
            .append("option")
            .text(lang)
            .property("value", lang);
        });
    });

    
    



}



init();