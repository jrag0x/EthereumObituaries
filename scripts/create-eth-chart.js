function createChart(priceData, obituariesData) {
    // Add validation right after receiving the data
    function validatePriceData(data) {
        // Log the last few entries
        const lastEntries = data.slice(-5);
        console.log('Last 5 price entries:', lastEntries);

        // Check for proper date sorting
        for(let i = 1; i < data.length; i++) {
            if(new Date(data[i].date) < new Date(data[i-1].date)) {
                console.warn('Date ordering issue detected:', {
                    previous: data[i-1],
                    current: data[i]
                });
            }
        }

        // Log the total number of entries
        console.log('Total price entries:', data.length);

        return data;
    }
    // Validate the data before processing
    priceData = validatePriceData(priceData);




    const priceSeries = priceData.map(d => [Date.parse(d.date), d.price]);
    //const latestPrice = priceSeries[priceSeries.length - 1][1];

    // Include all obituaries, even those without corresponding price data
    const obituarySeries = obituariesData.map(d => {
        const priceEntry = priceData.find(p => p.date === d.date);
        return {
            x: Date.parse(d.date),
            y: priceEntry ? priceEntry.price : null,
            statement: d.statement,
            author: d.author,
            source: d.source,
            link: d.link,
            isWebpageUp: d.isWebpageUp
        };
    });

    // Determine the earliest date for the x-axis range - always use the first price data point
    const earliestPriceDate = priceData.length ? Date.parse(priceData[0].date) : null;
    const minDate = earliestPriceDate;

    // Fetch latest ETH price from CoinGecko API
    async function fetchLatestPrice() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
            const data = await response.json();
            return data.ethereum.usd;
        } catch (error) {
            console.error('Error fetching ETH price:', error);
            return null;
        }
    }

    Highcharts.chart('ethChart', {
        chart: {
            backgroundColor: '#222222',
            events: {
                load: function () {
                    this.series[0].graph.attr({
                        filter: 'url(#glow)'
                    });

                    // Add centered watermark text
                    this.watermark = this.renderer.text('EthereumObituaries.com', 0, 0)
                        .attr({
                            zIndex: 0,
                            align: 'center'
                        })
                        .css({
                            color: '#ffffff',
                            opacity: 0.1,
                            fontSize: '24px',
                            fontWeight: 'bold'
                        })
                        .add();

                    // Position the watermark
                    this.watermarkUpdate();
                },
                redraw: function() {
                    // Reposition the watermark on redraw
                    this.watermarkUpdate();
                }
            }
        },
        title: {
            text: null // Remove the chart title
        },
        subtitle: {
            text: null // Remove the chart subtitle
        },
        xAxis: {
            type: 'datetime',
            labels: {
                formatter: function () {
                    const year = Highcharts.dateFormat('%Y', this.value);
                    return `<a href="#year-${year}" style="color: white; text-decoration: none;">${year}</a>`;
                },
                useHTML: true,
                style: {
                    color: '#ffffff'
                }
            },
            min: minDate,
            // Set tickInterval to one year in milliseconds
            tickInterval: 365 * 24 * 3600 * 1000,
            startOnTick: false,
            endOnTick: false,
            tickPositioner: function () {
                // Create an array of dates for the 1st of January of each year
                const positions = [];
                let tick = new Date(this.dataMin);
                tick.setDate(1);
                tick.setMonth(0); // January
                while (tick <= this.dataMax) {
                    positions.push(tick.getTime());
                    tick.setFullYear(tick.getFullYear() + 1);
                }
                return positions;
            }
        },
        yAxis: {
            type: 'logarithmic',
            min: 0.4,
            title: {
                text: 'ETH Price',
                style: {
                    color: '#ffffff'
                }
            },
            labels: {
                formatter: function() {
                    return '$' + this.value;
                },
                style: {
                    color: '#ffffff'
                }
            },
            gridLineColor: '#444444',
            minorTickInterval: null,
            tickInterval: 0.5,
            plotLines: [{
                id: 'latest-price',
                color: '#FFA500',
                width: 1,
                //value: latestPrice, // Replace with API data
                dashStyle: 'shortdash',
                label: {
                    text: '', // Initialize empty label
                    align: 'left',
                    style: {
                        color: '#FFA500',
                        fontWeight: 'bold'
                    }
                },
                zIndex: 5
            }]
        },
        tooltip: {
            useHTML: true,
            backgroundColor: '#333333',
            borderRadius: 5,
            style: {
                pointerEvents: 'auto',
                padding: '0px',
                color: '#ffffff'
            },
            formatter: function() {
                let displayDate = this.x;
                if (this.point.statement === "Sidechains: the coming death of altcoins and ethereum.") {
                    displayDate = Date.parse("2014-04-09");
                }
                if (this.point.statement === "Why Ethereum is dead in the water.") {
                    displayDate = Date.parse("2014-10-15");
                }

                if (this.series.name === 'Ethereum Price') {
                    return false; // Disable tooltip for Ethereum Price
                } else {
                    const price = this.point.y !== null ? `<div class="highcharts-tooltip-price">$${this.point.y.toFixed(2)} ETH</div>` : '<div class="highcharts-tooltip-price">N/A</div>';
                    return `
                        <div class="highcharts-tooltip-box">
                            ${price}
                            <div class="highcharts-tooltip-date">${Highcharts.dateFormat('%Y-%m-%d', displayDate)}</div>
                            <div class="highcharts-tooltip-statement">
                                <a href="${this.point.link}" target="_blank">${this.point.statement}</a>
                            </div>
                            <div class="author-source-container">
                                <span class="highcharts-tooltip-author">— ${this.point.author}</span>
                                <span class="highcharts-tooltip-source">(${this.point.source})</span>
                            </div>
                        </div>`;
                }
            }
        },
        series: [
            {
                name: 'Ethereum Price',
                data: priceSeries,
                type: 'line',
                color: {
                    linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
                    stops: [
                        [0, '#FFA500'],
                        [1, '#FF4500']
                    ]
                },
                marker: {
                    enabled: false
                },
                enableMouseTracking: false,
                states: {
                    inactive: {
                        opacity: 1
                    }
                }
            },
            {
                name: 'Obituaries',
                data: obituarySeries,
                type: 'scatter',
                color: 'red',
                marker: {
                    symbol: `url(assets/headstone-emoji.svg)`,
                    radius: 6,
                    states: {
                        hover: {
                            enabled: true,
                            radiusPlus: 0,
                        }
                    }
                },
                states: {
                    inactive: {
                        opacity: 1
                    }
                },
                cursor: 'pointer',
                point: {
                    events: {
                        click: function() {
                            window.open(this.link, '_blank');
                        }
                    }
                }
            }
        ],
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        }
    }, function(chart) { // on complete
        chart.watermarkUpdate = function() {
            if (this.watermark) {
                var bbox = this.watermark.getBBox();
                this.watermark.attr({
                    x: this.plotLeft + (this.plotWidth / 2),
                    y: this.plotTop + (this.plotHeight / 2) + (bbox.height / 4)
                });
            }
        };
        // Update the chart plot line with the fetched ETH price
        fetchLatestPrice().then(latestPrice => {
            if (latestPrice) {
                chart.yAxis[0].update({
                    plotLines: [{
                        id: 'latest-price',
                        color:'#FFA500',
                        width: 1,
                        dashStyle: 'shortdash',
                        value: latestPrice,
                        label: {
                            text: `$${latestPrice.toFixed(2)}`,
                            align: 'left',
                            style: {
                                color: '#FFA500',
                                fontWeight: 'bold'
                            }
                        }
                    }]
                });
            }
        });
    });
}
