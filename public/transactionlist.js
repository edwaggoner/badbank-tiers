function TransactionList() {
	const ctx = React.useContext(UserContext);
	const [transactions, setTransactions] = React.useState([]);

	React.useEffect(() => {
		const url = `/account/transactionlist/${ctx.user.email}/${ctx.user.password}`;
		(async () => {
			const resFromExpress = await fetch(url);
			const data = await resFromExpress.json();
			return data;
		})().then((userTransactionList) => {
			if (userTransactionList.error) {
				console.log(userTransactionList.error);
			} else {
				console.log(userTransactionList.receivedTransactionList);
				const list = userTransactionList.receivedTransactionList;
				setTransactions(list.reverse());
			}
		});
	}, []);

	// function handle() {
	// 	const url = `/account/transactionlist/${ctx.user.email}/${ctx.user.password}`;
	// 	(async () => {
	// 		const resFromExpress = await fetch(url);
	// 		const data = await resFromExpress.json();
	// 		return data;
	// 	})().then((userTransactionList) => {
	// 		if (userTransactionList.error) {
	// 			console.log(userTransactionList.error);
	// 		} else {
	// 			console.log(userTransactionList.receivedTransactionList);
	// 			setTransactions(userTransactionList.receivedTransactionList);
	// 		}
	// 	});
	// }
	if (transactions.length === 0) {
		return <>Retrieving your transaction list. 😃</>;
	}

	return (
		<>
			<table
				className="table table-success table-hover"
				style={{ width: '60%' }}
			>
				<thead>
					<tr>
						<th scope="col" width="10%">
							Date
						</th>
						<th scope="col" width="10%">
							Time
						</th>
						<th scope="col" width="10%" style={{ textAlign: 'right' }}>
							Transaction
						</th>
						<th scope="col" width="20%" style={{ textAlign: 'right' }}>
							Current Balance
						</th>
					</tr>
				</thead>
				<tbody>
					{transactions.map((element, i) => (
						<tr key={i}>
							<td>{new Date(element.createdAt).toLocaleDateString()}</td>
							<td>
								{new Date(element.createdAt).toLocaleTimeString([], {
									timeStyle: 'short',
								})}
							</td>
							<td style={{ textAlign: 'right' }}>
								{element.transaction.toFixed(2)}
							</td>
							<td style={{ textAlign: 'right' }}>
								{element.balance.toFixed(2)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}
