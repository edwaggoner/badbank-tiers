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

	const ctx = React.useContext(UserContext);

	function login() {
		if (email == '') {
			props.setStatus('You must enter an email.');
			return;
		}
		if (!email.includes('@')) {
			props.setStatus('Your email must include @');
			return;
		}
		if (!email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
			props.setStatus('Invalid email address');
			return;
		}
		if (password == '') {
			props.setStatus('You must enter password.');
			return;
		}
		let length = password.length;
		if (length < 6) {
			props.setStatus('Your password must contain at least 8 characters');
			return;
		}

		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((userCredential) => {
				// Signed in
				const loggedInUser = userCredential.user;
				console.log(userCredential.user);

				//Retrieve ID token
				firebase
					.auth()
					.currentUser.getIdToken(true)
					.then(function (idToken) {
						// Send login ID token to API
						const url = `/account/login/${idToken}`;
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
								user.name = loggedInUser.displayName;
								ctx.setUser(user);
								// props.setStatus('');
								props.setShow(false);
								props.setStatus('');
							}
						});
					});
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.dir(error);
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
			<button type="submit" className="btn btn-light" onClick={login}>
				Login
			</button>
			<br />
		</>
	);
}
