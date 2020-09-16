const {profileTypes} = require('./enums');

const getProfileQuery = ({type, id}) => {
	return {
		[type === profileTypes.client ? 'clientId' : 'contractorId']: id,
	};
};

module.exports = {
	getProfileQuery,
};
