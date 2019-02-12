const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseHistory = require('mongoose-history-updated')
const Schema = mongoose.Schema

const ReportsSchema = new Schema({
    "user_report": {
        type: String,
        required: true
    },
    "title_report": {
        type: String,
        required:true
    },
    "concesion_report": {
        type: String,
        required:true
    },
    "descripcion_report": {
        type: String,
        required:true
    },
    "fecha_report": {
        type: Date,
        default: Date.now,
        required: true
    },
    "cita_report": {
        type: Date
    },
    "fin_report": {
        type: String
    },
    "foto_incidente": {
        type: String
    },
    "folio_tarjeton": {
        type: String
    },
    "num_licencia": {
        type: String
    },
    "vencimiento_licencia": {
        type: String
    },
    "vencimiento_poliza": {
        type: String
    },
    "tipo_licencia": {
        type: String
    },
    "nombre_queja": {
        type: String
    },
    "tel_queja": {
        type: String
    },
    "tipo_reporte": {
        type: String,
        required: true
    },
    "monto_multa": {
        type:String
    },
    "pagado": {
        type: Boolean,
        default: false
    },
    "folio": {
        type: Number
    }
});

ReportsSchema.plugin(AutoIncrement, {inc_field: 'folio'})
ReportsSchema.plugin(mongooseHistory)
const Reports = mongoose.model('Reports', ReportsSchema)

let reports_history = Reports.historyModel()
/* Reports.counterReset('folio', function(err){
    console.log("reset");
}) */

module.exports = {
    Reports,
    reports_history
}