
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RunnerSchema   = new Schema({
    firstname: String,
    lastname: String,
    duvid: Number,
    email: String,
    birthday: Date,
    yearofbirth: Number,
    catger: String,
    catint: String,
    residence: String,
    nationality: String,
    club: String,
    homepage: String,
    phone: String,
    mobile: String,

    flags: {
	    tsize:    String,
        tsizeS:   { type: Boolean, default: false },
        tsizeM:   { type: Boolean, default: false },
        tsizeL:   { type: Boolean, default: false },
        tsizeXL:  { type: Boolean, default: false },
	    paid:     { type: Boolean, default: false },
	    sleep:    { type: Boolean, default: false },
	    pacer:    { type: Boolean, default: false },
	    waitlist: { type: Boolean, default: false }
    },

    sendsms:  { type: Boolean, default: false },
    lastSeen: { type: Date,    default: Date.now}
});

module.exports = mongoose.model('Runner', RunnerSchema);

