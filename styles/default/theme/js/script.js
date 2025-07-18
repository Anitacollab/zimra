"use strict";
var userAgent = navigator.userAgent.toLowerCase(),
    initialDate = new Date(),
    $document = $(document),
    $window = $(window),
    $html = $("html"),
    isDesktop = $html.hasClass("desktop"),
    isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1]) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTouch = "ontouchstart" in window,
    $top = $(".top"),
    plugins = {
        pointerEvents: isIE < 11 ? "js/pointer-events.min.js" : false,
        smoothScroll: $html.hasClass("use--smoothscroll") ? "js/smoothscroll.min.js" : false,
        bootstrapTooltip: $("[data-toggle='tooltip']"),
        bootstrapTabs: $(".tabs"),
        rdAudioPlayer: $(".rd-audio"),
        rdVideoPlayer: $(".rd-video-player"),
        owl: $(".owl-carousel"),
        responsiveTabs: $(".responsive-tabs"),
        rdGoogleMaps: $(".rd-google-map"),
        rdNavbar: $(".rd-navbar"),
        rdVideoBG: $(".rd-video"),
        rdRange: $('.rd-range'),
        textRotator: $(".text-rotator"),
        swiper: $(".swiper-slider"),
        counter: $(".counter"),
        flickrfeed: $(".flickr"),
        twitterfeed: $(".twitter"),
        progressBar: $(".progress-bar-js"),
        isotope: $(".isotope"),
        countDown: $(".countdown"),
        calendar: $(".rd-calendar"),
        materialTabs: $('.rd-material-tabs'),
        filePicker: $('.rd-file-picker'),
        fileDrop: $('.rd-file-drop'),
        popover: $('[data-toggle="popover"]'),
        productThumb: $(".product-thumbnails"),
        dateCountdown: $('.DateCountdown'),
        statefulButton: $('.btn-stateful'),
        slick: $('.slick-slider'),
        scroller: $(".scroll-wrap"),
        socialite: $(".socialite"),
        viewAnimate: $('.view-animate'),
        selectFilter: $("select"),
        stacktable: $("[data-responsive=true]"),
        bootstrapDateTimePicker: $("[date-time-picker]"),
        customWaypoints: $('[data-custom-scroll-to]'),
        photoSwipeGallery: $("[data-photo-swipe-item]"),
        circleProgress: $(".progress-bar-circle"),
        stepper: $("input[type='number']"),
        customToggle: $("[data-custom-toggle]"),
        rdMailForm: $(".rd-mailform"),
        rdInputLabel: $(".form-label"),
        regula: $("[data-constraints]"),
        radio: $("input[type='radio']"),
        checkbox: $("input[type='checkbox']"),
        captcha: $('.recaptcha'),
        mailchimp: $('.mailchimp-mailform'),
        search: $(".rd-search"),
        searchResults: $('.rd-search-results'),
        imgZoom: $('[mag-thumb]')
    };
$document.ready(function() {
    var isNoviBuilder = window.xMode;

    function getSwiperHeight(object, attr) {
        var val = object.attr("data-" + attr),
            dim;
        if (!val) {
            return undefined;
        }
        dim = val.match(/(px)|(%)|(vh)$/i);
        if (dim.length) {
            switch (dim[0]) {
                case "px":
                    return parseFloat(val);
                case "vh":
                    return $(window).height() * (parseFloat(val) / 100);
                case "%":
                    return object.width() * (parseFloat(val) / 100);
            }
        } else {
            return undefined;
        }
    }

    function toggleSwiperInnerVideos(swiper) {
        var prevSlide = $(swiper.slides[swiper.previousIndex]),
            nextSlide = $(swiper.slides[swiper.activeIndex]),
            videos;
        prevSlide.find("video").each(function() {
            this.pause();
        });
        videos = nextSlide.find("video");
        if (videos.length) {
            videos.get(0).play();
        }
    }

    function toggleSwiperCaptionAnimation(swiper) {
        var prevSlide = $(swiper.container),
            nextSlide = $(swiper.slides[swiper.activeIndex]);
        prevSlide.find("[data-caption-animate]").each(function() {
            var $this = $(this);
            $this.removeClass("animated").removeClass($this.attr("data-caption-animate")).addClass("not-animated");
        });
        nextSlide.find("[data-caption-animate]").each(function() {
            var $this = $(this),
                delay = $this.attr("data-caption-delay");
            setTimeout(function() {
                $this.removeClass("not-animated").addClass($this.attr("data-caption-animate")).addClass("animated");
            }, delay ? parseInt(delay) : 0);
        });
    }

    function isScrolledIntoView(elem) {
        var $window = $(window);
        return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
    }

    function lazyInit(element, func) {
        var $win = jQuery(window);
        $win.on('load scroll', function() {
            if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
                func.call();
                element.addClass('lazy-loaded');
            }
        });
    }

    function liveSearch(options) {
        $('#' + options.live).removeClass('cleared').html();
        options.current++;
        options.spin.addClass('loading');
        $.get(handler, {
            s: decodeURI(options.term),
            liveSearch: options.live,
            dataType: "html",
            liveCount: options.liveCount,
            filter: options.filter,
            template: options.template
        }, function(data) {
            options.processed++;
            var live = $('#' + options.live);
            if (options.processed == options.current && !live.hasClass('cleared')) {
                live.find('> #search-results').removeClass('active');
                live.html(data);
                setTimeout(function() {
                    live.find('> #search-results').addClass('active');
                }, 50);
            }
            options.spin.parents('.rd-search').find('.input-group-addon').removeClass('loading');
        })
    }

    function attachFormValidator(elements) {
        for (var i = 0; i < elements.length; i++) {
            var o = $(elements[i]),
                v;
            o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
            v = o.parent().find(".form-validation");
            if (v.is(":last-child")) {
                o.addClass("form-control-last-child");
            }
        }
        elements.on('input change propertychange blur', function(e) {
            var $this = $(this),
                results;
            if (e.type !== "blur") {
                if (!$this.parent().hasClass("has-error")) {
                    return;
                }
            }
            if ($this.parents('.rd-mailform').hasClass('success')) {
                return;
            }
            if ((results = $this.regula('validate')).length) {
                for (i = 0; i < results.length; i++) {
                    $this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error")
                }
            } else {
                $this.siblings(".form-validation").text("").parent().removeClass("has-error")
            }
        }).regula('bind');
        var regularConstraintsMessages = [{
            type: regula.Constraint.Required,
            newMessage: "The text field is required."
        }, {
            type: regula.Constraint.Email,
            newMessage: "The email is not a valid email."
        }, {
            type: regula.Constraint.Numeric,
            newMessage: "Only numbers are required"
        }, {
            type: regula.Constraint.Selected,
            newMessage: "Please choose an option."
        }];
        for (var i = 0; i < regularConstraintsMessages.length; i++) {
            var regularConstraint = regularConstraintsMessages[i];
            regula.override({
                constraintType: regularConstraint.type,
                defaultMessage: regularConstraint.newMessage
            });
        }
    }

    function isValidated(elements, captcha) {
        var results, errors = 0;
        if (elements.length) {
            for (j = 0; j < elements.length; j++) {
                var $input = $(elements[j]);
                if ((results = $input.regula('validate')).length) {
                    for (k = 0; k < results.length; k++) {
                        errors++;
                        $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
                    }
                } else {
                    $input.siblings(".form-validation").text("").parent().removeClass("has-error")
                }
            }
            if (captcha) {
                if (captcha.length) {
                    return validateReCaptcha(captcha) && errors === 0
                }
            }
            return errors === 0;
        }
        return true;
    }

    function validateReCaptcha(captcha) {
        var captchaToken = captcha.find('.g-recaptcha-response').val();
        if (captchaToken.length === 0) {
            captcha.siblings('.form-validation').html('Please, prove that you are not robot.').addClass('active');
            captcha.closest('.form-group').addClass('has-error');
            captcha.on('propertychange', function() {
                var $this = $(this),
                    captchaToken = $this.find('.g-recaptcha-response').val();
                if (captchaToken.length > 0) {
                    $this.closest('.form-group').removeClass('has-error');
                    $this.siblings('.form-validation').removeClass('active').html('');
                    $this.off('propertychange');
                }
            });
            return false;
        }
        return true;
    }
    window.onloadCaptchaCallback = function() {
        for (i = 0; i < plugins.captcha.length; i++) {
            var $capthcaItem = $(plugins.captcha[i]);
            grecaptcha.render($capthcaItem.attr('id'), {
                sitekey: $capthcaItem.attr('data-sitekey'),
                size: $capthcaItem.attr('data-size') ? $capthcaItem.attr('data-size') : 'normal',
                theme: $capthcaItem.attr('data-theme') ? $capthcaItem.attr('data-theme') : 'light',
                callback: function(e) {
                    $('.recaptcha').trigger('propertychange');
                }
            });
            $capthcaItem.after("<span class='form-validation'></span>");
        }
    };

    function initBootstrapTooltip(tooltipPlacement) {
        if (window.innerWidth < 599) {
            plugins.bootstrapTooltip.tooltip('destroy');
            plugins.bootstrapTooltip.tooltip({
                placement: 'bottom'
            });
        } else {
            plugins.bootstrapTooltip.tooltip('destroy');
            plugins.bootstrapTooltip.tooltipPlacement;
            plugins.bootstrapTooltip.tooltip();
        }
    }
    var o = $("#copyright-year");
    if (o.length) {
        o.text(initialDate.getFullYear());
    }
    if (isIE) {
        if (isIE < 10) {
            $html.addClass("lt-ie-10");
        }
        if (isIE < 11) {
            if (plugins.pointerEvents) {
                $.getScript(plugins.pointerEvents).done(function() {
                    $html.addClass("ie-10");
                    PointerEventsPolyfill.initialize({});
                });
            }
        }
        if (isIE === 11) {
            $("html").addClass("ie-11");
        }
        if (isIE === 12) {
            $("html").addClass("ie-edge");
        }
    }
    if (plugins.bootstrapTooltip.length) {
        var tooltipPlacement = plugins.bootstrapTooltip.attr('data-placement');
        initBootstrapTooltip(tooltipPlacement);
        $(window).on('resize orientationchange', function() {
            initBootstrapTooltip(tooltipPlacement);
        })
    }
    if (plugins.smoothScroll) {
        $.getScript(plugins.smoothScroll);
    }
    if (plugins.rdAudioPlayer.length > 0) {
        var i;
        for (i = 0; i < plugins.rdAudioPlayer.length; i++) {
            $(plugins.rdAudioPlayer[i]).RDAudio();
        }
    }
    if (plugins.textRotator.length) {
        var i;
        for (i = 0; i < plugins.textRotator.length; i++) {
            var textRotatorItem = plugins.textRotator[i];
            $(textRotatorItem).rotator();
        }
    }
    if (plugins.rdGoogleMaps.length) {
        var i;
        $.getScript("//maps.google.com/maps/api/js?key=AIzaSyAFeB0kVA6ouyJ_gEvFbMaefLy3cBCyRwo&sensor=false&libraries=geometry,places&v=3.7", function() {
            var head = document.getElementsByTagName('head')[0],
                insertBefore = head.insertBefore;
            head.insertBefore = function(newElement, referenceElement) {
                if (newElement.href && newElement.href.indexOf('//fonts.googleapis.com/css?family=Roboto') != -1 || newElement.innerHTML.indexOf('gm-style') != -1) {
                    return;
                }
                insertBefore.call(head, newElement, referenceElement);
            };
            for (i = 0; i < plugins.rdGoogleMaps.length; i++) {
                var $googleMapItem = $(plugins.rdGoogleMaps[i]);
                lazyInit($googleMapItem, $.proxy(function() {
                    var $this = $(this),
                        styles = $this.attr("data-styles");
                    $this.googleMap({
                        styles: styles ? JSON.parse(styles) : [],
                        onInit: function(map) {
                            var inputAddress = $('#rd-google-map-address');
                            if (inputAddress.length) {
                                var input = inputAddress;
                                var geocoder = new google.maps.Geocoder();
                                var marker = new google.maps.Marker({
                                    map: map,
                                    icon: "images/gmap_marker.png",
                                });
                                var autocomplete = new google.maps.places.Autocomplete(inputAddress[0]);
                                autocomplete.bindTo('bounds', map);
                                inputAddress.attr('placeholder', '');
                                inputAddress.on('change', function() {
                                    $("#rd-google-map-address-submit").trigger('click');
                                });
                                inputAddress.on('keydown', function(e) {
                                    if (e.keyCode == 13) {
                                        $("#rd-google-map-address-submit").trigger('click');
                                    }
                                });
                                $("#rd-google-map-address-submit").on('click', function(e) {
                                    e.preventDefault();
                                    var address = input.val();
                                    geocoder.geocode({
                                        'address': address
                                    }, function(results, status) {
                                        if (status == google.maps.GeocoderStatus.OK) {
                                            var latitude = results[0].geometry.location.lat();
                                            var longitude = results[0].geometry.location.lng();
                                            map.setCenter(new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude)));
                                            marker.setPosition(new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude)))
                                        }
                                    });
                                });
                            }
                        }
                    });
                }, $googleMapItem));
            }
        });
    }
    if (plugins.bootstrapDateTimePicker.length) {
        var i;
        for (i = 0; i < plugins.bootstrapDateTimePicker.length; i++) {
            var $dateTimePicker = $(plugins.bootstrapDateTimePicker[i]);
            var options = {};
            options['format'] = 'dddd DD MMMM YYYY - HH:mm';
            if ($dateTimePicker.attr("date-time-picker") == "date") {
                options['format'] = 'dddd DD MMMM YYYY';
                options['minDate'] = new Date();
            } else if ($dateTimePicker.attr("date-time-picker") == "time") {
                options['format'] = 'HH:mm';
            }
            options["time"] = ($dateTimePicker.attr("date-time-picker") != "date");
            options["date"] = ($dateTimePicker.attr("date-time-picker") != "time");
            options["shortTime"] = true;
            $dateTimePicker.bootstrapMaterialDatePicker(options);
        }
    }
    if (plugins.twitterfeed.length > 0) {
        var i;
        for (i = 0; i < plugins.twitterfeed.length; i++) {
            var twitterfeedItem = plugins.twitterfeed[i];
            $(twitterfeedItem).RDTwitter({
                hideReplies: false,
                localTemplate: {
                    avatar: "images/features/rd-twitter-post-avatar-48x48.jpg"
                },
                callback: function() {
                    $window.trigger("resize");
                }
            });
        }
    }
    if (plugins.materialTabs.length) {
        var i;
        for (i = 0; i < plugins.materialTabs.length; i++) {
            var materialTabsItem = plugins.materialTabs[i];
            $(materialTabsItem).RDMaterialTabs({});
        }
    }
//    if (plugins.captcha.length) {
//        $.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
//    }
//    if (plugins.radio.length) {
//        var i;
//        for (i = 0; i < plugins.radio.length; i++) {
//            $(plugins.radio[i]).addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
//        }
//    }
//    if (plugins.checkbox.length) {
//        var i;
//        for (i = 0; i < plugins.checkbox.length; i++) {
//            $(plugins.checkbox[i]).addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
//        }
//    }
//    if (plugins.rdInputLabel.length) {
//        plugins.rdInputLabel.RDInputLabel();
//    }
//    if (plugins.regula.length) {
//        attachFormValidator(plugins.regula);
//    }
//    if (plugins.rdMailForm.length) {
//        var i, j, k, msg = {
//            'MF000': 'Successfully sent!',
//            'MF001': 'Recipients are not set!',
//            'MF002': 'Form will not work locally!',
//            'MF003': 'Please, define email field in your form!',
//            'MF004': 'Please, define type of your form!',
//            'MF254': 'Something went wrong with PHPMailer!',
//            'MF255': 'Aw, snap! Something went wrong.'
//        };
//        for (i = 0; i < plugins.rdMailForm.length; i++) {
//            var $form = $(plugins.rdMailForm[i]),
//                formHasCaptcha = false;
//            $form.attr('novalidate', 'novalidate').ajaxForm({
//                data: {
//                    "form-type": $form.attr("data-form-type") || "contact",
//                    "counter": i
//                },
//                beforeSubmit: function(arr, $form, options) {
//                    if (isNoviBuilder)
//                        return;
//                    var form = $(plugins.rdMailForm[this.extraData.counter]),
//                        inputs = form.find("[data-constraints]"),
//                        output = $("#" + form.attr("data-form-output")),
//                        captcha = form.find('.recaptcha'),
//                        captchaFlag = true;
//                    output.removeClass("active error success");
//                    if (isValidated(inputs, captcha)) {
//                        if (captcha.length) {
//                            var captchaToken = captcha.find('.g-recaptcha-response').val(),
//                                captchaMsg = {
//                                    'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
//                                    'CPT002': 'Something wrong with google reCaptcha'
//                                };
//                            formHasCaptcha = true;
//                            $.ajax({
//                                method: "POST",
//                                url: "bat/reCaptcha.php",
//                                data: {
//                                    'g-recaptcha-response': captchaToken
//                                },
//                                async: false
//                            }).done(function(responceCode) {
//                                if (responceCode !== 'CPT000') {
//                                    if (output.hasClass("snackbars")) {
//                                        output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')
//                                        setTimeout(function() {
//                                            output.removeClass("active");
//                                        }, 3500);
//                                        captchaFlag = false;
//                                    } else {
//                                        output.html(captchaMsg[responceCode]);
//                                    }
//                                    output.addClass("active");
//                                }
//                            });
//                        }
//                        if (!captchaFlag) {
//                            return false;
//                        }
//                        form.addClass('form-in-process');
//                        if (output.hasClass("snackbars")) {
//                            output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
//                            output.addClass("active");
//                        }
//                    } else {
//                        return false;
//                    }
//                },
//                error: function(result) {
//                    if (isNoviBuilder)
//                        return;
//                    var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
//                        form = $(plugins.rdMailForm[this.extraData.counter]);
//                    output.text(msg[result]);
//                    form.removeClass('form-in-process');
//                    if (formHasCaptcha) {
//                        grecaptcha.reset();
//                    }
//                },
//                success: function(result) {
//                    if (isNoviBuilder)
//                        return;
//                    var form = $(plugins.rdMailForm[this.extraData.counter]),
//                        output = $("#" + form.attr("data-form-output")),
//                        select = form.find('select');
//                    form.addClass('success').removeClass('form-in-process');
//                    if (formHasCaptcha) {
//                        grecaptcha.reset();
//                    }
//                    result = result.length === 5 ? result : 'MF255';
//                    output.text(msg[result]);
//                    if (result === "MF000") {
//                        if (output.hasClass("snackbars")) {
//                            output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
//                        } else {
//                            output.addClass("active success");
//                        }
//                    } else {
//                        if (output.hasClass("snackbars")) {
//                            output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
//                        } else {
//                            output.addClass("active error");
//                        }
//                    }
//                    form.clearForm();
//                    if (select.length) {
//                        select.select2("val", "");
//                    }
//                    form.find('input, textarea').trigger('blur');
//                    setTimeout(function() {
//                        output.removeClass("active error success");
//                        form.removeClass('success');
//                    }, 3500);
//                }
//            });
//        }
//    }
    if (plugins.flickrfeed.length > 0) {
        var i;
        for (i = 0; i < plugins.flickrfeed.length; i++) {
            var flickrfeedItem = $(plugins.flickrfeed[i]);
            flickrfeedItem.RDFlickr({
                callback: function() {
                    var items = flickrfeedItem.find("[data-photo-swipe-item]");
                    if (items.length) {
                        for (var j = 0; j < items.length; j++) {
                            var image = new Image();
                            image.setAttribute('data-index', j);
                            image.onload = function() {
                                items[this.getAttribute('data-index')].setAttribute('data-size', this.naturalWidth + 'x' + this.naturalHeight);
                            };
                            image.src = items[j].getAttribute('href');
                        }
                    }
                }
            });
        }
    }
    if (plugins.productThumb.length) {
        var i;
        for (i = 0; i < plugins.productThumb.length; i++) {
            var thumbnails = $(plugins.productThumb[i]);
            thumbnails.find("li").on('click', function() {
                var item = $(this);
                item.parent().find('.active').removeClass('active');
                var image = item.parents(".product").find(".product-image-area");
                image.removeClass('animateImageIn');
                image.addClass('animateImageOut');
                item.addClass('active');
                setTimeout(function() {
                    var src = item.find("img").attr("src");
                    if (item.attr('data-large-image')) {
                        src = item.attr('data-large-image');
                    }
                    image.attr("src", src);
                    image.removeClass('animateImageOut');
                    image.addClass('animateImageIn');
                }, 300);
            })
        }
    }
    if (plugins.selectFilter.length) {
        var i;
        for (i = 0; i < plugins.selectFilter.length; i++) {
            var select = $(plugins.selectFilter[i]);
            select.select2({
                theme: "bootstrap"
            }).next().addClass(select.attr("class").match(/(input-sm)|(input-lg)|($)/i).toString().replace(new RegExp(",", 'g'), " "));
        }
    }
    if (plugins.stepper.length) {
        plugins.stepper.stepper({
            labels: {
                up: "",
                down: ""
            }
        });
    }
    if (plugins.filePicker.length || plugins.fileDrop.length) {
        var i;
        for (i = 0; i < plugins.filePicker.length; i++) {
            var filePickerItem = plugins.filePicker[i];
            $(filePickerItem).RDFilepicker({
                metaFieldClass: "rd-file-picker-meta"
            });
        }
        for (i = 0; i < plugins.fileDrop.length; i++) {
            var fileDropItem = plugins.fileDrop[i];
            $(fileDropItem).RDFilepicker({
                metaFieldClass: "rd-file-drop-meta",
                buttonClass: "rd-file-drop-btn",
                dropZoneClass: "rd-file-drop"
            });
        }
    }
    if (plugins.popover.length) {
        if (window.innerWidth < 767) {
            plugins.popover.attr('data-placement', 'bottom');
            plugins.popover.popover();
        } else {
            plugins.popover.popover();
        }
    }
    if (plugins.countDown.length) {
        var i;
        for (i = 0; i < plugins.countDown.length; i++) {
            var countDownItem = plugins.countDown[i],
                d = new Date(),
                type = countDownItem.getAttribute('data-type'),
                time = countDownItem.getAttribute('data-time'),
                format = countDownItem.getAttribute('data-format'),
                settings = [];
            d.setTime(Date.parse(time)).toLocaleString();
            settings[type] = d;
            settings['format'] = format;
            $(countDownItem).countdown(settings);
        }
    }
    if (plugins.dateCountdown.length) {
        var i;
        for (i = 0; i < plugins.dateCountdown.length; i++) {
            var dateCountdownItem = $(plugins.dateCountdown[i]),
                time = {
                    "Days": {
                        "text": "Days",
                        "show": true,
                        color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                    },
                    "Hours": {
                        "text": "Hours",
                        "show": true,
                        color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                    },
                    "Minutes": {
                        "text": "Minutes",
                        "show": true,
                        color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                    },
                    "Seconds": {
                        "text": "Seconds",
                        "show": true,
                        color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                    }
                };
            dateCountdownItem.TimeCircles({
                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "rgba(247, 247, 247, 1)",
                animation: "smooth",
                bg_width: dateCountdownItem.attr("data-bg-width") ? dateCountdownItem.attr("data-bg-width") : 0.9,
                circle_bg_color: dateCountdownItem.attr("data-bg") ? dateCountdownItem.attr("data-bg") : "rgba(0, 0, 0, 1)",
                fg_width: dateCountdownItem.attr("data-width") ? dateCountdownItem.attr("data-width") : 0.05
            });
            $(window).on('load resize orientationchange', function() {
                if (window.innerWidth < 479) {
                    dateCountdownItem.TimeCircles({
                        time: {
                            "Days": {
                                "text": "Days",
                                "show": true,
                                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                            },
                            "Hours": {
                                "text": "Hours",
                                "show": true,
                                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                            },
                            "Minutes": {
                                "text": "Minutes",
                                "show": true,
                                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                            },
                            Seconds: {
                                show: false,
                                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                            }
                        }
                    }).rebuild();
                } else if (window.innerWidth < 767) {
                    dateCountdownItem.TimeCircles({
                        time: {
                            "Days": {
                                "text": "Days",
                                "show": true,
                                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                            },
                            "Hours": {
                                "text": "Hours",
                                "show": true,
                                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                            },
                            "Minutes": {
                                "text": "Minutes",
                                "show": true,
                                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                            },
                            Seconds: {
                                show: false,
                                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                            }
                        }
                    }).rebuild();
                } else {
                    dateCountdownItem.TimeCircles({
                        time: time
                    }).rebuild();
                }
            });
        }
    }
    if (plugins.statefulButton.length) {
        $(plugins.statefulButton).on('click', function() {
            var statefulButtonLoading = $(this).button('loading');
            setTimeout(function() {
                statefulButtonLoading.button('reset')
            }, 2000);
        })
    }
    if (plugins.calendar.length) {
        var i;
        for (i = 0; i < plugins.calendar.length; i++) {
            var calendarItem = $(plugins.calendar[i]);
            calendarItem.rdCalendar({
                days: calendarItem.attr("data-days") ? calendarItem.attr("data-days").split(/\s?,\s?/i) : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                month: calendarItem.attr("data-months") ? calendarItem.attr("data-months").split(/\s?,\s?/i) : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            });
        }
    }
    if (plugins.circleProgress.length) {
        var i;
        for (i = 0; i < plugins.circleProgress.length; i++) {
            var circleProgressItem = $(plugins.circleProgress[i]);
            $document.on("scroll", function() {
                if (!circleProgressItem.hasClass('animated')) {
                    var arrayGradients = circleProgressItem.attr('data-gradient').split(",");
                    circleProgressItem.circleProgress({
                        value: circleProgressItem.attr('data-value'),
                        size: circleProgressItem.attr('data-size') ? circleProgressItem.attr('data-size') : 175,
                        fill: {
                            gradient: arrayGradients,
                            gradientAngle: Math.PI / 4
                        },
                        startAngle: -Math.PI / 4 * 2,
                        emptyFill: $(this).attr('data-empty-fill') ? $(this).attr('data-empty-fill') : "rgb(245,245,245)"
                    }).on('circle-animation-progress', function(event, progress, stepValue) {
                        $(this).find('span').text(String(stepValue.toFixed(2)).replace('0.', '').replace('1.', '1'));
                    });
                    circleProgressItem.addClass('animated');
                }
            }).trigger("scroll");
        }
    }
    if (plugins.progressBar.length) {
        var i, bar, type;
        for (i = 0; i < plugins.progressBar.length; i++) {
            var progressItem = plugins.progressBar[i];
            bar = null;
            if (progressItem.className.indexOf("progress-bar-horizontal") > -1) {
                type = 'Line';
            }
            if (progressItem.className.indexOf("progress-bar-radial") > -1) {
                type = 'Circle';
            }
            if (progressItem.getAttribute("data-stroke") && progressItem.getAttribute("data-value") && type) {
                bar = new ProgressBar[type](progressItem, {
                    strokeWidth: Math.round(parseFloat(progressItem.getAttribute("data-stroke")) / progressItem.offsetWidth * 100),
                    trailWidth: progressItem.getAttribute("data-trail") ? Math.round(parseFloat(progressItem.getAttribute("data-trail")) / progressItem.offsetWidth * 100) : 0,
                    text: {
                        value: progressItem.getAttribute("data-counter") === "true" ? '0' : null,
                        className: 'progress-bar__body',
                        style: null
                    }
                });
                bar.svg.setAttribute('preserveAspectRatio', "none meet");
                if (type === 'Line') {
                    bar.svg.setAttributeNS(null, "height", progressItem.getAttribute("data-stroke"));
                }
                bar.path.removeAttribute("stroke");
                bar.path.className.baseVal = "progress-bar__stroke";
                if (bar.trail) {
                    bar.trail.removeAttribute("stroke");
                    bar.trail.className.baseVal = "progress-bar__trail";
                }
                if (progressItem.getAttribute("data-easing") && !isIE) {
                    $(document).on("scroll", {
                        "barItem": bar
                    }, $.proxy(function(event) {
                        var bar = event.data.barItem;
                        var $this = $(this);
                        if (isScrolledIntoView($this) && this.className.indexOf("progress-bar--animated") === -1) {
                            this.className += " progress-bar--animated";
                            bar.animate(parseInt($this.attr("data-value")) / 100.0, {
                                easing: $this.attr("data-easing"),
                                duration: $this.attr("data-duration") ? parseInt($this.attr("data-duration")) : 800,
                                step: function(state, b) {
                                    if (b._container.className.indexOf("progress-bar-horizontal") > -1 || b._container.className.indexOf("progress-bar-vertical") > -1) {
                                        b.text.style.width = Math.abs(b.value() * 100).toFixed(0) + "%"
                                    }
                                    b.setText(Math.abs(b.value() * 100).toFixed(0));
                                }
                            });
                        }
                    }, progressItem)).trigger("scroll");
                } else {
                    bar.set(parseInt($(progressItem).attr("data-value")) / 100.0);
                    bar.setText($(progressItem).attr("data-value"));
                    if (type === 'Line') {
                        bar.text.style.width = parseInt($(progressItem).attr("data-value")) + "%";
                    }
                }
            } else {
                console.error(progressItem.className + ": progress bar type is not defined");
            }
        }
    }
    if (isDesktop) {
        $().UItoTop({
            easingType: 'easeOutQuart',
            containerClass: 'ui-to-top fa fa-angle-up'
        });
    }
    if (plugins.rdNavbar.length) {
        for (i = 0; i < plugins.rdNavbar.length; i++) {
            var $currentNavbar = $(plugins.rdNavbar[i]);
            $currentNavbar.RDNavbar({
                stickUpClone: ($currentNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? $currentNavbar.attr("data-stick-up-clone") === 'true' : false,
                responsive: {
                    0: {
                        stickUp: (!isNoviBuilder) ? $currentNavbar.attr("data-stick-up") === 'true' : false
                    },
                    768: {
                        stickUp: (!isNoviBuilder) ? $currentNavbar.attr("data-sm-stick-up") === 'true' : false
                    },
                    992: {
                        stickUp: (!isNoviBuilder) ? $currentNavbar.attr("data-md-stick-up") === 'true' : false
                    },
                    1200: {
                        stickUp: (!isNoviBuilder) ? $currentNavbar.attr("data-lg-stick-up") === 'true' : false
                    }
                },
                callbacks: {
                    onStuck: function() {
                        var navbarSearch = this.$element.find('.rd-search input');
                        if (navbarSearch) {
                            navbarSearch.val('').trigger('propertychange');
                        }
                    },
                    onUnstuck: function() {
                        if (this.$clone === null)
                            return;
                        var navbarSearch = this.$clone.find('.rd-search input');
                        if (navbarSearch) {
                            navbarSearch.val('').trigger('propertychange');
                            navbarSearch.blur();
                        }
                    },
                    onDropdownOver: function() {
                        return !isNoviBuilder;
                    }
                }
            });
            if (plugins.rdNavbar.attr("data-body-class")) {
                document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
            }
        }
    }
    if (plugins.viewAnimate.length) {
        var i;
        for (i = 0; i < plugins.viewAnimate.length; i++) {
            var $view = $(plugins.viewAnimate[i]).not('.active');
            $document.on("scroll", $.proxy(function() {
                if (isScrolledIntoView(this)) {
                    this.addClass("active");
                }
            }, $view)).trigger("scroll");
        }
    }
    if (plugins.swiper.length) {
        var i;
        for (i = 0; i < plugins.swiper.length; i++) {
            var s = $(plugins.swiper[i]);
            var pag = s.find(".swiper-pagination"),
                next = s.find(".swiper-button-next"),
                prev = s.find(".swiper-button-prev"),
                bar = s.find(".swiper-scrollbar"),
                swiperSlide = s.find(".swiper-slide");
            for (j = 0; j < swiperSlide.length; j++) {
                var $this = $(swiperSlide[j]),
                    url;
                if (url = $this.attr("data-slide-bg")) {
                    $this.css({
                        "background-image": "url(" + url + ")",
                        "background-size": "cover"
                    })
                }
            }
            swiperSlide.end().find("[data-caption-animate]").addClass("not-animated").end().swiper({
                autoplay: s.attr('data-autoplay') ? s.attr('data-autoplay') === "false" ? undefined : s.attr('data-autoplay') : 5000,
                direction: s.attr('data-direction') ? s.attr('data-direction') : "horizontal",
                effect: s.attr('data-slide-effect') ? s.attr('data-slide-effect') : "slide",
                speed: s.attr('data-slide-speed') ? s.attr('data-slide-speed') : 600,
                keyboardControl: s.attr('data-keyboard') === "true",
                mousewheelControl: s.attr('data-mousewheel') === "true",
                mousewheelReleaseOnEdges: s.attr('data-mousewheel-release') === "true",
                nextButton: next.length ? next.get(0) : null,
                prevButton: prev.length ? prev.get(0) : null,
                pagination: pag.length ? pag.get(0) : null,
                paginationClickable: pag.length ? pag.attr("data-clickable") !== "false" : false,
                paginationBulletRender: pag.length ? pag.attr("data-index-bullet") === "true" ? function(index, className) {
                    return '<span class="' + className + '">' + (index + 1) + '</span>';
                } : null : null,
                scrollbar: bar.length ? bar.get(0) : null,
                scrollbarDraggable: bar.length ? bar.attr("data-draggable") !== "false" : true,
                scrollbarHide: bar.length ? bar.attr("data-draggable") === "false" : false,
                loop: s.attr('data-loop') !== "false",
                onTransitionStart: function(swiper) {
                    toggleSwiperInnerVideos(swiper);
                },
                onTransitionEnd: function(swiper) {
                    toggleSwiperCaptionAnimation(swiper);
                },
                onInit: function(swiper) {
                    toggleSwiperInnerVideos(swiper);
                    toggleSwiperCaptionAnimation(swiper);
                    $(window).on('resize', function() {
                        swiper.update(true);
                    })
                }
            });
            $(window).on("resize", function() {
                var mh = getSwiperHeight(s, "min-height"),
                    h = getSwiperHeight(s, "height");
                if (h) {
                    s.css("height", mh ? mh > h ? mh : h : h);
                }
            }).trigger("resize");
        }
    }
    if (plugins.rdVideoPlayer.length) {
        var i;
        for (i = 0; i < plugins.rdVideoPlayer.length; i++) {
            var videoItem = plugins.rdVideoPlayer[i],
                volumeWrap = $(".rd-video-volume-wrap");
            $(videoItem).RDVideoPlayer({});
            volumeWrap.on("mouseenter", function() {
                $(this).addClass("hover")
            });
            volumeWrap.on("mouseleave", function() {
                $(this).removeClass("hover")
            });
            if (isTouch) {
                volumeWrap.find(".rd-video-volume").on("click", function() {
                    $(this).toggleClass("hover")
                });
                $document.on("click", function(e) {
                    if (!$(e.target).is(volumeWrap) && $(e.target).parents(volumeWrap).length == 0) {
                        volumeWrap.find(".rd-video-volume").removeClass("hover")
                    }
                })
            }
        }
    }
    if (plugins.search.length || plugins.searchResults) {
        var handler = "bat/rd-search.php";
        var defaultTemplate = '<h5 class="search_title"><a target="_top" href="#{href}" class="search_link">#{title}</a></h5>' + '<p>...#{token}...</p>' + '<p class="match"><em>Terms matched: #{count} - URL: #{href}</em></p>';
        var defaultFilter = '*.html';
        if (plugins.search.length) {
            for (i = 0; i < plugins.search.length; i++) {
                var searchItem = $(plugins.search[i]),
                    options = {
                        element: searchItem,
                        filter: (searchItem.attr('data-search-filter')) ? searchItem.attr('data-search-filter') : defaultFilter,
                        template: (searchItem.attr('data-search-template')) ? searchItem.attr('data-search-template') : defaultTemplate,
                        live: (searchItem.attr('data-search-live')) ? searchItem.attr('data-search-live') : false,
                        liveCount: (searchItem.attr('data-search-live-count')) ? parseInt(searchItem.attr('data-search-live')) : 4,
                        current: 0,
                        processed: 0,
                        timer: {}
                    };
                if ($('.rd-navbar-search-toggle').length) {
                    var toggle = $('.rd-navbar-search-toggle');
                    toggle.on('click', function() {
                        if (!($(this).hasClass('active'))) {
                            searchItem.find('input').val('').trigger('propertychange');
                        }
                    });
                }
                if (options.live) {
                    var clearHandler = false;
                    searchItem.find('input').on("keyup input propertychange", $.proxy(function() {
                        this.term = this.element.find('input').val().trim();
                        this.spin = this.element.find('.input-group-addon');
                        clearTimeout(this.timer);
                        if (this.term.length > 2) {
                            this.timer = setTimeout(liveSearch(this), 200);
                            if (clearHandler == false) {
                                clearHandler = true;
                                $("body").on("click", function(e) {
                                    if ($(e.toElement).parents('.rd-search').length == 0) {
                                        $('#rd-search-results-live').addClass('cleared').html('');
                                    }
                                })
                            }
                        } else if (this.term.length == 0) {
                            $('#' + this.live).addClass('cleared').html('');
                        }
                    }, options, this));
                }
                searchItem.submit($.proxy(function() {
                    $('<input />').attr('type', 'hidden').attr('name', "filter").attr('value', this.filter).appendTo(this.element);
                    return true;
                }, options, this))
            }
        }
        if (plugins.searchResults.length) {
            var regExp = /\?.*s=([^&]+)\&filter=([^&]+)/g;
            var match = regExp.exec(location.search);
            if (match != null) {
                $.get(handler, {
                    s: decodeURI(match[1]),
                    dataType: "html",
                    filter: match[2],
                    template: defaultTemplate,
                    live: ''
                }, function(data) {
                    plugins.searchResults.html(data);
                })
            }
        }
    }
    if (plugins.slick.length) {
        var i;
        for (i = 0; i < plugins.slick.length; i++) {
            var $slickItem = $(plugins.slick[i]);
            $slickItem.slick({
                slidesToScroll: parseInt($slickItem.attr('data-slide-to-scroll')) || 1,
                asNavFor: $slickItem.attr('data-for') || false,
                dots: $slickItem.attr("data-dots") == "true",
                infinite: $slickItem.attr("data-loop") == "true",
                focusOnSelect: true,
                arrows: $slickItem.attr("data-arrows") == "true",
                swipe: $slickItem.attr("data-swipe") == "true",
                autoplay: $slickItem.attr("data-autoplay") == "true",
                vertical: $slickItem.attr("data-vertical") == "true",
                centerMode: $slickItem.attr("data-center-mode") == "true",
                centerPadding: $slickItem.attr("data-center-padding") ? $slickItem.attr("data-center-padding") : '0.50',
                mobileFirst: true,
                responsive: [{
                    breakpoint: 0,
                    settings: {
                        slidesToShow: parseInt($slickItem.attr('data-items')) || 1,
                    }
                }, {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: parseInt($slickItem.attr('data-xs-items')) || 1,
                    }
                }, {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: parseInt($slickItem.attr('data-sm-items')) || 1,
                    }
                }, {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: parseInt($slickItem.attr('data-md-items')) || 1,
                    }
                }, {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: parseInt($slickItem.attr('data-lg-items')) || 1,
                    }
                }]
            }).on('afterChange', function(event, slick, currentSlide, nextSlide) {
                var $this = $(this),
                    childCarousel = $this.attr('data-child');
                if (childCarousel) {
                    $(childCarousel + ' .slick-slide').removeClass('slick-current');
                    $(childCarousel + ' .slick-slide').eq(currentSlide).addClass('slick-current');
                }
            });
        }
    }
    if (plugins.counter.length) {
        var i;
        for (i = 0; i < plugins.counter.length; i++) {
            var $counterNotAnimated = $(plugins.counter[i]).not('.animated');
            $document.on("scroll", $.proxy(function() {
                var $this = this;
                if ((!$this.hasClass("animated")) && (isScrolledIntoView($this))) {
                    $this.countTo({
                        refreshInterval: 40,
                        speed: $this.attr("data-speed") || 1000
                    });
                    $this.addClass('animated');
                }
            }, $counterNotAnimated)).trigger("scroll");
        }
    }
    if (plugins.isotope.length) {
        var i, isogroup = [];
        for (i = 0; i < plugins.isotope.length; i++) {
            var isotopeItem = plugins.isotope[i],
                iso = new Isotope(isotopeItem, {
                    itemSelector: '.isotope-item',
                    layoutMode: isotopeItem.getAttribute('data-isotope-layout') ? isotopeItem.getAttribute('data-isotope-layout') : 'masonry',
                    filter: '*'
                });
            isogroup.push(iso);
        }
        $(window).on('load', function() {
            setTimeout(function() {
                var i;
                for (i = 0; i < isogroup.length; i++) {
                    isogroup[i].element.className += " isotope--loaded";
                    isogroup[i].layout();
                }
            }, 600);
        });
        var resizeTimout;
        $("[data-isotope-filter]").on("click", function(e) {
            e.preventDefault();
            var filter = $(this);
            clearTimeout(resizeTimout);
            filter.parents(".isotope-filters").find('.active').removeClass("active");
            filter.addClass("active");
            var iso = $('.isotope[data-isotope-group="' + this.getAttribute("data-isotope-group") + '"]');
            iso.isotope({
                itemSelector: '.isotope-item',
                layoutMode: iso.attr('data-isotope-layout') ? iso.attr('data-isotope-layout') : 'masonry',
                filter: this.getAttribute("data-isotope-filter") == '*' ? '*' : '[data-filter*="' + this.getAttribute("data-isotope-filter") + '"]'
            });
        }).eq(0).trigger("click")
    }
    if (plugins.responsiveTabs.length > 0) {
        var i;
        for (i = 0; i < plugins.responsiveTabs.length; i++) {
            var responsiveTabsItem = $(plugins.responsiveTabs[i]);
            responsiveTabsItem.easyResponsiveTabs({
                type: responsiveTabsItem.attr("data-type") === "accordion" ? "accordion" : "default"
            });
            if (responsiveTabsItem.find('.owl-carousel').length) {
                responsiveTabsItem.find('.resp-tab-item').on('click', $.proxy(function(event) {
                    var $this = $(this),
                        carouselObj = ($this.find('.resp-tab-content-active .owl-carousel').owlCarousel()).data('owlCarousel');
                    if (carouselObj && typeof carouselObj.onResize === "function") {
                        carouselObj.onResize();
                    }
                }, responsiveTabsItem));
            }
            if (responsiveTabsItem.find('.slick-slider').length) {
                responsiveTabsItem.find('.resp-tab-item').on('click', $.proxy(function(event) {
                    var $this = $(this);
                    $this.find('.resp-tab-content-active .slick-slider').slick('setPosition');
                }, responsiveTabsItem));
            }
            if (responsiveTabsItem.attr('data-external-buttons') == "true") {
                var list = responsiveTabsItem.find('.resp-tabs-list li'),
                    newList = '<ul class="resp-tabs-extertal-list">';
                for (var j = 0; j < list.length; j++) {
                    newList += '<li><span>' + $(list[j]).text() + '</span></li>';
                }
                newList += '</ul>';
                responsiveTabsItem.find('.resp-tabs-container').before('<div class="resp-tab-external-prev"></div>')
                responsiveTabsItem.find('.resp-tab-external-prev').html(newList);
                responsiveTabsItem.find('.resp-tabs-container').after('<div class="resp-tab-external-next"></div>');
                responsiveTabsItem.find('.resp-tab-external-next').html(newList);
                changeExternalButtons(responsiveTabsItem);
                responsiveTabsItem.find('.resp-tab-external-prev').on('click', $.proxy(function(event) {
                    var $this = $(this);
                    changeExternalButtons($this, 'prev');
                }, responsiveTabsItem));
                responsiveTabsItem.find('.resp-tab-external-next').on('click', $.proxy(function(event) {
                    var $this = $(this);
                    changeExternalButtons($this, 'next');
                }, responsiveTabsItem));
                responsiveTabsItem.find('.resp-tabs-list .resp-tab-item').on('click', $.proxy(function(event) {
                    var $this = $(this);
                    changeExternalButtons($this);
                }, responsiveTabsItem));
            }
        }
    }
    if (plugins.owl.length) {
        var i;
        for (i = 0; i < plugins.owl.length; i++) {
            var c = $(plugins.owl[i]),
                responsive = {};
            var aliaces = ["-", "-xs-", "-sm-", "-md-", "-lg-"],
                values = [0, 480, 768, 992, 1200],
                j, k;
            for (j = 0; j < values.length; j++) {
                responsive[values[j]] = {};
                for (k = j; k >= -1; k--) {
                    if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
                        responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"));
                    }
                    if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
                        responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"));
                    }
                    if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
                        responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"));
                    }
                }
            }
            c.owlCarousel({
                autoplay: c.attr("data-autoplay") === "true",
                loop: c.attr("data-loop") !== "false",
                items: 1,
                dotsContainer: c.attr("data-pagination-class") || false,
                navContainer: c.attr("data-navigation-class") || false,
                mouseDrag: c.attr("data-mouse-drag") !== "false",
                nav: c.attr("data-nav") === "true",
                dots: c.attr("data-dots") === "true",
                dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each")) : false,
                animateOut: c.attr("data-animation-out") || false,
                responsive: responsive,
                navText: []
            });
        }
    }
    if (isDesktop && $html.hasClass("wow-animation") && $(".wow").length) {
        new WOW().init();
    }
    if (plugins.bootstrapTabs.length) {
        var i;
        for (i = 0; i < plugins.bootstrapTabs.length; i++) {
            var bootstrapTabsItem = $(plugins.bootstrapTabs[i]);
            bootstrapTabsItem.on("click", "a", function(event) {
                event.preventDefault();
                $(this).tab('show');
            });
        }
    }
    if (plugins.scroller.length) {
        var i;
        for (i = 0; i < plugins.scroller.length; i++) {
            var scrollerItem = $(plugins.scroller[i]);
            scrollerItem.mCustomScrollbar({
                scrollInertia: 200,
                scrollButtons: {
                    enable: true
                }
            });
        }
    }
    if (plugins.socialite.length) {
        Socialite.load();
    }
    if (plugins.rdVideoBG.length) {
        var i;
        for (i = 0; i < plugins.rdVideoBG.length; i++) {
            var videoItem = $(plugins.rdVideoBG[i]);
            videoItem.RDVideo({});
        }
    }
    if (plugins.rdRange.length) {
        plugins.rdRange.RDRange({});
    }
    if (plugins.photoSwipeGallery.length) {
        $document.delegate("[data-photo-swipe-item]", "click", function(event) {
            event.preventDefault();
            var $el = $(this),
                $galleryItems = $el.parents("[data-photo-swipe-gallery]").find("a[data-photo-swipe-item]"),
                pswpElement = document.querySelectorAll('.pswp')[0],
                encounteredItems = {},
                pswpItems = [],
                options, pswpIndex = 0,
                pswp;
            if ($galleryItems.length == 0) {
                $galleryItems = $el;
            }
            $galleryItems.each(function() {
                var $item = $(this),
                    src = $item.attr('href'),
                    size = $item.attr('data-size').split('x'),
                    pswdItem;
                if ($item.is(':visible')) {
                    if (!encounteredItems[src]) {
                        pswdItem = {
                            src: src,
                            w: parseInt(size[0], 10),
                            h: parseInt(size[1], 10),
                            el: $item
                        };
                        encounteredItems[src] = {
                            item: pswdItem,
                            index: pswpIndex
                        };
                        pswpItems.push(pswdItem);
                        pswpIndex++;
                    }
                }
            });
            options = {
                index: encounteredItems[$el.attr('href')].index,
                getThumbBoundsFn: function(index) {
                    var $el = pswpItems[index].el,
                        offset = $el.offset();
                    return {
                        x: offset.left,
                        y: offset.top,
                        w: $el.width()
                    };
                }
            };
            pswp = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, pswpItems, options);
            pswp.init();
        });
    }
    if (plugins.stacktable.length) {
        var i;
        for (i = 0; i < plugins.stacktable.length; i++) {
            var stacktableItem = $(plugins.stacktable[i]);
            stacktableItem.stacktable();
        }
    }
    if (plugins.customToggle.length) {
        var i;
        for (i = 0; i < plugins.customToggle.length; i++) {
            var $this = $(plugins.customToggle[i]);
            $this.on('click', $.proxy(function(event) {
                event.preventDefault();
                var $ctx = $(this);
                $($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
            }, $this));
            if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
                $("body").on("click", $this, function(e) {
                    if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length == 0 && e.data.find($(e.target)).length == 0) {
                        $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
                    }
                })
            }
        }
    }
    if (plugins.imgZoom.length) {
        var i;
        for (i = 0; i < plugins.imgZoom.length; i++) {
            var $imgZoomItem = $(plugins.imgZoom[i]);
            $imgZoomItem.mag();
        }
    }
    if (plugins.customWaypoints.length) {
        var i;
        for (i = 0; i < plugins.customWaypoints.length; i++) {
            var $this = $(plugins.customWaypoints[i]);
            $this.on('click', function(e) {
                e.preventDefault();
                $("body, html").stop().animate({
                    scrollTop: $("#" + $(this).attr('data-custom-scroll-to')).offset().top
                }, 1000, function() {
                    $(window).trigger("resize");
                });
            });
        }
    }
//    flag:
//    if ($top.length) {
//        $(window).scroll(function() {
//            if ($('html').hasClass('desktop')) {
//                if ($('html').hasClass('ie-11') || $('html').hasClass('ie-edge')) {
//                    return;
//                }
//                $top.css("opacity", 1 - $(window).scrollTop() / 500);
//                $top.css("top", 1 + $(window).scrollTop() / 1.5);
//                $top.css("position", 'relative');
//            }
//        });
//    }
});
(function() {
    var uaMatch = '',
        prefix = '';
    if (navigator.userAgent.match(/Windows/)) {
        $('html').addClass('x-win');
    } else if (navigator.userAgent.match(/Mac OS X/)) {
        $('html').addClass('x-mac');
    } else if (navigator.userAgent.match(/X11/)) {
        $('html').addClass('x-x11');
    }
    if (navigator.userAgent.match(/Chrome/)) {
        uaMatch = ' Chrome/';
        prefix = 'x-chrome';
    } else if (navigator.userAgent.match(/Safari/)) {
        uaMatch = ' Version/';
        prefix = 'x-safari';
    } else if (navigator.userAgent.match(/Firefox/)) {
        uaMatch = ' Firefox/';
        prefix = 'x-firefox';
    } else if (navigator.userAgent.match(/MSIE/)) {
        uaMatch = ' MSIE ';
        prefix = 'x-msie';
    }
    if (prefix) {
        $('html').addClass(prefix);
        uaMatch = new RegExp(uaMatch + '(\\d+)\.(\\d+)');
        var uaMatch = navigator.userAgent.match(uaMatch);
        if (uaMatch && uaMatch[1]) {
            $('html').addClass(prefix + '-' + uaMatch[1]);
            $('html').addClass(prefix + '-' + uaMatch[1] + '-' + uaMatch[2]);
        }
    }
})();