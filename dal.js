const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
let db = null;

// connect to mongo
MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
	console.log('Connected successfully to db server');

	// connect to myproject database
	db = client.db('myproject');
});

// create user account
function create(name, email, password) {
	return new Promise((resolve, reject) => {
		const collection = db.collection('users');
		const doc = { name, email, password, balance: 0 };
		collection.insertOne(doc, { w: 1 }, function (err, result) {
			err ? reject(err) : resolve(doc);
		});
	});
}

// login user
function login(email, password) {
	return new Promise((resolve, reject) => {
		const access = db.collection('logins');
		const doc = { email, password };
		access.insertOne(doc, { w: 1 }, function (err, result) {
			err ? reject(err) : resolve(doc);
		});
	});
}

// deposit
function deposit(email, amount) {
	return new Promise((resolve, reject) => {
		const addition = db.collection('deposits');
		const doc = { email, amount };
		addition.insertOne(doc, { w: 1 }, function (err, result) {
			err ? reject(err) : resolve(doc);
		});
	});
}
// withdraw
function withdraw(email, amount) {
	return new Promise((resolve, reject) => {
		const subtraction = db.collection('withdrawals');
		const doc = { email, amount };
		subtraction.insertOne(doc, { w: 1 }, function (err, result) {
			err ? reject(err) : resolve(doc);
		});
	});
}

//balance
function balance(email) {
	return new Promise((resolve, reject) => {
		const whatUGot = db.collection('balances');
		const doc = { email };
		whatUGot.insertOne(doc, { w: 1 }, function (err, result) {
			err ? reject(err) : resolve(doc);
		});
	});
}

// all users
function all() {
	return new Promise((resolve, reject) => {
		const customers = db
			.collection('users')
			.find({})
			.toArray(function (err, docs) {
				err ? reject(err) : resolve(docs);
			});
	});
}

module.exports = { create, login, deposit, withdraw, balance, all };
