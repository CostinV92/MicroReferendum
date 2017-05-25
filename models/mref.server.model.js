var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName:      String,
    lastName:       String,
    cnp:            String,
    email:          String,
    userName:       String,
    password:       String,
    roleId:         Number,
    publicKey:      String,
    referendums:    [Schema.Types.ObjectId],
    votedOn:        [Schema.Types.ObjectId]
});

var referendumSchema = new Schema({
    subject:        String,
    tags:           [],
    region:         [],
    startDate:      Date,
    endDate:        Date,
    description:    String,
    public:         Boolean,
    yesVotes:       {type: Number, default: 0},
    noVotes:        {type: Number, default: 0},
    createdBy:      Schema.Types.ObjectId
});

var categorySchema = new Schema({
    name:           String,
    code:           String     
});

var regionSchema = new Schema({
    name:           String,
    code:           String
});

var roleSchema = new Schema({
    name:           String,
    code:           Number
});

module.exports = {
    User:           mongoose.model('User', userSchema),
    Referendum:     mongoose.model('Referendum', referendumSchema),
    Categories:     mongoose.model('Categories', categorySchema),
    Region:         mongoose.model('Region', regionSchema),
    Roles:          mongoose.model('Roles', roleSchema)
}

