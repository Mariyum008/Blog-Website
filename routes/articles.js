// routes/articles.js
const express = require('express');
const Article = require('../models/articles.js');
const router = express.Router();


// GET /articles - List all articles
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: 'desc' });
        res.render('articles/index', { articles: articles });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// GET /articles/new - Show form to create new article
router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() });
});

// POST /articles - Create a new article
router.post('/', async (req, res) => {
    const article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    });

    try {
        await article.save();
        res.redirect(`/articles/${article.slug}`);
    } catch (err) {
        console.error(err);
        res.render('articles/new', { article: article });
    }
});

// GET /articles/:slug - Show a single article
router.get('/:slug', async (req, res) => {
    console.log('Fetching article with slug:', req.params.slug);
    try {
        const article = await Article.findOne({ slug: req.params.slug });
        if (!article) {
            console.error('Article not found');
            return res.redirect('/');
        }
        res.render('articles/show', { article: article });
    } catch (err) {
        console.error('Error fetching article:', err);
        res.redirect('/');
    }
});

// GET /articles/edit/:id - Show form to edit an article
router.get('/edit/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        res.render('articles/edit', { article: article });
    } catch (err) {
        console.error(err);
        res.redirect('/articles');
    }
});

// PUT /articles/:id - Update an article
router.put('/:id', async (req, res) => {
    let article;
    try {
        article = await Article.findById(req.params.id);
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
        await article.save();
        res.redirect(`/articles/${article.slug}`);
    } catch (err) {
        console.error(err);
        if (article == null) {
            res.redirect('/');
        } else {
            res.render('articles/edit', { article: article });
        }
    }
});

// DELETE /articles/:id - Delete an article
router.delete('/:id', async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.redirect('/articles');
    } catch (err) {
        console.error(err);
        res.redirect('/articles');
    }
});

module.exports = router;
