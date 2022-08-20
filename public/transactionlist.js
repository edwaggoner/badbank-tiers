function TransactionList() {
	const [show, setShow] = React.useState(true);
	const [status, setStatus] = React.useState('');

	return (
		<Card
			bgcolor="secondary"
			header="Login for Transaction List"
			status={status}
			body={
				show ? (
					<TransactionListForm setShow={setShow} setStatus={setStatus} />
				) : (
					<TransactionListMsg setShow={setShow} setStatus={setStatus} />
				)
			}
		/>
	);
}

function TransactionListMsg(props) {
	return (
		<>
			<h5>Success</h5>
			<button
				type="submit"
				className="btn btn-light"
				onClick={() => props.setShow(true)}
			>
				Authenticate again
			</button>
		</>
	);
}

function TransactionListForm(props) {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');

	const ctx = React.useContext(UserContext);

	function handle() {
		console.log(email, password);
		const url = `/account/transactionlist/${email}/${password}`;
		(async () => {
			const resFromExpress = await fetch(url);
			const data = await resFromExpress.json();
			return data;
		})().then((user) => {
			if (user.error) {
				console.log(user.error);
			} else {
				console.log('Successful login');
				console.dir(user);
			}
		});
	}

	return (
		<>
			Email
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
			</button>
		</>
	);
}
