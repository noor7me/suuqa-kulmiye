var express       =   require('express');
const mongoose      =   require('mongoose');
const bodyParser    =   require('body-parser');
const path          =   require('path');
const cors          =   require('cors');
const passport      =   require('passport');


// intialize the here 
var app = express();
app.set('port', process.env.PORT || 3000);

// define middlewears
//URL encoded body parse
app.use(bodyParser.urlencoded({
    extended: false
}));
//Json body parser
app.use(bodyParser.json());
//cors middlewear
app.use(cors());
//set up the static directory
app.use(express.static(path.join(__dirname, 'public')));



// Connect to the database;
const db = require('./config/keys').mongoURL;

mongoose.connect(db, {useNewUrlParser: true}).then(() => {
    console.log(`Database Connected Successfully ${db}`);
}).catch(err => {
    console.log(`Unable to connect to the database ${db}`);
});


//bring api/user routes 

const users = require('./routes/api/users');
app.use('/api/users', users);

//intial Authentication
app.use(passport.initialize());
require('./config/passport')(passport);

//bring other routes you may have 

// bring client routes 
app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname, 'public/index.html'))
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Sever started at port ${PORT}`);
})


