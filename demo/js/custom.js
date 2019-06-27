$("div#listSlider").listslider({
    autoplay: true,
    thumbnail: true,
    navigation: true,
    animate: "fade",
    duration: 6000,
    content: true,
});

$("div#defaultListSlider").listslider({
    autoplay: true,
    thumbnail: false,
    navigation: false,
    animate: "slide",
    duration: 6000,
    content: true,
});
