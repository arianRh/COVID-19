let dropCountry = document.getElementById("country");
let loader = document.getElementById("loader");
let loaderBox = document.getElementById("loader-box");
let myChart;

// DROPDOWM COUNTRY
async function getCountryName() {
	let countryName = await (
		await fetch("https://covid-193.p.rapidapi.com/countries", {
			method: "GET",
			headers: {
				"x-rapidapi-host": "covid-193.p.rapidapi.com",
				"x-rapidapi-key": "73bdf69d9emshc40179d9d51883ep1bbfc0jsnfa0c251b843e",
			},
		})
	).json();
	let item = "";
	let dropItem = document.getElementById("country");
	for (let i = 0; i <= countryName.response.length; i++) {
		if (countryName.response[i] == "Iran") {
			document.getElementsByClassName("dropdown-menu").innerHTML =
				item += `<option selected value="${countryName.response[i]}">${countryName.response[i]}</option>`;
		} else {
			document.getElementsByClassName("dropdown-menu").innerHTML =
				item += `<option value="${countryName.response[i]}">${countryName.response[i]}</option>`;
		}
	}
	dropItem.innerHTML = item;
}

// SET STATISTICS IN THE TABLE
async function setTable(country) {
	let d = new Date();
	let short = d.toISOString();
	updateDate = short.slice(0, 10);

	loader.style.display = "block";
	loaderBox.style.paddingTop = "8px";
	loaderBox.style.paddingBottom = "10px";

	let tableInformation = await (
		await fetch(
			`https://api.covid19tracking.narrativa.com/api/${updateDate}/country/${country}`
		)
	).json();
	loader.style.display = "none";
	if (tableInformation.dates[updateDate].countries[country] === undefined) {
		window.alert("Country is not avalable");
	} else {
		let dataTable = document.getElementById("data-table");
		let list = "";
		list += "<tr>";
		list += `<th>${tableInformation.dates[updateDate].countries[country]["name"]}</th>`;
		list += `<td>${tableInformation.dates[updateDate].countries[country]["today_confirmed"]}</td>`;
		list += `<td>${tableInformation.dates[updateDate].countries[country]["today_deaths"]}</td>`;
		list += `<td>${tableInformation.dates[updateDate].countries[country]["today_recovered"]}</td>`;
		list += `<td>${tableInformation.dates[updateDate].countries[country]["today_open_cases"]}</td>`;
		list += "</tr>";
		dataTable.innerHTML = list;
	}
}
// SET Chartjs
async function setChart(country) {
	let d = new Date();
	let short = d.toISOString();
	updateDate = short.slice(0, 10);

	let tableInformation = await (
		await fetch(
			`https://api.covid19tracking.narrativa.com/api/${updateDate}/country/${country}`
		)
	).json();

	let ctx = document.getElementById("myChart").getContext("2d");
	if (myChart) {
		myChart.data.datasets[0].data = [
			`${tableInformation.dates[updateDate].countries[country]["today_confirmed"]}`,
			`${tableInformation.dates[updateDate].countries[country]["today_deaths"]}`,
			`${tableInformation.dates[updateDate].countries[country]["today_recovered"]}`,
			`${tableInformation.dates[updateDate].countries[country]["today_open_cases"]}`,
		];
		myChart.update();
	} else {
		myChart = new Chart(ctx, {
			type: "pie",
			data: {
				labels: ["Confirmed", "Deaths", "Recovered", "Active"],
				datasets: [
					{
						data: [
							`${tableInformation.dates[updateDate].countries[country]["today_confirmed"]}`,
							`${tableInformation.dates[updateDate].countries[country]["today_deaths"]}`,
							`${tableInformation.dates[updateDate].countries[country]["today_recovered"]}`,
							`${tableInformation.dates[updateDate].countries[country]["today_open_cases"]}`,
						],
						backgroundColor: [
							"rgb(50, 62, 75)",
							"rgb(247, 114, 114)",
							"rgb(86, 248, 194)",
							"rgb(255, 158, 88)",
						],
					},
				],
			},
		});
	}
}

// Chartjs UPDATE
window.onload = async () => {
	let d = new Date();
	let short = d.toISOString();
	updateDate = short.slice(0, 10);

	let tableInformation = await (
		await fetch(
			`https://api.covid19tracking.narrativa.com/api/${updateDate}/country/${country}`,
			{ mode: "no-cors" }
		)
	).json();
	let dataTable = document.getElementById("data-table");
	let list = "";
	list += "<tr>";
	list += `<th>${tableInformation.dates[updateDate].countries[country]["name"]}</th>`;
	list += `<td>${tableInformation.dates[updateDate].countries[country]["today_confirmed"]}</td>`;
	list += `<td>${tableInformation.dates[updateDate].countries[country]["today_deaths"]}</td>`;
	list += `<td>${tableInformation.dates[updateDate].countries[country]["today_recovered"]}</td>`;
	list += `<td>${tableInformation.dates[updateDate].countries[country]["today_open_cases"]}</td>`;
	list += "</tr>";
	dataTable.innerHTML = list;

	let ctx = document.getElementById("myChart").getContext("2d");
	if (myChart) {
		myChart.data.datasets[0].data = [
			`${tableInformation.dates[updateDate].countries[country]["today_confirmed"]}`,
			`${tableInformation.dates[updateDate].countries[country]["today_deaths"]}`,
			`${tableInformation.dates[updateDate].countries[country]["today_recovered"]}`,
			`${tableInformation.dates[updateDate].countries[country]["today_open_cases"]}`,
		];
		myChart.update();
	} else {
		myChart = new Chart(ctx, {
			type: "bar",
			data: {
				labels: ["Confirmed", "Deaths", "Recovered", "Active"],
				datasets: [
					{
						label: ["Covid Static Tick"],
						data: [
							`${tableInformation.dates[updateDate].countries[country]["today_confirmed"]}`,
							`${tableInformation.dates[updateDate].countries[country]["today_deaths"]}`,
							`${tableInformation.dates[updateDate].countries[country]["today_recovered"]}`,
							`${tableInformation.dates[updateDate].countries[country]["today_open_cases"]}`,
						],
						backgroundColor: [
							"#284b63",
							"#3c6e71",
							"#bde0fe",
							"rgba(75, 192, 192, 1)",
						],
					},
				],
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
					},
				},
			},
		});
	}
};

// SET IRAN AS DEFAULT
window.onload = async () => {
	setChart("Iran");
	setTable("Iran");
};

getCountryName();

dropCountry.onchange = (e) => {
	setChart(e.target.value);
	setTable(e.target.value);
};
