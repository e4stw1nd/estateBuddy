const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Estate = require('./models/estate');
const AsyncError = require('./utils/AsyncError');
const AppError = require('./utils/AppError');
const { estateSchema, reviewSchema } = require('./utils/schemaVerify.js');
const Review = require('./models/review');
require('dotenv').config()

console.log(`${process.env.SAMPLE}`);


const uri = `${process.env.URL}`;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected');
}).catch(err => {
    console.error('Connection error', err);
});

const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log("Database connected");
// });

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home')
});
app.get('/estates', async (req, res) => {
    const estates = await Estate.find({});
    res.render('estates/index', { estates });
});
app.get('/estates/new', (req, res) => {
    res.render('estates/new');
})

app.post('/estates', async (req, res) => {
    const estate = new Estate(req.body.estate);
    await estate.save();
    res.redirect(`/estates/${estate._id}`)
})

app.get('/estates/:id', async (req, res,) => {
    const estate = await Estate.findById(req.params.id)
    res.render('estates/show', { estate });
});

app.get('/estates/:id/edit', async (req, res) => {
    const estate = await Estate.findById(req.params.id)
    res.render('estates/edit', { estate });
})

app.put('/estates/:id', async (req, res) => {
    const { id } = req.params;
    const estate = await Estate.findByIdAndUpdate(id, { ...req.body.estate });
    res.redirect(`/estates/${estate._id}`)
});

app.delete('/estates/:id', async (req, res) => {
    const { id } = req.params;
    await Estate.findByIdAndDelete(id);
    res.redirect('/estates');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})


app.listen(process.env.PORT||3000, () => {
    console.log(`Serving on port ${process.env.PORT}`)
})
