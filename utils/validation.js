const validator = require("validator")
const PhonNumber = require("libphonenumber-js")

exports.validEmail = (email) => {
    if (!validator.isEmail(email)) {
        throw new Error("invalid email address")
    }
    return email
}

exports.validPassword = (password) => {
    if (!validator.isStrongPassword(password)) {
        throw new Error("please enter a valid password")
    }
    return password
}

exports.validStringInput = (value) => {
    if (!value.match(/^[a-zA-Z -]+$/)) throw new Error('please provide only alphabetic characters')
    return value
}

exports.validDOB = (DOB) => {
    if (!validator.isDate(DOB, { format: 'DD/MM/YYYY', strictMode: true })) throw new Error('please provide valid Birth-Date')
    return DOB
}

exports.validMobileNumber = (mobileNumber) => {
    const phonNumber = PhonNumber.parse(mobileNumber, "IN")

    if (!PhonNumber.isValidNumber(phonNumber) || PhonNumber.country) {
        throw new Error("please provide a valid indian mobile number");

    }
    return mobileNumber
}

exports.checkValidStringType = (value) => {
    try {
        if (typeof value !== "string") {
            throw new Error("please provide a alphabetic value for name or title");
        }
    } catch (err) {
        throw err
    }
}

