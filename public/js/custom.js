async function showChartEvent() {
    $('#show').click(function() {
        var token = $('#token').val()
        var seriesData = []
        $.ajax({
            url: `/chart_data/${token}.json`,
            method: 'get',
            async: false,
            success: function(res) {
                seriesData = res
            }
        })
        var options = {
            series: seriesData,
    
            chart: {
                height: 800,
                width: 1200,
                type: 'line',
                zoom: {
                    enabled: false
                },
                animations: {
                    enabled: false
                },
            },
            title: {
                text: 'CandleStick Chart',
                align: 'left'
            },
            stroke: {
                width: [1, 1]
            },
            tooltip: {
                shared: true,
                custom: [function ({ seriesIndex, dataPointIndex, w }) {
                    return w.globals.series[seriesIndex][dataPointIndex]
                }, function ({ seriesIndex, dataPointIndex, w }) {
                    var o = w.globals.seriesCandleO[seriesIndex][dataPointIndex]
                    var h = w.globals.seriesCandleH[seriesIndex][dataPointIndex]
                    var l = w.globals.seriesCandleL[seriesIndex][dataPointIndex]
                    var c = w.globals.seriesCandleC[seriesIndex][dataPointIndex]
                    return (
                        ''
                    )
                }]
            },
            xaxis: {
                type: 'datetime'
            },
            yaxis: {
                type: 'numeric'
            }
        };
        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
    })
}
async function getTokens() {
    var tokens
    $.ajax({
        url: '/list-token',
        method: 'get',
        async: false,
        success: function(res) {
            tokens = res.tokens;
        }
    });
    tokens.forEach(element => {
        console.log(element)
        $('#token').append(`<option value="${element}">${element}</option>`)
    });
    $.notify('loaded', 'success');
}
function addTokenEvent() {
    $('#add-token').click(function() {
        var name = $('#token-name').val()
        var link = $('#link-coingecko').val()
        $.ajax({
            url: '/add-token',
            method: 'get',
            data: {name: name, link: link},
            success: function(res) {
                $.notify('add-token', 'success');
                window.location.reload()
            }
        })
    })
}
function showChart2Event() {
    $('#show2').click(function() {
        $('#chart').html('')
        const chart = LightweightCharts.createChart($('#chart')[0], { width: 1200, height: 700 });
        series = []
        var token = $('#token').val()
        $.ajax({
            url: `/chart_data/${token}.json`,
            method: 'get',
            async: false,
            success: function(res) {
                series = res
            }
        })
        var colors = ['blue', 'red', 'green', 'black']
        for(var i=0;i<series.length;i++) {
            const lineSeries = chart.addLineSeries({ color: colors[i], lineWidth: 1 });
            data = []
            series[i].data.forEach(e => {
                data.push({
                    value: e.y,
                    time: e.x
                })
            })
            lineSeries.setData(data);
        }

        chart.timeScale().fitContent();
    })
}
$(document).ready(function() {
    getTokens();
    addTokenEvent()
    showChartEvent()
    showChart2Event()
})
