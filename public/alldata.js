// from video 27.21 at 1:41
function AllData() {
	const [data, setData] = React.useState('');

	React.useEffect(() => {
		// fetch all accounts from API
		fetch('/account/all')
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setData(JSON.stringify(data));
			});
	}, []);

	return (
		<>
			<h5>All User Transactions</h5>
			{data}
		</>
	);
}
