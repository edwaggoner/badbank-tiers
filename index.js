const express = require('express');
const app = express();
const cors = require('cors');
const dal = require('./dal.js');

// used to serve static files from public directory
app.use(express.static('public'));
app.use(cors());

// create user account
app.get('/account/create/:name/:email/:password', function (req, res) {
	// else create user
	dal
		.create(req.params.name, req.params.email, req.params.password)
		.then((user) => {
			console.log(user);
			res.send(user);
		});
});

// login
app.get('/account/login/:email/:password', function (req, res) {
	dal.login(req.params.email, req.params.password).then(
		(credentials) => {
			console.dir(credentials);
			res.send(credentials);
		},
		(reason) => {
			res.send(reason);
		}
	);
});
// update - deposit/withdraw amount
// app.get('/account/update/:email/:amount', function (req, res) {

//     var amount = Number(req.params.amount);

//     dal.update(req.params.email, amount).
//         then((response) => {
//             console.log(response);
//             res.send(response);
//     });
// });

// deposit
app.get('/account/deposit/:email/:amount', function (req, res) {
	dal.deposit(req.params.email, req.params.amount).then((inMoney) => {
		console.log(inMoney);
		res.send(inMoney);
	});
});

// withdraw
app.get('/account/withdraw/:email/:amount', function (req, res) {
	dal.withdraw(req.params.email, req.params.amount).then((outMoney) => {
		console.log(outMoney);
		res.send(outMoney);
	});
});

// balance
app.get('/account/balance/:email', function (req, res) {
	dal.balance(req.params.email).then((howMuch) => {
		console.log(howMuch);
		res.send(howMuch);
	});
});

// all accounts
app.get('/account/all', function (req, res) {
	dal.all().then((docs) => {
		console.log(docs);
		res.send(docs);
	});
});

// listener
const port = 3000;
app.listen(port);
console.log('Running on port: ' + port);
