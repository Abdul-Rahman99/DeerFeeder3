import React from "react";
import ReactApexChart from "react-apexcharts";
import ReactEcharts from "echarts-for-react";

import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";

const SimplePie2 = ({ myData }) => {
  //   const series = myData ? myData.values : [];

  var option = {
    title: {
      text: "Deers Count",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "Specie Count",
        type: "pie",
        radius: "70%",
        data: myData
          ? myData.values.map((value, index) => ({
              value,
              name: myData.labels[index],
            }))
          : [],
        label: {
          normal: {
            show: true,
            position: "inside",
            formatter: "{d}%",
            color: "#000",
            fontSize: "14",
            fontWeight: "bold",
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return (
    <React.Fragment>
      <ReactEcharts style={{ height: "350px" }} option={option} />
    </React.Fragment>
  );
};

const SimplePie = ({ dataColors }) => {
  var chartPieBasicColors = getChartColorsArray(dataColors);
  const series = [44, 55, 13, 43, 22];
  var options = {
    chart: {
      height: 350,
      type: "pie",
    },
    labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      dropShadow: {
        enabled: true,
      },
    },
    colors: chartPieBasicColors,
  };
  return (
    <ReactApexChart
      dir="ltr"
      className="apex-charts"
      series={series}
      options={options}
      type="pie"
      height={350}
    />
  );
};

const SimpleDonut = ({ dataColors, myData }) => {
  // var chartDonutBasicColors = getChartColorsArray(dataColors);
  // const series = [myData?.birdsspecies || 0, myData?.sunrise || 0, myData?.sunset || 0]
  // Handle cases where myData is null or undefined
  const series = myData ? myData.values : [0]; // Default to an array with a single zero
  const labels = myData ? myData.labels : ["No Data"]; // Default to an array with a single label "No Data"

  var options = {
    chart: {
      height: 200,
      type: "pie",
    },
    labels: labels,
    legend: {
      show: true,
      position: "left",
    },
    dataLabels: {
      dropShadow: {
        enabled: false,
      },
    },
    // colors: chartDonutBasicColors
  };
  return (
    <ReactApexChart
      dir="ltr"
      className="apex-charts"
      series={series}
      options={options}
      type="pie"
      height={200.7}
    />
  );
};

const SimpleDonutSchedules = ({ dataColors, myData }) => {
  var chartDonutBasicColors = getChartColorsArray(dataColors);
  const series = [
    myData?.fixed || 0,
    myData?.sunrise || 0,
    myData?.sunset || 0,
  ];
  var options = {
    chart: {
      height: 300,
      type: "donut",
    },
    labels: ["Fixed", "Sunrise", "Sunset"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      dropShadow: {
        enabled: false,
      },
    },
    colors: chartDonutBasicColors,
  };
  return (
    <ReactApexChart
      dir="ltr"
      className="apex-charts"
      series={series}
      options={options}
      type="donut"
      height={267.7}
    />
  );
};

const UpdateDonut = ({ dataColors }) => {
  var chartDonutupdatingColors = getChartColorsArray(dataColors);
  const series = [44, 55, 13, 33];
  var options = {
    chart: {
      height: 280,
      type: "donut",
    },

    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
    },
    colors: chartDonutupdatingColors,
  };
  return (
    <ReactApexChart
      dir="ltr"
      className="apex-charts"
      series={series}
      options={options}
      type="donut"
      height={267.7}
    />
  );
};

const MonochromePie = ({ dataColors }) => {
  var chartMonochromeColors = getChartColorsArray(dataColors);
  const series = [25, 15, 44, 55, 41, 17];
  var options = {
    chart: {
      height: 300,
      type: "pie",
    },
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    theme: {
      monochrome: {
        enabled: true,
        color: "#405189",
        shadeTo: "light",
        shadeIntensity: 0.6,
      },
    },

    plotOptions: {
      pie: {
        dataLabels: {
          offset: -5,
        },
      },
    },
    title: {
      text: "Monochrome Pie",
      style: {
        fontWeight: 500,
      },
    },
    dataLabels: {
      formatter: function (val, opts) {
        var name = opts.w.globals.labels[opts.seriesIndex];
        return [name, val.toFixed(1) + "%"];
      },
      dropShadow: {
        enabled: false,
      },
    },
    legend: {
      show: false,
    },
  };
  return (
    <ReactApexChart
      dir="ltr"
      className="apex-charts"
      series={series}
      options={options}
      type="pie"
      height={287.7}
    />
  );
};

const GradientDonut = ({ dataColors }) => {
  var chartPieGradientColors = getChartColorsArray(dataColors);
  const series = [44, 55, 41, 17, 15];
  var options = {
    chart: {
      height: 300,
      type: "donut",
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
    },
    legend: {
      position: "bottom",
      formatter: function (val, opts) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex];
      },
    },
    title: {
      text: "Gradient Donut with custom Start-angle",
      style: {
        fontWeight: 500,
      },
    },
    colors: chartPieGradientColors,
  };
  return (
    <ReactApexChart
      dir="ltr"
      className="apex-charts"
      series={series}
      options={options}
      type="donut"
      height={267.7}
    />
  );
};

const PatternedDonut = ({ dataColors }) => {
  var chartPiePatternColors = getChartColorsArray(dataColors);
  const series = [44, 55, 41, 17, 15];
  var options = {
    chart: {
      height: 300,
      type: "donut",
      dropShadow: {
        enabled: true,
        color: "#111",
        top: -1,
        left: 3,
        blur: 3,
        opacity: 0.2,
      },
    },
    stroke: {
      width: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              showAlways: true,
              show: true,
            },
          },
        },
      },
    },
    labels: ["Comedy", "Action", "SciFi", "Drama", "Horror"],
    dataLabels: {
      dropShadow: {
        blur: 3,
        opacity: 0.8,
      },
    },
    fill: {
      type: "pattern",
      opacity: 1,
      pattern: {
        enabled: true,
        style: [
          "verticalLines",
          "squares",
          "horizontalLines",
          "circles",
          "slantedLines",
        ],
      },
    },
    states: {
      hover: {
        filter: "none",
      },
    },
    theme: {
      palette: "palette2",
    },
    title: {
      text: "Favorite Movie Type",
      style: {
        fontWeight: 500,
      },
    },
    legend: {
      position: "bottom",
    },
    colors: chartPiePatternColors,
  };
  return (
    <ReactApexChart
      dir="ltr"
      className="apex-charts"
      series={series}
      options={options}
      type="donut"
      height={267.7}
    />
  );
};
export {
  SimplePie,
  SimpleDonut,
  UpdateDonut,
  MonochromePie,
  GradientDonut,
  PatternedDonut,
  SimplePie2,
};
