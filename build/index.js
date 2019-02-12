'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

var _require = require('apollo-server-express'),
    graphqlExpress = _require.graphqlExpress,
    graphiqlExpress = _require.graphiqlExpress;

var _require2 = require('graphql'),
    execute = _require2.execute,
    subscribe = _require2.subscribe;

var _require3 = require('subscriptions-transport-ws'),
    SubscriptionServer = _require3.SubscriptionServer;

var _require4 = require('http'),
    createServer = _require4.createServer;

var _require5 = require('./resolvers'),
    Message = _require5.Message,
    Device = _require5.Device,
    Report = _require5.Report,
    Records = _require5.Records;

var User = require('./User');

var _require6 = require('./verify'),
    verifyToken = _require6.verifyToken;

var _require7 = require('./create'),
    createToken = _require7.createToken;

var timestampToDate = require('date-from-timestamp');

var schema = require('./schema');

var app = express();

mongoose.connect('mongodb://cristian:1q2w3e4r5t6y@ds131905.mlab.com:31905/bus_proyect');
var db = mongoose.connection;
db.on('error', function () {
    return console.log("Error al conectar a la BD");
}).once('open', function () {
    return console.log("Conectado a la BD!!");
});

app.use(bodyParser.json());
app.use(cors());

function Unix_timestamp(t) {
    var dt = new Date(t * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = dt.getFullYear();
    var month = months[dt.getMonth()];
    var date = dt.getDate();
    var restart = 0;
    var hr = dt.getHours();
    var m = "0" + dt.getMinutes();
    var s = "0" + dt.getSeconds();
    return (/*date + '/' + month + '/' + year + ' ' + */hr + ':' + m.substr(-2) /* + ':' + s.substr(-2)*/
    );
}

app.post('/signup', function (req, res) {
    var user = req.body;
    User.create(user).then(function (user) {
        return res.status(201).json({ "message": "Usuario Creado",
            "id": user._id });
    }).catch(function (err) {
        console.log(err);
        return res.json(err);
    });
});

app.post('/login', cors(), function (req, res) {
    var token = createToken(req.body.email, req.body.password).then(function (token) {
        console.log(token);
        res.status(201).json({ token: token });
    }).catch(function () {
        res.status(403).json({
            message: "Login Failed!!!! :( Invalid credentials"
        });
    });
});

app.post('/createMessage', function (req, res) {
    var message = req.body;
    console.log(message);
    var hora = Unix_timestamp(message.timestamp);

    var dispositivo = Device.findOne({ sigfox: message.device }).exec();
    console.log(dispositivo.device);
    console.log(dispositivo);

    if (hora >= '4:00' && hora <= '5:00') {
        console.log("Entro al corte del día");
        Device.findOne({ sigfox: message.device }).exec(function (err, dev) {
            console.log("Reset p1", dev);
            var json = {
                "contEfectivo": dev.contEfectivo,
                "contKm": dev.contKm,
                "contTime": dev.contTime,
                "contTravel": dev.contTravel,
                "initTravel": dev.initTravel
            };
            Records.create(json).then(function (record) {
                console.log(record);
                Device.findOneAndUpdate({ sigfox: message.device }, { $push: { records: record._id } }, function (err, dev) {
                    return dev;
                });
                return record;
            });
            Device.findOneAndUpdate({ sigfox: message.device }, { $set: { contEfectivo: 0, contKm: 0, contTime: 0, contTravel: 0, initTravel: [] } }, function (err, dev) {
                return dev;
            });
        });
    }

    if (message.data.length === 6) {
        console.log("Entro un folio");
        Device.findOne({ sigfox: message.device }).exec(function (err, dev) {
            if (dev.lastLocation != null) {
                console.log(dev.lastLocation);
                Device.findOneAndUpdate({ sigfox: message.device }, { $push: { initTravel: dev.lastLocation } }, function (err, dev) {
                    console.log("Actualizacion de inicio de viajes");
                    return dev;
                });
                return dev;
            } else {
                return err;
            }
        });

        console.log("Salio del proceso de folio");
        return res.status(201).json({ "message": "Mensaje procesado", "Dispositivo": message.device });
    }

    if (message.data.length === 12) {
        console.log("entro una longitud 12");
        if (message.data.indexOf('00') === 0 || message.data.indexOf('01') === 0) {
            console.log("entro totalizador");
            var pesos = message.data.substr(0, 4);
            var cent = message.data.substr(4, 2);
            var cash = Number(pesos + "." + cent);
            var km = Number(message.data.substr(6, 3));
            var time = Number(message.data.substr(9, 3));
            console.log(cash, ",", km, ",", time);

            Device.findOneAndUpdate({ sigfox: message.device }, { $inc: { contEfectivo: cash, contKm: km, contTime: time, contTravel: 1 } }, function (err, dev) {
                return dev;
            });
            console.log("salio");
        } else {
            console.log("Entro una localización");
            Device.findOneAndUpdate({ sigfox: message.device }, { $set: { lastLocation: message.data } }, function (err, dev) {
                return dev;
            });
            return res.status(201).json({ "message": "Mensaje procesado", "Dispositivo": message.device });
        }
    }
});

/* app.get('/getHistory',(req,res) => {
    let rep = Reports.historyModel()
        console.log(rep);
        let repo = reports_history.find().exec()
        console.log(repo);
        return res.status(200).json({"message":"Dispositivo Creado","id":report})
}) */

app.post('/addDevice', function (req, res) {
    var device = req.body;
    // console.log(device)
    Device.create(device).then(function (device) {
        return res.status(201).json({ "message": "Dispositivo Creado", "id": device._id });
    }).catch(function (err) {
        console.log(err);
        return res.json(err);
    });
});

/* function getNextSequenceValue(sequenceName){

    var sequenceDocument = Reports.findOneAndUpdate({
       query:{folio: sequenceName },
       update: {$inc:{sequence_value:1}},
       new:true
    });
     
    return sequenceDocument.sequence_value;
 }

app.post('/addReport',(req,res) => {
    let report = req.body
    Reports.create(report).then((report) => {
        Reports.findOneAndUpdate({_id: report._id},{$set:{
            folio: getNextSequenceValue()
        }})
        console.log(report);
        return res.status(201).json({"message": "Reporte Creado", "id": report._id})
    }).catch((err)=>{
        console.log(err);
        return res.json(err)
    })
}) */

app.post('/updateDevice', function (req, res) {
    var device = req.body;
    // console.log(device)
    Device.findByIdAndUpdate(device._id, { $set: {
            sigfox: device.sigfox,
            name: device.name,
            concesionarioFullName: device.concesionarioFullName,
            concesionarioLastname: device.concesionarioLastname,
            concesionarioAddress: device.concesionarioAddress,
            concesionarioDistrict: device.concesionarioDistrict,
            concesionarioNumExt: device.concesionarioNumExt,
            concesionarioCp: device.concesionarioCp,
            concesionarioTel: device.concesionarioTel,
            conductorFullName: device.conductorFullName,
            conductorLastname: device.conductorLastname,
            concesion: device.concesion,
            conductorAddress: device.conductorAddress,
            conductorDistrict: device.conductorDistrict,
            conductorNumExt: device.conductorNumExt,
            conductorNumInt: device.conductorNumInt,
            conductorCp: device.conductorCp,
            conductorTel: device.conductorTel,
            marca_taximetro: device.marca_taximetro,
            modelo_taximetro: device.modelo_taximetro,
            numSerie_taximetro: device.numSerie_taximetro,
            marcaVehicle: device.marcaVehicle,
            modeloVehicle: device.modeloVehicle,
            placaVehicle: device.placaVehicle,
            yearVehicle: device.yearVehicle,
            image_url_conductor: device.image_url_conductor,
            image_url_fvehicle: device.image_url_fvehicle,
            image_url_lvehicle: device.image_url_lvehicle,
            image_url_rvehicle: device.image_url_rvehicle,
            image_url_bvehicle: device.image_url_bvehicle
        } }).then(function (device) {
        return res.status(200).json({ "message": "Dispositivo Actualizado", "id": device._id });
    }).catch(function (err) {
        console.log(err);
        return res.json(err);
    });
});

app.post('/updateMe', function (req, res) {
    var user = req.body;
    console.log(user);
    User.findByIdAndUpdate(user._id, { $set: {
            name: user.name,
            lastname: user.lastname,
            user_phone: user.user_phone,
            avatar: user.avatar,
            nickname: user.nickname
        } }).then(function (user) {
        return res.status(200).json({ "message": "Perfil Actualizado", "id": user._id });
    }).catch(function (err) {
        console.log(err);
        return res.json(err);
    });
});

/* app.use('/graphql',(req,res,next) => {
    const token  = req.headers['authorization'];
    try{
        req.user = verifyToken(token)
        next();
    }catch(error){
        res.status(401).json({message:error.message})
    }
}) */

app.use('/graphql', graphqlExpress({
    schema: schema
}));

/* app.use('/graphiql',(req,res,next) => {
    const token  = req.headers['authorization'];
    try{
        req.user = verifyToken(token)
        next();
    }catch(error){
        res.status(401).json({message:error.message})
    }
}) */

//wss://expr-back.herokuapp.com/subscriptions
app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: 'ws://localhost:3030/subscriptions'
}));

var PORT = process.env.PORT || 3030;

var server = createServer(app);
server.listen(PORT, function () {
    console.log('Server now running at port ' + PORT);
    new SubscriptionServer({
        execute: execute,
        subscribe: subscribe,
        schema: schema
    }, {
        server: server,
        path: '/subscriptions'
    });
});