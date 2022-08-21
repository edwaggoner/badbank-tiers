function NavBar() {
	const ctx = React.useContext(UserContext);

	const createAccountLink = (
		<li className="nav-item">
			<a className="nav-link" href="/#/CreateAccount/">
				Create Account
			</a>
		</li>
	);

	const loginLink = (
		<li className="nav-item">
			<a className="nav-link" href="/#/login/">
				Login
			</a>
		</li>
	);

	const depositLink = (
		<li className="nav-item">
			<a className="nav-link" href="/#/deposit/">
				Deposit
			</a>
		</li>
	);

	const withdrawLink = (
		<li className="nav-item">
			<a className="nav-link" href="/#/withdraw/">
				Withdraw
			</a>
		</li>
	);

	const balanceLink = (
		<li className="nav-item">
			<a className="nav-link" href="/#/balance/">
				Balance
			</a>
		</li>
	);

	const transactionListLink = (
		<li className="nav-item">
			<a className="nav-link" href="/#/transactionlist/">
				Transaction List
			</a>
		</li>
	);

	const logoutLink = (
		<a className="btn btn-outline-primary btn-sm" href="/" role="button">
			Logout
		</a>
	);

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<a className="navbar-brand" href="#">
				GoodBank
			</a>
			<button
				className="navbar-toggler"
				type="button"
				data-toggle="collapse"
				data-target="#navbarNav"
				aria-controls="navbarNav"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span className="navbar-toggler-icon"></span>
			</button>
			<div className="collapse navbar-collapse" id="navbarNav">
				<ul className="navbar-nav">
					{!ctx.user.name ? createAccountLink : ''}
					{!ctx.user.name ? loginLink : ''}
					{ctx.user.name ? depositLink : ''}
					{ctx.user.name ? withdrawLink : ''}
					{ctx.user.name ? balanceLink : ''}
					{ctx.user.name ? transactionListLink : ''}
				</ul>
			</div>
			{ctx.user.name ? `Welcome, ${ctx.user.name}!` : ''}
			{ctx.user.name ? logoutLink : ''}
		</nav>
	);
}
