var ViewChart = function(viewpopulationData, clickFunction){

  var container = document.getElementById('viewChart');

  var chart = new Highcharts.Chart({

    chart: {
      type: "pie",
      renderTo: container,
      backgroundColor:'rgba(255, 255, 255, 0)'
    },

    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        }
      }
    },

    events: { 
      click: clickFunction
    },

    credits: {
       enabled: false
     },

    title: {
      text: ""
    },

    series: [
    {
      name: "Photo",
      data: viewpopulationData
    }
    ]

  })

}