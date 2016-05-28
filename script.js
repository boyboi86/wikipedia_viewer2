$(document).ready(function() {
  search()
  $(".main").fadeIn(1500);

  //autocomplete below
  $(".form-control").autocomplete({
    source: function(req, res) {
      $.ajax({
        url: "http://en.wikipedia.org/w/api.php",
        dataType: 'jsonp',
        data: {
          action: "opensearch",
          format: "json",
          search: $(".form-control").val()
        },
        success: function(data) {
          res(data[1]);
        }
      });
    }
  });

  //for both "enter" and click select
  function search() {
    $(".form-control").keypress(function(e) {
      if (e.keyCode == 13 && $(".form-control").val().length > 1) {
        e.preventDefault();
        displaySearch();
        //html do not put type="submit"
      };

      $(".btn").on("click", function(e) {
        if ($(".form-control").val().length > 1) {
          displaySearch();
        }
      });
      /*
      Replace the entire $.ajax code with the below code will also work

      $.getJSON("https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch="+$(".form-control").val() +"&srnamespace=0&srwhat=text&titles=Main%20Page&callback=?", function(data) {} ; */

      function displaySearch() {
        $.ajax({
          url: "https://en.wikipedia.org/w/api.php?",
          dataType: 'jsonp',
          data: {
            action: "query",
            list: "search",
            srsearch: $(".form-control").val(),
            format: "json"
          },
          xhrFields: {
            withCredentials: true
          },
          success: displayResult,
          error: function(err) {
            console.log(err);
          }
        })
      };
//tried adding effects but zzzz
      function displayResult(data) {
        
        $("#outcome").html("");
        $("img").fadeOut(1000).delay(500).slideUp(600);
        $(".btn").addClass("invisible");
        $(".form-control").addClass("margin");

        var result = '';

        $.each(data.query.search, function(i, obj) {
          result += "<a href='https://en.wikipedia.org/wiki/" + obj.title.replace(" ", "_") + "'>";
          result += "<div class='outcome'>";
          result += "<div class='title'>";
          result += obj.title;
          result += "</div>";
          result += "<div class='snippet'>";
          result += obj.snippet;
          result += "</div>";
          result += "</div>";
          result += "</a>";

//fadeIn effect after append
//apparently doesn't work
          $(result).appendTo("#outcome").hide().fadeIn(1000);
          
          $(".form-control").val("");
        })

      }

    })
  }

})