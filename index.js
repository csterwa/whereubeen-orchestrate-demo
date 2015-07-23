var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var orchestrate = require('orchestrate');

app.use(express.static('public'));
app.use(express.static('bower_components'));
app.use(bodyParser.json());

var orchestrate_api_key = process.env.ORCHESTRATE_API_KEY;
var orchestrate_api_url = process.env.ORCHESTRATE_API_ENDPOINT;

if (process.env.VCAP_SERVICES) {
  var services = JSON.parse(process.env.VCAP_SERVICES);
  var orchestrateConfig = services["orchestrate"];
  if (orchestrateConfig) {
    var node = orchestrateConfig[0];
    orchestrate_api_key = node.credentials.ORCHESTRATE_API_KEY
    orchestrate_api_url = node.credentials.ORCHESTRATE_API_HOST
  }
}

var db = orchestrate(orchestrate_api_key, orchestrate_api_url);

app.post('/location', function (req, res) {
	console.log('called location POST', req.body);
	if (!req.body.name || !req.body.latitude || !req.body.longitude) {
		res.send({'error': 'Must provide name, latitude and longitude in request body.'});
		return;
	}

	db.post('location', {
		name: req.body.name,
		location: {
			latitude: req.body.latitude,
			longitude: req.body.longitude
		}
	})
	.then(function(result) {
		res.send(result);
	})
	.fail(function(err) {
		res.send({'error': err});
	});
});

app.get('/location', function(req, res) {
	console.log('called location GET', req.query);
	req.query.limit = 100;
	db.list('location', req.query)
	.then(function(result) {
		res.send(result);
	})
	.fail(function(err) {
		res.send({'error': err});
	});
});

app.delete('/location/:id', function(req, res) {
	console.log('called location DELETE on', req.params.id);
	db.remove('location', req.params.id, true)
	.then(function(result) {
		res.send(result);
	})
	.fail(function(err) {
		res.send({'error': err});
	});
});

var port = process.env.PORT || 5000;

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
