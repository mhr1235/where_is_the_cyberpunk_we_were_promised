const links = [];
links[0]= "./loader1/index.html";
links[1]= "./loader2/index.html";
links[2]= "./loader3/index.html";
links[3]= "./loader4/index.html";

function loadNew(){

let random_url = Math.floor(Math.random() * 4); 

 //console.log(random_url);
  location.href = links[random_url];
}


document.getElementById('app1').onclick = loadNew;
document.getElementById('app2').onclick = loadNew;
document.getElementById('app3').onclick = loadNew;
document.getElementById('app4').onclick = loadNew;
document.getElementById('app5').onclick = loadNew;
//document.getElementsByClassName('title').onclick = loadNew;



const d = new Date();
document.getElementById("time").innerHTML = d + "<br>";

$.get("http://ipinfo.io", function (response) {
    $("#ip").html("IP: " + response.ip);
     $("#place").html(response.region);
    
}, "jsonp");