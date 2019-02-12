'use strict';

var jwt = require('jsonwebtoken');

var _require = require('./resolvers'),
    User = _require.User;

var expiresIn = "1d";
var secret = "samplejwtiotaxi";
var tokenPrefix = "JWT";

var createToken = function createToken(email, password) {
    if (!email || !password) {
        return false;
    }

    // console.log(email,password)

    var compare = new Promise(function (resolve, reject) {
        User.findOne({ 'email': email }).then(function (user) {
            console.log(user);
            if (!user) reject(false);
            user.comparePassword(password, function (err, isMatch) {
                console.log(isMatch);
                if (isMatch) {
                    var payload = {
                        name: user.name,
                        lastname: user.lastname,
                        admin: user.is_admin,
                        inspec: user.is_inspector,
                        email: user.email,
                        id: user._id,
                        avatar: user.avatar,
                        is_imt: user.is_imt,
                        is_caja: user.is_caja,
                        taller: user.is_taller,
                        uva: user.is_uva,
                        jefe_inspector: user.jefe_inspector,
                        administrativo: user.administrativo,
                        is_capt: user.is_capt,
                        finanzas: user.finanzas,
                        jefe_administrativo: user.jefe_administrativo,
                        admin_juridico: user.admin_juridico,
                        admin_tecnico: user.admin_tecnico,
                        capacitador: user.capacitador,
                        date_resp: user.date_resp
                    };
                    var token = jwt.sign(payload, secret);

                    resolve(token);
                } else {
                    reject(false);
                }
            });
        }).catch(function (err) {
            return err;
        });
    });

    return compare;
};

module.exports = {
    createToken: createToken
};