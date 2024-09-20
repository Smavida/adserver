const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const runtimeConfigSchema = new Schema({
    envLabel: String,
    group: String,
    scope: String,
    readonly: Boolean,
    reboot: Boolean,
    default: String,
	key: String,
	value: String,
    updatedAt: Date,
}, { collection: 'runtime-config', versionKey: false });

module.exports = mongoose.model('RuntimeConfig', runtimeConfigSchema);