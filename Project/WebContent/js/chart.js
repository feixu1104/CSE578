var years = [ '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013',
		'2014', '2015', '2016', '2017' ];
var australiaPlayers = [ [ 'GJ Bailey', 'MEK Hussey', 'BJ Haddin', 'SR Watson',
		'DA Warner', 'AJ Finch', 'MG Johnson', 'RT Ponting', 'SPD Smith',
		'MJ Clarke' ] ];
var englandPlayers = [ [ 'AJ Strauss', 'JE Root', 'SCJ Broad', 'EJG Morgan',
		'KP Pietersen', 'RS Bopara', 'AN Cook', 'JC Buttler', 'IR Bell',
		'PD Collingwood' ] ];
var indiaPlayers = [ [ 'V Kohli', 'SK Raina', 'RG Sharma', 'MS Dhoni',
		'SR Tendulkar', 'G Gambhir', 'Yuvraj Singh', 'RA Jadeja', 'S Dhawan',
		'V Sehwag' ] ];
var newZealandPlayers = [ [ 'MJ Guptill', 'LRPL Taylor', 'JEC Franklin',
		'GD Elliott', 'SB Styris', 'NL McCullum', 'KS Williamson',
		'DL Vettori', 'BB McCullum', 'TG Southee' ] ];
var pakistanPlayers = [ [ 'Shoaib Malik', 'Mohammad Yousuf', 'Ahmed Shehzad',
		'Misbah-ul-Haq', 'Kamran Akmal', 'Younis Khan', 'Saeed Ajmal',
		'Umar Akmal', 'Mohammad Hafeez', 'Shahid Afridi' ] ];
var southAfricaPlayers = [ [ 'Q de Kock', 'F du Plessis', 'JP Duminy',
		'HH Gibbs', 'JH Kallis', 'GC Smith', 'AB de Villiers', 'HM Amla',
		'DA Miller', 'MV Boucher' ] ];
var sriLankaPlayers = [ [ 'WU Tharanga', 'TM Dilshan', 'HDRL Thirimanne',
		'NLTC Perera', 'DPMD Jayawardene', 'KC Sangakkara', 'LD Chandimal',
		'KMDN Kulasekara', 'ST Jayasuriya', 'AD Mathews' ] ];
var westIndiesPlayers = [ [ 'KA Pollard', 'DM Bravo', 'RR Sarwan', 'DJG Sammy',
		'D Ramdin', 'S Chanderpaul', 'CH Gayle', 'MN Samuels', 'SL Malinga',
		'DJ Bravo' ] ];

var teamsArray = {
	'Australia' : australiaPlayers,
	'England' : englandPlayers,
	'India' : indiaPlayers,
	'New Zealand' : newZealandPlayers,
	'Pakistan' : pakistanPlayers,
	'South Africa' : southAfricaPlayers,
	'Sri Lanka' : sriLankaPlayers,
	'West Indies' : westIndiesPlayers
};

var homeTeam = document.getElementById('country').value;
var opposition = document.getElementById('againstCountry').value;

function drawChartAfterParsingData() {

	homeTeam = document.getElementById('country').value;
	c3.generate({
		bindto : '#stackAreaChart',
		data : {
			x : 'playerName',
			columns : resultData,
			type : 'area-spline',
			groups : teamsArray[homeTeam]
		},
		axis : {
			y : {
				label : {
					text : 'Runs',
					position : 'outer-middle'
				}
			},
			x : {
				tick : {
					values : years
				},
				label : {
					text : 'Years',
					position : 'center'
				}
			}
		},
		size : {
			width : 600,
			height : 225
		}
	});
	document.getElementById('stackAreaChart').style.display = 'block';
}

function makeChart() {

	homeTeam = document.getElementById('country').value;
	opposition = document.getElementById('againstCountry').value;
	resultData = new Array(11);
	var q = queue();
	q
			.defer(function(callback) {
				d3
						.csv(
								"allData/allStream.csv",
								type,
								function(data) {

									var filteredOnHome = d3.nest().key(
											function(d) {
												return d['home'];
											}).entries(data);

									var country1Data = filteredOnHome
											.filter(function(d) {
												return d.key == homeTeam;
											});
									if (opposition == 'All') {
										var oppositionDataValues = country1Data[0].values;
									} else {

										var filteredOnOpposition = d3.nest()
												.key(function(d) {
													return d['against'];
												}).entries(
														country1Data[0].values);

										var country2Data = filteredOnOpposition
												.filter(function(d) {
													return d.key == opposition;
												});

										var oppositionDataValues = country2Data[0].values;
									}

									var oppositionDataValuesFilteredOnYear = d3
											.nest().key(function(d) {
												return d['year'];
											}).entries(oppositionDataValues);

									for (var i = 1; i < resultData.length; i++) {
										resultData[i] = [
												teamsArray[homeTeam][0][i - 1],
												0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
												0, 0 ];
									}
									resultData[0] = [ 'playerName', '2006',
											'2007', '2008', '2009', '2010',
											'2011', '2012', '2013', '2014',
											'2015', '2016', '2017' ];

									for (var i = 0; i < oppositionDataValuesFilteredOnYear.length; i++) {

										var yearData = oppositionDataValuesFilteredOnYear[i];
										var yearDataValues = yearData.values;

										var playerDataByYear = d3.nest().key(
												function(d) {
													return d['playerName'];
												}).entries(yearDataValues);
										for (var j = 0; j < playerDataByYear.length; j++) {

											var playerGamesArray = playerDataByYear[j].values;
											var sum = 0;
											for (var k = 0; k < playerGamesArray.length; k++) {
												sum = sum
														+ parseInt(playerGamesArray[k]['runs']);
											}

											var homeTeamPlayers = teamsArray[homeTeam];
											var playerIndex = homeTeamPlayers[0]
													.indexOf(playerDataByYear[j].key);
											resultData[playerIndex + 1][oppositionDataValuesFilteredOnYear[i].key - 2006 + 1] = sum;
										}
									}
									callback(null, data)
								});
			});
	q.await(drawChartAfterParsingData)
}

function type(data) {
	data['runs'] = +data['runs'];
	return data;
}