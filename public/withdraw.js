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
		if (!Number.isInteger(amount)) {
			const Amount = amount.toString().split('.')[1].length;
			if (Amount > 2) {
				props.setStatus(
					'Your deposit amount must not have more than two decimal places.'
				);
				return;
			}
		}
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

	return (
		<>
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
