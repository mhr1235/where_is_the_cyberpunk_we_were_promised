(function() {
  /*
  	Home Portal App - Design concent
  	Designed to Raspberry Pi 2

  	Note: you can switch back to home if you slide to right the page

  	For more information follow me on Twitter @Icebobcsi
  	https://twitter.com/Icebobcsi

  	Icons: http://fontawesome.io/
  	Animation: https://greensock.com/gsap
  	Weather icons: http://vclouds.deviantart.com/art/VClouds-Weather-Icons-179152045
  	Home screen inspired by: https://www.behance.net/gallery/20006383/PORTAL-Inspire-Greatness

  */
  var mapLoaded, showMap, showPage;

  mapLoaded = false;

  showPage = function(pageName, cb) {
    var $page, $prevPage, tl;
    $page = $(".page.page-" + pageName);
    $prevPage = $(".page:visible");
    if ($prevPage.attr("class") === $page.attr("class")) {
      return $page;
    }
    // console.log("Show page " + pageName);
    tl = new TimelineLite({
      paused: true,
      onComplete: function() {
        if (!mapLoaded && pageName === "map") {
          showMap();
          mapLoaded = true;
        }
        if (cb) {
          return cb();
        }
      }
    });
    if ($prevPage.length > 0) {
      // Slide out old
      tl.to($prevPage, 0.5, {
        x: 800,
        ease: Power3.easeIn,
        clearProps: "scale",
        onComplete: function() {
          return $prevPage.hide();
        }
      });
    }
    tl.from($page, 0.5, {
      scale: 0.6,
      delay: 0.2,
      ease: Power3.easeOut,
      onStart: function() {
        return $page.show();
      }
    });
    
    // Animate home page
    if (pageName === "home") {
      tl.from(".page-home .panel-time", 0.6, {
        x: -400,
        ease: Power3.easeOut
      });
      tl.from(".page-home .panel-weather", 0.6, {
        x: "+=400",
        ease: Power3.easeOut
      }, '-=0.3');
      tl.staggerFrom(".page-home .panel-functions .icon", 1.5, {
        y: 150,
        clearProps: "opacity, scale",
        ease: Elastic.easeOut
      }, 0.2, "-=0.4");
      tl.staggerFrom(".page-home .panel-calendar li", 1.5, {
        x: -400,
        ease: Power3.easeOut
      }, 0.2, "-=2");
      tl.staggerFrom(".page-home .panel-tasks li", 1.5, {
        x: 400,
        ease: Power3.easeOut
      }, 0.2, "-=1.8");
    }
    
    // Animate weather page
    if (pageName === "weather") {
      tl.from(".page-weather .panel-now", 0.6, {
        x: -500,
        ease: Power3.easeOut
      });
      tl.from(".page-weather .panel-today", 0.6, {
        x: -500,
        ease: Power3.easeOut
      }, '-=0.2');
      tl.from(".page-weather .panel-location", 0.4, {
        x: "+=400",
        ease: Power3.easeOut
      }, '-=0.5');
      tl.staggerFrom(".page-weather .panel-forecast .box", 1.2, {
        y: 150,
        delay: 0.5,
        ease: Elastic.easeOut
      }, 0.1, "-=0.5");
    }
    
    // Animate calendar page
    if (pageName === "calendar") {
      tl.staggerFrom(".page-calendar .panel-calendar", 1.0, {
        y: -150,
        autoAlpha: 0,
        ease: Power3.easeOut
      }, 0.3);
      tl.staggerFrom(".page-calendar .panel-calendar li", 1.0, {
        y: 150,
        autoAlpha: 0,
        ease: Power3.easeOut
      }, 0.1, "-=0.6");
    }
    // Animate calendar page
    if (pageName === "tasks") {
      tl.staggerFrom(".page-tasks .panel-tasklist", 1.0, {
        y: -150,
        autoAlpha: 0,
        ease: Power3.easeOut
      }, 0.3, "-=0.2");
      tl.staggerFrom(".page-tasks .panel-tasklist li", 1.0, {
        y: 150,
        autoAlpha: 0,
        ease: Power3.easeOut
      }, 0.1, "-=0.8");
    }
    
    // Play
    tl.play();
    return $page;
  };

  $(function() {
    var bigIndex, smallIndex, stopBigNews, stopSmallNews;
    // $page = showPage "home"

    // Gestures control	
    $('.page').each(function(i, page) {
      var mc, type;
      if ($(page).hasClass("page-home")) {
        return;
      }
      mc = new Hammer(page, {
        preventDefault: true
      });
      type = "pan";
      mc.get(type).set({
        direction: Hammer.DIRECTION_HORIZONTAL,
        threshold: 10
      });
      return mc.on(type + 'right', function(ev) {
        mc.get(type).set({
          enable: false
        });
        console.log(ev);
        return showPage("home", function() {
          return mc.get(type).set({
            enable: true
          });
        });
      });
    });
    // Click handler for home buttons
    $(".page-home .panel-functions .icon").on("click", function() {
      TweenLite.to($(this), 0.5, {
        scale: 2.0,
        clearProps: "opacity, scale",
        opacity: 0
      });
      return showPage($(this).attr('data-page'));
    });
    $(".page-home .panel-weather").on("click", function() {
      return showPage("weather");
    });
    $(".page-home .panel-tasks").on("click", function() {
      return showPage("tasks");
    });
    $(".page-home .panel-tasks li .check").on("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      return $(this).closest("li").toggleClass("checked");
    });
    $(".page-home .panel-calendar").on("click", function() {
      return showPage("calendar");
    });
    // Task events	
    $(".page-tasks .panel-tasklist li").on("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      return $(this).toggleClass("checked");
    });
    $(".page-tasks .newItem .text").on("click", function(e) {
      var div;
      div = $(e.target).closest(".newItem");
      div.find(".text").hide();
      return div.find("input").val('').show().focus();
    });
    $(".page-tasks .newItem input").on("keypress", function(e) {
      var div, newLI, ul, value;
      if (e.keyCode === 13) {
        value = $(e.target).val();
        div = $(e.target).closest(".newItem");
        div.find(".text").show();
        div.find("input").hide();
        ul = div.parent().find("ul");
        newLI = $("<li/>").append([$("<div/>").addClass("check"), $("<div/>").addClass("title").text(value)]);
        ul.prepend(newLI);
        return TweenMax.from(newLI, 1.2, {
          y: -50,
          ease: Elastic.easeOut
        });
      }
    });
    $(".page-tasks .newItem input").on("blur", function(e) {
      var div;
      div = $(e.target).parent();
      div.find(".text").show();
      return div.find("input").hide();
    });
    
    // News scrolling
    stopBigNews = false;
    $(".page-news .panel-newslist-big").on("mouseenter", function() {
      return stopBigNews = true;
    }).on("mouseleave", function() {
      return stopBigNews = false;
    });
    bigIndex = 1;
    setInterval(function() {
      if (stopBigNews) {
        return;
      }
      TweenLite.to(".page-news .panel-newslist-big ul", 1.5, {
        scrollTo: {
          x: bigIndex * (370 + 4)
        },
        ease: Power2.easeInOut
      });
      bigIndex++;
      if (bigIndex >= $(".page-news .panel-newslist-big li").length) {
        return bigIndex = 0;
      }
    }, 4000);
    stopSmallNews = false;
    $(".page-news .panel-newslist-small").on("mouseenter", function() {
      return stopSmallNews = true;
    }).on("mouseleave", function() {
      return stopSmallNews = false;
    });
    smallIndex = 1;
    return setInterval(function() {
      var li, top, top0;
      if (stopSmallNews) {
        return;
      }
      li = $(`.page-news .panel-newslist-small li:eq(${smallIndex})`);
      top = li.offset().top;
      top0 = $(".page-news .panel-newslist-small li:eq(0)").offset().top;
      TweenLite.to(".page-news .panel-newslist-small", 1.5, {
        scrollTo: {
          y: top - top0
        },
        ease: Power2.easeInOut
      });
      smallIndex++;
      if (smallIndex >= $(".page-news .panel-newslist-small	li").length) {
        return smallIndex = 0;
      }
    }, 3000);
  });

  
  // Show traffic map
  showMap = function() {
    var map, mapOptions, trafficLayer;
    mapOptions = {
      center: {
        lat: 47.480865,
        lng: 19.060265
      },
      zoom: 12,
      // Cobalt Theme
      styles: [
        {
          featureType: 'all',
          elementType: 'all',
          stylers: [
            {
              'invert_lightness': false
            },
            {
              'saturation': 20
            },
            {
              'lightness': 10
            },
            {
              'gamma': 0.5
            },
            {
              'hue': '#90C2DC'
            }
          ]
        },
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [
            {
              'visibility': 'off'
            }
          ]
        }
      ]
    };
    map = new google.maps.Map($(".page-map .map").get(0), mapOptions);
    trafficLayer = new google.maps.TrafficLayer();
    return trafficLayer.setMap(map);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBY0c7RUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsTUFBQSxTQUFBLEVBQUEsT0FBQSxFQUFBOztFQUVILFNBQUEsR0FBWTs7RUFFWixRQUFBLEdBQVcsUUFBQSxDQUFDLFFBQUQsRUFBVyxFQUFYLENBQUE7QUFDWCxRQUFBLEtBQUEsRUFBQSxTQUFBLEVBQUE7SUFBQyxLQUFBLEdBQVEsQ0FBQSxDQUFFLGFBQUEsR0FBZ0IsUUFBbEI7SUFFUixTQUFBLEdBQVksQ0FBQSxDQUFFLGVBQUY7SUFDWixJQUFHLFNBQVMsQ0FBQyxJQUFWLENBQWUsT0FBZixDQUFBLEtBQTJCLEtBQUssQ0FBQyxJQUFOLENBQVcsT0FBWCxDQUE5QjtBQUNDLGFBQU8sTUFEUjtLQUhEOztJQVFDLEVBQUEsR0FBSyxJQUFJLFlBQUosQ0FDSjtNQUFBLE1BQUEsRUFBUSxJQUFSO01BQ0EsVUFBQSxFQUFZLFFBQUEsQ0FBQSxDQUFBO1FBQ1gsSUFBRyxDQUFJLFNBQUosSUFBa0IsUUFBQSxLQUFZLEtBQWpDO1VBQ0UsT0FBQSxDQUFBO1VBQ0EsU0FBQSxHQUFZLEtBRmQ7O1FBSUEsSUFBUSxFQUFSO2lCQUFBLEVBQUEsQ0FBQSxFQUFBOztNQUxXO0lBRFosQ0FESTtJQVNMLElBQUcsU0FBUyxDQUFDLE1BQVYsR0FBbUIsQ0FBdEI7O01BRUMsRUFBRSxDQUFDLEVBQUgsQ0FBTSxTQUFOLEVBQWlCLEdBQWpCLEVBQ0M7UUFBQSxDQUFBLEVBQUcsR0FBSDtRQUNBLElBQUEsRUFBTSxNQUFNLENBQUMsTUFEYjtRQUVBLFVBQUEsRUFBVyxPQUZYO1FBR0EsVUFBQSxFQUFZLFFBQUEsQ0FBQSxDQUFBO2lCQUFHLFNBQVMsQ0FBQyxJQUFWLENBQUE7UUFBSDtNQUhaLENBREQsRUFGRDs7SUFRQSxFQUFFLENBQUMsSUFBSCxDQUFRLEtBQVIsRUFBZSxHQUFmLEVBQ0M7TUFBQSxLQUFB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c2lnbmVkIHRvIFJhc3BiZXJyeSBQaSAyXG5cblx0Tm90ZTogeW91IGNhbiBzd2l0Y2ggYmFjayB0byBob21lIGlmIHlvdSBzbGlkZSB0byByaWdodCB0aGUgcGFnZVxuXG5cdEZvciBtb3JlIGluZm9ybWF0aW9uIGZvbGxvdyBtZSBvbiBUd2l0dGVyIEBJY2Vib2Jjc2lcblx0aHR0cHM6Ly90d2l0dGVyLmNvbS9JY2Vib2Jjc2lcblxuXHRJY29uczogaHR0cDovL2ZvbnRhd2Vzb21lLmlvL1xuXHRBbmltYXRpb246IGh0dHBzOi8vZ3JlZW5zb2NrLmNvbS9nc2FwXG5cdFdlYXRoZXIgaWNvbnM6IGh0dHA6Ly92Y2xvdWRzLmRldmlhbnRhcnQuY29tL2FydC9WQ2xvdWRzLVdlYXRoZXItSWNvbnMtMTc5MTUyMDQ1XG5cdEhvbWUgc2NyZWVuIGluc3BpcmVkIGJ5OiBodHRwczovL3d3dy5iZWhhbmNlLm5ldC9nYWxsZXJ5LzIwMDA2MzgzL1BPUlRBTC1JbnNwaXJlLUdyZWF0bmVzc1xuXG4jIyNcblxubWFwTG9hZGVkID0gZmFsc2Vcblxuc2hvd1BhZ2UgPSAocGFnZU5hbWUsIGNiKSAtPlxuXHQkcGFnZSA9ICQoXCIucGFnZS5wYWdlLVwiICsgcGFnZU5hbWUpXG5cdFxuXHQkcHJldlBhZ2UgPSAkKFwiLnBhZ2U6dmlzaWJsZVwiKTtcdFxuXHRpZiAkcHJldlBhZ2UuYXR0cihcImNsYXNzXCIpIGlzICRwYWdlLmF0dHIoXCJjbGFzc1wiKVxuXHRcdHJldHVybiAkcGFnZVxuXG5cdCMgY29uc29sZS5sb2coXCJTaG93IHBhZ2UgXCIgKyBwYWdlTmFtZSk7XG5cdFxuXHR0bCA9IG5ldyBUaW1lbGluZUxpdGVcblx0XHRwYXVzZWQ6IHRydWUsXG5cdFx0b25Db21wbGV0ZTogLT4gXG5cdFx0XHRpZiBub3QgbWFwTG9hZGVkIGFuZCBwYWdlTmFtZSBpcyBcIm1hcFwiIFxuXHRcdFx0XHRcdHNob3dNYXAoKVxuXHRcdFx0XHRcdG1hcExvYWRlZCA9IHRydWVcblx0XHRcblx0XHRcdGNiKCkgaWYgY2Jcblx0XG5cdGlmICRwcmV2UGFnZS5sZW5ndGggPiAwXG5cdFx0IyBTbGlkZSBvdXQgb2xkXG5cdFx0dGwudG8gJHByZXZQYWdlLCAwLjUsXG5cdFx0XHR4OiA4MDBcblx0XHRcdGVhc2U6IFBvd2VyMy5lYXNlSW5cblx0XHRcdGNsZWFyUHJvcHM6XCJzY2FsZVwiXG5cdFx0XHRvbkNvbXBsZXRlOiAtPiAkcHJldlBhZ2UuaGlkZSgpXG5cblx0dGwuZnJvbSAkcGFnZSwgMC41LFxuXHRcdHNjYWxlOiAwLjZcblx0XHRkZWxheTogMC4yXG5cdFx0ZWFzZTogUG93ZXIzLmVhc2VPdXRcblx0XHRvblN0YXJ0OiAtPiAkcGFnZS5zaG93KClcblx0XG5cdCMgQW5pbWF0ZSBob21lIHBhZ2Vcblx0aWYgcGFnZU5hbWUgaXMgXCJob21lXCJcblx0XHR0bC5mcm9tIFwiLnBhZ2UtaG9tZSAucGFuZWwtdGltZVwiLCAwLjYsIFxuXHRcdFx0eDogLTQwMFxuXHRcdFx0ZWFzZTogUG93ZXIzLmVhc2VPdXRcblxuXHRcdHRsLmZyb20gXCIucGFnZS1ob21lIC5wYW5lbC13ZWF0aGVyXCIsIDAuNiwgXG5cdFx0XHR4OiBcIis9NDAwXCJcblx0XHRcdGVhc2U6IFBvd2VyMy5lYXNlT3V0XG5cdFx0LCAnLT0wLjMnXG5cblx0XHR0bC5zdGFnZ2VyRnJvbSBcIi5wYWdlLWhvbWUgLnBhbmVsLWZ1bmN0aW9ucyAuaWNvblwiLCAxLjUsIFxuXHRcdFx0eTogMTUwXG5cdFx0XHRjbGVhclByb3BzOiBcIm9wYWNpdHksIHNjYWxlXCJcblx0XHRcdGVhc2U6IEVsYXN0aWMuZWFzZU91dFxuXHRcdCwgMC4yLCBcIi09MC40XCJcblxuXHRcdHRsLnN0YWdnZXJGcm9tIFwiLnBhZ2UtaG9tZSAucGFuZWwtY2FsZW5kYXIgbGlcIiwgMS41LCBcblx0XHRcdHg6IC00MDBcblx0XHRcdGVhc2U6IFBvd2VyMy5lYXNlT3V0XG5cdFx0LCAwLjIsIFwiLT0yXCJcblxuXHRcdHRsLnN0YWdnZXJGcm9tIFwiLnBhZ2UtaG9tZSAucGFuZWwtdGFza3MgbGlcIiwgMS41LCBcblx0XHRcdHg6IDQwMFxuXHRcdFx0ZWFzZTogUG93ZXIzLmVhc2VPdXRcblx0XHQsIDAuMiwgXCItPTEuOFwiXG5cdFx0XG5cdCMgQW5pbWF0ZSB3ZWF0aGVyIHBhZ2Vcblx0aWYgcGFnZU5hbWUgaXMgXCJ3ZWF0aGVyXCJcblx0XHR0bC5mcm9tIFwiLnBhZ2Utd2VhdGhlciAucGFuZWwtbm93XCIsIDAuNiwgXG5cdFx0XHR4OiAtNTAwXG5cdFx0XHRlYXNlOiBQb3dlcjMuZWFzZU91dFxuXG5cdFx0dGwuZnJvbSBcIi5wYWdlLXdlYXRoZXIgLnBhbmVsLXRvZGF5XCIsIDAuNiwgXG5cdFx0XHR4OiAtNTAwXG5cdFx0XHRlYXNlOiBQb3dlcjMuZWFzZU91dFxuXHRcdCwgJy09MC4yJ1xuXHRcdFx0XG5cdFx0dGwuZnJvbSBcIi5wYWdlLXdlYXRoZXIgLnBhbmVsLWxvY2F0aW9uXCIsIDAuNCwgXG5cdFx0XHR4OiBcIis9NDAwXCJcblx0XHRcdGVhc2U6IFBvd2VyMy5lYXNlT3V0XG5cdFx0LCAnLT0wLjUnXG5cdFx0XG5cdFx0dGwuc3RhZ2dlckZyb20gXCIucGFnZS13ZWF0aGVyIC5wYW5lbC1mb3JlY2FzdCAuYm94XCIsIDEuMiwgXG5cdFx0XHR5OiAxNTBcblx0XHRcdGRlbGF5OiAwLjVcblx0XHRcdGVhc2U6IEVsYXN0aWMuZWFzZU91dFxuXHRcdCwgMC4xLCBcIi09MC41XCJcblx0XG5cdCMgQW5pbWF0ZSBjYWxlbmRhciBwYWdlXG5cdGlmIHBhZ2VOYW1lIGlzIFwiY2FsZW5kYXJcIlxuXHRcdHRsLnN0YWdnZXJGcm9tIFwiLnBhZ2UtY2FsZW5kYXIgLnBhbmVsLWNhbGVuZGFyXCIsIDEuMCwgXG5cdFx0XHR5OiAtMTUwXG5cdFx0XHRhdXRvQWxwaGE6IDBcblx0XHRcdGVhc2U6IFBvd2VyMy5lYXNlT3V0XG5cdFx0LCAwLjNcblxuXHRcdHRsLnN0YWdnZXJGcm9tIFwiLnBhZ2UtY2FsZW5kYXIgLnBhbmVsLWNhbGVuZGFyIGxpXCIsIDEuMCwgXG5cdFx0XHR5OiAxNTBcblx0XHRcdGF1dG9BbHBoYTogMFxuXHRcdFx0ZWFzZTogUG93ZXIzLmVhc2VPdXRcblx0XHQsIDAuMSwgXCItPTAuNlwiXG5cblx0IyBBbmltYXRlIGNhbGVuZGFyIHBhZ2Vcblx0aWYgcGFnZU5hbWUgaXMgXCJ0YXNrc1wiXG5cdFx0dGwuc3RhZ2dlckZyb20gXCIucGFnZS10YXNrcyAucGFuZWwtdGFza2xpc3RcIiwgMS4wLCBcblx0XHRcdHk6IC0xNTBcblx0XHRcdGF1dG9BbHBoYTogMFxuXHRcdFx0ZWFzZTogUG93ZXIzLmVhc2VPdXRcblx0XHQsIDAuMywgXCItPTAuMlwiXG5cblx0XHR0bC5zdGFnZ2VyRnJvbSBcIi5wYWdlLXRhc2tzIC5wYW5lbC10YXNrbGlzdCBsaVwiLCAxLjAsIFxuXHRcdFx0eTogMTUwXG5cdFx0XHRhdXRvQWxwaGE6IDBcblx0XHRcdGVhc2U6IFBvd2VyMy5lYXNlT3V0XG5cdFx0LCAwLjEsIFwiLT0wLjhcIlxuXHRcdFxuXHRcdFxuXHQjIFBsYXlcblx0dGwucGxheSgpXG5cdFxuXHRyZXR1cm4gJHBhZ2VcblxuXG4kIC0+XG5cdCMgJHBhZ2UgPSBzaG93UGFnZSBcImhvbWVcIlxuXG5cdCMgR2VzdHVyZXMgY29udHJvbFx0XG5cdCQoJy5wYWdlJykuZWFjaCAoaSwgcGFnZSkgLT5cblx0XHRpZiAkKHBhZ2UpLmhhc0NsYXNzIFwicGFnZS1ob21lXCIgdGhlbiByZXR1cm5cblx0XG5cdFx0bWMgPSBuZXcgSGFtbWVyIHBhZ2UsIFxuXHRcdFx0cHJldmVudERlZmF1bHQ6IHRydWVcblxuXHRcdHR5cGUgPSBcInBhblwiXHRcdFx0XG5cdFx0bWMuZ2V0KHR5cGUpLnNldCh7IGRpcmVjdGlvbjogSGFtbWVyLkRJUkVDVElPTl9IT1JJWk9OVEFMLCB0aHJlc2hvbGQ6IDEwIH0pO1xuXHRcdG1jLm9uIHR5cGUgKyAncmlnaHQnLCAoZXYpIC0+XG5cdFx0XHRtYy5nZXQodHlwZSkuc2V0KHsgZW5hYmxlOiBmYWxzZSB9KTtcblx0XHRcdGNvbnNvbGUubG9nKGV2KVxuXHRcdFx0c2hvd1BhZ2UgXCJob21lXCIsIC0+XG5cdFx0XHRcdG1jLmdldCh0eXBlKS5zZXQoeyBlbmFibGU6IHRydWUgfSk7XG5cblx0IyBDbGljayBoYW5kbGVyIGZvciBob21lIGJ1dHRvbnNcblx0JChcIi5wYWdlLWhvbWUgLnBhbmVsLWZ1bmN0aW9ucyAuaWNvblwiKS5vbiBcImNsaWNrXCIsIC0+XHRcblx0XHRUd2VlbkxpdGUudG8gJCh0aGlzKSwgMC41LCBcblx0XHRcdHNjYWxlOiAyLjBcblx0XHRcdGNsZWFyUHJvcHM6IFwib3BhY2l0eSwgc2NhbGVcIlxuXHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XG5cdFx0c2hvd1BhZ2UgJCh0aGlzKS5hdHRyKCdkYXRhLXBhZ2UnKVxuXG5cdCQoXCIucGFnZS1ob21lIC5wYW5lbC13ZWF0aGVyXCIpLm9uIFwiY2xpY2tcIiwgLT5cblx0XHRzaG93UGFnZSBcIndlYXRoZXJcIlxuXHRcdFxuXHQkKFwiLnBhZ2UtaG9tZSAucGFuZWwtdGFza3NcIikub24gXCJjbGlja1wiLCAtPlxuXHRcdHNob3dQYWdlIFwidGFza3NcIlxuXG5cdCQoXCIucGFnZS1ob21lIC5wYW5lbC10YXNrcyBsaSAuY2hlY2tcIikub24gXCJjbGlja1wiLCAoZSktPlxuXHRcdGUucHJldmVudERlZmF1bHQoKVxuXHRcdGUuc3RvcFByb3BhZ2F0aW9uKClcblx0XHQkKHRoaXMpLmNsb3Nlc3QoXCJsaVwiKS50b2dnbGVDbGFzcyBcImNoZWNrZWRcIlx0XHRcblx0XHRcblx0JChcIi5wYWdlLWhvbWUgLnBhbmVsLWNhbGVuZGFyXCIpLm9uIFwiY2xpY2tcIiwgLT5cblx0XHRzaG93UGFnZSBcImNhbGVuZGFyXCJcblxuXHQjIFRhc2sgZXZlbnRzXHRcblx0JChcIi5wYWdlLXRhc2tzIC5wYW5lbC10YXNrbGlzdCBsaVwiKS5vbiBcImNsaWNrXCIsIChlKS0+XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0ZS5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdCQodGhpcykudG9nZ2xlQ2xhc3MgXCJjaGVja2VkXCJcdFx0XG5cdFxuXHQkKFwiLnBhZ2UtdGFza3MgLm5ld0l0ZW0gLnRleHRcIikub24gXCJjbGlja1wiLCAoZSktPlxuXHRcdGRpdiA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoXCIubmV3SXRlbVwiKVxuXHRcdGRpdi5maW5kKFwiLnRleHRcIikuaGlkZSgpXG5cdFx0ZGl2LmZpbmQoXCJpbnB1dFwiKS52YWwoJycpLnNob3coKS5mb2N1cygpXG5cdFx0XG5cdCQoXCIucGFnZS10YXNrcyAubmV3SXRlbSBpbnB1dFwiKS5vbiBcImtleXByZXNzXCIsIChlKS0+XG5cdFx0aWYgZS5rZXlDb2RlIGlzIDEzXG5cdFx0XHR2YWx1ZSA9ICQoZS50YXJnZXQpLnZhbCgpXG5cdFx0XHRkaXYgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KFwiLm5ld0l0ZW1cIilcblx0XHRcdGRpdi5maW5kKFwiLnRleHRcIikuc2hvdygpXG5cdFx0XHRkaXYuZmluZChcImlucHV0XCIpLmhpZGUoKVxuXHRcdFx0XG5cdFx0XHR1bCA9IGRpdi5wYXJlbnQoKS5maW5kKFwidWxcIik7XG5cdFx0XHRcdFxuXHRcdFx0bmV3TEkgPSAkKFwiPGxpLz5cIikuYXBwZW5kKFtcblx0XHRcdFx0XHQkKFwiPGRpdi8+XCIpLmFkZENsYXNzKFwiY2hlY2tcIiksXG5cdFx0XHRcdFx0JChcIjxkaXYvPlwiKS5hZGRDbGFzcyhcInRpdGxlXCIpLnRleHQodmFsdWUpXG5cdFx0XHRdKVxuXHRcdFx0dWwucHJlcGVuZCBuZXdMSVxuXHRcblx0XHRcdFR3ZWVuTWF4LmZyb20gbmV3TEksIDEuMiwgXG5cdFx0XHRcdHk6IC01MFxuXHRcdFx0XHRlYXNlOiBFbGFzdGljLmVhc2VPdXRcblx0XHRcdFx0XG5cdCQoXCIucGFnZS10YXNrcyAubmV3SXRlbSBpbnB1dFwiKS5vbiBcImJsdXJcIiwgKGUpLT5cdFx0XHRcdFxuXHRcdGRpdiA9ICQoZS50YXJnZXQpLnBhcmVudCgpXG5cdFx0ZGl2LmZpbmQoXCIudGV4dFwiKS5zaG93KClcblx0XHRkaXYuZmluZChcImlucHV0XCIpLmhpZGUoKVx0XHRcdFxuXHRcdFxuXHQjIE5ld3Mgc2Nyb2xsaW5nXG5cdFxuXHRzdG9wQmlnTmV3cyA9IGZhbHNlXG5cdCQoXCIucGFnZS1uZXdzIC5wYW5lbC1uZXdzbGlzdC1iaWdcIikub24oXCJtb3VzZWVudGVyXCIsIC0+XG5cdFx0c3RvcEJpZ05ld3MgPSB0cnVlXG5cdCkub24oXCJtb3VzZWxlYXZlXCIsIC0+XG5cdFx0c3RvcEJpZ05ld3MgPSBmYWxzZVxuXHQpXG5cblx0YmlnSW5kZXggPSAxXG5cdHNldEludGVydmFsIC0+XG5cdFx0aWYgc3RvcEJpZ05ld3MgdGhlbiByZXR1cm5cblx0XHRUd2VlbkxpdGUudG8oXCIucGFnZS1uZXdzIC5wYW5lbC1uZXdzbGlzdC1iaWcgdWxcIiwgMS41LCB7c2Nyb2xsVG86e3g6IGJpZ0luZGV4ICogKDM3MCArIDQpfSwgZWFzZTpQb3dlcjIuZWFzZUluT3V0fSk7ICMgNCAtPiAwLjI1ZW0gbWFyZ2luIGNhdXNlIG9mIGlubGluZS1ibG9ja1xuXHRcdFxuXHRcdGJpZ0luZGV4Kytcblx0XHRpZiBiaWdJbmRleCA+PSAkKFwiLnBhZ2UtbmV3cyAucGFuZWwtbmV3c2xpc3QtYmlnIGxpXCIpLmxlbmd0aCB0aGVuXHRiaWdJbmRleCA9IDBcblx0LCA0MDAwXG5cblx0c3RvcFNtYWxsTmV3cyA9IGZhbHNlXG5cdCQoXCIucGFnZS1uZXdzIC5wYW5lbC1uZXdzbGlzdC1zbWFsbFwiKS5vbihcIm1vdXNlZW50ZXJcIiwgLT5cblx0XHRzdG9wU21hbGxOZXdzID0gdHJ1ZVxuXHQpLm9uKFwibW91c2VsZWF2ZVwiLCAtPlxuXHRcdHN0b3BTbWFsbE5ld3MgPSBmYWxzZVxuXHQpXG5cblx0c21hbGxJbmRleCA9IDFcblx0c2V0SW50ZXJ2YWwgLT5cblx0XHRpZiBzdG9wU21hbGxOZXdzIHRoZW4gcmV0dXJuXG5cdFxuXHRcdGxpID0gJChcIi5wYWdlLW5ld3MgLnBhbmVsLW5ld3NsaXN0LXNtYWxsIGxpOmVxKCN7c21hbGxJbmRleH0pXCIpXG5cdFx0dG9wID0gbGkub2Zmc2V0KCkudG9wXG5cdFx0dG9wMCA9ICQoXCIucGFnZS1uZXdzIC5wYW5lbC1uZXdzbGlzdC1zbWFsbCBsaTplcSgwKVwiKS5vZmZzZXQoKS50b3Bcblx0XHRcblx0XHRUd2VlbkxpdGUudG8oXCIucGFnZS1uZXdzIC5wYW5lbC1uZXdzbGlzdC1zbWFsbFwiLCAxLjUsIHtzY3JvbGxUbzp7eTogdG9wIC0gdG9wMH0sIGVhc2U6UG93ZXIyLmVhc2VJbk91dH0pO1xuXHRcdFxuXHRcdHNtYWxsSW5kZXgrK1xuXHRcdGlmIHNtYWxsSW5kZXggPj0gJChcIi5wYWdlLW5ld3MgLnBhbmVsLW5ld3NsaXN0LXNtYWxsXHRsaVwiKS5sZW5ndGggdGhlblx0c21hbGxJbmRleCA9IDBcblx0LCAzMDAwXG5cdFxuXHRcbiMgU2hvdyB0cmFmZmljIG1hcFxuc2hvd01hcCA9IC0+XG5cdFx0bWFwT3B0aW9ucyA9IFxuXHRcdFx0Y2VudGVyOiBcblx0XHRcdFx0bGF0OiA0Ny40ODA4NjVcblx0XHRcdFx0bG5nOiAxOS4wNjAyNjVcblx0XHRcdHpvb206IDEyXG5cdFx0XHQjIENvYmFsdCBUaGVtZVxuXHRcdFx0c3R5bGVzOiBbXG5cdFx0XHRcdGZlYXR1cmVUeXBlOiAnYWxsJyxcblx0XHRcdFx0ZWxlbWVudFR5cGU6ICdhbGwnLFxuXHRcdFx0XHRzdHlsZXJzOiBbXG5cdFx0XHRcdFx0eyAnaW52ZXJ0X2xpZ2h0bmVzcyc6IGZhbHNlIH0sXG5cdFx0XHRcdFx0eyAnc2F0dXJhdGlvbic6IDIwIH0sXG5cdFx0XHRcdFx0eyAnbGlnaHRuZXNzJzogMTAgfSxcblx0XHRcdFx0XHR7ICdnYW1tYSc6IDAuNSB9LFxuXHRcdFx0XHRcdHsgJ2h1ZSc6ICcjOTBDMkRDJyB9XG5cdFx0XHRcdF1cblx0XHRcdCxcblx0XHRcdFx0ZmVhdHVyZVR5cGU6ICdwb2knLFxuXHRcdFx0XHRlbGVtZW50VHlwZTogJ2xhYmVscycsXG5cdFx0XHRcdHN0eWxlcnM6IFtcblx0XHRcdFx0XHR7ICd2aXNpYmlsaXR5JzogJ29mZicgfVxuXHRcdFx0XHRdXG5cdFx0XHRcblx0XHRcdF1cdFx0XHRcblxuXHRcdG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAgJChcIi5wYWdlLW1hcCAubWFwXCIpLmdldCgwKSwgbWFwT3B0aW9uc1xuXG5cdFx0dHJhZmZpY0xheWVyID0gbmV3IGdvb2dsZS5tYXBzLlRyYWZmaWNMYXllcigpXG5cdFx0dHJhZmZpY0xheWVyLnNldE1hcCBtYXBcblx0XHQiXX0=
//# sourceURL=coffeescript