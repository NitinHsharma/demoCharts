
function csvToArray(str, delimiter = ",") {
  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");

  // Map the rows
  // split values from each row into an array
  // use headers.reduce to create an object
  // object properties derived from headers:values
  // the object passed as an element of the array

  const filterData = rows.filter((item, index) => index % 10 === 0);
  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    console.log(values);
    if(values.length ==- 0) {
      return {};
    }
    const el = headers.reduce(function (object, header, index) {
      header = header.toLowerCase();
      if (!['time', 'open', 'date', 'close', 'high', 'close', 'low'].includes(header)) {
        return object;
      }
      if (!values[index]) {
        return object;
      }
      if (header == 'time') {
        object.time = timeToLocal(object['date'] + 'T'+ values[index]);
      } else {
        object[header] = ['open', 'high', 'close', 'low'].includes(header) ? parseFloat(values[index]) : values[index];
      }

      return object;
    }, {});
    if (Object.keys(el).length > 0) {
      return el;
    }
    // return el;
  });
  // return the array
  console.log(arr);
  return arr.filter(function(item){
    if (item && Object.keys(item).length > 0) {
      return item;
    }
    });
}


function timeToLocal(time) {
  const localTime = new Date(time);
  return localTime.getTime() / 1000;
}

// this is getting called from HTML directly
function createGraph() {
  const csvFile = document.getElementById('file');
  console.log(csvFile);
  if (!csvFile || !csvFile.files || csvFile.files.length == 0) {
    alert('Please select a file to create graph');
    return;
  }
  const loading = document.querySelector('#loading');
  loading.style.display = 'block';


  const input = csvFile.files[0];
  const reader = new FileReader();
  const chart = LightweightCharts.createChart(document.body, {
    height: screen.availHeight - 200,
    
    isUTCTimestamp: true,
    timeScale: {
      timeVisible: true
    },
    trackingMode: {
      track: true
    }
  });

  const candlestickSeries = chart.addCandlestickSeries({});

  reader.onload = function (e) {
    const text = e.target.result;
    const data = csvToArray(text);
    console.log(data);
    candlestickSeries.setData(data);
    chart.timeScale().fitContent();
  };

  reader.onloadend= function() {
    // hide loading indicator
    loading.style.display = 'none';
  };

  reader.readAsText(input);
}
