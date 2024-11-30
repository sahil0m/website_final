const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://sahildewani23cse:pasta%40123@web-project.0dbrw.mongodb.net/?retryWrites=true&w=majority&appName=Web-project", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connection successful");
}).catch((e) => {
    console.log("No connection");
    console.error(e);
});
