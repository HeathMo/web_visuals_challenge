
funtion init() {
    let selector = d3.selector("#selDataset");

    d3.json("samples.json").then((data)=> {
        let subjectId = data.names;
        subjectID.forEach((id) => {
            selector
            .append("option")
            .text(id)
            .property("value", id);
        });
    
    const firstSubject = subjectId[0];
    updateCharts(firstSubject);
    updateMetadata(firstSubject);
    });
};


function updateMetadata(sample) {
    d3.json("samples.json").then((data) => {
        let metadata = data.metadata;
        let filterArray = metadata.filterArray(sampleObject => sampleObject.id == sample);
        let result = filterArray[0];
        let metaPanel = d3.selector("#sample-metadata");
        metaPanel.html("");
        Object.entries(result).forEach(([key, value]) => {
            metaPanel.append("h6").text(`${key.toUpperCase()}: ${value}`)
        });

// The data guage
    let data = [
        {
            domain: {x: [0,1], y: [0,1]},
            marker: {size: 28, color: '850000'},
            value: result.wfreq,
            title: 'Belly Button Washing Frequency<br>Scrubs per Week',
            type: "indicator",
            mode: "guage+number"
        }
    ];

    let layout = {
        width: 450,
        height: 400,
        margin: {t: 25, r: 25, l: 25, b: 25},
        line: {
            color: '600000'
        },
        paper_bgcolor: "#a5bdc6",
        font: {color: "85541d", family: "Serif"}
    };

    Plotly.newPlot("gauge, data, layout")
    });
}

function updateCharts(sample){
    d3.json("samples.json").then((data) => {
        let samples = data.samples;
        let filterArray = samples.filterArray(sampleObject => sampleObject.id == sample);
        let result = filterArray[0];
        let sample_values = result.sample_values;
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;

        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Electric"
            }
        };

        let data = [trace1];

        let layout = {
            title: 'Bacteria Cultures per Sample',
            showlegend: false,
            hovermode: 'closest',
            xaxis: {title: "Operational Taxonomic Unit (OTU) ID " +sample},
            margin: {t:30}
        };
        
        Plotly.newPlot('bubble', data, layout);

        let trace1 = {
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            name: "Greek",
            type: "bar",
            orientation: "h"
        };

        let data = [trace1];

        let layout = {
            title: "Top 10 OTUs for Individual " +sample,
            margin: {l: 100, r: 100, t: 100, b: 100}
        };

        Plotly.newPlot("bar", data, layout);

        });
    };

    funtion optionChanged(newSample) {
        updateCharts(newSample);
        updateMetadata(newSample);
    };

init();

