const getProfileQuery = ({type, id}) => {
	return {
		[type === 'client' ? 'clientId' : 'contractorId']: id,
	};
};

const contractStatuses = {
	new: 'new',
	inProgress: 'in_progress',
	terminated: 'terminated',
};

module.exports = {
	getProfileQuery,
	contractStatuses,
};
