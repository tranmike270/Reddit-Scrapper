

$(document).ready(function(){
    var subreddit;
    var tabNotes = [];
    $("#subreddit-input").keyup(function(){
        console.log("hello");
        $("#search-display").text($(this).val().trim());
    });

    $("#subreddit-search").on('click', function(e){
        e.preventDefault();
        $(this).prop('disabled', true);

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
        var articleNote = $(this).next();

        var all = $('.see-notes').next();
        console.log(all.length);
        for(var j = 0; j < all.length; j++){
            if($(all[j]).hasClass('show-article-notes')){
                $(all[j]).addClass('hide-article-notes');
                $(all[j]).removeClass('show-article-notes');
            }
        }
        var articleID = $(this).attr('data-article');
        $.ajax('/note/' +articleID, {
            type: 'GET'
        }).then(function(article){
            $(articleNote).addClass('show-article-notes');
            $(articleNote).removeClass('hide-article-notes');
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

        console.log(title);
        console.log(body);
    })




    function createNewRow(post) {
        
        var http = "https://"
        if(post.link.includes(http)){

        }else {
            post.link = "https://www.reddit.com" + post.link;
        }
        console.log(post);
        var divHolder = $("<div>").addClass("col-4");
        var newPostCard = $("<div>").addClass("card");
        var newPostCardTitle = $("<div>").addClass("card-header").text(post.title);
        var saveBtn = $("<button>").addClass("save btn btn-primary").attr({
            type: 'button',
            'data-link' : post.link,
            'data-title' : post.title
        }).text("Save");
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
        $.ajax("/newArticles/" + subredditSearch, {
            type: "GET"
        }).then(function(data){
            console.log(data);
            if(data.length > 0){
                $("#searched-articles").empty();
                for(var i = 0; i < data.length; i++){
                    var card = createNewRow(data[i])
    
                    
    
                    $("#searched-articles").append(card);
                };
                $(".save").on('click', function(){

                    console.log($(this).attr('data-title'));
                    console.log($(this).attr('data-link'));
                    console.log(location.href.split('?'))

                    var data = {
                        subReddit : subreddit,
                        title : $(this).attr('data-title'),
                        link : $(this).attr('data-link')
                    };

                    savePostToUser(data, location.href.split('?')[1]);

                });

            }else {
                getPost(subredditSearch);
            };

        });
    }

    function savePostToUser(ArticleData, userId){

        $.ajax('/save/' + userId, {
            type: 'POST',
            data: ArticleData
        }).then(function(data){
            console.log(data);
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
})