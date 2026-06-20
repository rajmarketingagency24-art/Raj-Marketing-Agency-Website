(function($) {
    'use strict';

    $(document).ready(function() {

        // Mobile menu toggle
        $('.menu-toggle').on('click', function() {
            $(this).toggleClass('active');
            $('#site-navigation').toggleClass('active');
            $('.mobile-menu-overlay').toggleClass('active');
        });

        $('.mobile-menu-overlay').on('click', function() {
            $(this).removeClass('active');
            $('.menu-toggle').removeClass('active');
            $('#site-navigation').removeClass('active');
        });

        // Header scroll effect
        var header = $('.site-header');
        var lastScroll = 0;

        $(window).on('scroll', function() {
            var scroll = $(this).scrollTop();

            if (scroll > 100) {
                header.addClass('header-scrolled');
            } else {
                header.removeClass('header-scrolled');
            }

            if (scroll > lastScroll && scroll > 300) {
                header.addClass('header-hidden');
            } else {
                header.removeClass('header-hidden');
            }

            lastScroll = scroll;
        });

        // Smooth scroll for anchor links
        $('a[href*="#"]:not([href="#"])').on('click', function() {
            if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top - 80
                    }, 800);
                    return false;
                }
            }
        });

        // Scroll animations with Intersection Observer
        var animateElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale, .stagger-item');

        if (animateElements.length > 0) {
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');

                        if (entry.target.classList.contains('stagger-item')) {
                            var siblings = $(entry.target).closest('.stagger-container').find('.stagger-item');
                            siblings.each(function(index) {
                                var self = this;
                                setTimeout(function() {
                                    $(self).addClass('visible');
                                }, index * 100);
                            });
                        }
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

            animateElements.forEach(function(el) {
                observer.observe(el);
            });
        }

        // Service card hover effect
        $('.service-card, .service-detail-item').on('mouseenter', function() {
            $(this).find('.service-card-icon, .icon-box').addClass('animate');
        }).on('mouseleave', function() {
            $(this).find('.service-card-icon, .icon-box').removeClass('animate');
        });

        // Counter animation
        function animateCounters() {
            $('.counter-number').each(function() {
                var $this = $(this);
                var target = parseInt($this.data('target'));
                var current = 0;
                var increment = Math.ceil(target / 60);
                var timer = setInterval(function() {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    $this.text(current.toLocaleString());
                }, 25);
            });
        }

        var counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        var counterSection = document.querySelector('.hero-stats');
        if (counterSection) {
            counterObserver.observe(counterSection);
        }

        // Mobile sub-menu toggle
        $('.menu-item-has-children > a').on('click', function(e) {
            if ($(window).width() <= 991) {
                e.preventDefault();
                $(this).parent().toggleClass('open');
            }
        });

        // Reset sub-menus on window resize
        $(window).on('resize', function() {
            if ($(window).width() > 991) {
                $('.menu-item-has-children').removeClass('open');
            }
        });

        // Form submission - loading state
        $('#contact-form').on('submit', function() {
            var $submitBtn = $(this).find('button[type="submit"]');
            $submitBtn.text('Sending...').prop('disabled', true);
        });

    });

})(jQuery);
