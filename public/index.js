function Spa() {
	return (
		<HashRouter>
			<div>
				<NavBar />
				<UserContext.Provider
					value={{
						users: [
							{
								name: 'Peter Parker',
								email: 'peter@mit.edu',
								password: 'secret',
								balance: 100,
							},
						],
					}}
				>
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
						</Routes>
					</div>
				</UserContext.Provider>
			</div>
		</HashRouter>
	);
}

ReactDOM.render(<Spa />, document.getElementById('root'));
