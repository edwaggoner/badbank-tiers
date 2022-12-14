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
	const [amount, setAmount] = React.useState('');
	const ctx = React.useContext(UserContext);

	function deposit() {
		const depositAmount = Number(amount);
		if (!Number.isInteger(depositAmount)) {
			const decimalDigitCount = depositAmount.toString().split('.')[1].length;
			if (decimalDigitCount > 2) {
				props.setStatus(
					'Your deposit amount must not have more than two decimal places.'
				);
				return;
			}
		}
		if (depositAmount < 0) {
			props.setStatus('Your deposit amount must be greater than zero.');
			return;
		}

		firebase
			.auth()
			.currentUser.getIdToken(true)
			.then(function (idToken) {
				const url = `/account/deposit/${idToken}/${depositAmount}`;
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
				placeholder="0.00"
				value={amount}
				onChange={(e) => setAmount(e.currentTarget.value)}
			/>
			<br />
			<button type="submit" className="btn btn-light" onClick={deposit}>
				Deposit
			</button>
		</>
	);
}
