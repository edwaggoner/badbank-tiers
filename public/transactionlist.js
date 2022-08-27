function TransactionList() {
	// const [status, setStatus] = React.useState(false);
	const ctx = React.useContext(UserContext);
	const [transactions, setTransactions] = React.useState([]);

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
				setTransactions(userTransactionList.receivedTransactionList);
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
	// 				{list.map((element, i) => (
	// 					<tr key={i}>
	// 						<td>{i.name}</td>
	// 						<td>{i.email}</td>
	// 						<td>{i.transaction}</td>
	// 						<td>${i.balance.toFixed(2)}</td>
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
			<table className="table table-success table-hover">
				<thead>
					<tr>
						<th scope="col">Name</th>
						<th scope="col">Email</th>
						<th scope="col">Transaction</th>
						<th scope="col">Current Balance</th>
					</tr>
				</thead>
				<tbody>
					{transactions.map((element) => (
						<tr>
							<td>{element.name}</td>
							<td>{element.email}</td>
							<td>{element.transaction}</td>
							<td>{element.balance}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}
