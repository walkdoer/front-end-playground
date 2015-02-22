$(document).ready(function() {

  var clockGroup, fields, formatHour, formatMinute, formatSecond, height, offSetX, offSetY, pi, render, scaleHours, scaleSecsMins, vis, width;

  formatSecond = d3.time.format("%S");

  formatMinute = d3.time.format("%M");

  formatHour = d3.time.format("%H");

  fields = function() {
    var d, data, hour, minute, second;
    d = new Date();
    second = d.getSeconds();
    minute = d.getMinutes();
    hour = d.getHours() + minute / 60;
    return data = [
      {
        "unit": "seconds",
        "text": formatSecond(d),
        "numeric": second
      }, {
        "unit": "minutes",
        "text": formatMinute(d),
        "numeric": minute
      }, {
        "unit": "hours",
        "text": formatHour(d),
        "numeric": hour
      }
    ];
  };

  width = 400;

  height = 200;

  offSetX = 150;

  offSetY = 100;

  pi = Math.PI;

  scaleSecsMins = d3.scale.linear().domain([0, 59 + 59 / 60]).range([0, 2 * pi]);

  scaleHours = d3.scale.linear().domain([0, 11 + 59 / 60]).range([0, 2 * pi]);

  vis = d3.selectAll(".chart").append("svg:svg").attr("width", width).attr("height", height);

  clockGroup = vis.append("svg:g").attr("transform", "translate(" + offSetX + "," + offSetY + ")");

  clockGroup.append("svg:circle").attr("r", 80).attr("fill", "none").attr("class", "clock outercircle").attr("stroke", "black").attr("stroke-width", 2);

  clockGroup.append("svg:circle").attr("r", 4).attr("fill", "black").attr("class", "clock innercircle");

  render = function(data) {
    var hourArc, minuteArc, secondArc;
    clockGroup.selectAll(".clockhand").remove();
    secondArc = d3.svg.arc().innerRadius(0).outerRadius(70).startAngle(function(d) {
      return scaleSecsMins(d.numeric);
    }).endAngle(function(d) {
      return scaleSecsMins(d.numeric);
    });
    minuteArc = d3.svg.arc().innerRadius(0).outerRadius(70).startAngle(function(d) {
      return scaleSecsMins(d.numeric);
    }).endAngle(function(d) {
      return scaleSecsMins(d.numeric);
    });
    hourArc = d3.svg.arc().innerRadius(0).outerRadius(50).startAngle(function(d) {
      return scaleHours(d.numeric % 12);
    }).endAngle(function(d) {
      return scaleHours(d.numeric % 12);
    });
    clockGroup.selectAll(".clockhand").data(data).enter().append("svg:path").attr("d", function(d) {
      if (d.unit === "seconds") {
        return secondArc(d);
      } else if (d.unit === "minutes") {
        return minuteArc(d);
      } else if (d.unit === "hours") {
        return hourArc(d);
      }
    }).attr("class", "clockhand").attr("stroke", "black").attr("stroke-width", function(d) {
      if (d.unit === "seconds") {
        return 2;
      } else if (d.unit === "minutes") {
        return 3;
      } else if (d.unit === "hours") {
        return 3;
      }
    }).attr("fill", "none");
  };

  setInterval(function() {
    var data;
    data = fields();
    return render(data);
  }, 1000);

});
