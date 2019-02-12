const { PubSub, withFilter } = require('graphql-subscriptions');
const pubsub = new PubSub();
const mongoose = require('mongoose');
import Users from './User'
import { Reports, reports_history } from './Reports'
import { Schema } from 'mongoose';

const users= []
const messages = [];
const devices = [];
const reports = [];
const verifications = []
const talleres = []
const scans = []
const tests = []

const Message = mongoose.model('Message', {
  "device":{
  type:String,
  required:true
},
"timestamp":{
  type:Number,
  required:true
},
"data":{
  type:String,
  required:true
} });

const User = Users

const Device = mongoose.model('Device', {
  "sigfox":{
  type:String,
  required:true,
  unique:true
},
"concesion":{
  type:String,
  required:true,
  unique:true
},
"name":{
  type:String,
  required:true
},
"concesionarioFullName":{
  type: String
},
"concesionarioLastname":{
  type: String
},
"concesionarioAddress": {
  type:String
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
"marcaVehicle":{
  type:String
},
"modeloVehicle":{
  type:String
},
"placaVehicle":{
  type:String
},
"yearVehicle":{
  type:String
},
"image_url_fvehicle":{
  type:String
},
"image_url_lvehicle":{
  type:String
},
"image_url_rvehicle":{
  type:String
},
"image_url_bvehicle":{
  type:String
},
"image_url_conductor":{
  type:String
},
"conductorFullName":{
  type:String
},
"conductorLastname":{
  type: String
},
"conductorAddress":{
  type:String
},
"conductorDistrict":{
  type:String
},
"conductorNumExt":{
  type:String
},
"conductorNumInt":{
  type:String
},
"conductorCp": {
  type:String
},
"conductorTel":{
  type:String
},
"marca_taximetro":{
  type: String
},
"modelo_taximetro":{
  type: String
},
"numSerie_taximetro":{
  type: String
},
"velocidadMaxima":{
  type:String,
  default:0
},
"initTravel":[{
  type:String,
  default:[]
}],
"lastLocation":{
  type:String
},
"contTravel":{
  type:Number,
  default:0
},
"contTime":{
  type:Number,
  default:0
},
"contKm":{
  type:Number,
  default:0
},
"contEfectivo":{
  type:Number,
  default:0
},
"records":[{
  type:Schema.Types.ObjectId,
  ref:"Records"
}],
})

const Records = mongoose.model('Records', {
  "contKm":{
    type:String
  },
  "contTravel":{
      type:String
  },
  "contEfectivo":{
      type:String
  },
  "contTime":{
      type:String
  },
  "velocidadMaxima":{
      type:String
  },
  "initTravel":[{
      type:String
  }],
  "date":{
      type: Date,
      default: new Date()
  }
})

const Report = Reports

const Verifications = mongoose.model('Verification', {
  "concesion_verificar":{
    type:String
  },
  "fecha_verificacion":{
    type: Date,
    default: new Date()
  },
  "is_verificado":{
    type:Boolean,
    default:false
  }
})

const Taller = mongoose.model('Taller', {
  "nombre_tecnico":{
    type: String
  },
  "is_reparacion":{
    type: Boolean,
    default: false
  },
  "is_instalacion":{
    type: Boolean,
    default: false
  },
  "descripcion_evento":{
    type: String
  },
  "concesion_verificada":{
    type: String
  },
  "fecha_evento":{
    type: Date,
    default: new Date()
  }
})

const Scans = mongoose.model('Scans',{
  "juridico":{
    type: String
  },
  "concesion":{
    type: String
  },
  "driver_card":{
    type: String
  },
  "img_vehicle_f":{
    type: String
  },
  "img_vehicle_b":{
    type: String
  },
  "img_vehicle_l":{
    type: String
  },
  "img_vehicle_r":{
    type: String
  },
  "img_conductor":{
    type: String
  },
  "id_chofer":{
    type: String
  },
  "img_concesionario":{
    type: String
  },
  "id_concesionario":{
    type: String
  },
  "proof_address_cond":{
    type: String
  },
  "proof_address_conce":{
    type: String
  },
  "title_concesion":{
    type: String
  },
  "criminal_record_cond":{
    type: String
  },
})

const Driver_Tests = mongoose.model('Driver_Tests',{
  "concesion":{
    type: String
  },
  "date_test":{
    type: Date,
    default: new Date()
  },
  "comments":{
    type: String
  },
  "success":{
    type: Boolean,
    default: false
  }
})

const resolvers = {
  Query: {
    getUsers(parentValue, params){
      const users = User.find().exec()
      return users
    },
    getMessages(parentValue, params) {
      const messages = Message.find().exec()
      return messages;
    },
    getDevices(parentValue, params){
      const devices = Device.find().exec()
      return devices
    },
    singleDevice(parentValue, params){
      const device = Device.findById(params.id).exec()
      return device
    },
    singleUser(parentValue, params){
      const user = User.findById(params.id).exec()
      return user
    },
    nameUser(parentValue, params){
      const name_user = User.findOne({name:params.name}).exec()
      return name_user
    },
    getReports(parentValue, params){
      const reports = Report.find().exec()
      return reports
    },
    singleReport(parentValue, params){
      const report = Report.findById(params.id).exec()
      return report
    },
    conceReport(parentValue, params){
      const report = Report.find({concesion_report: params.concesion_report}).exec()
      return report
    },
    conceDevice(parentValue, params){
      const conce = Device.findOne({concesion:params.concesion}).exec()
      return conce
    },
    getHistory(parentValue, params){
      const hist = reports_history.find().exec()
      return hist
    },
    getHistoryCreated(parentValue, params){
      const hist_created = reports_history.find({o:"i"}).exec()
      return hist_created
    },
    getRecords(parentValue, params){
      const record = Records.find().exec()
      return record
    },
    getVerificacion(parentValue, params){
      const verif = Verifications.find().exec()
      return verif
    },
    singleRecords(parentValue, params){
      const record = Records.findById(params.id).exec()
      return record
    },
    conceVerificacion(parentValue, params){
      const conce_verif = Verifications.findOne({concesion_verificar:params.concesion_verificar}).exec()
      return conce_verif
    },
    getTaller(parentValue, params){
      const taller = Taller.find().exec()
      return taller
    },
    conceTaller(parentValue, params){
      const conce_taller = Taller.findOne({concesion_verificada:params.concesion_verificada}).exec()
      return conce_taller
    },
    singleTaller(parentValue, params){
      const single_taller = Taller.findById(params.id).exec()
      return single_taller
    },
    getScans(parentValue, params){
      const scans = Scans.find().exec()
      return scans
    },
    singleScan(parentValue, params){
      const single_scan = Scans.findById(params.id).exec()
      return single_scan
    },
    conceScan(parentValue, params){
      const conce_scan = Scans.findOne({concesion: params.concesion}).exec()
      return conce_scan
    },
    getTests(parentValue, params){
      const tests = Driver_Tests.find().exec()
      return tests
    },
    singleTest(parentValue, params){
      const single_test = Driver_Tests.findById(params.id).exec()
      return single_test
    },
    conceTest(parentValue, params){
      const conce_test = Driver_Tests.findOne({concesion: params.concesion}).exec()
      return conce_test
    }
  },
  Mutation: {
    signup(parentValue, { name, lastname, email, password, user_phone, avatar, nickname, is_admin, is_inspector, is_imt, is_caja, is_taller, is_uva, jefe_inspector, administrativo, is_capt, finanzas, jefe_administrativo, admin_juridico, admin_tecnico, capacitador, date_resp }){
      users.push({ name, lastname, email, password, user_phone, avatar, nickname, is_admin, is_inspector, is_imt, is_caja, is_taller, is_uva, jefe_inspector, administrativo, is_capt, finanzas, jefe_administrativo, admin_juridico, admin_tecnico, capacitador, date_resp })

      const user = new User({ name: name, lastname: lastname, email: email, password: password, user_phone:user_phone, avatar:avatar, nickname:nickname, is_admin: is_admin, is_inspector:is_inspector, is_imt:is_imt, is_caja:is_caja, is_taller:is_taller, is_uva: is_uva, jefe_inspector: jefe_inspector, administrativo: administrativo, is_capt: is_capt, finanzas: finanzas,  jefe_administrativo: jefe_administrativo, admin_juridico: admin_juridico, admin_tecnico: admin_tecnico, capacitador: capacitador, date_resp: date_resp})
      user.save().then(() => console.log("user creado"))

      pubsub.publish('newUserAdded', {
        newUserAdded: { name, lastname, email, password, user_phone, avatar, nickname, is_admin, is_inspector, is_imt, is_caja, is_taller, is_uva }
      })
      return users
    },

    updateUser(parentValue, params){
      return User.findOneAndUpdate({_id:params._id},{$set:{
        name: params.data,
        lastname: params.lastname,
        user_phone: params.user_phone,
        avatar: params.avatar,
        nickname: params.nickname
      }}
        ).then((user)=> {
            return user
        }).catch((err)=>{
            throw new Error("Error al hacer update")
        })
    },

    addReport(parentValue, {user_report, title_report, concesion_report, descripcion_report, fecha_report, cita_report, fin_report, foto_incidente, folio_tarjeton, num_licencia, vencimiento_licencia, vencimiento_poliza, tipo_licencia, nombre_queja, tel_queja, tipo_reporte, monto_multa, pagado, folio}){
      reports.push({ user_report, title_report, concesion_report, descripcion_report, fecha_report, cita_report, fin_report, foto_incidente, folio_tarjeton, num_licencia, vencimiento_licencia, vencimiento_poliza, tipo_licencia, nombre_queja, tel_queja, tipo_reporte, monto_multa, pagado, folio })

      const repor = new Report({user_report: user_report, title_report: title_report, concesion_report: concesion_report, descripcion_report: descripcion_report, fecha_report: fecha_report, cita_report: cita_report, fin_report: fin_report, foto_incidente: foto_incidente, folio_tarjeton: folio_tarjeton, num_licencia: num_licencia, vencimiento_licencia: vencimiento_licencia, vencimiento_poliza: vencimiento_poliza, tipo_licencia: tipo_licencia, nombre_queja: nombre_queja, tel_queja: tel_queja, tipo_reporte: tipo_reporte, monto_multa: monto_multa, pagado: pagado, folio: folio })
      repor.save().then(() => console.log(`report creado con folio: ${repor.folio}`))

      pubsub.publish('newReportAdded', {
        newReportAdded: { user_report, title_report, concesion_report, descripcion_report, fecha_report, cita_report }
      })

      return reports
    },

    addVerificacion(parentValue, {concesion_verificar, fecha_verificacion, is_verificado}){
      verifications.push({ concesion_verificar, fecha_verificacion, is_verificado })

      const verifs = new Verifications({concesion_verificar: concesion_verificar, fecha_verificacion: fecha_verificacion, is_verificado: is_verificado})
      verifs.save().then(() => console.log("verification added"))
    },

    addTaller(parentValue, {nombre_tecnico, is_reparacion, is_instalacion, descripcion_evento, concesion_verificada, fecha_evento}){
      talleres.push({ nombre_tecnico, is_reparacion, is_instalacion, descripcion_evento, concesion_verificada, fecha_evento })

      const taller = new Taller({nombre_tecnico: nombre_tecnico, is_reparacion: is_reparacion, is_instalacion: is_instalacion, descripcion_evento: descripcion_evento, concesion_verificada: concesion_verificada, fecha_evento: fecha_evento})
      taller.save().then(() => console.log("added taller report"))
    },

    addScans(parentValue, {juridico, concesion, driver_card, img_vehicle_f, img_vehicle_b, img_vehicle_l, img_vehicle_r, img_conductor, id_chofer, img_concesionario, id_concesionario, proof_address_conce, proof_address_cond, title_concesion, criminal_record_cond}){
      scans.push({juridico, concesion, driver_card, img_vehicle_f, img_vehicle_b, img_vehicle_l, img_vehicle_r, img_conductor, id_chofer, img_concesionario, id_concesionario, proof_address_conce, proof_address_cond, title_concesion, criminal_record_cond})

      const scan = new Scans({juridico: juridico, concesion: concesion, driver_card: driver_card, img_vehicle_f: img_vehicle_f, img_vehicle_b: img_vehicle_b, img_vehicle_l: img_vehicle_l, img_vehicle_r: img_vehicle_r, img_conductor: img_conductor, id_chofer: id_chofer, img_concesionario: img_concesionario, id_concesionario: id_concesionario, proof_address_conce: proof_address_conce, proof_address_cond: proof_address_cond, title_concesion: title_concesion, criminal_record_cond: criminal_record_cond})
      scan.save().then(() => console.log("added scans"))
    },

    addTest(parentValue, {concesion, date_test, comments, success}){
      tests.push({concesion, date_test, comments, success})

      const test = new Driver_Tests({concesion: concesion, date_test: date_test, comments: comments, success: success})
      test.save().then(() => console.log("added test"))
    },

    addMessage(parentValue, { device, timestamp, data }) {
      messages.push({ device, timestamp, data });

      const mess = new Message({ device: device, data: data, timestamp: timestamp })
      mess.save().then(() => console.log("message creado"))

      pubsub.publish('newMessageAdded', {
        newMessageAdded: { device, timestamp, data }
      });
      
      return messages;
    },

    addDevice(parentValue,{ sigfox, concesion, name, concesionarioFullName, concesionarioLastname, concesionarioAddress, concesionarioDistrict, concesionarioNumExt,
      concesionarioCp, concesionarioTel, marcaVehicle, modeloVehicle, placaVehicle, yearVehicle, image_url_fvehicle, image_url_lvehicle, image_url_rvehicle,
      image_url_bvehicle, image_url_conductor, conductorFullName, conductorLastname, conductorAddress, conductorDistrict, conductorNumExt, conductorNumInt, conductorCp,
      conductorTel, marca_taximetro, modelo_taximetro, numSerie_taximetro, velocidadMaxima, initTravel, lastLocation, contTravel, contTime, contKm, contEfectivo, records }){
        devices.push({ sigfox, concesion, name, concesionarioFullName, concesionarioLastname, concesionarioAddress, concesionarioDistrict,
          concesionarioNumExt, concesionarioCp, concesionarioTel, marcaVehicle, modeloVehicle, placaVehicle, yearVehicle,
          image_url_fvehicle, image_url_lvehicle, image_url_rvehicle, image_url_bvehicle, image_url_conductor, 
          conductorFullName, conductorLastname, conductorAddress, conductorDistrict, conductorNumExt, conductorNumInt, conductorCp, conductorTel, marca_taximetro, modelo_taximetro, numSerie_taximetro, velocidadMaxima,
          initTravel, lastLocation, contTravel, contTime, contKm, contEfectivo, records})

          const dev = new Device({ sigfox: sigfox, concesion: concesion, name: name, concesionarioFullName: concesionarioFullName, concesionarioLastname: concesionarioLastname,
            concesionarioAddress: concesionarioAddress, concesionarioDistrict: concesionarioDistrict, concesionarioNumExt: concesionarioNumExt,
            concesionarioCp: concesionarioCp, concesionarioTel: concesionarioTel, marcaVehicle: marcaVehicle, modeloVehicle: modeloVehicle,
          placaVehicle: placaVehicle, yearVehicle: yearVehicle, image_url_fvehicle: image_url_fvehicle, image_url_lvehicle: image_url_lvehicle, image_url_rvehicle: image_url_rvehicle,
          image_url_bvehicle: image_url_bvehicle, image_url_conductor: image_url_conductor, conductorFullName: conductorFullName, conductorLastname: conductorLastname, conductorAddress: conductorAddress,
          conductorDistrict: conductorDistrict, conductorNumExt: conductorNumExt, conductorNumInt: conductorNumInt, conductorCp: conductorCp, conductorTel: conductorTel, 
          marca_taximetro: marca_taximetro, modelo_taximetro: modelo_taximetro, numSerie_taximetro: numSerie_taximetro, velocidadMaxima: velocidadMaxima,
          initTravel:initTravel, lastLocation: lastLocation, contTravel: contTravel, contTime: contTime, contKm: contKm, contEfectivo: contEfectivo, records:records })
          dev.save().then(() => console.log("device creado"))

          pubsub.publish('newDeviceAdded', {
            newDeviceAdded: { sigfox, concesion, name, concesionarioFullName, concesionarioAddress, concesionarioDistrict,
              concesionarioNumExt, concesionarioCp, concesionarioTel, marcaVehicle, modeloVehicle, placaVehicle, yearVehicle,
              image_url_fvehicle, image_url_lvehicle, image_url_rvehicle, image_url_bvehicle, image_url_conductor, 
              conductorFullName, conductorAddress, conductorDistrict, conductorNumExt, conductorNumInt, conductorCp, conductorTel, velocidadMaxima,
              initTravel, lastLocation, contTravel, contTime, contKm, contEfectivo, records }
          })

          return devices
      },

      updateTaller(parentValue, params){
        return Taller.findOneAndUpdate({_id:params._id},{$set:{
          nombre_tecnico: params.nombre_tecnico,
          is_reparacion: params.is_reparacion,
          is_instalacion: params.is_instalacion,
          descripcion_evento: params.descripcion_evento,
          concesion_verificada: params.concesion_verificada
        }}).then((device)=> {
              return device
          }).catch((err)=>{
              throw new Error("Error al hacer update")
          })
      },

      updateScans(parentValue, params){
        return Scans.findOneAndUpdate({_id:params._id},{$set:{
          juridico:params.juridico,
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
        }}).then(scan => scan).catch((err) => {
          throw new Error("Error al hacer update")
        })
      },

      updateTest(parentValue, params){
        return Driver_Tests.findOneAndUpdate({_id:params._id}, {$set: {
          concesion: params.concesion,
          date_test:params.date_test,
          comments: params.comments,
          success: params.success
        }}).then(test => test).catch((err) => {
          throw new Error("Error al hacer update")
        })
      },

      updateReport(parentValue, params){
        return Reports.findOneAndUpdate({_id:params._id},{$set:{
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
        }}).then((device)=> {
              return device
          }).catch((err)=>{
              throw new Error("Error al hacer update")
          })
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

      updateDevice(parentValue, params){
        console.log(`data: ${params.placaVehicle}`)
        return Device.findOneAndUpdate({_id:params._id},{$set:{
          sigfox: params.sigfox,
          concesion: params.concesion,
          name: params.name,
          concesionarioFullName: params.concesionarioFullName,
          concesionarioLastname: params.concesionarioLastname,
          concesionarioAddress: params.concesionarioAddress,
          concesionarioDistrict:params.concesionarioDistrict,
          concesionarioNumExt:params.concesionarioNumExt,
          concesionarioCp:params.concesionarioCp,
          concesionarioTel:params.concesionarioTel,
          marcaVehicle:params.marcaVehicle,
          modeloVehicle:params.modeloVehicle,
          placaVehicle:params.placaVehicle,
          yearVehicle:params.yearVehicle,
          image_url_fvehicle:params.image_url_fvehicle,
          image_url_lvehicle:params.image_url_lvehicle,
          image_url_rvehicle:params.image_url_rvehicle,
          image_url_bvehicle:params.image_url_bvehicle,
          image_url_conductor:params.image_url_conductor,
          conductorFullName:params.conductorFullName,
          conductorLastname: params.conductorLastname,
          conductorAddress:params.conductorAddress,
          conductorDistrict:params.conductorDistrict,
          conductorNumExt:params.conductorNumExt,
          conductorNumInt:params.conductorNumInt,
          conductorCp:params.conductorCp,
          conductorTel:params.conductorTel,
          marca_taximetro:params.marca_taximetro,
          modelo_taximetro:params.modelo_taximetro,
          numSerie_taximetro:params.numSerie_taximetro
        }}
          ).then((device)=> {
              return device
          }).catch((err)=>{
              throw new Error("Error al hacer update")
          })
      }
  },
  Subscription: {
    newUserAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('newUserAdded'),
        (params, variables) => true
      )
    },
    newMessageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('newMessageAdded'),
        (params, variables) => true
      )
    },
    newDeviceAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('newDeviceAdded'),
        (params, variables) => true
      )
    },
    newReportAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('newReportAdded'),
        (params, variables) => true
      )
    }
  }
};

module.exports = {
  resolvers,
  User,
  Message,
  Device,
  Records,
  Report,
  Verifications,
  Taller
}