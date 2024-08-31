
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const articleRouter = require('./routes/articles');
const path = require('path');

const app = express();

// Use IPv4 address explicitly
mongoose.connect('mongodb://127.0.0.1:27017/blog-website', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB Connected');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});
// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: false })); // To parse form data
app.use(methodOverride('_method')); // To support PUT and DELETE methods
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Routes
app.use('/articles', articleRouter);

// Home Route
app.get('/', (req, res) => {
    res.redirect('/articles');
});

// Start the Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
