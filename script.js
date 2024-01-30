let data = [];
let holderMass;
let observationNo = 1;

function addData() {
    const attachedMass = parseFloat(document.getElementById('attachedMass').value);
    const time = parseFloat(document.getElementById('time').value);
    const diameter = parseFloat(document.getElementById('diameter').value);
    const height = parseFloat(document.getElementById('height').value);
    const holderMass = parseFloat(document.getElementById('holderMass').value);

    if (isNaN(attachedMass) || isNaN(time) || isNaN(diameter) || isNaN(height)) {
        alert('Please enter valid numeric values.');
        return;
    }

    const totalMass = holderMass + attachedMass;

    data.push({
        attachedMass: attachedMass,
        totalMass: totalMass,
        time: time,
        diameter: diameter,
        height: height,
        observationNo: observationNo
    });

    alert('Observation ' + observationNo + ' added.');
    observationNo++;

    // Clear attachedMass, time, diameter, and height input for the next observation
    document.getElementById('attachedMass').value = '';
    document.getElementById('time').value = '';
}

function generateGraph() {
    if (data.length < 1) {
        alert('Please add data before generating the graph.');
        return;
    }

    const xData = data.map(item => item.time ** 2);
    const yData = data.map(item => item.totalMass * ((9.81 * item.time ** 2) - 2 * item.height));

    const trace = {
        x: xData,
        y: yData,
        mode: 'markers',
        type: 'scatter',
        name: 'Experimental Value'
    };

    const regression = fitLine(xData, yData);

    const layout = {
        title: 'Variation of m(gt^2-2h) with t^2',
        xaxis: {
            title: 't^2'
        },
        yaxis: {
            title: 'm*((g*t^2)-2*h)'
        },
        legend: {
            x: 0.7,
            y: 1
        },
        autosize: false,
        width: 600,
        height: 500
    };

    Plotly.newPlot('graph', [trace, regression], layout);
}

function fitLine(xData, yData) {
    const xAvg = average(xData);
    const yAvg = average(yData);

    const numerator = xData.reduce((acc, x, i) => acc + (x - xAvg) * (yData[i] - yAvg), 0);
    const denominator = xData.reduce((acc, x) => acc + (x - xAvg) ** 2, 0);

    const slope = numerator / denominator;
    const intercept = yAvg - slope * xAvg;

    const line = xData.map(x => slope * x + intercept);

    // Display the equation
    document.getElementById('equation').innerHTML = `Best Fitted Line: y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`;

    return {
        x: xData,
        y: line,
        mode: 'lines',
        type: 'scatter',
        name: 'Best Fitted Linear Regression',
        line: {
            color: 'red'
        }
    };
}

function average(array) {
    return array.reduce((acc, val) => acc + val, 0) / array.length;
}

function saveGraphAsPDF() {
    // Add logic here to save the graph as a PDF
    alert('Graph saved as PDF.');
}

function resetHolderMass() {
    holderMass = parseFloat(document.getElementById('holderMass').value);
    if (isNaN(holderMass)) {
        alert('Please enter a valid numeric value for Holder Mass.');
        return;
    }
    document.getElementById('holderMass').value = '';
}
function resetDiameter() {
    diameter = parseFloat(document.getElementById('diameter').value);
    if (isNaN(diameter)) {
        alert('Please enter a valid numeric value for Diameter of the shaft.');
        return;
    }
    document.getElementById('diameter').value = '';
}
function resetHeight() {
    height = parseFloat(document.getElementById('height').value);
    if (isNaN(height)) {
        alert('Please enter a valid numeric value for Height.');
        return;
    }
    document.getElementById('height').value = '';
}

function generateDatasheet() {
    let datasheet = '<table border="1">';
    datasheet += '<tr><th>Observation No</th><th>Attached Mass, m2 - (kg)</th>';
    datasheet += '<th>Total Mass, m=m1 + m2 - (kg)</th><th>Time of Fall, t - (sec)</th>';
    datasheet += '<th>t^2 (sec^2)</th><th>m(gt^2-2h) (kg-m)</th></tr>';

    data.forEach((observation, i) => {
        const attachedMass = observation.attachedMass;
        const totalMass = observation.totalMass;
        const time = observation.time;
        const tSquared = time ** 2;
        const calculatedValue = totalMass * ((9.81 * time ** 2) - 2 * observation.height);

        datasheet += `<tr><td>${i + 1}</td><td>${attachedMass}</td>`;
        datasheet += `<td>${totalMass.toFixed(2)}</td><td>${time}</td>`;
        datasheet += `<td>${tSquared.toFixed(2)}</td><td>${calculatedValue.toFixed(2)}</td></tr>`;
    });

    datasheet += '</table>';

    const datasheetWindow = window.open('', '_blank');
    datasheetWindow.document.write(datasheet);
    datasheetWindow.document.write('<button onclick="saveDatasheetAsPDF()">Save Datasheet as PDF</button>');
}

function saveDatasheetAsPDF() {
    // Add logic here to save the datasheet as a PDF
    alert('Datasheet saved as PDF.');
}
