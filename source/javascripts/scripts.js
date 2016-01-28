(function($){
	
$(function() {

  // Get random integer
  function getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
    
	function getRandomPercent() {
  	return getRandomInt(0, 100) + '%';
	}

  var shapesSet = $('.shapes .shape');
  var shapeCount = shapesSet.length;
  shapesSet = shapesSet.clone();
  
  //var shapeDelay = 0;
  //var fadeDelay = 0;
  
  var shapeDelay = 1200;
  var shapeDelayVariance = 40; // This represents a percentage
  var maxShapes = 600;
  var initDelay = 1200;
  var shapesAnimating = true;
  var allShapes = $('.shapes .shape');
  var mobileDice = $('.mobile-dice');
  var shapeIndex = 0;
  
  function moreShapes() {
    shapesSet.clone().appendTo( ".shapes" );
    allShapes = $('.shapes .shape');
    shapeCount = allShapes.length;
  }
  
  function nextShape() {
    if ((shapeIndex < maxShapes) && shapesAnimating) {
      
      // Add more shapes
      if(shapeIndex == shapeCount) {
        moreShapes();
      }
      
      var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
      var currentShapeVariance = getRandomInt(0, shapeDelayVariance);
      var currentShapeDelay = shapeDelay + ((shapeDelay*currentShapeVariance/100)*plusOrMinus);
      currentShapeDelay = Math.round(currentShapeDelay);
      
      setTimeout(function() {
        $(allShapes[shapeIndex]).css({left: getRandomPercent(), top: getRandomPercent()}).show();
        shapeIndex ++;
        nextShape();
      }, currentShapeDelay);
      
    }
  }
  
  function shapeInit() {
    shapesAnimating = true;
    if($(window).width() > 700.0) {
      setTimeout(function() {
        nextShape();
      }, initDelay);
    }
  }
  
  shapeInit();
  
  // Preload dice images
  if(!webgl_detect()) {
    $(window).load(function() {
  		var diceIMGs = [];
  		for (i = 1; i < 20; ++i) {
  			diceIMGs[i] = new Image();
  			diceIMGs[i].src = '-/img/faces/face-' + i + '.png?v1.1';
  		}
  		console.log(diceIMGs);
  	});
	}
  
  var fakeDiceDimension = 640;
  var randomatorEl = $('.randomator img');  
  function randomator() {
    var randomInt
    var randomize =  setInterval(function(){
      randomInt = getRandomInt(1, 20);
      var randomSrc = '-/img/faces/face-' + randomInt + '.png?v1.1';
      randomatorEl.attr('src',  randomSrc);
    }, 100);
    setTimeout(function() {
      clearInterval(randomize);
      if (randomInt === 1) {
        approved();
      }
    }, 1000)
  }
  
  // --------------------------------
  // Dice
  // --------------------------------
  
  var isFirefox = typeof InstallTrigger !== 'undefined';
  
  // Check for WebGL Suppport
  function webgl_detect(return_context)
  {
      if (!!window.WebGLRenderingContext) {
          var canvas = document.createElement("canvas"),
               names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
             context = false;
   
          for(var i=0;i<4;i++) {
              try {
                  context = canvas.getContext(names[i]);
                  if (context && typeof context.getParameter == "function") {
                      // WebGL is enabled
                      if (return_context) {
                          // return WebGL object if the function's argument is present
                          return {name:names[i], gl:context};
                      }
                      // else, return just true
                      return true;
                  }
              } catch(e) {}
          }
   
          // WebGL is supported, but disabled
          return false;
      }
   
      // WebGL not supported
      return false;
  }
  
  function approved() {
    $('body').addClass('stop-scroll');
    var approvedEl = $('.approved');
    var approvedHeaderEl = $('.approved h1');
    approvedEl.show();
    var flashInterval = setInterval(function(){
      if(approvedHeaderEl.is(':visible')) {
        approvedHeaderEl.hide();
      } else {
        approvedHeaderEl.show();
      }
    }, 500);
    setTimeout(function() {
      approvedEl.hide();
      clearInterval(flashInterval);
      $('body').removeClass('stop-scroll');
    }, 3000);
  }

  function initializeDice() {
    var container = document.body;
    var canvas = document.getElementById('canvas');
    $(canvas).width($(window).width() - 1);
    $(canvas).height($(window).height() - 1);
    
    var box = new $t.dice.dice_box(canvas);
    
    function after_roll(result) {
      // If lands on approved, flash screen
      if(result[0] === 1) {
        setTimeout(function() {
          approved();
        }, 500)
      }
    }
    
    box.bind_mouse(container, '', after_roll);
    
    // First dice roll
    box.rolling = false;
    box.roll({x: .5, y: -.5}, 50); 
    
    $t.bind(container, ['mouseup', 'touchend', 'touchcancel'], function(ev) {
      box.rolling = false;
      $('.shape-instructions').remove();
      var step = box.w / 4.5;
      var x = Math.floor((ev.clientX - (box.w - step / 2 - step * 3)) / step);
      var y = ev.clientY - (box.h - step / 2);
    });
  }
 
  function hideDiceCanvas() {
    resetURL();
    $('body').removeClass('dice-visible');
    $('.dice, .mobile-dice').hide();
    $('.intro, .shapes').show();
  }

  $('.side-label-top').click(function(e) {
    e.preventDefault();
    hideDiceCanvas();
    shapeInit();
  });
  
  // Show try-it based on URL
  var diceInitialized = false;
  var URLhash = window.location.href;
  if(URLhash == 'http://advicedice.bigcartel.com/try-it') {
    if(webgl_detect() && !isFirefox) {
      showDiceCanvas();
    } else {
      showMobileDice();
    }
  } 
    
  function resetURL() {
    history.pushState("", document.title, window.location.pathname);
  }
  function tryURL() {
    history.pushState("", document.title, window.location.pathname + "#try-now");
  }
  
  function showDiceCanvas() {
//     tryURL();
    shapesAnimating = false;
    $('body').addClass('dice-visible');
    $('.shapes, .intro').hide();
    $('.dice, .shape-instructions').show();
    if(!diceInitialized) {
      console.log('test');
      diceInitialized = true;
      initializeDice();
    }
  }
  
  function showMobileDice() {
//     tryURL();
    shapesAnimating = false;
    $('body').addClass('dice-visible');
    $('.shapes, .intro').hide();
    mobileDice.show();
    randomator();
  }
  
  $('.shuffle').click(function(e) {
    e.preventDefault();
    randomator();
  });
  
  // Initialize dice trial
  $('.dice-trigger').click(function(e) {
    e.preventDefault();
    if(webgl_detect() && !isFirefox) {
      showDiceCanvas();
    } else {
      showMobileDice();
    }
  });
  

});	
		
  'use strict';
  // Global settings

  // Site scripts
  $(document).ready(function(){
  	$('.circular-cta-text').circleType();
	});
  
	//adds underline to active nav element
	$(function() {
		var loc = window.location.href; // returns the full URL
			if(/product/.test(loc)) {
				$('#global-nav-top-right').addClass('global-nav_active');
			} else if(/about/.test(loc)) {
				$('#global-nav-bottom-right').addClass('global-nav_active_about');
			} else if(/try/.test(loc)) {
				$('#global-nav-bottom-left').addClass('global-nav_active_about');
			} 
	});
	
	$(function() {
		// Slider
		var slideshowAtts = {
		    speed: 400,
		    swipe: true,
		    autoHeight: 'calc',
		    pager: '.cycle-pager',
		    pagerTemplate: '<span></span>',
		    next: $('.slideshow img')
  		}
  		
  		var waitForFinalEvent = (function () {
  			var timers = {};
  			return function (callback, ms, uniqueId) {
  				if (!uniqueId) {
  					uniqueId = "Don't call this twice without a uniqueId";
      			}
	  			if (timers[uniqueId]) {
	  				clearTimeout (timers[uniqueId]);
      			}
	  			timers[uniqueId] = setTimeout(callback, ms);
    		};
  		})();
  		if($('.stacked-images').length === 0) {
    
  			// Slidehsow
  			$('.slideshow').cycle(slideshowAtts);
    
  			// Slider max height
  			function maxImageHeight() {
  				if($(window).width() > 880) {
  					var maxImageHeight = $(window).height() - $('header').outerHeight();
  					$('.images, .images img').css({'max-height': maxImageHeight});
      			} else {
	  				$('.images, .images img').css({'max-height': 9999});
      			}
    		}
    
			$(window).resize(function() {
				maxImageHeight();
    		});
			$(window).load(function() {
				maxImageHeight();
    		});
    
  		} else {
  
  			function startSlideshow() {
  				$('.cycle-pager').show();
	  			$('.slideshow').cycle(slideshowAtts);
      		
    	}
    
		startSlideshow();
    
  	}
  	
  	//change button to success message on mailchimp submit
  	
	function register($form) {
	  $.ajax({
	    type: $form.attr('method'),
	    url: $form.attr('action'),
	    data: $form.serialize(),
	    cache       : false,
	    dataType    : 'json',
	    contentType: "application/json; charset=utf-8",
	    error       : function(err) { $('#notification_container').html('<span class="alert">Could not connect to server. Please try again later.</span>'); },
	    success     : function(data) {
	     
	      if (data.result != "success") {
	        var message = data.msg.substring(4);
	        console.log(message);
	        $('#mc-embedded-subscribe').attr('value','FAIL');
	      } 
	
	      else {
	        var message = data.msg;
	        console.log("success");
	        $('#mc-embedded-subscribe').attr('value','you did it');
	      }
	     
	    }
	  });
	}
  	 var $form = $('#mc-embedded-subscribe-form');
 
	  $('#mc-embedded-subscribe').on('click', function(event) {
	    if(event) event.preventDefault();
	    register($form);
	  });






});

})(jQuery); // End boss daddy closure



