 var wsServer = 'ws://localhost:8080/';

 $(document).ready(function() {
    $('#showstat4').modal('toggle');
     Connection();
 });

 var ws;
 var SocketCreated = false;
 queue = [];

 function Connection() {
     if (SocketCreated && (ws.readyState == 0 || ws.readyState == 1)) {
         ws.close();
     } else {
         console.log("准备连接到服务器 ...");
         try {
             var Socket = "MozWebSocket" in window ? MozWebSocket : WebSocket;
             ws = new Socket(wsServer);

             SocketCreated = true;
         } catch (ex) {
             console.log(ex, "ERROR");
             return;
         }
         //$("#ToggleConnection").innerHTML = "断开";
         ws.onopen = WSonOpen;
         ws.onmessage = WSonMessage;
         ws.onclose = WSonClose;
         ws.onerror = WSonError;
     }
 };


 function WSonOpen() {
     console.log("连接已经建立。", "OK");
     $('#showstat4').modal('toggle');

 };

 function WSonClose() {
     console.log("连接关闭。", "ERROR");
 };

 function WSonError() {
     console.log("WebSocket错误。", "ERROR");
     Connection();
 };

 function WSonMessage(evt) {
     var data = evt.data;
     if (!data) return;
   //  console.log(data);
     data = JSON.parse(data);
     if (!data) return;
    // console.log(data);
     queue.push(data);
 };


$(function () {
    $(document).ready(function() {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
    
        var chart;
        $('#container').highcharts({
            chart: {
                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function() {
    
                        // set up the updating of the chart each second
                        var series = this.series;
                        setInterval( (function (){
                            while(queue.length > 0){
                                var resultNode = queue.shift()
                                //alert(resultNode["ord"]);
                                var x = resultNode["stime"], // current time
                                    y = resultNode["utime"],
                                    index = parseInt(resultNode["ord"]);
                                series[index].addPoint([x, y], true, true); 
                            }
                        }), 1000);
                    }
                }
            },
            title: {
                text: 'Redis写入性能监控'
            },
            xAxis: {
                title: {
                    text: '测试时间'
                },
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: '耗时(ms)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function() {
                        return '<b>'+ this.series.name +'</b><br/>'+
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Redis1',
                data: (function() {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;
    
                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x: time + i * 1000,
                            y: 0
                        });
                    }
                    return data;
                })()
            },
            {
                name: 'Redis2',
                data: (function() {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;
    
                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x: time + i * 1000,
                            y: 0
                        });
                    }
                    return data;
                })()
            },
            {
                name: 'Redis3',
                data: (function() {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;
    
                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x: time + i * 1000,
                            y: 0
                        });
                    }
                    return data;
                })()
            },
            {
                name: 'Redis4',
                data: (function() {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;
    
                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x: time + i * 1000,
                            y: 0
                        });
                    }
                    return data;
                })()
            },
            {
                name: 'Redis5',
                data: (function() {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;
    
                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x: time + i * 1000,
                            y: 0
                        });
                    }
                    return data;
                })()
            },

            ]
        });
    });
    
});


 