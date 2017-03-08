
pioneer.home = function() {
    $('.carousel.carousel-slider').carousel({fullWidth: true});
    $(".button-collapse").sideNav({
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true // Choose whether you can drag to open on touch screens
    });

    autoplay()   
    function autoplay() {
        $('.carousel').carousel('next');
        setTimeout(autoplay, 5000);
    }

    $('.parallax').parallax();

    $(window).resize(function() {
        adjustBlockLeftHeight();
        adjustThreeColumnWidth();
    });

    adjustBlockLeftHeight();
    adjustThreeColumnWidth();

    function adjustBlockLeftHeight(){
        var leftWidth = $('.home-slide .block__two-column--left').width();
        var leftHeight = leftWidth * 1.2;
        var vpWidth = $(window).width();

        $('.home-slide .block__two-column--left').height(leftHeight);
        if(vpWidth >= 600 )
            $('.home-slide .block__two-column--right').height(leftHeight);
        else{
            $('.home-slide .block__two-column--right').css("height: auto;");            
        }
    }

    function adjustThreeColumnWidth(){
        var vpWidth = $(window).width();
        var intervalWidth = Math.floor(vpWidth / 3);
        var gap = vpWidth - intervalWidth * 3;

        if(vpWidth >= 600){
            $('.home-contact .block__three-column').each(function(index, elem){
                if(index == 0){
                    $(elem).width(intervalWidth + gap);
                    isFirst = false;
                } else {
                    $(elem).width(intervalWidth);
                }
            });            
        } else {
            $('.home-contact .block__three-column').each(function(index, elem){
                $(elem).width(vpWidth);
            });            
        }
    }
}