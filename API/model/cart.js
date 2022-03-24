const { mongoose } = require("mongoose");
// cart and order data could change
// user may order one thing and later add more things to order
// cart and order is not same data
const cartSchema = mongoose.Schema({
    cartOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        require: true,
        unique: true
    },
    appoinment: {
        appoinmentWith: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            require: true
        },
        fees: {
            type: Number
        },
        time: {
            type: Date
        }
    },
    drug: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Drug",
        require: true
    }],
    test: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
        require: true
    }]
})

module.exports = mongoose.model("Cart", cartSchema);