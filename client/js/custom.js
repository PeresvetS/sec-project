import $ from 'jquery';
import Chartist from 'chartist';
import SmoothScroll from 'smoothscroll-for-websites';


$(document).ready(function() {
    // animation

    $('.post')
        .addClass('hiddens')
        .viewportChecker({ classToAdd: 'visible animated fadeIn', offset: 100 });

    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('.scrollup').fadeIn();
        } else {
            $('.scrollup').fadeOut();
        }
    });

    $('.scrollup').click(function() {
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });


    $('.down').click(
        function(e) {
            $('html, body').animate({ scrollTop: $('#down').offset().top }, 600);
        }
    );

    // modal

    $('#orderModal').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var packet = button.data('whatever') // Extract info from data-* attributes
            // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
            // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this)
        modal.find('#packet').val(packet)
    });




    //chart

    var chart = new Chartist.Line('.ct-chart', {
        labels: ['2014', '2015', '2016', '2017'],
        series: [
            [509.635, 760.935, 1015.774, 1397.980],
            [200.872, 313.190, 413.414, 594.639],
        ]
    }, {
        low: 0,
        showArea: true,
        showPoint: true,
        fullWidth: true,
    });




    var seq = 0,
        delays = 80,
        durations = 500;

    // Once the chart is fully created we reset the sequence
    chart.on('created', function() {
        seq = 0;
    });

    // On each drawn element by Chartist we use the Chartist.Svg API to trigger SMIL animations
    chart.on('draw', function(data) {
        seq++;

        if (data.type === 'line') {
            // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
            data.element.animate({
                opacity: {
                    // The delay when we like to start the animation
                    begin: seq * delays + 1000,
                    // Duration of the animation
                    dur: durations,
                    // The value where the animation should start
                    from: 0,
                    // The value where it should end
                    to: 1
                }
            });
        } else if (data.type === 'label' && data.axis === 'x') {
            data.element.animate({
                y: {
                    begin: seq * delays,
                    dur: durations,
                    from: data.y + 100,
                    to: data.y,
                    // We can specify an easing function from Chartist.Svg.Easing
                    easing: 'easeOutQuart'
                }
            });
        } else if (data.type === 'label' && data.axis === 'y') {
            data.element.animate({
                x: {
                    begin: seq * delays,
                    dur: durations,
                    from: data.x - 100,
                    to: data.x,
                    easing: 'easeOutQuart'
                }
            });
        } else if (data.type === 'point') {
            data.element.animate({
                x1: {
                    begin: seq * delays,
                    dur: durations,
                    from: data.x - 10,
                    to: data.x,
                    easing: 'easeOutQuart'
                },
                x2: {
                    begin: seq * delays,
                    dur: durations,
                    from: data.x - 10,
                    to: data.x,
                    easing: 'easeOutQuart'
                },
                opacity: {
                    begin: seq * delays,
                    dur: durations,
                    from: 0,
                    to: 1,
                    easing: 'easeOutQuart'
                }
            });
        } else if (data.type === 'grid') {
            // Using data.axis we get x or y which we can use to construct our animation definition objects
            var pos1Animation = {
                begin: seq * delays,
                dur: durations,
                from: data[data.axis.units.pos + '1'] - 30,
                to: data[data.axis.units.pos + '1'],
                easing: 'easeOutQuart'
            };

            var pos2Animation = {
                begin: seq * delays,
                dur: durations,
                from: data[data.axis.units.pos + '2'] - 100,
                to: data[data.axis.units.pos + '2'],
                easing: 'easeOutQuart'
            };

            var animations = {};
            animations[data.axis.units.pos + '1'] = pos1Animation;
            animations[data.axis.units.pos + '2'] = pos2Animation;
            animations['opacity'] = {
                begin: seq * delays,
                dur: durations,
                from: 0,
                to: 1,
                easing: 'easeOutQuart'
            };

            data.element.animate(animations);
        }
    });

    // For the sake of the example we update the chart every time it's created with a delay of 10 seconds
    chart.on('created', function() {
        if (window.__exampleAnimateTimeout) {
            clearTimeout(window.__exampleAnimateTimeout);
            window.__exampleAnimateTimeout = null;
        }
        window.__exampleAnimateTimeout = setTimeout(chart.update.bind(chart), 64000);
    });


    //scroll 


    // modal send message

    $("#formMessage").submit(function(e) {
        var form = $(this);
        var formData = form.serialize();
        $.ajax({
            type: "POST",
            url: "/",
            data: formData,
            beforeSend: function(data) {
                form
                    .find('button[type="submit"]')
                    .attr('disabled', 'disabled');
            },
            success: function() {
                $("#success")
                    .css('display', 'block')
                    .css('opacity', '1');;
            },
            error: function() {
                $("#fail").css('display', 'block')
                    .css('display', 'block')
                    .css('opacity', '1');
            },
            complete: function(data) {
                form
                    .find('button[type="submit"]')
                    .prop('disabled', false);
            }
        });
        e.preventDefault();
    });

    $("#formOrder").submit(function(e) {
        var form = $(this);
        var formData = form.serialize();
        $.ajax({
            type: "POST",
            url: "/",
            data: formData,
            beforeSend: function(data) {
                form
                    .find('button[type="submit"]')
                    .attr('disabled', 'disabled');
            },
            success: function() {
                $("#orderModal").fadeOut();
                $("#success")
                    .css('display', 'block')
                    .css('opacity', '1');;
            },
            error: function(e) {
                $("#orderModal").fadeOut();
                $("#fail")
                    .css('display', 'block')
                    .css('opacity', '1');
            },
            complete: function(data) {
                form
                    .find('button[type="submit"]')
                    .prop('disabled', false);
            }
        });
        e.preventDefault();
    });


    $('#reload').click(
        function(e) {
            window.location.reload();
        });


});