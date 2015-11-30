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
    ipc.send('goto-github', 'https://github.com/John-Lin');
  });

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
