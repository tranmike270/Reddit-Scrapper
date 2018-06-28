

$(document).ready(function(){
    var subreddit;
    var tabNotes = [];

    $("#subreddit-input").keyup(function(){
        console.log("hello");
        $("#search-display").text($(this).val().trim());
    });

    $("#subreddit-search").on('click', function(e){
        e.preventDefault();
        $(this).prop('disabled', true).html('Searching <div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        
        subreddit = $("#subreddit-input").val().trim();
        var subredditSearch = $("#subreddit-input").val().trim();

        var url ={
            link:"https://www.reddit.com/r/" + subredditSearch + "/"
        } ;

        console.log(url);
        
        getPost(subredditSearch);
    });

    console.log($("#login-error-msg").text().trim());
    if($("#login-error-msg").text().trim().length > 1){
        $("#loginModal").modal('toggle');
    };

    if($("#signup-error-msg").text().trim().length > 1){
        $("#signUpModal").modal('toggle');
    };


    $('.see-notes').on('click', function(){
        var articleNote = $(this).next('.article-notes');
        $('.see-notes').next('.article-notes').children('.main-group').empty();
        $('.see-notes').next('.article-notes').removeClass('show-article-notes');
        $('.see-notes').next('.article-notes').addClass('hide-article-notes');
        if($(this).next('.article-notes').hasClass('show-article-notes')){
            $(this).next('.article-notes').addClass('show-article-notes');
            $(this).next('.article-notes').removeClass('hide-article-notes');
        }else {
            $(this).next('.article-notes').removeClass('hide-article-notes');
            $(this).next('.article-notes').addClass('show-article-notes');
            var articleID = $(this).attr('data-article');
            
            getNotes(articleID);
        };



        
    });

    $(document).on('click','div.list-group a.list-group-item-action', function(){
        console.log('...is this working')
       $('.list-group-item-action').removeClass('active show');
       $(".tab-pane").removeClass('active show'); 
       $(this).addClass('active show');

    });


    $('.form-new-note').submit(function(event){
        event.preventDefault();
        var formID = $(this).attr('data-form');
        var title = $('input[data-new-title="' + formID +'"]').val().trim();
        var body = $('textarea[data-new-body="' + formID +'"]').val().trim();

        var newNote = {
            title: title,
            body : body
        };
        $('button[data-new-btn="' + formID + '"]').prop('disabled', true).text('Adding Note...');
        createNote(formID, newNote);

    })

    $(document).on('click', 'div.row div.col-4 div.card div.card-body button.save', function(){

        console.log($(this).attr('data-title'));
        console.log($(this).attr('data-link'));

      
        var data = {
            subReddit : subreddit,
            title : $(this).attr('data-title'),
            link : $(this).attr('data-link')
        };
        $(this).attr({
            class: 'btn btn-warning',
            type: 'button'
        }).html("Saving <div class='lds-ring'><div></div><div></div><div></div><div></div></div>").prop("disabled",true)

        savePostToUser(data);

    })

    
  
    function createNewRow(post, saved) {
        
        var http = "https://"
        if(post.link.includes(http)){

        }else {
            post.link = "https://www.reddit.com" + post.link;
        }
        var divHolder = $("<div>").addClass("col-4");
        var newPostCard = $("<div>").addClass("card");
        var newPostCardTitle = $("<div>").addClass("card-header").text(post.title);
        if(saved.includes(post.link)){
            var saveBtn = $("<button>").addClass("btn btn-success").attr({
                type: 'button'
            }).text("Saved!").prop('disabled',true);
        }else {
            var saveBtn = $("<button>").addClass("save btn btn-primary").attr({
                type: 'button',
                'data-link' : post.link,
                'data-title' : post.title
            }).text("Save");
        }

        var newPostCardBody = $("<div>").addClass("card-body");
        var newPostLink = $("<a>").attr({
            href : post.link,
            target : "_blank"
        }).text("Link to Post");
        newPostCardBody.append(saveBtn);
        newPostCardBody.append(newPostLink);
        newPostCard.append(newPostCardTitle);
        newPostCard.append(newPostCardBody);
        newPostCard.data("post", post);
        divHolder.append(newPostCard);
        return divHolder;
      }

    function getPost(subredditSearch){
        $.ajax('/saved',{
            type: "GET"
        }).then(function(articles){
            console.log("Hello");
            var links = [];
            if(articles.length > 0){
                for(var k = 0; k < articles.length; k++){
                    links.push(articles[k].link)
                }
            }


            $.ajax("/newArticles/" + subredditSearch, {
                type: "GET"
            }).then(function(data){
                var noPostCounter = 0;
                if(data.length > 0){
                    
                    $("#search-header-text").text(`Here's the top post from ${subredditSearch}!`);
                    $("#searched-articles").empty();
                    for(var i = 0; i < data.length; i++){
                        var card = createNewRow(data[i], links);
                            
                        
                        
                        $("#searched-articles").append(card);
                        
                    };
    
                    $("#subreddit-search").prop('disabled', false).html('Search');
    
                }else {
                    if(noPostCounter === 6){
                        $("#subreddit-search").prop('disabled', false).html('Search');
    
                        $("#search-header-text").text("Unfortunately we could not find anything for that subreddit... Check and make sure your casing is correct. Try again or search a different subreddit!!!");
                    }else {
                        noPostCounter++
                        getPost(subredditSearch);
                    }
    
                };
    
            });

        });

    }

    function savePostToUser(ArticleData){

        $.ajax('/saveArticle', {
            type: 'POST',
            data: ArticleData
        }).then(function(data){
            if(data.articles){
                $('.btn-warning').attr({
                    class: 'btn btn-success',
                    type: 'button'
                }).prop('disabled', true).text('Saved!');
            }
        });
    };

    function createNote(articleID, noteData){

        $.ajax('/newNote/'+articleID,{
            type: 'POST',
            data: noteData
        }).then(function(results){
            $("#note-added").trigger('click');
            console.log(results);
        });
    }


    function getNotes (articleID){
        $.ajax('/note/' +articleID, {
            type: 'GET'
        }).then(function(article){

            console.log(article);
            if(article.notes.length > 0){
                console.log("HEre");
                for(var i = 0; i < article.notes.length; i++){
                    var newNoteList = $("<a>").attr({
                        class: 'article-note list-group-item list-group-item-action',
                        'data-toggle' : "list",
                        href: "#note-tab-" + article.notes[i]._id,
                        role: 'tab'
                    }).text(article.notes[i].title);
                    console.log(newNoteList)
                    $("div[data-note-list='" + article._id +"']").append(newNoteList);

                    if(tabNotes.includes(article.notes[i]._id)){
                        console.log(tabNotes);
                    } else {
                        console.log(tabNotes);
                        tabNotes.push(article.notes[i]._id);

                        var hrTag = $("<hr>")

                        var newTab = $("<div>").attr({
                            class: 'tab-pane fade',
                            id: 'note-tab-'+ article.notes[i]._id,
                            role: 'tabpanel' 
                        });
                        var containerDiv = $('<div>').addClass('row');

                        var colDiv = $("<div>").attr({
                            class: 'col-12',
                            'data-note-container': article.notes[i]._id
                        });

                        var infoContainer = $("<div>")
                        
                        var articleHeader = $('<h3>').text(article.title)
                    

                        var noteTitle = $('<h4>').text(article.notes[i].title);

                        var noteBody = $('<p>').text(article.notes[i].body);
            

                        var deleteBtn = $('<button>').attr({
                            type : 'button',
                            class: 'btn btn-danger note-delete-btn',
                            'data-note-id' : article.notes[i]._id
                        }).text("Delete Note");

                        var changeBtn = $('<button>').attr({
                            type : 'button',
                            class: 'btn note-change-btn',
                            'data-note-id' : article.notes[i]._id
                        }).text("Delete Note");


                        //hidden form

                        var form = $('<form>').attr({
                            class: 'update-note-form hidden',
                            'data-note-form' : article.notes[i]._id
                        });

                        var fgTitle = $("<div>").attr({
                            class: 'form-group'
                        });

                        var lbTitle = $("<label>").attr({
                            class: "new-note-form-labels"
                        }).text('Note Title');

                        var ipTitle = $('<input>').attr({
                            class: "form-control",
                            type: 'text',
                            name: 'title',
                            'data-update-title' : article.notes[i]._id
                        }).prop('required', true);

                        var fgBody = $("<div>").attr({
                            class: 'form-group'
                        });

                        var lbBody = $("<label>").attr({
                            class: "new-note-form-labels"
                        }).text('Note Body');

                        var taBody = $('<textarea>').attr({
                            class: "form-control",
                            name: 'body',
                            'data-update-body' : article.notes[i]._id
                        });

                        var cancelBtn = $('<button>').attr({
                            type : 'button',
                            class: 'btn btn-danger note-cancel-update-btn',
                            'data-note-id' : article.notes[i]._id
                        }).text("Cancel Changes");

                        var confirmBtn = $('<button>').attr({
                            type : 'button',
                            class: 'btn note-confirm-btn',
                            'data-note-id' : article.notes[i]._id
                        }).text("Apply Changes");

                        //Put together the Form-groups

                        $(fgTitle).append(lbTitle, ipTitle);

                        $(fgBody).append(lbBody, taBody);

                        //put for together

                        $(form).append(fgTitle, fgBody, cancelBtn , confirmBtn)


                        //creat new tab
                        $(infoContainer).append(infoContainer)
                        $(infoContainer).append(articleHeader)
                        $(infoContainer).append(hrTag)
                        $(infoContainer).append(noteTitle)
                        $(infoContainer).append(hrTag)
                        $(infoContainer).append(noteBody)
                        $(infoContainer).append(hrTag)
                        $(infoContainer).append(deleteBtn)
                        $(infoContainer).append(changeBtn);

                        $(colDiv).append(infoContainer);
                        $(colDiv).append(form);

                        $(containerDiv).append(colDiv);

                        $(newTab).append(containerDiv);

                        $('#articles-tabContent').append(newTab);
                    }

                }

                $("h7[data-note-title='" + article._id +"']").text("Notes for This Article");
               
            } else {
                $("h7[data-note-title='" + article._id +"']").text("No Notes for This Article");
 
            };


        })
    }
})