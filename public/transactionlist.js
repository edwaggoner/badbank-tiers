function TransactionList() {
	// const [email, setEmail] = React.useState('');
	// const [password, setPassword] = React.useState('');

	const ctx = React.useContext(UserContext);

	let list;

	function handle() {
		const url = `/account/transactionlist/${ctx.user.email}/${ctx.user.password}`;
		(async () => {
			const resFromExpress = await fetch(url);
			const data = await resFromExpress.json();
			return data;
		})().then((userTransactionList) => {
			if (userTransactionList.error) {
				console.log(userTransactionList.error);
			} else {
				list = userTransactionList['receivedTransactionList'];
				console.log(list);
			}
		});
	}

	// const displayList = (
	// 	<div>
	// 		<table className="table table-success table-hover">
	// 			<thead>
	// 				<tr>
	// 					<th scope="col">Name</th>
	// 					<th scope="col">Email</th>
	// 					<th scope="col">Transaction</th>
	// 					<th scope="col">Balance</th>
	// 				</tr>
	// 			</thead>
	// 			<tbody>
	// 				{list.map((i) => (
	// 					<tr key={i}>
	// 						<td>{transaction.name}</td>
	// 						<td>{transaction.email}</td>
	// 						<td>{transaction.transaction}</td>
	// 						<td>${transaction.balance.toFixed(2)}</td>
	// 					</tr>
	// 				))}
	// 			</tbody>
	// 		</table>
	// 	</div>
	// );

	return (
		<>
			<button type="submit" className="btn btn-light" onClick={handle}>
				List Your Transactions
			</button>
			<br />
			{list ? displayList : ''}

			{/* Email
			<br />
			<input
				type="input"
				className="form-control"
				placeholder="Enter email"
				value={email}
				onChange={(e) => setEmail(e.currentTarget.value)}
			/>
			<br />
			Password
			<br />
			<input
				type="password"
				className="form-control"
				placeholder="Enter password"
				value={password}
				onChange={(e) => setPassword(e.currentTarget.value)}
			/>
			<br />
			<button type="submit" className="btn btn-light" onClick={handle}>
				Login
			</button> */}
		</>
	);
}
