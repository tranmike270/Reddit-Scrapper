var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    subReddit: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    notes : [
        {
            type: Schema.Types.ObjectId,
            ref: 'Note'
        }
    ]
});

    //Custom Methods
        // Save an article
    ArticleSchema.methods.saveArticle = function(article){
        console.log(article);

    };
        // Delete an article
    ArticleSchema.methods.deleteArticle = function(){
        
    }
var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;