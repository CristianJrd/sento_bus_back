'use strict';

var _User = require('./User');

var _User2 = _interopRequireDefault(_User);

var _Reports = require('./Reports');

var _mongoose = require('mongoose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('graphql-subscriptions'),
    PubSub = _require.PubSub,
    withFilter = _require.withFilter;

var pubsub = new PubSub();
var mongoose = require('mongoose');


var users = [];
var messages = [];
var devices = [];
var reports = [];
var verifications = [];
var talleres = [];
var scans = [];
var tests = [];

var Message = mongoose.model('Message', {
  "device": {
    type: String,
    required: true
  },
  "timestamp": {
    type: Number,
    required: true
  },
  "data": {
    type: String,
    required: true
  } });

var User = _User2.default;

var Device = mongoose.model('Device', {
  "sigfox": {
    type: String,
    required: true,
    unique: true
  },
  "concesion": {
    type: String,
    required: true,
    unique: true
  },
  "name": {
    type: String,
    required: true
  },
  "concesionarioFullName": {
    type: String
  },
  "concesionarioLastname": {
    type: String
  },
  "concesionarioAddress": {
    type: String
  },
  "concesionarioDistrict": {
    type: String
  },
  "concesionarioNumExt": {
    type: String
  },
  "concesionarioCp": {
    type: String
  },
  "concesionarioTel": {
    type: String
  },
  "marcaVehicle": {
    type: String
  },
  "modeloVehicle": {
    type: String
  },
  "placaVehicle": {
    type: String
  },
  "yearVehicle": {
    type: String
  },
  "image_url_fvehicle": {
    type: String
  },
  "image_url_lvehicle": {
    type: String
  },
  "image_url_rvehicle": {
    type: String
  },
  "image_url_bvehicle": {
    type: String
  },
  "image_url_conductor": {
    type: String
  },
  "conductorFullName": {
    type: String
  },
  "conductorLastname": {
    type: String
  },
  "conductorAddress": {
    type: String
  },
  "conductorDistrict": {
    type: String
  },
  "conductorNumExt": {
    type: String
  },
  "conductorNumInt": {
    type: String
  },
  "conductorCp": {
    type: String
  },
  "conductorTel": {
    type: String
  },
  "marca_taximetro": {
    type: String
  },
  "modelo_taximetro": {
    type: String
  },
  "numSerie_taximetro": {
    type: String
  },
  "velocidadMaxima": {
    type: String,
    default: 0
  },
  "initTravel": [{
    type: String,
    default: []
  }],
  "lastLocation": {
    type: String
  },
  "contTravel": {
    type: Number,
    default: 0
  },
  "contTime": {
    type: Number,
    default: 0
  },
  "contKm": {
    type: Number,
    default: 0
  },
  "contEfectivo": {
    type: Number,
    default: 0
  },
  "records": [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: "Records"
  }]
});

var Records = mongoose.model('Records', {
  "contKm": {
    type: String
  },
  "contTravel": {
    type: String
  },
  "contEfectivo": {
    type: String
  },
  "contTime": {
    type: String
  },
  "velocidadMaxima": {
    type: String
  },
  "initTravel": [{
    type: String
  }],
  "date": {
    type: Date,
    default: new Date()
  }
});

var Report = _Reports.Reports;

var Verifications = mongoose.model('Verification', {
  "concesion_verificar": {
    type: String
  },
  "fecha_verificacion": {
    type: Date,
    default: new Date()
  },
  "is_verificado": {
    type: Boolean,
    default: false
  }
});

var Taller = mongoose.model('Taller', {
  "nombre_tecnico": {
    type: String
  },
  "is_reparacion": {
    type: Boolean,
    default: false
  },
  "is_instalacion": {
    type: Boolean,
    default: false
  },
  "descripcion_evento": {
    type: String
  },
  "concesion_verificada": {
    type: String
  },
  "fecha_evento": {
    type: Date,
    default: new Date()
  }
});

var Scans = mongoose.model('Scans', {
  "juridico": {
    type: String
  },
  "concesion": {
    type: String
  },
  "driver_card": {
    type: String
  },
  "img_vehicle_f": {
    type: String
  },
  "img_vehicle_b": {
    type: String
  },
  "img_vehicle_l": {
    type: String
  },
  "img_vehicle_r": {
    type: String
  },
  "img_conductor": {
    type: String
  },
  "id_chofer": {
    type: String
  },
  "img_concesionario": {
    type: String
  },
  "id_concesionario": {
    type: String
  },
  "proof_address_cond": {
    type: String
  },
  "proof_address_conce": {
    type: String
  },
  "title_concesion": {
    type: String
  },
  "criminal_record_cond": {
    type: String
  }
});

var Driver_Tests = mongoose.model('Driver_Tests', {
  "concesion": {
    type: String
  },
  "date_test": {
    type: Date,
    default: new Date()
  },
  "comments": {
    type: String
  },
  "success": {
    type: Boolean,
    default: false
  }
});

var resolvers = {
  Query: {
    getUsers: function getUsers(parentValue, params) {
      var users = User.find().exec();
      return users;
    },
    getMessages: function getMessages(parentValue, params) {
      var messages = Message.find().exec();
      return messages;
    },
    getDevices: function getDevices(parentValue, params) {
      var devices = Device.find().exec();
      return devices;
    },
    singleDevice: function singleDevice(parentValue, params) {
      var device = Device.findById(params.id).exec();
      return device;
    },
    singleUser: function singleUser(parentValue, params) {
      var user = User.findById(params.id).exec();
      return user;
    },
    nameUser: function nameUser(parentValue, params) {
      var name_user = User.findOne({ name: params.name }).exec();
      return name_user;
    },
    getReports: function getReports(parentValue, params) {
      var reports = Report.find().exec();
      return reports;
    },
    singleReport: function singleReport(parentValue, params) {
      var report = Report.findById(params.id).exec();
      return report;
    },
    conceReport: function conceReport(parentValue, params) {
      var report = Report.find({ concesion_report: params.concesion_report }).exec();
      return report;
    },
    conceDevice: function conceDevice(parentValue, params) {
      var conce = Device.findOne({ concesion: params.concesion }).exec();
      return conce;
    },
    getHistory: function getHistory(parentValue, params) {
      var hist = _Reports.reports_history.find().exec();
      return hist;
    },
    getHistoryCreated: function getHistoryCreated(parentValue, params) {
      var hist_created = _Reports.reports_history.find({ o: "i" }).exec();
      return hist_created;
    },
    getRecords: function getRecords(parentValue, params) {
      var record = Records.find().exec();
      return record;
    },
    getVerificacion: function getVerificacion(parentValue, params) {
      var verif = Verifications.find().exec();
      return verif;
    },
    singleRecords: function singleRecords(parentValue, params) {
      var record = Records.findById(params.id).exec();
      return record;
    },
    conceVerificacion: function conceVerificacion(parentValue, params) {
      var conce_verif = Verifications.findOne({ concesion_verificar: params.concesion_verificar }).exec();
      return conce_verif;
    },
    getTaller: function getTaller(parentValue, params) {
      var taller = Taller.find().exec();
      return taller;
    },
    conceTaller: function conceTaller(parentValue, params) {
      var conce_taller = Taller.findOne({ concesion_verificada: params.concesion_verificada }).exec();
      return conce_taller;
    },
    singleTaller: function singleTaller(parentValue, params) {
      var single_taller = Taller.findById(params.id).exec();
      return single_taller;
    },
    getScans: function getScans(parentValue, params) {
      var scans = Scans.find().exec();
      return scans;
    },
    singleScan: function singleScan(parentValue, params) {
      var single_scan = Scans.findById(params.id).exec();
      return single_scan;
    },
    conceScan: function conceScan(parentValue, params) {
      var conce_scan = Scans.findOne({ concesion: params.concesion }).exec();
      return conce_scan;
    },
    getTests: function getTests(parentValue, params) {
      var tests = Driver_Tests.find().exec();
      return tests;
    },
    singleTest: function singleTest(parentValue, params) {
      var single_test = Driver_Tests.findById(params.id).exec();
      return single_test;
    },
    conceTest: function conceTest(parentValue, params) {
      var conce_test = Driver_Tests.findOne({ concesion: params.concesion }).exec();
      return conce_test;
    }
  },
  Mutation: {
    signup: function signup(parentValue, _ref) {
      var name = _ref.name,
          lastname = _ref.lastname,
          email = _ref.email,
          password = _ref.password,
          user_phone = _ref.user_phone,
          avatar = _ref.avatar,
          nickname = _ref.nickname,
          is_admin = _ref.is_admin,
          is_inspector = _ref.is_inspector,
          is_imt = _ref.is_imt,
          is_caja = _ref.is_caja,
          is_taller = _ref.is_taller,
          is_uva = _ref.is_uva,
          jefe_inspector = _ref.jefe_inspector,
          administrativo = _ref.administrativo,
          is_capt = _ref.is_capt,
          finanzas = _ref.finanzas,
          jefe_administrativo = _ref.jefe_administrativo,
          admin_juridico = _ref.admin_juridico,
          admin_tecnico = _ref.admin_tecnico,
          capacitador = _ref.capacitador,
          date_resp = _ref.date_resp;

      users.push({ name: name, lastname: lastname, email: email, password: password, user_phone: user_phone, avatar: avatar, nickname: nickname, is_admin: is_admin, is_inspector: is_inspector, is_imt: is_imt, is_caja: is_caja, is_taller: is_taller, is_uva: is_uva, jefe_inspector: jefe_inspector, administrativo: administrativo, is_capt: is_capt, finanzas: finanzas, jefe_administrativo: jefe_administrativo, admin_juridico: admin_juridico, admin_tecnico: admin_tecnico, capacitador: capacitador, date_resp: date_resp });

      var user = new User({ name: name, lastname: lastname, email: email, password: password, user_phone: user_phone, avatar: avatar, nickname: nickname, is_admin: is_admin, is_inspector: is_inspector, is_imt: is_imt, is_caja: is_caja, is_taller: is_taller, is_uva: is_uva, jefe_inspector: jefe_inspector, administrativo: administrativo, is_capt: is_capt, finanzas: finanzas, jefe_administrativo: jefe_administrativo, admin_juridico: admin_juridico, admin_tecnico: admin_tecnico, capacitador: capacitador, date_resp: date_resp });
      user.save().then(function () {
        return console.log("user creado");
      });

      pubsub.publish('newUserAdded', {
        newUserAdded: { name: name, lastname: lastname, email: email, password: password, user_phone: user_phone, avatar: avatar, nickname: nickname, is_admin: is_admin, is_inspector: is_inspector, is_imt: is_imt, is_caja: is_caja, is_taller: is_taller, is_uva: is_uva }
      });
      return users;
    },
    updateUser: function updateUser(parentValue, params) {
      return User.findOneAndUpdate({ _id: params._id }, { $set: {
          name: params.data,
          lastname: params.lastname,
          user_phone: params.user_phone,
          avatar: params.avatar,
          nickname: params.nickname
        } }).then(function (user) {
        return user;
      }).catch(function (err) {
        throw new Error("Error al hacer update");
      });
    },
    addReport: function addReport(parentValue, _ref2) {
      var user_report = _ref2.user_report,
          title_report = _ref2.title_report,
          concesion_report = _ref2.concesion_report,
          descripcion_report = _ref2.descripcion_report,
          fecha_report = _ref2.fecha_report,
          cita_report = _ref2.cita_report,
          fin_report = _ref2.fin_report,
          foto_incidente = _ref2.foto_incidente,
          folio_tarjeton = _ref2.folio_tarjeton,
          num_licencia = _ref2.num_licencia,
          vencimiento_licencia = _ref2.vencimiento_licencia,
          vencimiento_poliza = _ref2.vencimiento_poliza,
          tipo_licencia = _ref2.tipo_licencia,
          nombre_queja = _ref2.nombre_queja,
          tel_queja = _ref2.tel_queja,
          tipo_reporte = _ref2.tipo_reporte,
          monto_multa = _ref2.monto_multa,
          pagado = _ref2.pagado,
          folio = _ref2.folio;

      reports.push({ user_report: user_report, title_report: title_report, concesion_report: concesion_report, descripcion_report: descripcion_report, fecha_report: fecha_report, cita_report: cita_report, fin_report: fin_report, foto_incidente: foto_incidente, folio_tarjeton: folio_tarjeton, num_licencia: num_licencia, vencimiento_licencia: vencimiento_licencia, vencimiento_poliza: vencimiento_poliza, tipo_licencia: tipo_licencia, nombre_queja: nombre_queja, tel_queja: tel_queja, tipo_reporte: tipo_reporte, monto_multa: monto_multa, pagado: pagado, folio: folio });

      var repor = new Report({ user_report: user_report, title_report: title_report, concesion_report: concesion_report, descripcion_report: descripcion_report, fecha_report: fecha_report, cita_report: cita_report, fin_report: fin_report, foto_incidente: foto_incidente, folio_tarjeton: folio_tarjeton, num_licencia: num_licencia, vencimiento_licencia: vencimiento_licencia, vencimiento_poliza: vencimiento_poliza, tipo_licencia: tipo_licencia, nombre_queja: nombre_queja, tel_queja: tel_queja, tipo_reporte: tipo_reporte, monto_multa: monto_multa, pagado: pagado, folio: folio });
      repor.save().then(function () {
        return console.log('report creado con folio: ' + repor.folio);
      });

      pubsub.publish('newReportAdded', {
        newReportAdded: { user_report: user_report, title_report: title_report, concesion_report: concesion_report, descripcion_report: descripcion_report, fecha_report: fecha_report, cita_report: cita_report }
      });

      return reports;
    },
    addVerificacion: function addVerificacion(parentValue, _ref3) {
      var concesion_verificar = _ref3.concesion_verificar,
          fecha_verificacion = _ref3.fecha_verificacion,
          is_verificado = _ref3.is_verificado;

      verifications.push({ concesion_verificar: concesion_verificar, fecha_verificacion: fecha_verificacion, is_verificado: is_verificado });

      var verifs = new Verifications({ concesion_verificar: concesion_verificar, fecha_verificacion: fecha_verificacion, is_verificado: is_verificado });
      verifs.save().then(function () {
        return console.log("verification added");
      });
    },
    addTaller: function addTaller(parentValue, _ref4) {
      var nombre_tecnico = _ref4.nombre_tecnico,
          is_reparacion = _ref4.is_reparacion,
          is_instalacion = _ref4.is_instalacion,
          descripcion_evento = _ref4.descripcion_evento,
          concesion_verificada = _ref4.concesion_verificada,
          fecha_evento = _ref4.fecha_evento;

      talleres.push({ nombre_tecnico: nombre_tecnico, is_reparacion: is_reparacion, is_instalacion: is_instalacion, descripcion_evento: descripcion_evento, concesion_verificada: concesion_verificada, fecha_evento: fecha_evento });

      var taller = new Taller({ nombre_tecnico: nombre_tecnico, is_reparacion: is_reparacion, is_instalacion: is_instalacion, descripcion_evento: descripcion_evento, concesion_verificada: concesion_verificada, fecha_evento: fecha_evento });
      taller.save().then(function () {
        return console.log("added taller report");
      });
    },
    addScans: function addScans(parentValue, _ref5) {
      var juridico = _ref5.juridico,
          concesion = _ref5.concesion,
          driver_card = _ref5.driver_card,
          img_vehicle_f = _ref5.img_vehicle_f,
          img_vehicle_b = _ref5.img_vehicle_b,
          img_vehicle_l = _ref5.img_vehicle_l,
          img_vehicle_r = _ref5.img_vehicle_r,
          img_conductor = _ref5.img_conductor,
          id_chofer = _ref5.id_chofer,
          img_concesionario = _ref5.img_concesionario,
          id_concesionario = _ref5.id_concesionario,
          proof_address_conce = _ref5.proof_address_conce,
          proof_address_cond = _ref5.proof_address_cond,
          title_concesion = _ref5.title_concesion,
          criminal_record_cond = _ref5.criminal_record_cond;

      scans.push({ juridico: juridico, concesion: concesion, driver_card: driver_card, img_vehicle_f: img_vehicle_f, img_vehicle_b: img_vehicle_b, img_vehicle_l: img_vehicle_l, img_vehicle_r: img_vehicle_r, img_conductor: img_conductor, id_chofer: id_chofer, img_concesionario: img_concesionario, id_concesionario: id_concesionario, proof_address_conce: proof_address_conce, proof_address_cond: proof_address_cond, title_concesion: title_concesion, criminal_record_cond: criminal_record_cond });

      var scan = new Scans({ juridico: juridico, concesion: concesion, driver_card: driver_card, img_vehicle_f: img_vehicle_f, img_vehicle_b: img_vehicle_b, img_vehicle_l: img_vehicle_l, img_vehicle_r: img_vehicle_r, img_conductor: img_conductor, id_chofer: id_chofer, img_concesionario: img_concesionario, id_concesionario: id_concesionario, proof_address_conce: proof_address_conce, proof_address_cond: proof_address_cond, title_concesion: title_concesion, criminal_record_cond: criminal_record_cond });
      scan.save().then(function () {
        return console.log("added scans");
      });
    },
    addTest: function addTest(parentValue, _ref6) {
      var concesion = _ref6.concesion,
          date_test = _ref6.date_test,
          comments = _ref6.comments,
          success = _ref6.success;

      tests.push({ concesion: concesion, date_test: date_test, comments: comments, success: success });

      var test = new Driver_Tests({ concesion: concesion, date_test: date_test, comments: comments, success: success });
      test.save().then(function () {
        return console.log("added test");
      });
    },
    addMessage: function addMessage(parentValue, _ref7) {
      var device = _ref7.device,
          timestamp = _ref7.timestamp,
          data = _ref7.data;

      messages.push({ device: device, timestamp: timestamp, data: data });

      var mess = new Message({ device: device, data: data, timestamp: timestamp });
      mess.save().then(function () {
        return console.log("message creado");
      });

      pubsub.publish('newMessageAdded', {
        newMessageAdded: { device: device, timestamp: timestamp, data: data }
      });

      return messages;
    },
    addDevice: function addDevice(parentValue, _ref8) {
      var sigfox = _ref8.sigfox,
          concesion = _ref8.concesion,
          name = _ref8.name,
          concesionarioFullName = _ref8.concesionarioFullName,
          concesionarioLastname = _ref8.concesionarioLastname,
          concesionarioAddress = _ref8.concesionarioAddress,
          concesionarioDistrict = _ref8.concesionarioDistrict,
          concesionarioNumExt = _ref8.concesionarioNumExt,
          concesionarioCp = _ref8.concesionarioCp,
          concesionarioTel = _ref8.concesionarioTel,
          marcaVehicle = _ref8.marcaVehicle,
          modeloVehicle = _ref8.modeloVehicle,
          placaVehicle = _ref8.placaVehicle,
          yearVehicle = _ref8.yearVehicle,
          image_url_fvehicle = _ref8.image_url_fvehicle,
          image_url_lvehicle = _ref8.image_url_lvehicle,
          image_url_rvehicle = _ref8.image_url_rvehicle,
          image_url_bvehicle = _ref8.image_url_bvehicle,
          image_url_conductor = _ref8.image_url_conductor,
          conductorFullName = _ref8.conductorFullName,
          conductorLastname = _ref8.conductorLastname,
          conductorAddress = _ref8.conductorAddress,
          conductorDistrict = _ref8.conductorDistrict,
          conductorNumExt = _ref8.conductorNumExt,
          conductorNumInt = _ref8.conductorNumInt,
          conductorCp = _ref8.conductorCp,
          conductorTel = _ref8.conductorTel,
          marca_taximetro = _ref8.marca_taximetro,
          modelo_taximetro = _ref8.modelo_taximetro,
          numSerie_taximetro = _ref8.numSerie_taximetro,
          velocidadMaxima = _ref8.velocidadMaxima,
          initTravel = _ref8.initTravel,
          lastLocation = _ref8.lastLocation,
          contTravel = _ref8.contTravel,
          contTime = _ref8.contTime,
          contKm = _ref8.contKm,
          contEfectivo = _ref8.contEfectivo,
          records = _ref8.records;

      devices.push({ sigfox: sigfox, concesion: concesion, name: name, concesionarioFullName: concesionarioFullName, concesionarioLastname: concesionarioLastname, concesionarioAddress: concesionarioAddress, concesionarioDistrict: concesionarioDistrict,
        concesionarioNumExt: concesionarioNumExt, concesionarioCp: concesionarioCp, concesionarioTel: concesionarioTel, marcaVehicle: marcaVehicle, modeloVehicle: modeloVehicle, placaVehicle: placaVehicle, yearVehicle: yearVehicle,
        image_url_fvehicle: image_url_fvehicle, image_url_lvehicle: image_url_lvehicle, image_url_rvehicle: image_url_rvehicle, image_url_bvehicle: image_url_bvehicle, image_url_conductor: image_url_conductor,
        conductorFullName: conductorFullName, conductorLastname: conductorLastname, conductorAddress: conductorAddress, conductorDistrict: conductorDistrict, conductorNumExt: conductorNumExt, conductorNumInt: conductorNumInt, conductorCp: conductorCp, conductorTel: conductorTel, marca_taximetro: marca_taximetro, modelo_taximetro: modelo_taximetro, numSerie_taximetro: numSerie_taximetro, velocidadMaxima: velocidadMaxima,
        initTravel: initTravel, lastLocation: lastLocation, contTravel: contTravel, contTime: contTime, contKm: contKm, contEfectivo: contEfectivo, records: records });

      var dev = new Device({ sigfox: sigfox, concesion: concesion, name: name, concesionarioFullName: concesionarioFullName, concesionarioLastname: concesionarioLastname,
        concesionarioAddress: concesionarioAddress, concesionarioDistrict: concesionarioDistrict, concesionarioNumExt: concesionarioNumExt,
        concesionarioCp: concesionarioCp, concesionarioTel: concesionarioTel, marcaVehicle: marcaVehicle, modeloVehicle: modeloVehicle,
        placaVehicle: placaVehicle, yearVehicle: yearVehicle, image_url_fvehicle: image_url_fvehicle, image_url_lvehicle: image_url_lvehicle, image_url_rvehicle: image_url_rvehicle,
        image_url_bvehicle: image_url_bvehicle, image_url_conductor: image_url_conductor, conductorFullName: conductorFullName, conductorLastname: conductorLastname, conductorAddress: conductorAddress,
        conductorDistrict: conductorDistrict, conductorNumExt: conductorNumExt, conductorNumInt: conductorNumInt, conductorCp: conductorCp, conductorTel: conductorTel,
        marca_taximetro: marca_taximetro, modelo_taximetro: modelo_taximetro, numSerie_taximetro: numSerie_taximetro, velocidadMaxima: velocidadMaxima,
        initTravel: initTravel, lastLocation: lastLocation, contTravel: contTravel, contTime: contTime, contKm: contKm, contEfectivo: contEfectivo, records: records });
      dev.save().then(function () {
        return console.log("device creado");
      });

      pubsub.publish('newDeviceAdded', {
        newDeviceAdded: { sigfox: sigfox, concesion: concesion, name: name, concesionarioFullName: concesionarioFullName, concesionarioAddress: concesionarioAddress, concesionarioDistrict: concesionarioDistrict,
          concesionarioNumExt: concesionarioNumExt, concesionarioCp: concesionarioCp, concesionarioTel: concesionarioTel, marcaVehicle: marcaVehicle, modeloVehicle: modeloVehicle, placaVehicle: placaVehicle, yearVehicle: yearVehicle,
          image_url_fvehicle: image_url_fvehicle, image_url_lvehicle: image_url_lvehicle, image_url_rvehicle: image_url_rvehicle, image_url_bvehicle: image_url_bvehicle, image_url_conductor: image_url_conductor,
          conductorFullName: conductorFullName, conductorAddress: conductorAddress, conductorDistrict: conductorDistrict, conductorNumExt: conductorNumExt, conductorNumInt: conductorNumInt, conductorCp: conductorCp, conductorTel: conductorTel, velocidadMaxima: velocidadMaxima,
          initTravel: initTravel, lastLocation: lastLocation, contTravel: contTravel, contTime: contTime, contKm: contKm, contEfectivo: contEfectivo, records: records }
      });

      return devices;
    },
    updateTaller: function updateTaller(parentValue, params) {
      return Taller.findOneAndUpdate({ _id: params._id }, { $set: {
          nombre_tecnico: params.nombre_tecnico,
          is_reparacion: params.is_reparacion,
          is_instalacion: params.is_instalacion,
          descripcion_evento: params.descripcion_evento,
          concesion_verificada: params.concesion_verificada
        } }).then(function (device) {
        return device;
      }).catch(function (err) {
        throw new Error("Error al hacer update");
      });
    },
    updateScans: function updateScans(parentValue, params) {
      return Scans.findOneAndUpdate({ _id: params._id }, { $set: {
          juridico: params.juridico,
          concesion: params.concesion,
          driver_card: params.driver_card,
          img_vehicle_f: params.img_vehicle_f,
          img_vehicle_b: params.img_vehicle_b,
          img_vehicle_l: params.img_vehicle_l,
          img_vehicle_r: params.img_vehicle_r,
          img_conductor: params.img_conductor,
          id_chofer: params.id_chofer,
          img_concesionario: params.img_concesionario,
          id_concesionario: params.id_concesionario,
          proof_address_conce: params.proof_address_conce,
          proof_address_cond: params.proof_address_cond,
          title_concesion: params.title_concesion,
          criminal_record_cond: params.criminal_record_cond
        } }).then(function (scan) {
        return scan;
      }).catch(function (err) {
        throw new Error("Error al hacer update");
      });
    },
    updateTest: function updateTest(parentValue, params) {
      return Driver_Tests.findOneAndUpdate({ _id: params._id }, { $set: {
          concesion: params.concesion,
          date_test: params.date_test,
          comments: params.comments,
          success: params.success
        } }).then(function (test) {
        return test;
      }).catch(function (err) {
        throw new Error("Error al hacer update");
      });
    },
    updateReport: function updateReport(parentValue, params) {
      return _Reports.Reports.findOneAndUpdate({ _id: params._id }, { $set: {
          concesion_report: params.concesion_report,
          title_report: params.title_report,
          descripcion_report: params.descripcion_report,
          fecha_report: params.fecha_report,
          cita_report: params.cita_report,
          fin_report: params.fin_report,
          foto_incidente: params.foto_incidente,
          folio_tarjeton: params.folio_tarjeton,
          num_licencia: params.num_licencia,
          vencimiento_licencia: params.vencimiento_licencia,
          vencimiento_poliza: params.vencimiento_poliza,
          tipo_licencia: params.tipo_licencia,
          nombre_queja: params.nombre_queja,
          tel_queja: params.tel_queja,
          tipo_reporte: params.tipo_reporte,
          monto_multa: params.monto_multa,
          pagado: params.pagado,
          folio: params.folio
        } }).then(function (device) {
        return device;
      }).catch(function (err) {
        throw new Error("Error al hacer update");
      });
    },


    /*       updateCita(parentValue, params){
            return Report.findByIdAndUpdate(params._id,{$set:{
              cita_report: params.cita_report
            }}).then((device)=> {
                  return device
              }).catch((err)=>{
                  throw new Error("Error al hacer update")
              })
          }, */

    updateDevice: function updateDevice(parentValue, params) {
      console.log('data: ' + params.placaVehicle);
      return Device.findOneAndUpdate({ _id: params._id }, { $set: {
          sigfox: params.sigfox,
          concesion: params.concesion,
          name: params.name,
          concesionarioFullName: params.concesionarioFullName,
          concesionarioLastname: params.concesionarioLastname,
          concesionarioAddress: params.concesionarioAddress,
          concesionarioDistrict: params.concesionarioDistrict,
          concesionarioNumExt: params.concesionarioNumExt,
          concesionarioCp: params.concesionarioCp,
          concesionarioTel: params.concesionarioTel,
          marcaVehicle: params.marcaVehicle,
          modeloVehicle: params.modeloVehicle,
          placaVehicle: params.placaVehicle,
          yearVehicle: params.yearVehicle,
          image_url_fvehicle: params.image_url_fvehicle,
          image_url_lvehicle: params.image_url_lvehicle,
          image_url_rvehicle: params.image_url_rvehicle,
          image_url_bvehicle: params.image_url_bvehicle,
          image_url_conductor: params.image_url_conductor,
          conductorFullName: params.conductorFullName,
          conductorLastname: params.conductorLastname,
          conductorAddress: params.conductorAddress,
          conductorDistrict: params.conductorDistrict,
          conductorNumExt: params.conductorNumExt,
          conductorNumInt: params.conductorNumInt,
          conductorCp: params.conductorCp,
          conductorTel: params.conductorTel,
          marca_taximetro: params.marca_taximetro,
          modelo_taximetro: params.modelo_taximetro,
          numSerie_taximetro: params.numSerie_taximetro
        } }).then(function (device) {
        return device;
      }).catch(function (err) {
        throw new Error("Error al hacer update");
      });
    }
  },
  Subscription: {
    newUserAdded: {
      subscribe: withFilter(function () {
        return pubsub.asyncIterator('newUserAdded');
      }, function (params, variables) {
        return true;
      })
    },
    newMessageAdded: {
      subscribe: withFilter(function () {
        return pubsub.asyncIterator('newMessageAdded');
      }, function (params, variables) {
        return true;
      })
    },
    newDeviceAdded: {
      subscribe: withFilter(function () {
        return pubsub.asyncIterator('newDeviceAdded');
      }, function (params, variables) {
        return true;
      })
    },
    newReportAdded: {
      subscribe: withFilter(function () {
        return pubsub.asyncIterator('newReportAdded');
      }, function (params, variables) {
        return true;
      })
    }
  }
};

module.exports = {
  resolvers: resolvers,
  User: User,
  Message: Message,
  Device: Device,
  Records: Records,
  Report: Report,
  Verifications: Verifications,
  Taller: Taller
};