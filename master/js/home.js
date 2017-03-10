
pioneer.home = function() {


    $('.carousel.carousel-slider').carousel({fullWidth: true});
    $(".button-collapse").sideNav({
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true // Choose whether you can drag to open on touch screens
    });

    autoplay();
    adjustBlockLeftHeight();
    adjustThreeColumnWidth();

    function autoplay() {
        $('.carousel').carousel('next');
        setTimeout(autoplay, 5000);
    }

    $('.parallax').parallax();

    $(window).resize(function() {
        adjustBlockLeftHeight();
        adjustThreeColumnWidth();
    });

    function adjustBlockLeftHeight(){
        var leftWidth = $('.home-slide .block__two-column--left').outerWidth();
        var leftHeight = leftWidth * 1.2;
        var vpWidth = $(window).width();
        $('.home-slide .block__two-column--left').outerHeight(leftHeight);
        $('.home-slide .block__two-column--right').outerHeight(leftHeight);
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
                $(elem).height(intervalWidth);
            });            
        } else {
            $('.home-contact .block__three-column').each(function(index, elem){
                $(elem).width(vpWidth);
                $(elem).height(vpWidth);
            });            
        }
    }

    var feed = new Instafeed({
        get: 'user',
        userId: 1268599184,
        accessToken: '1268599184.a110f59.fca8520d90054229a9166be386104252',
        target: 'instagram',
        resolution: 'standard_resolution',
        limit: '1',
        sortBy: 'most-recent',
        target: 'instagram_wrapper',
        template: '<div class="block__hover-zoom" style="background-image: url({{image}});"><div class="block__icon block__icon--sm-logo"><i class="icon-insta"></i></div></div>',
        after: function() {
            $('#default-instagram').hide();
        }
    });    

    feed.run();
}