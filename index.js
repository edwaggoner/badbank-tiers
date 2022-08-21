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

// deposit
app.get('/account/deposit/:email/:amount', function (req, res) {
	dal.deposit(req.params.email, req.params.amount).then(
		(update) => {
			console.log(update);
			res.send(update);
		},
		(reason) => {
			res.send(reason);
		}
	);
});

// withdraw
app.get('/account/withdraw/:email/:amount', function (req, res) {
	dal.withdraw(req.params.email, req.params.amount).then(
		(update) => {
			res.send(update);
		},
		(reason) => {
			res.send(reason);
		}
	);
});

// balance
app.get('/account/balance/:email', function (req, res) {
	dal.balance(req.params.email).then(
		(balance) => {
			console.log(balance);
			res.send(balance);
		},
		(reason) => {
			res.send(reason);
		}
	);
});

// transaction list
app.get('/account/transactionlist/:email/:password', function (req, res) {
	dal.transactionList(req.params.email, req.params.password).then(
		(userTransactionList) => {
			console.dir(userTransactionList);
			res.send(userTransactionList);
		},
		(reason) => {
			res.send(reason);
		}
	);
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
