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
	const [amount, setAmount] = React.useState('');
	const ctx = React.useContext(UserContext);

	function withdraw() {
		const withdrawAmount = Number(amount);
		if (!Number.isInteger(withdrawAmount)) {
			const decimalDigitCount = withdrawAmount.toString().split('.')[1].length;
			if (decimalDigitCount > 2) {
				props.setStatus(
					'Your deposit amount must not have more than two decimal places.'
				);
				return;
			}
		}
		if (withdrawAmount < 0) {
			props.setStatus('Your withdrawal amount must be greater than zero.');
			return;
		} else if (withdrawAmount > ctx.user.balance) {
			props.setStatus('You may not withdraw more than your current balance.');
			return;
		}

		firebase
			.auth()
			.currentUser.getIdToken(true)
			.then(function (idToken) {
				const url = `/account/withdraw/${idToken}/${withdrawAmount}`;
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
						console.dir(update);
						ctx.setUser({ ...ctx.user, balance: update.balance });
						props.setStatus('');
						props.setShow(false);
					}
				});
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
			<button type="submit" className="btn btn-light" onClick={withdraw}>
				Withdraw
			</button>
		</>
	);
}
