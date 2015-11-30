var cpuStats = require('cpu-stats');
var os = require('os');
var ipc = require('ipc');

var CPU_NUM = os.cpus().length;

function initialData() {
  // generate an array of random data
  var data = [];
  var dataset = [];
  var time = (new Date()).getTime();
  var i;

  for (i = -19; i <= 0; i += 1) {
    data.push({
      x: time + i * 1000,
      y: 0,
    });
  }

  return data;
}

function initialCPUSerie(num) {
  var cpuObj = {};
  var series = [];
  for (var i = 0; i < num; i++) {
    cpuObj.name = `CPU${i}`;
    cpuObj.data = initialData();
    series.push(JSON.parse(JSON.stringify(cpuObj)));
  }

  return series;
}

$(function() {

  $('.github-corner').on('click', function() {
    ipc.send('goto-github', 'https://github.com/John-Lin/etop');
  });

  // Load the fonts
  Highcharts.createElement('link', {
    href: '//fonts.googleapis.com/css?family=Signika:400,700',
    rel: 'stylesheet',
    type: 'text/css',
  }, null, document.getElementsByTagName('head')[0]);

  // Add the background image to the container
  Highcharts.wrap(Highcharts.Chart.prototype, 'getContainer', function(proceed) {
    proceed.call(this);
    this.container.style.background = 'url(http://www.highcharts.com/samples/graphics/sand.png)';
  });

  Highcharts.theme = {
     colors: ["#f45b5b", "#8085e9", "#8d4654", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
        "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
     chart: {
        backgroundColor: null,
        style: {
           fontFamily: "Signika, serif"
        }
     },
     title: {
        style: {
           color: 'black',
           fontSize: '16px',
           fontWeight: 'bold'
        }
     },
     subtitle: {
        style: {
           color: 'black'
        }
     },
     tooltip: {
        borderWidth: 0
     },
     legend: {
        itemStyle: {
           fontWeight: 'bold',
           fontSize: '13px'
        }
     },
     xAxis: {
        labels: {
           style: {
              color: '#6e6e70'
           }
        }
     },
     yAxis: {
        labels: {
           style: {
              color: '#6e6e70'
           }
        }
     },
     plotOptions: {
        series: {
           shadow: true
        },
        candlestick: {
           lineColor: '#404048'
        },
        map: {
           shadow: false
        }
     },

     // Highstock specific
     navigator: {
        xAxis: {
           gridLineColor: '#D0D0D8'
        }
     },
     rangeSelector: {
        buttonTheme: {
           fill: 'white',
           stroke: '#C0C0C8',
           'stroke-width': 1,
           states: {
              select: {
                 fill: '#D0D0D8'
              }
           }
        }
     },
     scrollbar: {
        trackBorderColor: '#C0C0C8'
     },

     // General
     background2: '#E0E0E8'

  };

  // Apply the theme
  Highcharts.setOptions(Highcharts.theme);

  var chart = new Highcharts.Chart({
    chart: {
      renderTo: 'container',
    },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 150,
      title: {text: 'Time'},
    },
    yAxis: {
      title: {text: 'Utilization (%)'},
    },
    tooltip: {
      formatter: function() {
        return `<b>${this.series.name}</b>
        <br/>${Highcharts.dateFormat('%H:%M:%S', this.x)}
        <br/>${Highcharts.numberFormat(this.y, 2)}%`;
      },
    },
    exporting: {enabled: false},
    title: {
      text: 'Per-Core CPU Usage',
    },
    series: initialCPUSerie(CPU_NUM),
  });

  setInterval(function() {
    var options =  { keepHistory: true };

    cpuStats(1000, function(error, result) {
      var coresNum = result.length;
      var timeStamp = (new Date()).getTime();
      var redraw = false;

      for (var i = 0; i < CPU_NUM; i++) {
        if (i === CPU_NUM - 1) {
          var redraw = true;
        }

        chart.series[i].addPoint([timeStamp, result[i].cpu], redraw, true);
      }

    });

  }, 2000);

});
