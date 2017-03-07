$(document).ready(function(){
    $('.carousel.carousel-slider').carousel({fullWidth: true});
    $(".button-collapse").sideNav({
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true // Choose whether you can drag to open on touch screens
    });
});
