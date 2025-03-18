const lawyerModel = require('../models/lawyer.model');


module.exports.createLawyer = async ({
    firstName, lastName, email, password,
}) => {
    if (!firstName || !email || !password) {
        throw new Error('All fields are required');
    }
    const lawyer = await lawyerModel.create({
        fullName: {
            firstName,
            lastName
        },
        email,
        password,
    })

    return lawyer;
}