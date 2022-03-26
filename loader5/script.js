/*JS isn't my expertise 😉*/
$(document).ready(function() {
    $("#menuButton").on("click", function(){
        $(".side-a").toggleClass("is-open");
        $("html").toggleClass("is-nav-open");
        //loadNew();
    });
      $("#darkMode").on("click", function(){
        $("html").toggleClass("is-dark");
    });

      $(".see-more").on("click", function(){
        loadNew();
    });

  

     

      const links = [];
links[0]= "../loader1/index.html";
links[1]= "../loader2/index.html";
links[2]= "../loader3/index.html";
links[3]= "../loader4/index.html";



function loadNew() {

let random_url = Math.floor(Math.random() * 4); 

 //console.log(random_url);
  location.href = links[random_url];
}


});



