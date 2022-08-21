function Spa() {
	const [user, setUser] = React.useState({});
	return (
		<HashRouter>
			<div>
				<UserContext.Provider value={{ user, setUser }}>
					<NavBar />
					<div className="container" style={{ padding: '20px' }}>
						<Routes>
							<Route path="/" exact element={<Home />} />
							<Route path="/CreateAccount/" element={<CreateAccount />} />
							<Route path="/login/" element={<Login />} />
							<Route path="/deposit/" element={<Deposit />} />
							<Route path="/withdraw/" element={<Withdraw />} />
							{/* <Route path="/transactions/" element={<Transactions/>} /> */}
							<Route path="/balance/" element={<Balance />} />
							<Route path="/alldata/" element={<AllData />} />
							<Route path="/transactionlist/" element={<TransactionList />} />
						</Routes>
					</div>
				</UserContext.Provider>
			</div>
		</HashRouter>
	);
}

ReactDOM.render(<Spa />, document.getElementById('root'));
