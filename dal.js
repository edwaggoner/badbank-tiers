const { CURSOR_FLAGS } = require('mongodb');

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
		const doc = { name, email, password, balance: 7 };
		collection.insertOne(doc, { w: 1 }, function (err, result) {
			err ? reject(err) : resolve(doc);
		});
	});
}

// login user
function login(email, password) {
	return new Promise((resolve, reject) => {
		const users = db.collection('users');
		console.log(`Logging in ${email}:${password}`);
		// check email+password against user list
		const userPromise = users.findOne({ email, password });

		userPromise.then((user) => {
			console.log(user);
			if (user === null) {
				reject({ error: 'Invalid login.' });
				console.log('Login failed.');
			} else {
				console.log('Logged IN!:');

				// Build transaction entry for 'logins' collection: name, email, password
				const doc = {
					name: user.name,
					email,
					password,
				};

				// insert transaction entry into 'transactions' collection
				const transactions = db.collection('logins');
				transactions.insertOne(doc, { w: 1 });
				console.log('This login has been added to the login list');

				resolve({
					name: user.name,
					email: user.email,
					balance: user.balance,
				});
			}
		});
	});
}

// deposit
function deposit(email, amount) {
	return new Promise((resolve, reject) => {
		const users = db.collection('users');

		// check submitted email against emails in 'users' collection
		const userPromise = users.findOne({ email });

		userPromise.then((user) => {
			// if submitted email does not match any in 'users' collection, reject deposit
			console.log(user);
			if (user === null) {
				reject({ error: 'Invalid deposit.' });
				console.log('Deposit failed.');
			} else {
				// if submitted email DOES match, update balance and create transaction record
				console.log(
					`User ${user.name} balance in the user collection BEFORE this deposit is ${user.balance}`
				);

				// convert amount (string) to amount (number)
				number = Number(amount);

				// determine the updated balance
				updatedBalance = user.balance + number;

				// create a filter selects a user to update
				const filter = { email: email };

				// create a document that sets the balance of the user in the 'users' collection
				const updateDoc = {
					$set: {
						balance: updatedBalance,
					},
				};

				const resultPromise = users.findOneAndUpdate(filter, updateDoc);
				resultPromise.then((result) => {
					console.log(
						`${result.MatchedCount} document(s) in 'user' collection matched the filter, updated ${result.ModifiedCount} document(s)`
					);

					// Build transaction entry for 'transactions' collection: name, email, transaction amount, updated balance
					const doc = {
						name: user.name,
						email,
						transaction: number,
						balance: updatedBalance,
					};

					// insert transaction entry into 'transactions' collection
					const transactions = db.collection('transactions');
					transactions.insertOne(doc, { w: 1 });
					console.log(
						'This transaction has been logged in the transaction list'
					);

					resolve({
						name: user.name,
						email: user.email,
						transaction: number,
						balance: updatedBalance,
					});
				});
			}
		});
	});
}

// withdraw
function withdraw(email, amount) {
	return new Promise((resolve, reject) => {
		const users = db.collection('users');

		// check submitted email against emails in 'users' collection
		const userPromise = users.findOne({ email });

		userPromise.then((user) => {
			// if submitted email does not match any in 'users' collection, reject deposit
			console.log(user);
			if (user === null) {
				reject({ error: 'Invalid withdrawal.' });
				console.log('Withdrawal failed.');
			} else {
				// if submitted email DOES match, update balance and create transaction record
				console.log(
					`User ${user.name} balance in the user collection BEFORE this withdrawal is ${user.balance}`
				);

				// convert amount (string) to amount (number)
				number = Number(amount);

				// determine the updated balance
				updatedBalance = user.balance - number;

				// create a filter selects a user to update
				const filter = { email: email };

				// create a document that sets the balance of the user in the 'users' collection
				const updateDoc = {
					$set: {
						balance: updatedBalance,
					},
				};

				const resultPromise = users.findOneAndUpdate(filter, updateDoc);
				resultPromise.then((result) => {
					console.log(
						`${result.MatchedCount} document(s) in 'user' collection matched the filter, updated ${result.ModifiedCount} document(s)`
					);

					// Build transaction entry for 'transactions' collection: name, email, transaction amount, updated balance
					const doc = {
						name: user.name,
						email,
						transaction: -number,
						balance: updatedBalance,
					};

					// insert transaction entry into 'transactions' collection
					const transactions = db.collection('transactions');
					transactions.insertOne(doc, { w: 1 });
					console.log(
						'This transaction has been logged in the transaction list'
					);

					resolve({
						name: user.name,
						email: user.email,
						transaction: -number,
						balance: updatedBalance,
					});
				});
			}
		});
	});
}

//balance
function balance(email) {
	return new Promise((resolve, reject) => {
		const users = db.collection('users');

		// check submitted email against emails in 'users' collection
		const userPromise = users.findOne({ email });

		userPromise.then((user) => {
			// if submitted email does not match any in 'users' collection, reject deposit
			console.log(user);
			if (user === null) {
				reject({ error: 'Invalid inquiry.' });
				console.log('Inquiry failed.');
			} else {
				// if submitted email DOES match, update balance and create transaction record
				console.log(`User ${user.name} balance is: ${user.balance}`);

				// Build transaction entry for 'transactions' collection: name, email, transaction amount, updated balance
				const doc = {
					name: user.name,
					email,
					transaction: 'balance check',
					balance: user.balance,
				};

				// insert transaction entry into 'transactions' collection
				const transactions = db.collection('transactions');
				transactions.insertOne(doc, { w: 1 });
				console.log(
					'This balance inquiry has been logged in the transaction list'
				);

				resolve({
					name: user.name,
					email: user.email,
					transaction: 'balance check',
					balance: user.balance,
				});
			}
		});
	});
}

// transaction list
function transactionList(email, password) {
	return new Promise((resolve, reject) => {
		const users = db.collection('users');
		console.log(`Checking ${email}:${password} against user list`);
		// check email+password against user list
		const userPromise = users.findOne({ email, password });

		userPromise.then((user) => {
			console.log(user);
			if (user === null) {
				reject({ error: 'Invalid login.' });
				console.log('Login failed.');
			} else {
				console.log('User confirmed');

				// get handle on all of the user's entries in the 'transactions' collection
				const transactions = db.collection('transactions');
				const findResult = transactions.find({
					name: user.name,
				});

				resolve({
					name: user.name,
					email: user.email,
					balance: user.balance,
				});
			}
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
