var connection = require('../common/connection');

const userSchema = {
   firstName: String,
   lastName: String,
   email: String,
   password: String,
   permissionLevel: Number
};

const User = connection.getModel('Users', userSchema);

exports.createUser = (userData) => {
    const user = new User(userData);
    return user.save();
};

exports.findById = id => {
	return User.findById(id).then((result) => {
		result = result.toJSON();
		delete result._id;
		delete result.__v;
		delete result.password;
		return result; 
	});
}

exports.findByEmail = (email) => {
    return User.find({ email: email });
};

exports.patchUser = (id, userData) => {
    return new Promise((resolve, reject) => {
        User.findById(id, function (err, user) {
            if (err) reject(err);
            for (let i in userData) {
                user[i] = userData[i];
            }
            user.save(function (err, updatedUser) {
                if (err) return reject(err);
                resolve(updatedUser);
            });
        });
    })
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        User.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};

exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        User.deleteOne({_id: userId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};