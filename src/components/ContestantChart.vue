<!-- eslint-disable no-mixed-spaces-and-tabs -->
<!-- eslint-disable no-mixed-spaces-and-tabs -->
<!-- src/components/BarStats.vue -->

<template>
	<div>
	  <h2>Bar Stats</h2>
	  <div>
		<p>Total Number of Ideas: {{ countNumberOfIdeas }}</p>
		<div>
			<canvas id="myChart"></canvas>

	  </div>
	  </div>
	  <div>
		<h2>Pie Stats</h2>
	  </div>
	  <div>
		<p>Total Number of GIB User: {{ countNumberOfUsers }}</p>
		<div>
			<canvas id="myPieChart"></canvas>

	  </div>
	  </div>
	</div>
  </template>
  
  <script>

  import axios from 'axios'
  export default {
    data() {
        // eslint-disable-next-line no-mixed-spaces-and-tabs
    return {
    countNumberOfIdeas: 0,
    countNumberOfUsers:0,
    memberShipCount :null,
    stagesCount: null,
    };
    },
mounted() {
    this.fetchBarStats();
},
methods: {
    async fetchBarStats() {
    try {
        const response = await axios.get('/barStats');
        const { countNumberOfIdeas, stagesCount } = response.data;
        this.countNumberOfIdeas = countNumberOfIdeas;
        this.stagesCount = stagesCount;
        this.drawBarChart();
        this.drawPieChart()
    } catch (error) {
        console.error(error);
    }
    },


async drawBarChart() {
    try {
        console.log("dshfgjsfgj")
        const ctx = document.getElementById('myChart');
        const label = Object.keys(this.stagesCount);
        const datas = Object.values(this.stagesCount);
        new Chart(ctx, {
        type: 'bar',
        data: {

            labels: label,
            datasets: [{
            label: '# of Ideas',
            data: datas,
            borderWidth: 1
            }]
        },
        options: {
            scales: {
            y: {
                beginAtZero: true
            }
            }
        }
        });
    } catch (error) {
        console.log(error);
    }
},



async drawPieChart() {
    try {
        console.log("sdjkfhsdkjfh")
        const response = await axios.get('/pieStats');
        const { memberShipCount, countNumberOfUsers } = response.data;
        this.memberShipCount = memberShipCount;
        this.countNumberOfUsers = countNumberOfUsers;
        const ctx = document.getElementById('myPieChart');
        const label = Object.keys(this.memberShipCount);
        const datas = Object.values(this.memberShipCount);
        new Chart(ctx, {
        type: 'pie',
        data: {

            labels: label,
            datasets: [{
            label: '# of Ideas',
            data: datas,
            backgroundColor:['#970070','#0900e0','#900a00', '#000000']
            }]
        },
        
        });
    } catch (error) {
        console.log(error);
    }
}
},
};

    

    import Chart from 'chart.js/auto'
        
    </script>
    