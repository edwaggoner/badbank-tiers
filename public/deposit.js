function Deposit() {
	const [show, setShow] = React.useState(true);
	const [status, setStatus] = React.useState('');

	return (
		<Card
			bgcolor="warning"
			header="Deposit"
			status={status}
			body={
				show ? (
					<DepositForm setShow={setShow} setStatus={setStatus} />
				) : (
					<DepositMsg setShow={setShow} />
				)
			}
		/>
	);
}

function DepositMsg(props) {
	return (
		<>
			<h5>Success</h5>
			<h6>Your new balance appears above</h6>
			<button
				type="submit"
				className="btn btn-light"
				onClick={() => props.setShow(true)}
			>
				Deposit again
			</button>
		</>
	);
}

function DepositForm(props) {
	const [email, setEmail] = React.useState('');
	const [amount, setAmount] = React.useState('');
	const ctx = React.useContext(UserContext);

	function handle() {
		console.log(email, amount);
		const url = `/account/deposit/${email}/${amount}`;
		(async () => {
			const resFromExpress = await fetch(url);
			const data = await resFromExpress.json();
			return data;
		})().then((update) => {
			if (update.error) {
				console.log(update.error);
				props.setStatus('fail');
				return;
			} else {
				console.log('Successful deposit.');
				console.dir(update);
				ctx.setUser(update);
				props.setStatus('');
				props.setShow(false);
			}
		});
	}
	// function handle(){

	//   console.log(email,amount);
	//   const user = ctx.users.find((user) => user.email == email);
	//   if (!user) {
	//     props.setStatus('fail!');
	//     return;
	//   }

	//   user.balance = user.balance + Number(amount);
	//   console.log(user);
	//   props.setStatus('');
	//   props.setShow(false);
	// }

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
			Amount
			<br />
			<input
				type="number"
				className="form-control"
				placeholder="Enter amount"
				value={amount}
				onChange={(e) => setAmount(e.currentTarget.value)}
			/>
			<br />
			<button type="submit" className="btn btn-light" onClick={handle}>
				Deposit
			</button>
		</>
	);
}
