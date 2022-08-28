//import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js';

function CreateAccount() {
	const [show, setShow] = React.useState(true);
	const [status, setStatus] = React.useState('');

	return (
		<Card
			bgcolor="primary"
			header="Create Account"
			status={status}
			body={
				show ? (
					<CreateForm setShow={setShow} setStatus={setStatus} />
				) : (
					<CreateMsg setShow={setShow} />
				)
			}
		/>
	);
}

function CreateMsg(props) {
	return (
		<>
			<h5>Success!</h5>
			<br />
			<h6>Your name and account balance</h6>
			<h6>are displayed above</h6>
			{/* <button
				type="submit"
				className="btn btn-light"
				onClick={() => props.setShow(true)}
			>
				Add another account
			</button> */}
		</>
	);
}

function CreateForm(props) {
	const [name, setName] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');

	const ctx = React.useContext(UserContext);

	// add firebase authentication sign-up

	// from video 27.21 at 0:34
	function createUser() {
		if (name == '') {
			props.setStatus('You must enter a name.');
			return;
		}
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

		auth
			.createUserWithEmailAndPassword(email, password)
			.then((userCredential) => {
				// Signed in
				const user = userCredential.user;
				console.log(userCredential.user);
				// Retrieve ID token
				firebase
					.auth()
					.currentUser.getIdToken(true)
					.then(function (idToken) {
						// Send createacount ID token to API
						const url = `/account/create/${idToken}`;
						(async () => {
							const res = await fetch(url);
							const data = await res.json();
							return data;
						})().then((user) => {
							if (user.error) {
								console.log(user.error);
							} else {
								console.dir(user);
								ctx.setUser(user);
								props.setStatus('');
							}
						});
						props.setShow(false);
					});
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.dir(error);
				// ..
			});
	}
	return (
		<form>
			Name
			<br />
			<input
				type="input"
				className="form-control"
				placeholder="Enter name"
				value={name}
				onChange={(e) => setName(e.currentTarget.value)}
			/>
			<br />
			Email address
			<br />
			<input
				type="email"
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
			<input
				type="submit"
				value="Create Account"
				className="btn btn-light"
				onClick={createUser}
			/>
		</form>
	);
}
