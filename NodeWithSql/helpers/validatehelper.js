var constraints = {
    user: {
        UserName: {
            presence: true,
            exclusion: {
                minimum: 6,
                message: "must be at least 6 characters"
            }
        },
        Password: {
            presence: true,
            length: {
                minimum: 6,
                maximum:10,
                message: "must be of minimum 6 characters and maximum 10 charecters"
            }
        },
        Email: {
            email: true
            // format: {
            //     pattern: "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",
            //     message: "is not valid"
            // }
        }
    }
};

module.exports = constraints;