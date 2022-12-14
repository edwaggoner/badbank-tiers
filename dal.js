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
function create(uid) {
	return new Promise((resolve, reject) => {
		const collection = db.collection('users');

		//build
		const doc = { uid, balance: 0 };
		collection.insertOne(doc, { w: 1 }, function (err, result) {
			err ? reject(err) : resolve(doc);
		});
	});
}

// login user
function login(uid) {
	return new Promise((resolve, reject) => {
		const users = db.collection('users');
		// check email+password against user list
		const userPromise = users.findOne({ uid });

		userPromise.then((user) => {
			console.log(user);
			if (user === null) {
				reject({ error: 'Invalid login.' });
				console.log('Login failed.');
			} else {
				console.log('Logged IN!:');

				// Build entry for 'logins' collection: date, uid
				const doc = {
					createdAt: new Date(),
					uid: user.uid,
				};

				// insert entry into 'login' collection
				const loginList = db.collection('logins');
				loginList.insertOne(doc, { w: 1 });
				console.log('This login has been added to the login list');

				resolve({
					uid: user.uid,
					balance: user.balance,
				});
			}
		});
	});
}

// deposit
function deposit(uid, amount) {
	return new Promise((resolve, reject) => {
		const users = db.collection('users');

		// check submitted uid against uids in 'users' collection
		const userPromise = users.findOne({ uid });

		userPromise.then((user) => {
			// if submitted uid does not match any in 'users' collection, reject deposit
			console.log(user);
			if (user === null) {
				reject({ error: 'Invalid deposit.' });
				console.log('Deposit failed.');
			} else {
				// if submitted uid DOES match, update balance and create transaction record
				console.log(
					`User ${uid} balance in the user collection BEFORE this deposit is ${user.balance}`
				);

				// convert amount (string) to amount (number)
				number = Number(amount);

				// determine the updated balance
				updatedBalance = user.balance + number;

				// create a filter selects a user to update
				const filter = { uid: uid };

				// create a document that sets the balance of the user in the 'users' collection
				const updateDoc = {
					$set: {
						balance: updatedBalance,
					},
				};

				const resultPromise = users.findOneAndUpdate(filter, updateDoc);
				resultPromise.then((result) => {
					// Build transaction entry for 'transactions' collection: createdAt, uid, transaction amount, updated balance
					const doc = {
						createdAt: new Date(),
						uid: user.uid,
						transaction: number,
						balance: updatedBalance,
					};

					// insert transaction entry into 'transactions' collection
					const transactions = db.collection('transactions');
					transactions.insertOne(doc, { w: 1 });
					console.log('This deposit has been logged in the transaction list');

					resolve({
						date: doc['createdAt'],
						transaction: doc['transaction'],
						balance: doc['balance'],
					});
				});
			}
		});
	});
}

// withdraw
function withdraw(uid, amount) {
	return new Promise((resolve, reject) => {
		const users = db.collection('users');

		// check submitted email against emails in 'users' collection
		const userPromise = users.findOne({ uid });

		userPromise.then((user) => {
			// if submitted email does not match any in 'users' collection, reject deposit
			console.log(user);
			if (user === null) {
				reject({ error: 'Invalid withdrawal.' });
				console.log('Withdrawal failed.');
			} else {
				// if submitted email DOES match, update balance and create transaction record
				console.log(
					`User ${uid} balance in the user collection BEFORE this withdrawal is ${user.balance}`
				);

				// convert amount (string) to amount (number)
				number = Number(amount);

				// determine the updated balance
				updatedBalance = user.balance - number;

				// create a filter selects a user to update
				const filter = { uid: uid };

				// create a document that sets the balance of the user in the 'users' collection
				const updateDoc = {
					$set: {
						balance: updatedBalance,
					},
				};

				const resultPromise = users.findOneAndUpdate(filter, updateDoc);
				resultPromise.then((result) => {
					// Build transaction entry for 'transactions' collection: name, email, transaction amount, updated balance
					const doc = {
						createdAt: new Date(),
						uid: user.uid,
						transaction: -number,
						balance: updatedBalance,
					};

					// insert transaction entry into 'transactions' collection
					const transactions = db.collection('transactions');
					transactions.insertOne(doc, { w: 1 });
					console.log(
						'This withdrawal has been logged in the transaction list'
					);

					resolve({
						date: doc['createdAt'],
						transaction: doc['transaction'],
						balance: doc['balance'],
					});
				});
			}
		});
	});
}

// transaction list
function transactionList(uid) {
	return new Promise((resolve, reject) => {
		const users = db.collection('users');
		// check uid against user list
		const userPromise = users.findOne({ uid });

		userPromise.then((user) => {
			if (user === null) {
				reject({ error: 'UID not found in users collection.' });
			} else {
				// get all of the user's entries in the 'transactions' collection
				const transactions = db.collection('transactions');
				const list = transactions.find({
					uid: user.uid,
				});

				const receivedTransactionList = [];
				const forEachDonePromise = list.forEach((doc) => {
					delete doc._id;
					receivedTransactionList.push(doc);
				});

				forEachDonePromise.then(() => {
					resolve({ receivedTransactionList });
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

module.exports = {
	create,
	login,
	deposit,
	withdraw,
	transactionList,
	all,
};
