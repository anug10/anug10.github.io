        var on = addEventListener
            , $ = function (q) {
                return document.querySelector(q)
            }
            , $$ = function (q) {
                return document.querySelectorAll(q)
            }
            , $body = document.body
            , $inner = $('.inner');
        on('load', function () {
            setTimeout(function () {
                $body.className = $body.className.replace(/\bis-loading\b/, 'is-playing');
                setTimeout(function () {
                    $body.className = $body.className.replace(/\bis-playing\b/, 'is-ready');
                }, 2000);
            }, 100);
        });
        var style, sheet, rule;
        style = document.createElement('style');
        style.appendChild(document.createTextNode(''));
        document.head.appendChild(style);
        sheet = style.sheet;
        if (navigator.userAgent.match(/Android ([0-9\.]+)/)) {
            (function () {
                sheet.insertRule('body::after { }', 0);
                rule = sheet.cssRules[0];
                var f = function () {
                    rule.style.cssText = 'height: ' + (Math.max(screen.width, screen.height)) + 'px';
                };
                on('load', f);
                on('orientationchange', f);
                on('touchmove', f);
            })();
        }
        else if (navigator.userAgent.match(/([0-9_]+) like Mac OS X/) || navigator.userAgent.match(/CPU like Mac OS X/)) {
            (function () {
                sheet.insertRule('body::after { }', 0);
                rule = sheet.cssRules[0];
                rule.style.cssText = '-webkit-transform: scale(1.0)';
            })();
        }
        else if (navigator.userAgent.match(/(MSIE|rv:11\.0)/)) {
            (function () {
                var t, f;
                f = function () {
                    var x = $('#wrapper');
                    if (x.scrollHeight > innerHeight) x.style.height = 'auto';
                    else x.style.height = '100vh';
                };
                (f)();
                on('resize', function () {
                    clearTimeout(t);
                    t = setTimeout(f, 250);
                });
            })();
        }

        function lightboxGallery(id) {
            var _this = this;
            this.id = id;
            this.$wrapper = $('#' + this.id);
            this.$modal = null;
            this.$links = $$('#' + this.id + ' .thumbnail');
            this.locked = false;
            this.init();
        };
        lightboxGallery.prototype.init = function () {
            this.initModal();
            this.initLinks();
        };
        lightboxGallery.prototype.initModal = function () {
            var _this = this
                , $modal, $modalImage;
            $modal = document.createElement('div');
            $modal.id = this.id + '-modal';
            $modal.tabIndex = -1;
            $modal.className = 'gallery-modal';
            $modal.innerHTML = '<div class="inner"><img src="" /></div>';
            $body.appendChild($modal);
            $modalImage = $('#' + this.id + '-modal img');
            $modalImage.addEventListener('load', function () {
                window.setTimeout(function () {
                    if (!$modal.classList.contains('visible')) return;
                    $modal.classList.add('loaded');
                }, 275);
            });
            $modal.show = function (href) {
                if (_this.locked) return;
                _this.locked = true;
                $modalImage.src = href;
                $modal.classList.add('visible');
                $modal.focus();
                window.setTimeout(function () {
                    _this.locked = false;
                }, 600);
            };
            $modal.hide = function () {
                if (_this.locked) return;
                if (!$modal.classList.contains('visible')) return;
                _this.locked = true;
                $modal.classList.remove('visible');
                $modal.classList.remove('loaded');
                window.setTimeout(function () {
                    $modalImage.src = '';
                    _this.locked = false;
                    $body.focus();
                }, 600);
            };
            $modal.addEventListener('click', function (event) {
                $modal.hide();
            });
            $modal.addEventListener('keydown', function (event) {
                if (event.keyCode == 27) $modal.hide();
            });
            this.$modal = $modal;
        };
        lightboxGallery.prototype.initLinks = function () {
            var _this = this;
            for (i = 0; i < this.$links.length; i++) this.$links[i].addEventListener('click', function (event) {
                event.stopPropagation();
                event.preventDefault();
                _this.show(this.href);
            });
        };
        lightboxGallery.prototype.show = function (href) {
            this.$modal.show(href);
        };
        new lightboxGallery('gallery01');
  