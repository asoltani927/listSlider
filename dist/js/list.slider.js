/*

 java script left slider plugin
 developer: amin soltani (asoltani927@gmail.com)
 site: www.adrianaco.ir | asoltani.ir
 
 options:
    autoplay: false,
    thumbnail: true,
    navigation: false,
    animate: "slide"
*/

    (function($) {
        $.fn.listslider = function (OptionArgs = false) {
            var options = {
                autoplay: false,
                thumbnail: true,
                navigation: false,
                animate: "slide",
                status: true,
                duration: 5000,
                speed: 100,
                playPause: true,
                content: false,
            };

            if (OptionArgs != false) {
                $.each(OptionArgs, function (key, value) {
                    options[key] = value;
                });
            }

            var slider = $(this);
            //  slider.css("transition","0.5s all");
            slider.addClass('listslider');


            slider.children("div.slides").attr("data-u", "slides").attr('id', 'slides');
            slider.children("div.slides").children("div.slide").css("display", "none").children("img").attr("data-u", "image");

            slider.append('<div id="loading"></div>');
            slider.children("div#loading").attr("data-u", "loading");
            slider.children("div[data-u=loading]").show();

            var count_slides = slider.children("div.slides").children("div.slide").length; // number of slide
            var selected_slide_eq = Math.round(count_slides / 2) - 1; // showed slide
            var timeout; // for change sliding
            var playInterval; // for auto play function
            
            slider.children("div.slides").children("div.slide").each(function (index, slide) {
                    $(slide).attr("eq", index);
            });
            
            if (options["thumbnail"] == true) {
                slider.append('<div id="thumbniles"></div>');
                var thumbniles = slider.children("div#thumbniles");
                var top = 0;
                slider.children("div.slides").children("div.slide").each(function (index, slide) {
                    var thumb_d = $("<div>").attr("data-u", "thumb").attr("eq", $(slide).attr("eq")).css("top", top);
                    $("<img>").attr("src", $(slide).children("img").attr("src")).addClass("i").appendTo(thumb_d);
                    $("<div>").addClass("t").html($(slide).children("img").attr("data-t")).appendTo(thumb_d);
                    $("<div>").addClass("c").html($(slide).children("img").attr("data-c")).appendTo(thumb_d);
                    thumb_d.appendTo(thumbniles);
                    top += thumb_d.height() + 18;
                });

                thumbniles.children("div[data-u=thumb]").unbind();

                thumbniles.children("div[data-u=thumb]").on("click", function () {
                    var slide = $(this);
                    var eq = $(slide).attr("eq");
                    if(selected_slide_eq != eq)
                    {
                            var diff = thumbniles.children("div[data-u=thumb]").eq(selected_slide_eq).css("top").replace("px","") - $(slide).css("top").replace("px","");

                            thumbniles.children("div[data-u=thumb]").each(function(){
                                var px = parseInt($(this).css("top").replace("px","")) + diff;
                                $(this).css("top",px);
                            });

                            thumbniles.children("div[data-u=thumb]").removeClass("selected");
                            $(slide).addClass("selected");
                            go_to_slide(eq);
                    }


                });
            }

            if (options["navigation"] == true)
            {
                
                $('<a class="arrowleft"></a>').css("z-index",999999).attr("data-u","arrowleft").appendTo(slider);
                $('<a class="arrowright"></a>').css("z-index",999999).attr("data-u","arrowright").appendTo(slider);

                $("a[data-u=arrowright]").on("click", function () {
                    next_slide();
                });

                $("a[data-u=arrowleft]").on("click", function () {
                    previous_slide();
                });
            }
            
            function SetPlayInterval()
            {
                if (!playInterval) {
                    
                    clearInterval(playInterval);
                
                    playInterval = setInterval(function(){
                        if (options["autoplay"] == true)
                        {
                            next_slide();
                        }
                    }, options["duration"]);
                }
            }
            
            if (options["autoplay"] == true)
            {
               SetPlayInterval();
            }
            
            if(options["playPause"] == true)
                {
                    if (options["autoplay"] == true)
                    {
                        $('<a class="playPause"></a>').css("z-index",999999).attr("data-u","play").appendTo(slider);
                    }
                    else
                    {
                        $('<a class="playPause"></a>').css("z-index",999999).attr("data-u","pause").appendTo(slider);
                    }
                    
                    $("a.playPause").on("click", function () {
                        if (options["autoplay"] == true)
                        {
                            options["autoplay"] = false;
                            $("a.playPause").attr("data-u","pause");
                        }
                        else
                        {
                            options["autoplay"] = true;
                            $("a.playPause").attr("data-u","play");
                            SetPlayInterval();
                        }
                    });
                }

            if(options["status"] == true)
            {
                var select = (selected_slide_eq + 1);
                $("<div>").addClass("status").css("z-index",999999).appendTo(slider).html(select + "/" + count_slides);
            }
            

            function list_slider_status()
            {
                var select = (parseInt(selected_slide_eq) + 1);
                slider.children("div.status").html(select + "/" + count_slides);
            }

            function go_to_slide(eq)
            {

                        
                        timeout = setTimeout(function () {
                            slider.children("div[data-u=loading]").show();
                            switch (options["animate"]) {
                                case "slide":
                                    if(eq < selected_slide_eq)
                                    {
                                         slider.children("div.slides").children("div.slide[eq=" + eq + "]").hide().css("left","-100%");
                                        slider.children("div.slides").children("div.slide[eq=" + selected_slide_eq + "]").animate({left: "100%"},options["speed"],function(){ $(this).hide(); });
                                    }
                                    else
                                    {
                                        slider.children("div.slides").children("div.slide[eq=" + eq + "]").hide().css("left","100%");
                                        slider.children("div.slides").children("div.slide[eq=" + selected_slide_eq + "]").animate({left: "-100%"},options["speed"],function(){ $(this).hide(); });
                                    }

                                   slider.children("div.slides").children("div.slide[eq=" + eq + "]").show().animate({left: "0"},options["speed"]);
                                    break;

                                default: // or fade
                                    slider.children("div.slides").children("div.slide").css("z-index", 99999)
                                    slider.children("div.slides").children("div.slide[eq=" + eq + "]").css("z-index", 99);
                                    slider.children("div.slides").children("div.slide[eq=" + eq + "]").fadeIn(options["speed"]);
                                    slider.children("div.slides").children("div.slide[eq=" + selected_slide_eq + "]").fadeOut(options["speed"] + 200);

                                    break;
                            }
                            selected_slide_eq = eq;
                            list_slider_status();
                            slider.children("div[data-u=loading]").hide();
                            clearTimeout(timeout);
                        },100);

                    
            }

            function next_slide()
            {
                eq = parseInt(selected_slide_eq) + 1;
                if(eq > (count_slides  - 1))
                {
                    eq = 0;
                }

                if(options["thumbnail"] == true)
                {
                    thumbniles.children("div[data-u=thumb]").eq(eq).click();
                }
                else
                {
                    go_to_slide(eq);
                }
            }

            function previous_slide()
            {
                eq = parseInt(selected_slide_eq) - 1;
                if(eq < 0)
                {
                    eq = count_slides - 1;
                }

                if(options["thumbnail"] == true)
                {
                    thumbniles.children("div[data-u=thumb]").eq(eq).click();
                }
                else
                {
                    go_to_slide(eq);
                }
            }
            
            next_slide();
        }
    })(jQuery);

