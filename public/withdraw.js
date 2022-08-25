function Withdraw() {
	const [show, setShow] = React.useState(true);
	const [status, setStatus] = React.useState('');

	return (
		<Card
			bgcolor="success"
			header="Withdraw"
			status={status}
			body={
				show ? (
					<WithdrawForm setShow={setShow} setStatus={setStatus} />
				) : (
					<WithdrawMsg setShow={setShow} />
				)
			}
		/>
	);
}

function WithdrawMsg(props) {
	return (
		<>
			<h5>Success</h5>
			<h6>Your new balance appears above</h6>
			<button
				type="submit"
				className="btn btn-light"
				onClick={() => props.setShow(true)}
			>
				Withdraw again
			</button>
		</>
	);
}

function WithdrawForm(props) {
	const [email, setEmail] = React.useState('');
	const [amount, setAmount] = React.useState('');
	const ctx = React.useContext(UserContext);

	function handle() {
		if (amount < 0) {
			props.setStatus('Your withdrawal amount must be greater than zero.');
			return;
		} else if (amount > ctx.user.balance) {
			props.setStatus('You may not withdraw more than your current balance.');
			return;
		}

		console.log(amount);
		const url = `/account/withdraw/${ctx.user.email}/${amount}`;
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
				console.log('Successful withdrawal.');
				console.log(update.balance);
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
	// 	props.setStatus('fail!')
	//	return;
	//   }

	//   user.balance = user.balance - Number(amount);
	//   console.log(user);
	//   props.setStatus('');
	//   props.setShow(false);
	// }

	return (
		<>
			{/* Email
			<br />
			<input
				type="input"
				className="form-control"
				placeholder="Enter email"
				value={email}
				onChange={(e) => setEmail(e.currentTarget.value)}
			/>
			<br /> */}
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
				Withdraw
			</button>
		</>
	);
}
