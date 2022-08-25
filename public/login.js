function Login() {
	const [show, setShow] = React.useState(true);
	const [status, setStatus] = React.useState('');

	return (
		<Card
			bgcolor="secondary"
			header={show ? 'Login' : ''}
			status={status}
			body={
				show ? (
					<LoginForm setShow={setShow} setStatus={setStatus} />
				) : (
					<LoginMsg setShow={setShow} setStatus={setStatus} />
				)
			}
		/>
	);
}

function LoginMsg(props) {
	const ctx = React.useContext(UserContext);

	return (
		<>
			<h5>Welcome,</h5>
			<h5>{ctx.user.name}!</h5>
			<h6>You are now logged in.</h6>
			{/* <button
				type="submit"
				className="btn btn-light"
				onClick={() => props.setShow(true)}
			>
				Authenticate again
			</button> */}
		</>
	);
}

function LoginForm(props) {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [usererror, setUsererror] = React.useState(false);
	const ctx = React.useContext(UserContext);

	function handle() {
		console.log(email, password);
		const url = `/account/login/${email}/${password}`;
		(async () => {
			const resFromExpress = await fetch(url);
			const data = await resFromExpress.json();
			return data;
		})().then((user) => {
			if (user.error) {
				console.log(user.error);
				props.setStatus('Invalid credentials.');
				return;
			} else {
				console.log('Successful login');
				console.dir(user);
				ctx.setUser(user);
				// props.setStatus('');
				props.setShow(false);
				props.setStatus('');
			}
		});
		// props.setShow(false);
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
			<br />
		</>
	);
}
