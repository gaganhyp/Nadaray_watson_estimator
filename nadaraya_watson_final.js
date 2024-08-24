//fully implementation of adding data conconrently to the graph  and calcutaing 

//nadaray watson estimator

// -both price and nadaray envolpe array 

const url = "wss://as.binomo.com/";

const ws = new WebSocket(url);
//create date constructor

const data_ = Array(1);

const ctx = document.getElementById('chart').getContext('2d');

var dataFirst = {

    label: "#1",

    data: [],

    lineTension: 0,

    fill: false,

    borderColor: 'rgba(255, 26, 104, 6)'

  };

var dataSecond = {

    label: "#2",

    data: [],

    lineTension: 0,

    fill: false,

  borderColor: 'green'

  };

var speedData = {

  labels: [],

  datasets: [dataFirst, dataSecond]

};

var chartOptions = {

  animation : false,

  scales: {

          x:{

            min:0, 

            max: 1000

             },

          y: {

            beginAtZero: false,

            

          }

        },

  legend: {

    display: true,

    position: 'top',

    labels: {

      boxWidth: 80,

      fontColor: 'black'

    }

  }

};

var chart = new Chart(ctx, {

  type: 'line',

  data: speedData,

  options: chartOptions

});

function pop_second_arr(){

chart.data.datasets.pop();

//console.log("hh");

}

function addData(val){

  chart.data.datasets[0].data.push(val);

  chart.data.labels.push(".");

  console.log(chart.data.datasets[0].data.length);

  if(chart.data.datasets[0].data.length>=500){

   console.log(chart.data.datasets[0].data.shift());

   chart.data.labels.shift();

  }

  if(chart.data.datasets[0].data.length > 0){

   pop_second_arr();

    var data_ = calc_nadaray(chart.data.datasets[0].data);

    //console.log(calc_nadaray(chart.data.datasets[0]));

    var new_ = {

    label: "#3",

    data: data_,

    lineTension: 0,

    fill: false,

  borderColor: 'green'

  };

   //console.log(new_);

   chart.data.datasets.push(new_);

  }

  chart.update();

}

function getData(){

ws.addEventListener('open', (event) => {

  console.log("connected");

  ws.send("{\"action\":\"subscribe\",\"rics\":[\"Z-CRY/IDX\"]}");

  ws.onmessage = function(d){

  //console.log(typeof d.data); = string

  var raw = JSON.parse(d.data).data[0].assets;

  if(Object.prototype.toString.call(raw) == '[object Array]'){

   // console.log(raw[0].rate);

   addData(raw[0].rate); //price data

  }

 }

});

}

function calc_nadaray(src){ 

  var res = [];

  var h = 10;

  var y2 = 0;

  var y1 =0; 

  var y1_d = 0;

  //

  n = src[src.length-1]

  //console.log(Math.min(199,n-1));

  for(var i = 0; i <= Math.min(src.length-1); i++){

      //console.log(n);

      var sum = 0;

      var sumw = 0;  

      for(var j = 0; j <= Math.min(src.length-1);j++){

          w = Math.exp(-(Math.pow(i-j,2)/(h*h*2)));

          //console.log(Math.exp(-(Math.pow(i-j,2)/(h*h*2)))); //OK

          sum += src[j]*w;

          sumw += w;

          }//end of second loop

        y2 = sum/sumw;

        //res.push(y1);

        d = y2 - y1;

        res.push(y2);

        y1 = y2;

        y1_d = d;

  }//end of first loop

  //console.log(res);

  return res;

}

getData();
