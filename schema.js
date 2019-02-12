const { makeExecutableSchema } = require('graphql-tools');
const { resolvers } = require('./resolvers');

const typeDefs = `
  type Message {
    device: String!
    timestamp: String!
    data: String!
  }

  type User {
    _id: ID! @unique
    name: String!
    lastname: String!
    email: String! @unique
    password: String!
    user_phone: String
    avatar: String
    nickname: String
    is_admin: Boolean @default(value:false)
    is_inspector: Boolean @default(value:false)
    is_imt: Boolean @default(value:false)
    finanzas: Boolean @default(value:false)
    is_caja: Boolean @default(value:false)
    is_taller: Boolean @default(value:false)
    is_uva: Boolean @default(value:false)
    jefe_inspector: Boolean @default(value:false)
    jefe_administrativo: Boolean @default(value:false)
    administrativo: Boolean @default(value:false)
    is_capt: Boolean @default(value:false)
    admin_juridico: Boolean @default(value:false)
    admin_tecnico: Boolean @default(value:false)
    capacitador: Boolean @default(value:false)
    date_resp: Boolean @default(value:false)
    status: Boolean @default(value:true)
  }

  type Device {
    _id: ID! @unique
    sigfox: String! @unique
    concesion: String! @unique
    name: String!
    concesionarioFullName: String
    concesionarioLastname: String
    concesionarioAddress: String
    concesionarioDistrict: String
    concesionarioNumExt: String
    concesionarioCp: String
    concesionarioTel: String
    marcaVehicle: String
    modeloVehicle: String
    placaVehicle: String
    yearVehicle: String
    image_url_fvehicle: String
    image_url_lvehicle: String
    image_url_rvehicle: String
    image_url_bvehicle: String
    image_url_conductor: String
    conductorFullName: String
    conductorLastname: String
    conductorAddress: String
    conductorDistrict: String
    conductorNumExt: String
    conductorNumInt: String
    conductorCp: String
    conductorTel: String
    marca_taximetro: String
    modelo_taximetro: String
    numSerie_taximetro: String
    velocidadMaxima: String @default(value:0)
    initTravel:[String]
    lastLocation: String
    contTravel: Int @default(value:0)
    contTime: Int @default(value:0)
    contKm: Int @default(value:0)
    contEfectivo: Float @default(value:0)
    records: [String]
  }

  type Records{
    _id: ID! @unique
    contTravel: String
    contTime: String
    contKm: String
    contEfectivo: String
    velocidadMaxima: String
    initTravel: [String]
    date: String
  }

  type Reports{
    _id: ID! @unique
    user_report: String!
    title_report: String!
    concesion_report: String!
    descripcion_report: String!
    fecha_report: String!
    cita_report: String
    fin_report: String
    foto_incidente: String
    folio_tarjeton: String
    num_licencia: String
    vencimiento_licencia: String
    vencimiento_poliza: String
    tipo_licencia: String
    nombre_queja: String
    tel_queja: String
    tipo_reporte: String!
    monto_multa: String
    pagado: Boolean @default(value:false)
    folio: Int
  }

  type Repor{
    _id: ID! @unique
    title_report: String
    concesion_report: String
    descripcion_report: String
    fecha_report: String
    cita_report: String
    fin_report: String
    foto_incidente: String
    folio_tarjeton: String
    num_licencia: String
    vencimiento_licencia: String
    vencimiento_poliza: String
    tipo_licencia: String
    nombre_queja: String
    tel_queja: String
    tipo_reporte: String
    monto_multa: String
    pagado: Boolean @default(value:false)
    folio: Int
  }

  type reports_history{
    id:ID! @unique
    t:String
    o:String
    d:Repor
  }

  type Verification {
    _id: ID! @unique
    concesion_verificar: String
    fecha_verificacion: String
    is_verificado : Boolean @default(value:false)
  }

  type Taller {
    _id: ID! @unique
    nombre_tecnico: String
    is_reparacion: Boolean @default(value:false)
    is_instalacion: Boolean @default(value:false)
    descripcion_evento: String
    concesion_verificada: String
    fecha_evento: String
  }

  type Scans {
    _id: ID! @unique
    juridico: String
    concesion: String
    driver_card: String
    img_vehicle_f: String
    img_vehicle_b: String
    img_vehicle_l: String
    img_vehicle_r: String
    img_conductor: String
    id_chofer: String
    img_concesionario: String
    id_concesionario: String
    proof_address_cond: String
    proof_address_conce: String
    title_concesion: String
    criminal_record_cond: String
  }

  type Drive_Tests {
    _id: ID! @unique
    concesion: String
    date_test: String
    comments: String
    success: Boolean @default(value:false)
  }

  type Query {
    getUsers: [User]
    getMessages: [Message]
    getDevices: [Device]
    getReports: [Reports]
    singleDevice(id: ID!): Device
    singleUser(id:ID!): User
    nameUser(name:String!): User
    singleReport(id:ID!): Reports
    conceReport(concesion_report: String!): [Reports]
    conceDevice(concesion:String!): Device
    getHistoryCreated(o:String): [reports_history]
    getHistory: [reports_history]
    getRecords: [Records]
    singleRecords(id:ID!): Records
    getVerificacion: [Verification]
    conceVerificacion(concesion_verificar:String!): Verification
    getTaller: [Taller]
    conceTaller(concesion_verificada:String!): Taller
    singleTaller(id:ID!): Taller
    getScans: [Scans]
    conceScan(concesion:String!): Scans
    singleScan(id:ID!): Scans
    getTests: [Drive_Tests]
    singleTest(id:ID!): Drive_Tests
    conceTest(concesion: String!): Drive_Tests
  }

  type Mutation {
    signup(name: String!, email: String! @unique, lastname: String!, password: String!, user_phone: String, avatar: String, nickname: String, is_admin: Boolean, is_inspector: Boolean, is_imt: Boolean, is_caja: Boolean, is_taller: Boolean, is_uva: Boolean, jefe_inspector: Boolean, administrativo: Boolean, is_capt: Boolean, finanzas: Boolean, jefe_administrativo: Boolean, admin_juridico: Boolean, admin_tecnico: Boolean, capacitador: Boolean, date_resp: Boolean): [User]
    login(email: String!, password: String!): [User]
    addUser(name: String!, lastname: String!, email: String! @unique, password: String!, user_phone: String, avatar: String, nickname: String, is_admin: Boolean, is_inspector: Boolean, is_imt: Boolean, is_caja: Boolean, is_taller: Boolean, is_uva: Boolean, jefe_inspector: Boolean, administrativo: Boolean, is_capt: Boolean, finanzas: Boolean, jefe_administrativo: Boolean, admin_juridico: Boolean, admin_tecnico: Boolean, capacitador: Boolean, date_resp: Boolean): [User]
    updateUser(_id:ID!, name: String!, lastname: String, email:String! @unique, user_phone: String, avatar: String, nickname: String): User
    addMessage(device: String!, timestamp: String!, data: String!): [Message]
    addReport(user_report:String, title_report:String, concesion_report:String, descripcion_report: String, fecha_report: String, cita_report: String, fin_report: String, foto_incidente: String, folio_tarjeton: String, num_licencia: String, vencimiento_licencia: String, vencimiento_poliza: String, tipo_licencia: String, nombre_queja: String, tel_queja: String, tipo_reporte: String!, monto_multa: String, pagado: Boolean, folio: Int): [Reports]
    updateReport(_id: ID!, concesion_report: String, title_report: String, descripcion_report: String, fecha_report: String, cita_report: String, fin_report: String, foto_incidente: String, folio_tarjeton: String, num_licencia: String, vencimiento_licencia: String, vencimiento_poliza: String, tipo_licencia: String, nombre_queja: String, tel_queja: String, tipo_reporte: String!, monto_multa: String, pagado: Boolean, folio: Int): Reports
    addVerificacion(concesion_verificar: String, fecha_verificacion: String, is_verificado: Boolean): [Verification]
    addTaller(nombre_tecnico: String, is_reparacion: Boolean, is_instalacion: Boolean, descripcion_evento: String, concesion_verificada: String, fecha_evento: String): [Taller]
    updateTaller(_id: ID!, nombre_tecnico: String, is_reparacion: Boolean, is_instalacion: Boolean, descripcion_evento: String, concesion_verificada: String, fecha_evento: String): Taller
    addScans(juridico: String, concesion: String, driver_card: String, img_vehicle_f: String, img_vehicle_b: String, img_vehicle_l: String, img_vehicle_r: String, img_conductor: String, id_chofer: String, img_concesionario: String, id_concesionario: String, proof_address_cond: String, proof_address_conce: String, title_concesion: String, criminal_record_cond: String):[Scans]
    updateScans(_id: ID!, juridico: String, concesion: String, driver_card: String, img_vehicle_f: String, img_vehicle_b: String, img_vehicle_l: String, img_vehicle_r: String, img_conductor: String, id_chofer: String, img_concesionario: String, id_concesionario: String, proof_address_cond: String, proof_address_conce: String, title_concesion: String, criminal_record_cond: String):Scans
    addTest(concesion: String, date_test: String, comments: String, success: Boolean): [Drive_Tests]
    updateTest(_id: ID!, concesion: String, date_test: String, comments: String, success: Boolean): Drive_Tests
    updateDevice(_id: ID!,
      sigfox: String! @unique,
      concesion: String! @unique,
      name: String!,
      concesionarioFullName: String,
      concesionarioLastname: String,
      concesionarioAddress: String,
      concesionarioDistrict: String,
      concesionarioNumExt: String,
      concesionarioCp: String,
      concesionarioTel: String,
      marcaVehicle: String,
      modeloVehicle: String,
      placaVehicle: String,
      yearVehicle: String,
      image_url_fvehicle: String,
      image_url_lvehicle: String,
      image_url_rvehicle: String,
      image_url_bvehicle: String,
      image_url_conductor: String,
      conductorFullName: String,
      conductorLastname: String,
      conductorAddress: String,
      conductorDistrict: String,
      conductorNumExt: String,
      conductorNumInt: String,
      conductorCp: String,
      conductorTel: String,
      marca_taximetro: String,
      modelo_taximetro: String,
      numSerie_taximetro: String
      ): Device

    addDevice(sigfox: String! @unique,
      concesion: String! @unique,
      name: String!,
      concesionarioFullName: String,
      concesionarioLastname: String,
      concesionarioAddress: String,
      concesionarioDistrict: String,
      concesionarioNumExt: String,
      concesionarioCp: String,
      concesionarioTel: String,
      marcaVehicle: String,
      modeloVehicle: String,
      placaVehicle: String,
      yearVehicle: String,
      image_url_fvehicle: String,
      image_url_lvehicle: String,
      image_url_rvehicle: String,
      image_url_bvehicle: String,
      image_url_conductor: String,
      conductorFullName: String,
      conductorLastname: String,
      conductorAddress: String,
      conductorDistrict: String,
      conductorNumExt: String,
      conductorNumInt: String,
      conductorCp: String,
      conductorTel: String,
      marca_taximetro: String,
      modelo_taximetro: String,
      numSerie_taximetro: String,
      lastLocation: String,
      contTravel: Int @default(value:0),
      contTime: Int @default(value:0),
      contKm: Int @default(value:0),
      contEfectivo: Float @default(value:0)): [Device]
  }

  type Subscription {
    newUserAdded: User
    newMessageAdded: Message
    newDeviceAdded: Device
    newReportAdded: Reports
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

module.exports = makeExecutableSchema({ typeDefs, resolvers })