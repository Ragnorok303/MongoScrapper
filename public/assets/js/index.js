$(document).ready(function () {
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);
    $(".clear").on("click", handleArticleClear);

    initPage();

    function initPage() {
        articleContainer.empty();
        $.get("/headlines").then(function (data) {
            if (data && data.length) {
                renderArticles(data);
            }
            else {
                renderEmpty();
            }
        });
        console.log("init page")
    }

    function renderArticles(articles) {
        var articlePanels = [];
        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }
        articleContainer.append(articlePanels);
        console.log("render articles"+ articles.length)
    }

    function createPanel(article) {
        var panel = $(
            [
                "<div class='panel panel-default'>",
                "<div class='panel-heading'>",
                "<h3>",
                "<a class='article-link' target='_blank' href=https://www.nytimes.com" + article.link + ">",
                article.title,
                "</a>",
                "<a class='btn btn-info save'>",
                "Save Article",
                "</a>",
                "</h3>",
                "</div>",
                "<div class='panel-body'>",
                article.summary,
                "</div>",
                "</div>"
            ].join("")
        );
        panel.data("_id", article._id);
        return panel;
    }

    function renderEmpty() {
        var emptyAlert = $(
            [
                "<div class='alert alert-warning text-center'>",
                "<h4>Looks like we don't have any new articles.</h4>",
                "</div>",
                "<div class='panel panel-default'>",
                "<div class='panel-heading text-center'>",
                "<h3>What Would You Like To Do?</h3>",
                "</div>",
                "<div class='panel-body text-center'>",
                "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
                "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
                "</div>",
                "</div>"
            ].join("")
        );
        articleContainer.append(emptyAlert);
    }

    function handleArticleSave() {
        var articleToSave = $(this).parents(".panel").data();
        articleToSave.saved = true;
        console.log(articleToSave)
        $.ajax({
            method: "PUT",
            url: "/headlines/" + articleToSave._id,
            data: articleToSave
        }).then(function (data) {

            if (data.ok) {
                initPage();
            }
        });
    }

    function handleArticleScrape() {
        $.get("/scrape").then(function (data) {
            console.log("scraped")
            initPage();
            bootbox.alert("<h3 class='text-center m-top-80'>" + data.count + "<h3>");
        });
    }

    function handleArticleClear() {
        console.log("clear artilces")
        $.ajax({
            url: "/headlines/" + articleContainer._id,
            type: 'DELETE',
            success: function (response) {
                console.log("return empty")
                articleContainer.empty();
                initPage();
            },
            error:function (err){
                console.log("we have a problem", err)
            },
            
        });

    }
});