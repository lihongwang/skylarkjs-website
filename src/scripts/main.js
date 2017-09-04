require.config({
    baseUrl: "./",
    waitSeconds: 60,
    packages: [{
        name: "skylark",
        location: "lib/skylark"
    }, {
        name: "ace",
        main: "ace",
        location: "https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.8"
    }],

    paths: {
        "skylark-all": "lib/skylark/skylark-all.min",
        "caret": "https://cdn.bootcss.com/Caret.js/0.3.1/jquery.caret",
        "atwho": "https://cdn.bootcss.com/at.js/1.5.4/js/jquery.atwho",
        "bootstrap": "https://cdn.bootcss.com/bootstrap/3.3.6/js/bootstrap",
        "handlebars": "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.10/handlebars.amd.min",
        "jotted": "https://cdn.jsdelivr.net/jotted/1.5.1/jotted.min",
        "jquery": "lib/skylark-jquery/skylark-jquery-all.min",
        "particles": "lib/particles",
        "tether": "https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min",
        "text": "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text"
    },
    shim: {
        "bootstrap": {
            deps: ["jquery"],
            exports: "$"　
        }
    }

});
require(["skylark-all"], function() {
    require([
        "skylark/noder",
        "skylark/scripter",
        "skylark/router",
        "skylark/spa",
        "scripts/config/config",
        "jquery"
    ], function(noder, scripter, router, spa, config, $) {
        window._goTop = function(time) {
            time = time || 200;
            $(document.body).animate({
                "scrollTop": 0
            }, time, function() {
                goTopShown = false;
            });
            $(".go-top-btn").css({
                opacity: 0
            }).hide();
        };
        window.addThrob = function(node, callback) {
            $(node).css("opacity", 0.5);
            return noder.throb(node, {
                callback: callback
            });
        };
        var goTop = function(selector) {
            var goTopShown = false;
            selector.css({
                opacity: 0
            }).on("click", function() {
                window._goTop();
            });

            $(window).scroll(function() {
                if (goTopShown && window.scrollY > 0) return;
                if (window.scrollY > 100) {
                    selector.css({
                        opacity: 1
                    }).show();
                    goTopShown = true;
                } else {
                    selector.css({
                        opacity: 0
                    }).hide();
                    goTopShown = false;
                }
            });
        };
        var main = $("#main-wrap")[0],
            throb = window.addThrob(main, function() {
                require(["bootstrap"], function() {
                    var app = spa(config);
                    return app.prepare().then(function() {
                        main.style.opacity = 1;
                        router.one("prepared", function(e) {
                            throb.remove();
                        });
                        return app.run();
                    });
                });
            });
        goTop($(".go-top-btn"));
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            $("#sk-navbar").delegate(".nav-item", "click", function(e) {
                $('#sk-navbar').collapse('hide');
            });
            $(".logo-nav").on("click", function() {
                $('#sk-navbar').collapse('hide');
            })
            $(".navbar").addClass("navbar-default");
        }
    });
});
