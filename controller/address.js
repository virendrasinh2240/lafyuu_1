const Address = require('../models/address');
const User = require('../models/user');
const { validMobileNumber, checkValidStringType } = require('../utils/validation');

exports.add_address = async (req, res, next) => {
    try {
        const { user_id } = req.user;

        const { region, first_name, last_name, street_address, street_address2, city, state, zip_code, phone_number } = req.body;

        if (!region) {
            throw new Error("Please provide region");
        }
        checkValidStringType(region);

        if (!first_name) {
            throw new Error("Please provide first_name");
        }
        checkValidStringType(first_name);

        if (!last_name) {
            throw new Error("Please provide last_name");
        }
        checkValidStringType(last_name);

        if (!city) {
            throw new Error("Please provide city");
        }
        checkValidStringType(city);

        if (!state) {
            throw new Error("Please provide state");
        }
        checkValidStringType(state);

        if (!phone_number) {
            throw new Error("Please provide phone_number");
        }
        validMobileNumber(phone_number);

        function isValidZipCode(value) {
            if (!/^([0-9]{6})$/.test(value)) {
                throw new Error('Invalid zip_code format. It must be a 6-digit number');
            }
        }
        isValidZipCode(zip_code);

        const user = await User.findById(user_id);
        if (!user) {
            throw new Error('Provided user_id does not exist.');
        }

        const address = new Address({
            region,
            first_name,
            last_name,
            street_address,
            street_address2,
            city,
            state,
            zip_code,
            phone_number,
            user_id
        });

        await address.save();

        res.status(200).json({
            status: {
                message: "Successfully added address to user",
                code: 200,
                error: false
            },
            data: { address }
        });
    } catch (error) {
        next(error);
    }
};

exports.get_address = async (req, res, next) => {
    try {
        const { user_id } = req.user;

        const addresses = await Address.find({ user_id });

        if (addresses.length === 0) {
            return res.status(400).json({
                status: {
                    message: 'No available address',
                    code: 400,
                    error: true
                }
            });
        }

        return res.status(200).json({
            status: {
                message: 'Successfully fetched address',
                code: 200,
                error: false
            },
            data: { addresses }
        });
    } catch (error) {
        next(error);
    }
};

exports.editAddress = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const { address_id, region, first_name, last_name, street_address, street_address2, city, state, zip_code, phone_number } = req.body;

        const user = await User.findById(user_id);
        if (!user) {
            return res.status(400).json({
                status: {
                    message: 'Provided user_id does not exist.',
                    code: 400,
                    error: true
                }
            });
        }

        const address = await Address.findById(address_id);
        if (!address) {
            return res.status(400).json({
                status: {
                    message: 'Provided address_id does not exist.',
                    code: 400,
                    error: true
                }
            });
        }

        if (address.user_id.toString() !== user_id.toString()) {
            return res.status(400).json({
                status: {
                    message: 'Unauthorized to update this address',
                    code: 400,
                    error: true
                }
            });
        }

        function isValidZipCode(value) {
            if (!/^([0-9]{6})$/.test(value)) {
                throw new Error('Invalid zip_code format. It must be a 6-digit number');
            }
        }
        isValidZipCode(zip_code);

        if (phone_number && !/^[6-9]\d{9}$/.test(phone_number)) {
            return res.status(400).json({
                status: {
                    message: 'Please provide a valid Indian mobile number',
                    code: 400,
                    error: true
                }
            });
        }

        if (region) address.region = region;
        if (first_name) address.first_name = first_name;
        if (last_name) address.last_name = last_name;
        if (street_address) address.street_address = street_address;
        if (street_address2) address.street_address2 = street_address2;
        if (city) address.city = city;
        if (state) address.state = state;
        if (zip_code) address.zip_code = zip_code;
        if (phone_number) address.phone_number = phone_number;

        await address.save();

        return res.status(200).json({
            status: {
                message: 'Address updated successfully',
                code: 200,
                error: false
            },
            data: { address }
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteAddress = async (req, res, next) => {
    try {
        const { address_id } = req.query;

        if (!address_id) {
            return res.status(400).json({
                status: {
                    message: 'Please provide address_id',
                    code: 400,
                    error: true
                }
            });
        }

        const address = await Address.findById(address_id);

        if (!address) {
            throw new Error("Provided address_id does not exist.");
        }

        await address.remove();

        return res.status(200).json({
            status: {
                message: 'Address deleted successfully',
                code: 200,
                error: false
            }
        });
    } catch (error) {
        next(error);
    }
};
