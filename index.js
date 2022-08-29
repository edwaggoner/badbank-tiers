const express = require('express');
const app = express();
const cors = require('cors');
const dal = require('./dal.js');
const { applicationDefault, initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

// used to serve static files from public directory
app.use(express.static('public'));
app.use(cors());

console.log(`Env: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);

// initialize firebase-admin
initializeApp({
	credential: applicationDefault(),
});

// create user account
app.get('/account/create/:idtoken', function (req, res) {
	console.log(req.params.idtoken);
	// idToken comes from the client app
	getAuth()
		.verifyIdToken(req.params.idtoken)
		.then((decodedToken) => {
			const uid = decodedToken.uid;
			console.log('Decoded token id is: ' + decodedToken.uid);
			dal.create(uid).then((user) => {
				console.log(user);
				res.send(user);
			});
			// ...
		})
		.catch((error) => {
			console.log('Error in decode' + error);
			// Handle error
		});
});

// login
app.get('/account/login/:idtoken', function (req, res) {
	console.log(req.params.idtoken);
	// idToken comes from the client app
	getAuth()
		.verifyIdToken(req.params.idtoken)
		.then((decodedToken) => {
			const uid = decodedToken.uid;
			console.log('Decoded token id is: ' + decodedToken.uid);
			dal.login(uid).then((user) => {
				console.log(user);
				res.send(user);
			});
			// ...
		})
		.catch((error) => {
			console.log('Error in decode' + error);
			// Handle error
		});
});

// deposit
app.get('/account/deposit/:idtoken/:depositamount', function (req, res) {
	console.log(req.params.idtoken);
	getAuth()
		.verifyIdToken(req.params.idtoken)
		.then((decodedToken) => {
			const uid = decodedToken.uid;
			console.log('Decoded token id is: ' + decodedToken.uid);
			dal.deposit(uid, req.params.depositamount).then(
				(update) => {
					console.log(update);
					res.send(update);
				},
				(reason) => {
					res.send(reason);
				}
			);
		});
});

// withdraw
app.get('/account/withdraw/:idtoken/:withdrawamount', function (req, res) {
	console.log(req.params.idtoken);
	getAuth()
		.verifyIdToken(req.params.idtoken)
		.then((decodedToken) => {
			const uid = decodedToken.uid;
			console.log('Decoded token id is: ' + decodedToken.uid);
			dal.withdraw(uid, req.params.withdrawamount).then(
				(update) => {
					res.send(update);
				},
				(reason) => {
					res.send(reason);
				}
			);
		});
});

// transaction list
app.get('/account/transactionlist/:idtoken', function (req, res) {
	getAuth()
		.verifyIdToken(req.params.idtoken)
		.then((decodedToken) => {
			const uid = decodedToken.uid;
			console.log('Decoded token id is: ' + decodedToken.uid);
			dal.transactionList(uid).then(
				(userTransactionList) => {
					res.send(userTransactionList);
				},
				(reason) => {
					res.send(reason);
				}
			);
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
