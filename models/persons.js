require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log("connecting to ", url);

mongoose.set("strictQuery", false);
mongoose
	.connect(url)
	.then(() => {
		console.log("connected to mongodb");
	})
	.catch(error => {
		console.log(error.message);
	});

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minLength: 3,
	},
	number: {
		type: String,
		required: true,
		validate: {
			validator: function (v) {
				return /\d{2,3}-\d{7,8}/.test(v);
			},
			message: props => `${props.value} is not a valid phone number`,
		},
	},
	date: Date,
});

personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Person", personSchema);
