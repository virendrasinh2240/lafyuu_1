const generatePass = (length) => {
    let pass = ""
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz0123456789@#$';

    for (let i = 1; i < length; i++) {
        let char = math.floor(Math.random() * str.length)

        pass += str.charAt(char)
    }
    return pass
}

module.exports = generatePass