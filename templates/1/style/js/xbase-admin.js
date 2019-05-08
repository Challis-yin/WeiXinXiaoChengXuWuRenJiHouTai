/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
    throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
    'use strict';
    var version = $.fn.jquery.split(' ')[0].split('.')
    if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
        throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
    }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // ============================================================

    function transitionEnd() {
        var el = document.createElement('bootstrap')

        var transEndEventNames = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return { end: transEndEventNames[name] }
            }
        }

        return false // explicit for ie8 (  ._.)
    }

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false
        var $el = this
        $(this).one('bsTransitionEnd', function () { called = true })
        var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
        setTimeout(callback, duration)
        return this
    }

    $(function () {
        $.support.transition = transitionEnd()

        if (!$.support.transition) return

        $.event.special.bsTransitionEnd = {
            bindType: $.support.transition.end,
            delegateType: $.support.transition.end,
            handle: function (e) {
                if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
            }
        }
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.7
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // ALERT CLASS DEFINITION
    // ======================

    var dismiss = '[data-dismiss="alert"]'
    var Alert = function (el) {
        $(el).on('click', dismiss, this.close)
    }

    Alert.VERSION = '3.3.7'

    Alert.TRANSITION_DURATION = 150

    Alert.prototype.close = function (e) {
        var $this = $(this)
        var selector = $this.attr('data-target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        var $parent = $(selector === '#' ? [] : selector)

        if (e) e.preventDefault()

        if (!$parent.length) {
            $parent = $this.closest('.alert')
        }

        $parent.trigger(e = $.Event('close.bs.alert'))

        if (e.isDefaultPrevented()) return

        $parent.removeClass('in')

        function removeElement() {
            // detach from parent, fire event then clean up data
            $parent.detach().trigger('closed.bs.alert').remove()
        }

        $.support.transition && $parent.hasClass('fade') ?
            $parent
                .one('bsTransitionEnd', removeElement)
                .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
            removeElement()
    }


    // ALERT PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.alert')

            if (!data) $this.data('bs.alert', (data = new Alert(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.alert

    $.fn.alert = Plugin
    $.fn.alert.Constructor = Alert


    // ALERT NO CONFLICT
    // =================

    $.fn.alert.noConflict = function () {
        $.fn.alert = old
        return this
    }


    // ALERT DATA-API
    // ==============

    $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.7
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // BUTTON PUBLIC CLASS DEFINITION
    // ==============================

    var Button = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, Button.DEFAULTS, options)
        this.isLoading = false
    }

    Button.VERSION = '3.3.7'

    Button.DEFAULTS = {
        loadingText: 'loading...'
    }

    Button.prototype.setState = function (state) {
        var d = 'disabled'
        var $el = this.$element
        var val = $el.is('input') ? 'val' : 'html'
        var data = $el.data()

        state += 'Text'

        if (data.resetText == null) $el.data('resetText', $el[val]())

        // push to event loop to allow forms to submit
        setTimeout($.proxy(function () {
            $el[val](data[state] == null ? this.options[state] : data[state])

            if (state == 'loadingText') {
                this.isLoading = true
                $el.addClass(d).attr(d, d).prop(d, true)
            } else if (this.isLoading) {
                this.isLoading = false
                $el.removeClass(d).removeAttr(d).prop(d, false)
            }
        }, this), 0)
    }

    Button.prototype.toggle = function () {
        var changed = true
        var $parent = this.$element.closest('[data-toggle="buttons"]')

        if ($parent.length) {
            var $input = this.$element.find('input')
            if ($input.prop('type') == 'radio') {
                if ($input.prop('checked')) changed = false
                $parent.find('.active').removeClass('active')
                this.$element.addClass('active')
            } else if ($input.prop('type') == 'checkbox') {
                if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
                this.$element.toggleClass('active')
            }
            $input.prop('checked', this.$element.hasClass('active'))
            if (changed) $input.trigger('change')
        } else {
            this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
            this.$element.toggleClass('active')
        }
    }


    // BUTTON PLUGIN DEFINITION
    // ========================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.button')
            var options = typeof option == 'object' && option

            if (!data) $this.data('bs.button', (data = new Button(this, options)))

            if (option == 'toggle') data.toggle()
            else if (option) data.setState(option)
        })
    }

    var old = $.fn.button

    $.fn.button = Plugin
    $.fn.button.Constructor = Button


    // BUTTON NO CONFLICT
    // ==================

    $.fn.button.noConflict = function () {
        $.fn.button = old
        return this
    }


    // BUTTON DATA-API
    // ===============

    $(document)
        .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
            var $btn = $(e.target).closest('.btn')
            Plugin.call($btn, 'toggle')
            if (!($(e.target).is('input[type="radio"], input[type="checkbox"]'))) {
                // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
                e.preventDefault()
                // The target component still receive the focus
                if ($btn.is('input,button')) $btn.trigger('focus')
                else $btn.find('input:visible,button:visible').first().trigger('focus')
            }
        })
        .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
            $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
        })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.7
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // CAROUSEL CLASS DEFINITION
    // =========================

    var Carousel = function (element, options) {
        this.$element = $(element)
        this.$indicators = this.$element.find('.carousel-indicators')
        this.options = options
        this.paused = null
        this.sliding = null
        this.interval = null
        this.$active = null
        this.$items = null

        this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

        this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
            .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
            .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
    }

    Carousel.VERSION = '3.3.7'

    Carousel.TRANSITION_DURATION = 600

    Carousel.DEFAULTS = {
        interval: 5000,
        pause: 'hover',
        wrap: true,
        keyboard: true
    }

    Carousel.prototype.keydown = function (e) {
        if (/input|textarea/i.test(e.target.tagName)) return
        switch (e.which) {
            case 37: this.prev(); break
            case 39: this.next(); break
            default: return
        }

        e.preventDefault()
    }

    Carousel.prototype.cycle = function (e) {
        e || (this.paused = false)

        this.interval && clearInterval(this.interval)

        this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

        return this
    }

    Carousel.prototype.getItemIndex = function (item) {
        this.$items = item.parent().children('.item')
        return this.$items.index(item || this.$active)
    }

    Carousel.prototype.getItemForDirection = function (direction, active) {
        var activeIndex = this.getItemIndex(active)
        var willWrap = (direction == 'prev' && activeIndex === 0)
            || (direction == 'next' && activeIndex == (this.$items.length - 1))
        if (willWrap && !this.options.wrap) return active
        var delta = direction == 'prev' ? -1 : 1
        var itemIndex = (activeIndex + delta) % this.$items.length
        return this.$items.eq(itemIndex)
    }

    Carousel.prototype.to = function (pos) {
        var that = this
        var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

        if (pos > (this.$items.length - 1) || pos < 0) return

        if (this.sliding) return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
        if (activeIndex == pos) return this.pause().cycle()

        return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
    }

    Carousel.prototype.pause = function (e) {
        e || (this.paused = true)

        if (this.$element.find('.next, .prev').length && $.support.transition) {
            this.$element.trigger($.support.transition.end)
            this.cycle(true)
        }

        this.interval = clearInterval(this.interval)

        return this
    }

    Carousel.prototype.next = function () {
        if (this.sliding) return
        return this.slide('next')
    }

    Carousel.prototype.prev = function () {
        if (this.sliding) return
        return this.slide('prev')
    }

    Carousel.prototype.slide = function (type, next) {
        var $active = this.$element.find('.item.active')
        var $next = next || this.getItemForDirection(type, $active)
        var isCycling = this.interval
        var direction = type == 'next' ? 'left' : 'right'
        var that = this

        if ($next.hasClass('active')) return (this.sliding = false)

        var relatedTarget = $next[0]
        var slideEvent = $.Event('slide.bs.carousel', {
            relatedTarget: relatedTarget,
            direction: direction
        })
        this.$element.trigger(slideEvent)
        if (slideEvent.isDefaultPrevented()) return

        this.sliding = true

        isCycling && this.pause()

        if (this.$indicators.length) {
            this.$indicators.find('.active').removeClass('active')
            var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
            $nextIndicator && $nextIndicator.addClass('active')
        }

        var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
        if ($.support.transition && this.$element.hasClass('slide')) {
            $next.addClass(type)
            $next[0].offsetWidth // force reflow
            $active.addClass(direction)
            $next.addClass(direction)
            $active
                .one('bsTransitionEnd', function () {
                    $next.removeClass([type, direction].join(' ')).addClass('active')
                    $active.removeClass(['active', direction].join(' '))
                    that.sliding = false
                    setTimeout(function () {
                        that.$element.trigger(slidEvent)
                    }, 0)
                })
                .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
        } else {
            $active.removeClass('active')
            $next.addClass('active')
            this.sliding = false
            this.$element.trigger(slidEvent)
        }

        isCycling && this.cycle()

        return this
    }


    // CAROUSEL PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.carousel')
            var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var action = typeof option == 'string' ? option : options.slide

            if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
            if (typeof option == 'number') data.to(option)
            else if (action) data[action]()
            else if (options.interval) data.pause().cycle()
        })
    }

    var old = $.fn.carousel

    $.fn.carousel = Plugin
    $.fn.carousel.Constructor = Carousel


    // CAROUSEL NO CONFLICT
    // ====================

    $.fn.carousel.noConflict = function () {
        $.fn.carousel = old
        return this
    }


    // CAROUSEL DATA-API
    // =================

    var clickHandler = function (e) {
        var href
        var $this = $(this)
        var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
        if (!$target.hasClass('carousel')) return
        var options = $.extend({}, $target.data(), $this.data())
        var slideIndex = $this.attr('data-slide-to')
        if (slideIndex) options.interval = false

        Plugin.call($target, options)

        if (slideIndex) {
            $target.data('bs.carousel').to(slideIndex)
        }

        e.preventDefault()
    }

    $(document)
        .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
        .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

    $(window).on('load', function () {
        $('[data-ride="carousel"]').each(function () {
            var $carousel = $(this)
            Plugin.call($carousel, $carousel.data())
        })
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.7
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
    'use strict';

    // COLLAPSE PUBLIC CLASS DEFINITION
    // ================================

    var Collapse = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, Collapse.DEFAULTS, options)
        this.$trigger = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
            '[data-toggle="collapse"][data-target="#' + element.id + '"]')
        this.transitioning = null

        if (this.options.parent) {
            this.$parent = this.getParent()
        } else {
            this.addAriaAndCollapsedClass(this.$element, this.$trigger)
        }

        if (this.options.toggle) this.toggle()
    }

    Collapse.VERSION = '3.3.7'

    Collapse.TRANSITION_DURATION = 350

    Collapse.DEFAULTS = {
        toggle: true
    }

    Collapse.prototype.dimension = function () {
        var hasWidth = this.$element.hasClass('width')
        return hasWidth ? 'width' : 'height'
    }

    Collapse.prototype.show = function () {
        if (this.transitioning || this.$element.hasClass('in')) return

        var activesData
        var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

        if (actives && actives.length) {
            activesData = actives.data('bs.collapse')
            if (activesData && activesData.transitioning) return
        }

        var startEvent = $.Event('show.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return

        if (actives && actives.length) {
            Plugin.call(actives, 'hide')
            activesData || actives.data('bs.collapse', null)
        }

        var dimension = this.dimension()

        this.$element
            .removeClass('collapse')
            .addClass('collapsing')[dimension](0)
            .attr('aria-expanded', true)

        this.$trigger
            .removeClass('collapsed')
            .attr('aria-expanded', true)

        this.transitioning = 1

        var complete = function () {
            this.$element
                .removeClass('collapsing')
                .addClass('collapse in')[dimension]('')
            this.transitioning = 0
            this.$element
                .trigger('shown.bs.collapse')
        }

        if (!$.support.transition) return complete.call(this)

        var scrollSize = $.camelCase(['scroll', dimension].join('-'))

        this.$element
            .one('bsTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
    }

    Collapse.prototype.hide = function () {
        if (this.transitioning || !this.$element.hasClass('in')) return

        var startEvent = $.Event('hide.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return

        var dimension = this.dimension()

        this.$element[dimension](this.$element[dimension]())[0].offsetHeight

        this.$element
            .addClass('collapsing')
            .removeClass('collapse in')
            .attr('aria-expanded', false)

        this.$trigger
            .addClass('collapsed')
            .attr('aria-expanded', false)

        this.transitioning = 1

        var complete = function () {
            this.transitioning = 0
            this.$element
                .removeClass('collapsing')
                .addClass('collapse')
                .trigger('hidden.bs.collapse')
        }

        if (!$.support.transition) return complete.call(this)

        this.$element
            [dimension](0)
            .one('bsTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
    }

    Collapse.prototype.toggle = function () {
        this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

    Collapse.prototype.getParent = function () {
        return $(this.options.parent)
            .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
            .each($.proxy(function (i, element) {
                var $element = $(element)
                this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
            }, this))
            .end()
    }

    Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
        var isOpen = $element.hasClass('in')

        $element.attr('aria-expanded', isOpen)
        $trigger
            .toggleClass('collapsed', !isOpen)
            .attr('aria-expanded', isOpen)
    }

    function getTargetFromTrigger($trigger) {
        var href
        var target = $trigger.attr('data-target')
            || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

        return $(target)
    }


    // COLLAPSE PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.collapse')
            var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
            if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.collapse

    $.fn.collapse = Plugin
    $.fn.collapse.Constructor = Collapse


    // COLLAPSE NO CONFLICT
    // ====================

    $.fn.collapse.noConflict = function () {
        $.fn.collapse = old
        return this
    }


    // COLLAPSE DATA-API
    // =================

    $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
        var $this = $(this)

        if (!$this.attr('data-target')) e.preventDefault()

        var $target = getTargetFromTrigger($this)
        var data = $target.data('bs.collapse')
        var option = data ? 'toggle' : $this.data()

        Plugin.call($target, option)
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // DROPDOWN CLASS DEFINITION
    // =========================

    var backdrop = '.dropdown-backdrop'
    var toggle = '[data-toggle="dropdown"]'
    var Dropdown = function (element) {
        $(element).on('click.bs.dropdown', this.toggle)
    }

    Dropdown.VERSION = '3.3.7'

    function getParent($this) {
        var selector = $this.attr('data-target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        var $parent = selector && $(selector)

        return $parent && $parent.length ? $parent : $this.parent()
    }

    function clearMenus(e) {
        if (e && e.which === 3) return
        $(backdrop).remove()
        $(toggle).each(function () {
            var $this = $(this)
            var $parent = getParent($this)
            var relatedTarget = { relatedTarget: this }

            if (!$parent.hasClass('open')) return

            if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

            $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

            if (e.isDefaultPrevented()) return

            $this.attr('aria-expanded', 'false')
            $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
        })
    }

    Dropdown.prototype.toggle = function (e) {
        var $this = $(this)

        if ($this.is('.disabled, :disabled')) return

        var $parent = getParent($this)
        var isActive = $parent.hasClass('open')

        clearMenus()

        if (!isActive) {
            if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
                // if mobile we use a backdrop because click events don't delegate
                $(document.createElement('div'))
                    .addClass('dropdown-backdrop')
                    .insertAfter($(this))
                    .on('click', clearMenus)
            }

            var relatedTarget = { relatedTarget: this }
            $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

            if (e.isDefaultPrevented()) return

            $this
                .trigger('focus')
                .attr('aria-expanded', 'true')

            $parent
                .toggleClass('open')
                .trigger($.Event('shown.bs.dropdown', relatedTarget))
        }

        return false
    }

    Dropdown.prototype.keydown = function (e) {
        if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

        var $this = $(this)

        e.preventDefault()
        e.stopPropagation()

        if ($this.is('.disabled, :disabled')) return

        var $parent = getParent($this)
        var isActive = $parent.hasClass('open')

        if (!isActive && e.which != 27 || isActive && e.which == 27) {
            if (e.which == 27) $parent.find(toggle).trigger('focus')
            return $this.trigger('click')
        }

        var desc = ' li:not(.disabled):visible a'
        var $items = $parent.find('.dropdown-menu' + desc)

        if (!$items.length) return

        var index = $items.index(e.target)

        if (e.which == 38 && index > 0) index--         // up
        if (e.which == 40 && index < $items.length - 1) index++         // down
        if (!~index) index = 0

        $items.eq(index).trigger('focus')
    }


    // DROPDOWN PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.dropdown')

            if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.dropdown

    $.fn.dropdown = Plugin
    $.fn.dropdown.Constructor = Dropdown


    // DROPDOWN NO CONFLICT
    // ====================

    $.fn.dropdown.noConflict = function () {
        $.fn.dropdown = old
        return this
    }


    // APPLY TO STANDARD DROPDOWN ELEMENTS
    // ===================================

    $(document)
        .on('click.bs.dropdown.data-api', clearMenus)
        .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
        .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
        .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
        .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.7
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // MODAL CLASS DEFINITION
    // ======================

    var Modal = function (element, options) {
        this.options = options
        this.$body = $(document.body)
        this.$element = $(element)
        this.$dialog = this.$element.find('.modal-dialog')
        this.$backdrop = null
        this.isShown = null
        this.originalBodyPad = null
        this.scrollbarWidth = 0
        this.ignoreBackdropClick = false

        if (this.options.remote) {
            this.$element
                .find('.modal-content')
                .load(this.options.remote, $.proxy(function () {
                    this.$element.trigger('loaded.bs.modal')
                }, this))
        }
    }

    Modal.VERSION = '3.3.7'

    Modal.TRANSITION_DURATION = 300
    Modal.BACKDROP_TRANSITION_DURATION = 150

    Modal.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true
    }

    Modal.prototype.toggle = function (_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget)
    }

    Modal.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.checkScrollbar()
        this.setScrollbar()
        this.$body.addClass('modal-open')

        this.escape()
        this.resize()

        this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

        this.$dialog.on('mousedown.dismiss.bs.modal', function () {
            that.$element.one('mouseup.dismiss.bs.modal', function (e) {
                if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
            })
        })

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(that.$body) // don't move modals dom position
            }

            that.$element
                .show()
                .scrollTop(0)

            that.adjustDialog()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element.addClass('in')

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
                that.$dialog // wait for modal to slide in
                    .one('bsTransitionEnd', function () {
                        that.$element.trigger('focus').trigger(e)
                    })
                    .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
                that.$element.trigger('focus').trigger(e)
        })
    }

    Modal.prototype.hide = function (e) {
        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()
        this.resize()

        $(document).off('focusin.bs.modal')

        this.$element
            .removeClass('in')
            .off('click.dismiss.bs.modal')
            .off('mouseup.dismiss.bs.modal')

        this.$dialog.off('mousedown.dismiss.bs.modal')

        $.support.transition && this.$element.hasClass('fade') ?
            this.$element
                .one('bsTransitionEnd', $.proxy(this.hideModal, this))
                .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
            this.hideModal()
    }

    Modal.prototype.enforceFocus = function () {
        $(document)
            .off('focusin.bs.modal') // guard against infinite focus loop
            .on('focusin.bs.modal', $.proxy(function (e) {
                if (document !== e.target &&
                    this.$element[0] !== e.target &&
                    !this.$element.has(e.target).length) {
                    this.$element.trigger('focus')
                }
            }, this))
    }

    Modal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keydown.dismiss.bs.modal')
        }
    }

    Modal.prototype.resize = function () {
        if (this.isShown) {
            $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
        } else {
            $(window).off('resize.bs.modal')
        }
    }

    Modal.prototype.hideModal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.$body.removeClass('modal-open')
            that.resetAdjustments()
            that.resetScrollbar()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Modal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Modal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $(document.createElement('div'))
                .addClass('modal-backdrop ' + animate)
                .appendTo(this.$body)

            this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
                if (this.ignoreBackdropClick) {
                    this.ignoreBackdropClick = false
                    return
                }
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                    ? this.$element[0].focus()
                    : this.hide()
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
                this.$backdrop
                    .one('bsTransitionEnd', callback)
                    .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            var callbackRemove = function () {
                that.removeBackdrop()
                callback && callback()
            }
            $.support.transition && this.$element.hasClass('fade') ?
                this.$backdrop
                    .one('bsTransitionEnd', callbackRemove)
                    .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                callbackRemove()

        } else if (callback) {
            callback()
        }
    }

    // these following methods are used to handle overflowing modals

    Modal.prototype.handleUpdate = function () {
        this.adjustDialog()
    }

    Modal.prototype.adjustDialog = function () {
        var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
            paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
        })
    }

    Modal.prototype.resetAdjustments = function () {
        this.$element.css({
            paddingLeft: '',
            paddingRight: ''
        })
    }

    Modal.prototype.checkScrollbar = function () {
        var fullWindowWidth = window.innerWidth
        if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
            var documentElementRect = document.documentElement.getBoundingClientRect()
            fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
        }
        this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
        this.scrollbarWidth = this.measureScrollbar()
    }

    Modal.prototype.setScrollbar = function () {
        var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
        this.originalBodyPad = document.body.style.paddingRight || ''
        if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
    }

    Modal.prototype.resetScrollbar = function () {
        this.$body.css('padding-right', this.originalBodyPad)
    }

    Modal.prototype.measureScrollbar = function () { // thx walsh
        var scrollDiv = document.createElement('div')
        scrollDiv.className = 'modal-scrollbar-measure'
        this.$body.append(scrollDiv)
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
        this.$body[0].removeChild(scrollDiv)
        return scrollbarWidth
    }


    // MODAL PLUGIN DEFINITION
    // =======================

    function Plugin(option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    var old = $.fn.modal

    $.fn.modal = Plugin
    $.fn.modal.Constructor = Modal


    // MODAL NO CONFLICT
    // =================

    $.fn.modal.noConflict = function () {
        $.fn.modal = old
        return this
    }


    // MODAL DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
        var option = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        if ($this.is('a')) e.preventDefault()

        $target.one('show.bs.modal', function (showEvent) {
            if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
            $target.one('hidden.bs.modal', function () {
                $this.is(':visible') && $this.trigger('focus')
            })
        })
        Plugin.call($target, option, this)
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.7
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // TOOLTIP PUBLIC CLASS DEFINITION
    // ===============================

    var Tooltip = function (element, options) {
        this.type = null
        this.options = null
        this.enabled = null
        this.timeout = null
        this.hoverState = null
        this.$element = null
        this.inState = null

        this.init('tooltip', element, options)
    }

    Tooltip.VERSION = '3.3.7'

    Tooltip.TRANSITION_DURATION = 150

    Tooltip.DEFAULTS = {
        animation: true,
        placement: 'top',
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: 'hover focus',
        title: '',
        delay: 0,
        html: false,
        container: false,
        viewport: {
            selector: 'body',
            padding: 0
        }
    }

    Tooltip.prototype.init = function (type, element, options) {
        this.enabled = true
        this.type = type
        this.$element = $(element)
        this.options = this.getOptions(options)
        this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
        this.inState = { click: false, hover: false, focus: false }

        if (this.$element[0] instanceof document.constructor && !this.options.selector) {
            throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
        }

        var triggers = this.options.trigger.split(' ')

        for (var i = triggers.length; i--;) {
            var trigger = triggers[i]

            if (trigger == 'click') {
                this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
            } else if (trigger != 'manual') {
                var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin'
                var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

                this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
                this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
            }
        }

        this.options.selector ?
            (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
            this.fixTitle()
    }

    Tooltip.prototype.getDefaults = function () {
        return Tooltip.DEFAULTS
    }

    Tooltip.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options)

        if (options.delay && typeof options.delay == 'number') {
            options.delay = {
                show: options.delay,
                hide: options.delay
            }
        }

        return options
    }

    Tooltip.prototype.getDelegateOptions = function () {
        var options = {}
        var defaults = this.getDefaults()

        this._options && $.each(this._options, function (key, value) {
            if (defaults[key] != value) options[key] = value
        })

        return options
    }

    Tooltip.prototype.enter = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('bs.' + this.type)

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
            $(obj.currentTarget).data('bs.' + this.type, self)
        }

        if (obj instanceof $.Event) {
            self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
        }

        if (self.tip().hasClass('in') || self.hoverState == 'in') {
            self.hoverState = 'in'
            return
        }

        clearTimeout(self.timeout)

        self.hoverState = 'in'

        if (!self.options.delay || !self.options.delay.show) return self.show()

        self.timeout = setTimeout(function () {
            if (self.hoverState == 'in') self.show()
        }, self.options.delay.show)
    }

    Tooltip.prototype.isInStateTrue = function () {
        for (var key in this.inState) {
            if (this.inState[key]) return true
        }

        return false
    }

    Tooltip.prototype.leave = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('bs.' + this.type)

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
            $(obj.currentTarget).data('bs.' + this.type, self)
        }

        if (obj instanceof $.Event) {
            self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
        }

        if (self.isInStateTrue()) return

        clearTimeout(self.timeout)

        self.hoverState = 'out'

        if (!self.options.delay || !self.options.delay.hide) return self.hide()

        self.timeout = setTimeout(function () {
            if (self.hoverState == 'out') self.hide()
        }, self.options.delay.hide)
    }

    Tooltip.prototype.show = function () {
        var e = $.Event('show.bs.' + this.type)

        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e)

            var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
            if (e.isDefaultPrevented() || !inDom) return
            var that = this

            var $tip = this.tip()

            var tipId = this.getUID(this.type)

            this.setContent()
            $tip.attr('id', tipId)
            this.$element.attr('aria-describedby', tipId)

            if (this.options.animation) $tip.addClass('fade')

            var placement = typeof this.options.placement == 'function' ?
                this.options.placement.call(this, $tip[0], this.$element[0]) :
                this.options.placement

            var autoToken = /\s?auto?\s?/i
            var autoPlace = autoToken.test(placement)
            if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

            $tip
                .detach()
                .css({ top: 0, left: 0, display: 'block' })
                .addClass(placement)
                .data('bs.' + this.type, this)

            this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
            this.$element.trigger('inserted.bs.' + this.type)

            var pos = this.getPosition()
            var actualWidth = $tip[0].offsetWidth
            var actualHeight = $tip[0].offsetHeight

            if (autoPlace) {
                var orgPlacement = placement
                var viewportDim = this.getPosition(this.$viewport)

                placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top' :
                    placement == 'top' && pos.top - actualHeight < viewportDim.top ? 'bottom' :
                        placement == 'right' && pos.right + actualWidth > viewportDim.width ? 'left' :
                            placement == 'left' && pos.left - actualWidth < viewportDim.left ? 'right' :
                                placement

                $tip
                    .removeClass(orgPlacement)
                    .addClass(placement)
            }

            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

            this.applyPlacement(calculatedOffset, placement)

            var complete = function () {
                var prevHoverState = that.hoverState
                that.$element.trigger('shown.bs.' + that.type)
                that.hoverState = null

                if (prevHoverState == 'out') that.leave(that)
            }

            $.support.transition && this.$tip.hasClass('fade') ?
                $tip
                    .one('bsTransitionEnd', complete)
                    .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
                complete()
        }
    }

    Tooltip.prototype.applyPlacement = function (offset, placement) {
        var $tip = this.tip()
        var width = $tip[0].offsetWidth
        var height = $tip[0].offsetHeight

        // manually read margins because getBoundingClientRect includes difference
        var marginTop = parseInt($tip.css('margin-top'), 10)
        var marginLeft = parseInt($tip.css('margin-left'), 10)

        // we must check for NaN for ie 8/9
        if (isNaN(marginTop)) marginTop = 0
        if (isNaN(marginLeft)) marginLeft = 0

        offset.top += marginTop
        offset.left += marginLeft

        // $.fn.offset doesn't round pixel values
        // so we use setOffset directly with our own function B-0
        $.offset.setOffset($tip[0], $.extend({
            using: function (props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                })
            }
        }, offset), 0)

        $tip.addClass('in')

        // check to see if placing tip in new offset caused the tip to resize itself
        var actualWidth = $tip[0].offsetWidth
        var actualHeight = $tip[0].offsetHeight

        if (placement == 'top' && actualHeight != height) {
            offset.top = offset.top + height - actualHeight
        }

        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

        if (delta.left) offset.left += delta.left
        else offset.top += delta.top

        var isVertical = /top|bottom/.test(placement)
        var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
        var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

        $tip.offset(offset)
        this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
    }

    Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
        this.arrow()
            .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
            .css(isVertical ? 'top' : 'left', '')
    }

    Tooltip.prototype.setContent = function () {
        var $tip = this.tip()
        var title = this.getTitle()

        $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
        $tip.removeClass('fade in top bottom left right')
    }

    Tooltip.prototype.hide = function (callback) {
        var that = this
        var $tip = $(this.$tip)
        var e = $.Event('hide.bs.' + this.type)

        function complete() {
            if (that.hoverState != 'in') $tip.detach()
            if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
                that.$element
                    .removeAttr('aria-describedby')
                    .trigger('hidden.bs.' + that.type)
            }
            callback && callback()
        }

        this.$element.trigger(e)

        if (e.isDefaultPrevented()) return

        $tip.removeClass('in')

        $.support.transition && $tip.hasClass('fade') ?
            $tip
                .one('bsTransitionEnd', complete)
                .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
            complete()

        this.hoverState = null

        return this
    }

    Tooltip.prototype.fixTitle = function () {
        var $e = this.$element
        if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
            $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
        }
    }

    Tooltip.prototype.hasContent = function () {
        return this.getTitle()
    }

    Tooltip.prototype.getPosition = function ($element) {
        $element = $element || this.$element

        var el = $element[0]
        var isBody = el.tagName == 'BODY'

        var elRect = el.getBoundingClientRect()
        if (elRect.width == null) {
            // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
            elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
        }
        var isSvg = window.SVGElement && el instanceof window.SVGElement
        // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
        // See https://github.com/twbs/bootstrap/issues/20280
        var elOffset = isBody ? { top: 0, left: 0 } : (isSvg ? null : $element.offset())
        var scroll = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
        var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

        return $.extend({}, elRect, scroll, outerDims, elOffset)
    }

    Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
        return placement == 'bottom' ? { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 } :
            placement == 'top' ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
                placement == 'left' ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
                    /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

    }

    Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
        var delta = { top: 0, left: 0 }
        if (!this.$viewport) return delta

        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
        var viewportDimensions = this.getPosition(this.$viewport)

        if (/right|left/.test(placement)) {
            var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll
            var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
            if (topEdgeOffset < viewportDimensions.top) { // top overflow
                delta.top = viewportDimensions.top - topEdgeOffset
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
                delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
            }
        } else {
            var leftEdgeOffset = pos.left - viewportPadding
            var rightEdgeOffset = pos.left + viewportPadding + actualWidth
            if (leftEdgeOffset < viewportDimensions.left) { // left overflow
                delta.left = viewportDimensions.left - leftEdgeOffset
            } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
                delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
            }
        }

        return delta
    }

    Tooltip.prototype.getTitle = function () {
        var title
        var $e = this.$element
        var o = this.options

        title = $e.attr('data-original-title')
            || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title)

        return title
    }

    Tooltip.prototype.getUID = function (prefix) {
        do prefix += ~~(Math.random() * 1000000)
        while (document.getElementById(prefix))
        return prefix
    }

    Tooltip.prototype.tip = function () {
        if (!this.$tip) {
            this.$tip = $(this.options.template)
            if (this.$tip.length != 1) {
                throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
            }
        }
        return this.$tip
    }

    Tooltip.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
    }

    Tooltip.prototype.enable = function () {
        this.enabled = true
    }

    Tooltip.prototype.disable = function () {
        this.enabled = false
    }

    Tooltip.prototype.toggleEnabled = function () {
        this.enabled = !this.enabled
    }

    Tooltip.prototype.toggle = function (e) {
        var self = this
        if (e) {
            self = $(e.currentTarget).data('bs.' + this.type)
            if (!self) {
                self = new this.constructor(e.currentTarget, this.getDelegateOptions())
                $(e.currentTarget).data('bs.' + this.type, self)
            }
        }

        if (e) {
            self.inState.click = !self.inState.click
            if (self.isInStateTrue()) self.enter(self)
            else self.leave(self)
        } else {
            self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
        }
    }

    Tooltip.prototype.destroy = function () {
        var that = this
        clearTimeout(this.timeout)
        this.hide(function () {
            that.$element.off('.' + that.type).removeData('bs.' + that.type)
            if (that.$tip) {
                that.$tip.detach()
            }
            that.$tip = null
            that.$arrow = null
            that.$viewport = null
            that.$element = null
        })
    }


    // TOOLTIP PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.tooltip')
            var options = typeof option == 'object' && option

            if (!data && /destroy|hide/.test(option)) return
            if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.tooltip

    $.fn.tooltip = Plugin
    $.fn.tooltip.Constructor = Tooltip


    // TOOLTIP NO CONFLICT
    // ===================

    $.fn.tooltip.noConflict = function () {
        $.fn.tooltip = old
        return this
    }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.7
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // POPOVER PUBLIC CLASS DEFINITION
    // ===============================

    var Popover = function (element, options) {
        this.init('popover', element, options)
    }

    if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

    Popover.VERSION = '3.3.7'

    Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
        placement: 'right',
        trigger: 'click',
        content: '',
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    })


    // NOTE: POPOVER EXTENDS tooltip.js
    // ================================

    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

    Popover.prototype.constructor = Popover

    Popover.prototype.getDefaults = function () {
        return Popover.DEFAULTS
    }

    Popover.prototype.setContent = function () {
        var $tip = this.tip()
        var title = this.getTitle()
        var content = this.getContent()

        $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
        $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
            this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
            ](content)

        $tip.removeClass('fade top bottom left right in')

        // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
        // this manually by checking the contents.
        if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
    }

    Popover.prototype.hasContent = function () {
        return this.getTitle() || this.getContent()
    }

    Popover.prototype.getContent = function () {
        var $e = this.$element
        var o = this.options

        return $e.attr('data-content')
            || (typeof o.content == 'function' ?
                o.content.call($e[0]) :
                o.content)
    }

    Popover.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
    }


    // POPOVER PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.popover')
            var options = typeof option == 'object' && option

            if (!data && /destroy|hide/.test(option)) return
            if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.popover

    $.fn.popover = Plugin
    $.fn.popover.Constructor = Popover


    // POPOVER NO CONFLICT
    // ===================

    $.fn.popover.noConflict = function () {
        $.fn.popover = old
        return this
    }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.7
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // SCROLLSPY CLASS DEFINITION
    // ==========================

    function ScrollSpy(element, options) {
        this.$body = $(document.body)
        this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
        this.options = $.extend({}, ScrollSpy.DEFAULTS, options)
        this.selector = (this.options.target || '') + ' .nav li > a'
        this.offsets = []
        this.targets = []
        this.activeTarget = null
        this.scrollHeight = 0

        this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
        this.refresh()
        this.process()
    }

    ScrollSpy.VERSION = '3.3.7'

    ScrollSpy.DEFAULTS = {
        offset: 10
    }

    ScrollSpy.prototype.getScrollHeight = function () {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    }

    ScrollSpy.prototype.refresh = function () {
        var that = this
        var offsetMethod = 'offset'
        var offsetBase = 0

        this.offsets = []
        this.targets = []
        this.scrollHeight = this.getScrollHeight()

        if (!$.isWindow(this.$scrollElement[0])) {
            offsetMethod = 'position'
            offsetBase = this.$scrollElement.scrollTop()
        }

        this.$body
            .find(this.selector)
            .map(function () {
                var $el = $(this)
                var href = $el.data('target') || $el.attr('href')
                var $href = /^#./.test(href) && $(href)

                return ($href
                    && $href.length
                    && $href.is(':visible')
                    && [[$href[offsetMethod]().top + offsetBase, href]]) || null
            })
            .sort(function (a, b) { return a[0] - b[0] })
            .each(function () {
                that.offsets.push(this[0])
                that.targets.push(this[1])
            })
    }

    ScrollSpy.prototype.process = function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
        var scrollHeight = this.getScrollHeight()
        var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height()
        var offsets = this.offsets
        var targets = this.targets
        var activeTarget = this.activeTarget
        var i

        if (this.scrollHeight != scrollHeight) {
            this.refresh()
        }

        if (scrollTop >= maxScroll) {
            return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
        }

        if (activeTarget && scrollTop < offsets[0]) {
            this.activeTarget = null
            return this.clear()
        }

        for (i = offsets.length; i--;) {
            activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
            && this.activate(targets[i])
        }
    }

    ScrollSpy.prototype.activate = function (target) {
        this.activeTarget = target

        this.clear()

        var selector = this.selector +
            '[data-target="' + target + '"],' +
            this.selector + '[href="' + target + '"]'

        var active = $(selector)
            .parents('li')
            .addClass('active')

        if (active.parent('.dropdown-menu').length) {
            active = active
                .closest('li.dropdown')
                .addClass('active')
        }

        active.trigger('activate.bs.scrollspy')
    }

    ScrollSpy.prototype.clear = function () {
        $(this.selector)
            .parentsUntil(this.options.target, '.active')
            .removeClass('active')
    }


    // SCROLLSPY PLUGIN DEFINITION
    // ===========================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.scrollspy')
            var options = typeof option == 'object' && option

            if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.scrollspy

    $.fn.scrollspy = Plugin
    $.fn.scrollspy.Constructor = ScrollSpy


    // SCROLLSPY NO CONFLICT
    // =====================

    $.fn.scrollspy.noConflict = function () {
        $.fn.scrollspy = old
        return this
    }


    // SCROLLSPY DATA-API
    // ==================

    $(window).on('load.bs.scrollspy.data-api', function () {
        $('[data-spy="scroll"]').each(function () {
            var $spy = $(this)
            Plugin.call($spy, $spy.data())
        })
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.7
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // TAB CLASS DEFINITION
    // ====================

    var Tab = function (element) {
        // jscs:disable requireDollarBeforejQueryAssignment
        this.element = $(element)
        // jscs:enable requireDollarBeforejQueryAssignment
    }

    Tab.VERSION = '3.3.7'

    Tab.TRANSITION_DURATION = 150

    Tab.prototype.show = function () {
        var $this = this.element
        var $ul = $this.closest('ul:not(.dropdown-menu)')
        var selector = $this.data('target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        if ($this.parent('li').hasClass('active')) return

        var $previous = $ul.find('.active:last a')
        var hideEvent = $.Event('hide.bs.tab', {
            relatedTarget: $this[0]
        })
        var showEvent = $.Event('show.bs.tab', {
            relatedTarget: $previous[0]
        })

        $previous.trigger(hideEvent)
        $this.trigger(showEvent)

        if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

        var $target = $(selector)

        this.activate($this.closest('li'), $ul)
        this.activate($target, $target.parent(), function () {
            $previous.trigger({
                type: 'hidden.bs.tab',
                relatedTarget: $this[0]
            })
            $this.trigger({
                type: 'shown.bs.tab',
                relatedTarget: $previous[0]
            })
        })
    }

    Tab.prototype.activate = function (element, container, callback) {
        var $active = container.find('> .active')
        var transition = callback
            && $.support.transition
            && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

        function next() {
            $active
                .removeClass('active')
                .find('> .dropdown-menu > .active')
                .removeClass('active')
                .end()
                .find('[data-toggle="tab"]')
                .attr('aria-expanded', false)

            element
                .addClass('active')
                .find('[data-toggle="tab"]')
                .attr('aria-expanded', true)

            if (transition) {
                element[0].offsetWidth // reflow for transition
                element.addClass('in')
            } else {
                element.removeClass('fade')
            }

            if (element.parent('.dropdown-menu').length) {
                element
                    .closest('li.dropdown')
                    .addClass('active')
                    .end()
                    .find('[data-toggle="tab"]')
                    .attr('aria-expanded', true)
            }

            callback && callback()
        }

        $active.length && transition ?
            $active
                .one('bsTransitionEnd', next)
                .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
            next()

        $active.removeClass('in')
    }


    // TAB PLUGIN DEFINITION
    // =====================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.tab')

            if (!data) $this.data('bs.tab', (data = new Tab(this)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.tab

    $.fn.tab = Plugin
    $.fn.tab.Constructor = Tab


    // TAB NO CONFLICT
    // ===============

    $.fn.tab.noConflict = function () {
        $.fn.tab = old
        return this
    }


    // TAB DATA-API
    // ============

    var clickHandler = function (e) {
        e.preventDefault()
        Plugin.call($(this), 'show')
    }

    $(document)
        .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
        .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);


/* ========================================================================
 * Bootstrap: affix.js v3.3.7
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // AFFIX CLASS DEFINITION
    // ======================

    var Affix = function (element, options) {
        this.options = $.extend({}, Affix.DEFAULTS, options)

        this.$target = $(this.options.target)
            .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
            .on('click.bs.affix.data-api', $.proxy(this.checkPositionWithEventLoop, this))

        this.$element = $(element)
        this.affixed = null
        this.unpin = null
        this.pinnedOffset = null

        this.checkPosition()
    }

    Affix.VERSION = '3.3.7'

    Affix.RESET = 'affix affix-top affix-bottom'

    Affix.DEFAULTS = {
        offset: 0,
        target: window
    }

    Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
        var scrollTop = this.$target.scrollTop()
        var position = this.$element.offset()
        var targetHeight = this.$target.height()

        if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

        if (this.affixed == 'bottom') {
            if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
            return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
        }

        var initializing = this.affixed == null
        var colliderTop = initializing ? scrollTop : position.top
        var colliderHeight = initializing ? targetHeight : height

        if (offsetTop != null && scrollTop <= offsetTop) return 'top'
        if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

        return false
    }

    Affix.prototype.getPinnedOffset = function () {
        if (this.pinnedOffset) return this.pinnedOffset
        this.$element.removeClass(Affix.RESET).addClass('affix')
        var scrollTop = this.$target.scrollTop()
        var position = this.$element.offset()
        return (this.pinnedOffset = position.top - scrollTop)
    }

    Affix.prototype.checkPositionWithEventLoop = function () {
        setTimeout($.proxy(this.checkPosition, this), 1)
    }

    Affix.prototype.checkPosition = function () {
        if (!this.$element.is(':visible')) return

        var height = this.$element.height()
        var offset = this.options.offset
        var offsetTop = offset.top
        var offsetBottom = offset.bottom
        var scrollHeight = Math.max($(document).height(), $(document.body).height())

        if (typeof offset != 'object') offsetBottom = offsetTop = offset
        if (typeof offsetTop == 'function') offsetTop = offset.top(this.$element)
        if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

        var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

        if (this.affixed != affix) {
            if (this.unpin != null) this.$element.css('top', '')

            var affixType = 'affix' + (affix ? '-' + affix : '')
            var e = $.Event(affixType + '.bs.affix')

            this.$element.trigger(e)

            if (e.isDefaultPrevented()) return

            this.affixed = affix
            this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

            this.$element
                .removeClass(Affix.RESET)
                .addClass(affixType)
                .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
        }

        if (affix == 'bottom') {
            this.$element.offset({
                top: scrollHeight - height - offsetBottom
            })
        }
    }


    // AFFIX PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.affix')
            var options = typeof option == 'object' && option

            if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.affix

    $.fn.affix = Plugin
    $.fn.affix.Constructor = Affix


    // AFFIX NO CONFLICT
    // =================

    $.fn.affix.noConflict = function () {
        $.fn.affix = old
        return this
    }


    // AFFIX DATA-API
    // ==============

    $(window).on('load', function () {
        $('[data-spy="affix"]').each(function () {
            var $spy = $(this)
            var data = $spy.data()

            data.offset = data.offset || {}

            if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
            if (data.offsetTop != null) data.offset.top = data.offsetTop

            Plugin.call($spy, data)
        })
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: Timepicker.js
 * https://github.com/jdewit/bootstrap-timepicker/graphs/contributors
 * ========================================================================
 * Copyright 2013-2018 Twitter Bootstrap
 * Licensed under MIT (https://github.com/jdewit/bootstrap-timepicker/graphs/LICENSE)
 * ======================================================================== */

+function ($, window, document) {
    'use strict';

    // TIMEPICKER PUBLIC CLASS DEFINITION
    var Timepicker = function (element, options) {
        this.widget = '';
        this.$element = $(element);
        this.defaultTime = options.defaultTime;
        this.disableFocus = options.disableFocus;
        this.disableMousewheel = options.disableMousewheel;
        this.isOpen = options.isOpen;
        this.minuteStep = options.minuteStep;
        this.modalBackdrop = options.modalBackdrop;
        this.orientation = options.orientation;
        this.secondStep = options.secondStep;
        this.snapToStep = options.snapToStep;
        this.showInputs = options.showInputs;
        this.showMeridian = options.showMeridian;
        this.showSeconds = options.showSeconds;
        this.template = options.template;
        this.appendWidgetTo = options.appendWidgetTo;
        this.showWidgetOnAddonClick = options.showWidgetOnAddonClick;
        this.icons = options.icons;
        this.maxHours = options.maxHours;
        this.explicitMode = options.explicitMode; // If true 123 = 1:23, 12345 = 1:23:45, else invalid.

        this.handleDocumentClick = function (e) {
            var self = e.data.scope;
            // This condition was inspired by bootstrap-datepicker.
            // The element the timepicker is invoked on is the input but it has a sibling for addon/button.
            if (!(self.$element.parent().find(e.target).length ||
                self.$widget.is(e.target) ||
                self.$widget.find(e.target).length)) {
                self.hideWidget();
            }
        };

        this._init();
    };

    Timepicker.prototype = {

        constructor: Timepicker,
        _init: function () {
            var self = this;

            if (this.showWidgetOnAddonClick && (this.$element.parent().hasClass('input-group') && this.$element.parent().hasClass('bootstrap-timepicker'))) {
                this.$element.parent('.input-group.bootstrap-timepicker').find('.input-group-addon').on({
                    'click.timepicker': $.proxy(this.showWidget, this)
                });
                this.$element.on({
                    'focus.timepicker': $.proxy(this.highlightUnit, this),
                    'click.timepicker': $.proxy(this.highlightUnit, this),
                    'keydown.timepicker': $.proxy(this.elementKeydown, this),
                    'blur.timepicker': $.proxy(this.blurElement, this),
                    'mousewheel.timepicker DOMMouseScroll.timepicker': $.proxy(this.mousewheel, this)
                });
            } else {
                if (this.template) {
                    this.$element.on({
                        'focus.timepicker': $.proxy(this.showWidget, this),
                        'click.timepicker': $.proxy(this.showWidget, this),
                        'blur.timepicker': $.proxy(this.blurElement, this),
                        'mousewheel.timepicker DOMMouseScroll.timepicker': $.proxy(this.mousewheel, this)
                    });
                } else {
                    this.$element.on({
                        'focus.timepicker': $.proxy(this.highlightUnit, this),
                        'click.timepicker': $.proxy(this.highlightUnit, this),
                        'keydown.timepicker': $.proxy(this.elementKeydown, this),
                        'blur.timepicker': $.proxy(this.blurElement, this),
                        'mousewheel.timepicker DOMMouseScroll.timepicker': $.proxy(this.mousewheel, this)
                    });
                }
            }

            if (this.template !== false) {
                this.$widget = $(this.getTemplate()).on('click', $.proxy(this.widgetClick, this));
            } else {
                this.$widget = false;
            }

            if (this.showInputs && this.$widget !== false) {
                this.$widget.find('input').each(function () {
                    $(this).on({
                        'click.timepicker': function () { $(this).select(); },
                        'keydown.timepicker': $.proxy(self.widgetKeydown, self),
                        'keyup.timepicker': $.proxy(self.widgetKeyup, self)
                    });
                });
            }

            this.setDefaultTime(this.defaultTime);
        },

        blurElement: function () {
            this.highlightedUnit = null;
            this.updateFromElementVal();
        },

        clear: function () {
            this.hour = '';
            this.minute = '';
            this.second = '';
            this.meridian = '';

            this.$element.val('');
        },

        decrementHour: function () {
            if (this.showMeridian) {
                if (this.hour === 1) {
                    this.hour = 12;
                } else if (this.hour === 12) {
                    this.hour--;

                    return this.toggleMeridian();
                } else if (this.hour === 0) {
                    this.hour = 11;

                    return this.toggleMeridian();
                } else {
                    this.hour--;
                }
            } else {
                if (this.hour <= 0) {
                    this.hour = this.maxHours - 1;
                } else {
                    this.hour--;
                }
            }
        },

        decrementMinute: function (step) {
            var newVal;

            if (step) {
                newVal = this.minute - step;
            } else {
                newVal = this.minute - this.minuteStep;
            }

            if (newVal < 0) {
                this.decrementHour();
                this.minute = newVal + 60;
            } else {
                this.minute = newVal;
            }
        },

        decrementSecond: function () {
            var newVal = this.second - this.secondStep;

            if (newVal < 0) {
                this.decrementMinute(true);
                this.second = newVal + 60;
            } else {
                this.second = newVal;
            }
        },

        elementKeydown: function (e) {
            switch (e.which) {
                case 9: //tab
                    if (e.shiftKey) {
                        if (this.highlightedUnit === 'hour') {
                            this.hideWidget();
                            break;
                        }
                        this.highlightPrevUnit();
                    } else if ((this.showMeridian && this.highlightedUnit === 'meridian') || (this.showSeconds && this.highlightedUnit === 'second') || (!this.showMeridian && !this.showSeconds && this.highlightedUnit === 'minute')) {
                        this.hideWidget();
                        break;
                    } else {
                        this.highlightNextUnit();
                    }
                    e.preventDefault();
                    this.updateFromElementVal();
                    break;
                case 27: // escape
                    this.updateFromElementVal();
                    break;
                case 37: // left arrow
                    e.preventDefault();
                    this.highlightPrevUnit();
                    this.updateFromElementVal();
                    break;
                case 38: // up arrow
                    e.preventDefault();
                    switch (this.highlightedUnit) {
                        case 'hour':
                            this.incrementHour();
                            this.highlightHour();
                            break;
                        case 'minute':
                            this.incrementMinute();
                            this.highlightMinute();
                            break;
                        case 'second':
                            this.incrementSecond();
                            this.highlightSecond();
                            break;
                        case 'meridian':
                            this.toggleMeridian();
                            this.highlightMeridian();
                            break;
                    }
                    this.update();
                    break;
                case 39: // right arrow
                    e.preventDefault();
                    this.highlightNextUnit();
                    this.updateFromElementVal();
                    break;
                case 40: // down arrow
                    e.preventDefault();
                    switch (this.highlightedUnit) {
                        case 'hour':
                            this.decrementHour();
                            this.highlightHour();
                            break;
                        case 'minute':
                            this.decrementMinute();
                            this.highlightMinute();
                            break;
                        case 'second':
                            this.decrementSecond();
                            this.highlightSecond();
                            break;
                        case 'meridian':
                            this.toggleMeridian();
                            this.highlightMeridian();
                            break;
                    }

                    this.update();
                    break;
            }
        },

        getCursorPosition: function () {
            var input = this.$element.get(0);

            if ('selectionStart' in input) {// Standard-compliant browsers

                return input.selectionStart;
            } else if (document.selection) {// IE fix
                input.focus();
                var sel = document.selection.createRange(),
                    selLen = document.selection.createRange().text.length;

                sel.moveStart('character', -input.value.length);

                return sel.text.length - selLen;
            }
        },

        getTemplate: function () {
            var template,
                hourTemplate,
                minuteTemplate,
                secondTemplate,
                meridianTemplate,
                templateContent;

            if (this.showInputs) {
                hourTemplate = '<input type="text" class="bootstrap-timepicker-hour" maxlength="2"/>';
                minuteTemplate = '<input type="text" class="bootstrap-timepicker-minute" maxlength="2"/>';
                secondTemplate = '<input type="text" class="bootstrap-timepicker-second" maxlength="2"/>';
                meridianTemplate = '<input type="text" class="bootstrap-timepicker-meridian" maxlength="2"/>';
            } else {
                hourTemplate = '<span class="bootstrap-timepicker-hour"></span>';
                minuteTemplate = '<span class="bootstrap-timepicker-minute"></span>';
                secondTemplate = '<span class="bootstrap-timepicker-second"></span>';
                meridianTemplate = '<span class="bootstrap-timepicker-meridian"></span>';
            }

            templateContent = '<table>' +
                '<tr>' +
                '<td><a href="#" data-action="incrementHour"><span class="' + this.icons.up + '"></span></a></td>' +
                '<td class="separator">&nbsp;</td>' +
                '<td><a href="#" data-action="incrementMinute"><span class="' + this.icons.up + '"></span></a></td>' +
                (this.showSeconds ?
                    '<td class="separator">&nbsp;</td>' +
                    '<td><a href="#" data-action="incrementSecond"><span class="' + this.icons.up + '"></span></a></td>'
                    : '') +
                (this.showMeridian ?
                    '<td class="separator">&nbsp;</td>' +
                    '<td class="meridian-column"><a href="#" data-action="toggleMeridian"><span class="' + this.icons.up + '"></span></a></td>'
                    : '') +
                '</tr>' +
                '<tr>' +
                '<td>' + hourTemplate + '</td> ' +
                '<td class="separator">:</td>' +
                '<td>' + minuteTemplate + '</td> ' +
                (this.showSeconds ?
                    '<td class="separator">:</td>' +
                    '<td>' + secondTemplate + '</td>'
                    : '') +
                (this.showMeridian ?
                    '<td class="separator">&nbsp;</td>' +
                    '<td>' + meridianTemplate + '</td>'
                    : '') +
                '</tr>' +
                '<tr>' +
                '<td><a href="#" data-action="decrementHour"><span class="' + this.icons.down + '"></span></a></td>' +
                '<td class="separator"></td>' +
                '<td><a href="#" data-action="decrementMinute"><span class="' + this.icons.down + '"></span></a></td>' +
                (this.showSeconds ?
                    '<td class="separator">&nbsp;</td>' +
                    '<td><a href="#" data-action="decrementSecond"><span class="' + this.icons.down + '"></span></a></td>'
                    : '') +
                (this.showMeridian ?
                    '<td class="separator">&nbsp;</td>' +
                    '<td><a href="#" data-action="toggleMeridian"><span class="' + this.icons.down + '"></span></a></td>'
                    : '') +
                '</tr>' +
                '</table>';

            switch (this.template) {
                case 'modal':
                    template = '<div class="bootstrap-timepicker-widget modal hide fade in" data-backdrop="' + (this.modalBackdrop ? 'true' : 'false') + '">' +
                        '<div class="modal-header">' +
                        '<a href="#" class="close" data-dismiss="modal">&times;</a>' +
                        '<h3>Pick a Time</h3>' +
                        '</div>' +
                        '<div class="modal-content">' +
                        templateContent +
                        '</div>' +
                        '<div class="modal-footer">' +
                        '<a href="#" class="btn btn-primary" data-dismiss="modal">OK</a>' +
                        '</div>' +
                        '</div>';
                    break;
                case 'dropdown':
                    template = '<div class="bootstrap-timepicker-widget dropdown-menu">' + templateContent + '</div>';
                    break;
            }

            return template;
        },

        getTime: function () {
            if (this.hour === '') {
                return '';
            }

            return this.hour + ':' + (this.minute.toString().length === 1 ? '0' + this.minute : this.minute) + (this.showSeconds ? ':' + (this.second.toString().length === 1 ? '0' + this.second : this.second) : '') + (this.showMeridian ? ' ' + this.meridian : '');
        },

        hideWidget: function () {
            if (this.isOpen === false) {
                return;
            }

            this.$element.trigger({
                'type': 'hide.timepicker',
                'time': {
                    'value': this.getTime(),
                    'hours': this.hour,
                    'minutes': this.minute,
                    'seconds': this.second,
                    'meridian': this.meridian
                }
            });

            if (this.template === 'modal' && this.$widget.modal) {
                this.$widget.modal('hide');
            } else {
                this.$widget.removeClass('open');
            }

            $(document).off('mousedown.timepicker, touchend.timepicker', this.handleDocumentClick);

            this.isOpen = false;
            // show/hide approach taken by datepicker
            this.$widget.detach();
        },

        highlightUnit: function () {
            this.position = this.getCursorPosition();
            if (this.position >= 0 && this.position <= 2) {
                this.highlightHour();
            } else if (this.position >= 3 && this.position <= 5) {
                this.highlightMinute();
            } else if (this.position >= 6 && this.position <= 8) {
                if (this.showSeconds) {
                    this.highlightSecond();
                } else {
                    this.highlightMeridian();
                }
            } else if (this.position >= 9 && this.position <= 11) {
                this.highlightMeridian();
            }
        },

        highlightNextUnit: function () {
            switch (this.highlightedUnit) {
                case 'hour':
                    this.highlightMinute();
                    break;
                case 'minute':
                    if (this.showSeconds) {
                        this.highlightSecond();
                    } else if (this.showMeridian) {
                        this.highlightMeridian();
                    } else {
                        this.highlightHour();
                    }
                    break;
                case 'second':
                    if (this.showMeridian) {
                        this.highlightMeridian();
                    } else {
                        this.highlightHour();
                    }
                    break;
                case 'meridian':
                    this.highlightHour();
                    break;
            }
        },

        highlightPrevUnit: function () {
            switch (this.highlightedUnit) {
                case 'hour':
                    if (this.showMeridian) {
                        this.highlightMeridian();
                    } else if (this.showSeconds) {
                        this.highlightSecond();
                    } else {
                        this.highlightMinute();
                    }
                    break;
                case 'minute':
                    this.highlightHour();
                    break;
                case 'second':
                    this.highlightMinute();
                    break;
                case 'meridian':
                    if (this.showSeconds) {
                        this.highlightSecond();
                    } else {
                        this.highlightMinute();
                    }
                    break;
            }
        },

        highlightHour: function () {
            var $element = this.$element.get(0),
                self = this;

            this.highlightedUnit = 'hour';

            if ($element.setSelectionRange) {
                setTimeout(function () {
                    if (self.hour < 10) {
                        $element.setSelectionRange(0, 1);
                    } else {
                        $element.setSelectionRange(0, 2);
                    }
                }, 0);
            }
        },

        highlightMinute: function () {
            var $element = this.$element.get(0),
                self = this;

            this.highlightedUnit = 'minute';

            if ($element.setSelectionRange) {
                setTimeout(function () {
                    if (self.hour < 10) {
                        $element.setSelectionRange(2, 4);
                    } else {
                        $element.setSelectionRange(3, 5);
                    }
                }, 0);
            }
        },

        highlightSecond: function () {
            var $element = this.$element.get(0),
                self = this;

            this.highlightedUnit = 'second';

            if ($element.setSelectionRange) {
                setTimeout(function () {
                    if (self.hour < 10) {
                        $element.setSelectionRange(5, 7);
                    } else {
                        $element.setSelectionRange(6, 8);
                    }
                }, 0);
            }
        },

        highlightMeridian: function () {
            var $element = this.$element.get(0),
                self = this;

            this.highlightedUnit = 'meridian';

            if ($element.setSelectionRange) {
                if (this.showSeconds) {
                    setTimeout(function () {
                        if (self.hour < 10) {
                            $element.setSelectionRange(8, 10);
                        } else {
                            $element.setSelectionRange(9, 11);
                        }
                    }, 0);
                } else {
                    setTimeout(function () {
                        if (self.hour < 10) {
                            $element.setSelectionRange(5, 7);
                        } else {
                            $element.setSelectionRange(6, 8);
                        }
                    }, 0);
                }
            }
        },

        incrementHour: function () {
            if (this.showMeridian) {
                if (this.hour === 11) {
                    this.hour++;
                    return this.toggleMeridian();
                } else if (this.hour === 12) {
                    this.hour = 0;
                }
            }
            if (this.hour === this.maxHours - 1) {
                this.hour = 0;

                return;
            }
            this.hour++;
        },

        incrementMinute: function (step) {
            var newVal;

            if (step) {
                newVal = this.minute + step;
            } else {
                newVal = this.minute + this.minuteStep - (this.minute % this.minuteStep);
            }

            if (newVal > 59) {
                this.incrementHour();
                this.minute = newVal - 60;
            } else {
                this.minute = newVal;
            }
        },

        incrementSecond: function () {
            var newVal = this.second + this.secondStep - (this.second % this.secondStep);

            if (newVal > 59) {
                this.incrementMinute(true);
                this.second = newVal - 60;
            } else {
                this.second = newVal;
            }
        },

        mousewheel: function (e) {
            if (this.disableMousewheel) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail,
                scrollTo = null;

            if (e.type === 'mousewheel') {
                scrollTo = (e.originalEvent.wheelDelta * -1);
            }
            else if (e.type === 'DOMMouseScroll') {
                scrollTo = 40 * e.originalEvent.detail;
            }

            if (scrollTo) {
                e.preventDefault();
                $(this).scrollTop(scrollTo + $(this).scrollTop());
            }

            switch (this.highlightedUnit) {
                case 'minute':
                    if (delta > 0) {
                        this.incrementMinute();
                    } else {
                        this.decrementMinute();
                    }
                    this.highlightMinute();
                    break;
                case 'second':
                    if (delta > 0) {
                        this.incrementSecond();
                    } else {
                        this.decrementSecond();
                    }
                    this.highlightSecond();
                    break;
                case 'meridian':
                    this.toggleMeridian();
                    this.highlightMeridian();
                    break;
                default:
                    if (delta > 0) {
                        this.incrementHour();
                    } else {
                        this.decrementHour();
                    }
                    this.highlightHour();
                    break;
            }

            return false;
        },

        /**
         * Given a segment value like 43, will round and snap the segment
         * to the nearest "step", like 45 if step is 15. Segment will
         * "overflow" to 0 if it's larger than 59 or would otherwise
         * round up to 60.
         */
        changeToNearestStep: function (segment, step) {
            if (segment % step === 0) {
                return segment;
            }
            if (Math.round((segment % step) / step)) {
                return (segment + (step - segment % step)) % 60;
            } else {
                return segment - segment % step;
            }
        },

        // This method was adapted from bootstrap-datepicker.
        place: function () {
            if (this.isInline) {
                return;
            }
            var widgetWidth = this.$widget.outerWidth(), widgetHeight = this.$widget.outerHeight(), visualPadding = 10, windowWidth =
                $(window).width(), windowHeight = $(window).height(), scrollTop = $(window).scrollTop();

            var zIndex = parseInt(this.$element.parents().filter(function () { return $(this).css('z-index') !== 'auto'; }).first().css('z-index'), 10) + 10;
            var offset = this.component ? this.component.parent().offset() : this.$element.offset();
            var height = this.component ? this.component.outerHeight(true) : this.$element.outerHeight(false);
            var width = this.component ? this.component.outerWidth(true) : this.$element.outerWidth(false);
            var left = offset.left, top = offset.top;

            this.$widget.removeClass('timepicker-orient-top timepicker-orient-bottom timepicker-orient-right timepicker-orient-left');

            if (this.orientation.x !== 'auto') {
                this.$widget.addClass('timepicker-orient-' + this.orientation.x);
                if (this.orientation.x === 'right') {
                    left -= widgetWidth - width;
                }
            } else {
                // auto x orientation is best-placement: if it crosses a window edge, fudge it sideways
                // Default to left
                this.$widget.addClass('timepicker-orient-left');
                if (offset.left < 0) {
                    left -= offset.left - visualPadding;
                } else if (offset.left + widgetWidth > windowWidth) {
                    left = windowWidth - widgetWidth - visualPadding;
                }
            }
            // auto y orientation is best-situation: top or bottom, no fudging, decision based on which shows more of the widget
            var yorient = this.orientation.y, topOverflow, bottomOverflow;
            if (yorient === 'auto') {
                topOverflow = -scrollTop + offset.top - widgetHeight;
                bottomOverflow = scrollTop + windowHeight - (offset.top + height + widgetHeight);
                if (Math.max(topOverflow, bottomOverflow) === bottomOverflow) {
                    yorient = 'top';
                } else {
                    yorient = 'bottom';
                }
            }
            this.$widget.addClass('timepicker-orient-' + yorient);
            if (yorient === 'top') {
                top += height;
            } else {
                top -= widgetHeight + parseInt(this.$widget.css('padding-top'), 10);
            }

            this.$widget.css({
                top: top,
                left: left,
                zIndex: zIndex
            });
        },

        remove: function () {
            $('document').off('.timepicker');
            if (this.$widget) {
                this.$widget.remove();
            }
            delete this.$element.data().timepicker;
        },

        setDefaultTime: function (defaultTime) {
            if (!this.$element.val()) {
                if (defaultTime === 'current') {
                    var dTime = new Date(),
                        hours = dTime.getHours(),
                        minutes = dTime.getMinutes(),
                        seconds = dTime.getSeconds(),
                        meridian = 'AM';

                    if (seconds !== 0) {
                        seconds = Math.ceil(dTime.getSeconds() / this.secondStep) * this.secondStep;
                        if (seconds === 60) {
                            minutes += 1;
                            seconds = 0;
                        }
                    }

                    if (minutes !== 0) {
                        minutes = Math.ceil(dTime.getMinutes() / this.minuteStep) * this.minuteStep;
                        if (minutes === 60) {
                            hours += 1;
                            minutes = 0;
                        }
                    }

                    if (this.showMeridian) {
                        if (hours === 0) {
                            hours = 12;
                        } else if (hours >= 12) {
                            if (hours > 12) {
                                hours = hours - 12;
                            }
                            meridian = 'PM';
                        } else {
                            meridian = 'AM';
                        }
                    }

                    this.hour = hours;
                    this.minute = minutes;
                    this.second = seconds;
                    this.meridian = meridian;

                    this.update();

                } else if (defaultTime === false) {
                    this.hour = 0;
                    this.minute = 0;
                    this.second = 0;
                    this.meridian = 'AM';
                } else {
                    this.setTime(defaultTime);
                }
            } else {
                this.updateFromElementVal();
            }
        },

        setTime: function (time, ignoreWidget) {
            if (!time) {
                this.clear();
                return;
            }

            var timeMode,
                timeArray,
                hour,
                minute,
                second,
                meridian;

            if (typeof time === 'object' && time.getMonth) {
                // this is a date object
                hour = time.getHours();
                minute = time.getMinutes();
                second = time.getSeconds();

                if (this.showMeridian) {
                    meridian = 'AM';
                    if (hour > 12) {
                        meridian = 'PM';
                        hour = hour % 12;
                    }

                    if (hour === 12) {
                        meridian = 'PM';
                    }
                }
            } else {
                timeMode = ((/a/i).test(time) ? 1 : 0) + ((/p/i).test(time) ? 2 : 0); // 0 = none, 1 = AM, 2 = PM, 3 = BOTH.
                if (timeMode > 2) { // If both are present, fail.
                    this.clear();
                    return;
                }

                timeArray = time.replace(/[^0-9\:]/g, '').split(':');

                hour = timeArray[0] ? timeArray[0].toString() : timeArray.toString();

                if (this.explicitMode && hour.length > 2 && (hour.length % 2) !== 0) {
                    this.clear();
                    return;
                }

                minute = timeArray[1] ? timeArray[1].toString() : '';
                second = timeArray[2] ? timeArray[2].toString() : '';

                // adaptive time parsing
                if (hour.length > 4) {
                    second = hour.slice(-2);
                    hour = hour.slice(0, -2);
                }

                if (hour.length > 2) {
                    minute = hour.slice(-2);
                    hour = hour.slice(0, -2);
                }

                if (minute.length > 2) {
                    second = minute.slice(-2);
                    minute = minute.slice(0, -2);
                }

                hour = parseInt(hour, 10);
                minute = parseInt(minute, 10);
                second = parseInt(second, 10);

                if (isNaN(hour)) {
                    hour = 0;
                }
                if (isNaN(minute)) {
                    minute = 0;
                }
                if (isNaN(second)) {
                    second = 0;
                }

                // Adjust the time based upon unit boundary.
                // NOTE: Negatives will never occur due to time.replace() above.
                if (second > 59) {
                    second = 59;
                }

                if (minute > 59) {
                    minute = 59;
                }

                if (hour >= this.maxHours) {
                    // No day/date handling.
                    hour = this.maxHours - 1;
                }

                if (this.showMeridian) {
                    if (hour > 12) {
                        // Force PM.
                        timeMode = 2;
                        hour -= 12;
                    }
                    if (!timeMode) {
                        timeMode = 1;
                    }
                    if (hour === 0) {
                        hour = 12; // AM or PM, reset to 12.  0 AM = 12 AM.  0 PM = 12 PM, etc.
                    }
                    meridian = timeMode === 1 ? 'AM' : 'PM';
                } else if (hour < 12 && timeMode === 2) {
                    hour += 12;
                } else {
                    if (hour >= this.maxHours) {
                        hour = this.maxHours - 1;
                    } else if ((hour < 0) || (hour === 12 && timeMode === 1)) {
                        hour = 0;
                    }
                }
            }

            this.hour = hour;
            if (this.snapToStep) {
                this.minute = this.changeToNearestStep(minute, this.minuteStep);
                this.second = this.changeToNearestStep(second, this.secondStep);
            } else {
                this.minute = minute;
                this.second = second;
            }
            this.meridian = meridian;

            this.update(ignoreWidget);
        },

        showWidget: function () {
            if (this.isOpen) {
                return;
            }

            if (this.$element.is(':disabled')) {
                return;
            }

            // show/hide approach taken by datepicker
            this.$widget.appendTo(this.appendWidgetTo);
            $(document).on('mousedown.timepicker, touchend.timepicker', { scope: this }, this.handleDocumentClick);

            this.$element.trigger({
                'type': 'show.timepicker',
                'time': {
                    'value': this.getTime(),
                    'hours': this.hour,
                    'minutes': this.minute,
                    'seconds': this.second,
                    'meridian': this.meridian
                }
            });

            this.place();
            if (this.disableFocus) {
                this.$element.blur();
            }

            // widget shouldn't be empty on open
            if (this.hour === '') {
                if (this.defaultTime) {
                    this.setDefaultTime(this.defaultTime);
                } else {
                    this.setTime('0:0:0');
                }
            }

            if (this.template === 'modal' && this.$widget.modal) {
                this.$widget.modal('show').on('hidden', $.proxy(this.hideWidget, this));
            } else {
                if (this.isOpen === false) {
                    this.$widget.addClass('open');
                }
            }

            this.isOpen = true;
        },

        toggleMeridian: function () {
            this.meridian = this.meridian === 'AM' ? 'PM' : 'AM';
        },

        update: function (ignoreWidget) {
            this.updateElement();
            if (!ignoreWidget) {
                this.updateWidget();
            }

            this.$element.trigger({
                'type': 'changeTime.timepicker',
                'time': {
                    'value': this.getTime(),
                    'hours': this.hour,
                    'minutes': this.minute,
                    'seconds': this.second,
                    'meridian': this.meridian
                }
            });
        },

        updateElement: function () {
            this.$element.val(this.getTime()).change();
        },

        updateFromElementVal: function () {
            this.setTime(this.$element.val());
        },

        updateWidget: function () {
            if (this.$widget === false) {
                return;
            }

            var hour = this.hour,
                minute = this.minute.toString().length === 1 ? '0' + this.minute : this.minute,
                second = this.second.toString().length === 1 ? '0' + this.second : this.second;

            if (this.showInputs) {
                this.$widget.find('input.bootstrap-timepicker-hour').val(hour);
                this.$widget.find('input.bootstrap-timepicker-minute').val(minute);

                if (this.showSeconds) {
                    this.$widget.find('input.bootstrap-timepicker-second').val(second);
                }
                if (this.showMeridian) {
                    this.$widget.find('input.bootstrap-timepicker-meridian').val(this.meridian);
                }
            } else {
                this.$widget.find('span.bootstrap-timepicker-hour').text(hour);
                this.$widget.find('span.bootstrap-timepicker-minute').text(minute);

                if (this.showSeconds) {
                    this.$widget.find('span.bootstrap-timepicker-second').text(second);
                }
                if (this.showMeridian) {
                    this.$widget.find('span.bootstrap-timepicker-meridian').text(this.meridian);
                }
            }
        },

        updateFromWidgetInputs: function () {
            if (this.$widget === false) {
                return;
            }

            var t = this.$widget.find('input.bootstrap-timepicker-hour').val() + ':' +
                this.$widget.find('input.bootstrap-timepicker-minute').val() +
                (this.showSeconds ? ':' + this.$widget.find('input.bootstrap-timepicker-second').val() : '') +
                (this.showMeridian ? this.$widget.find('input.bootstrap-timepicker-meridian').val() : '')
            ;

            this.setTime(t, true);
        },

        widgetClick: function (e) {
            e.stopPropagation();
            e.preventDefault();

            var $input = $(e.target),
                action = $input.closest('a').data('action');

            if (action) {
                this[action]();
            }
            this.update();

            if ($input.is('input')) {
                $input.get(0).setSelectionRange(0, 2);
            }
        },

        widgetKeydown: function (e) {
            var $input = $(e.target),
                name = $input.attr('class').replace('bootstrap-timepicker-', '');

            switch (e.which) {
                case 9: //tab
                    if (e.shiftKey) {
                        if (name === 'hour') {
                            return this.hideWidget();
                        }
                    } else if ((this.showMeridian && name === 'meridian') || (this.showSeconds && name === 'second') || (!this.showMeridian && !this.showSeconds && name === 'minute')) {
                        return this.hideWidget();
                    }
                    break;
                case 27: // escape
                    this.hideWidget();
                    break;
                case 38: // up arrow
                    e.preventDefault();
                    switch (name) {
                        case 'hour':
                            this.incrementHour();
                            break;
                        case 'minute':
                            this.incrementMinute();
                            break;
                        case 'second':
                            this.incrementSecond();
                            break;
                        case 'meridian':
                            this.toggleMeridian();
                            break;
                    }
                    this.setTime(this.getTime());
                    $input.get(0).setSelectionRange(0, 2);
                    break;
                case 40: // down arrow
                    e.preventDefault();
                    switch (name) {
                        case 'hour':
                            this.decrementHour();
                            break;
                        case 'minute':
                            this.decrementMinute();
                            break;
                        case 'second':
                            this.decrementSecond();
                            break;
                        case 'meridian':
                            this.toggleMeridian();
                            break;
                    }
                    this.setTime(this.getTime());
                    $input.get(0).setSelectionRange(0, 2);
                    break;
            }
        },

        widgetKeyup: function (e) {
            if ((e.which === 65) || (e.which === 77) || (e.which === 80) || (e.which === 46) || (e.which === 8) || (e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105)) {
                this.updateFromWidgetInputs();
            }
        }
    };

    //TIMEPICKER PLUGIN DEFINITION
    $.fn.timepicker = function (option) {
        var args = Array.apply(null, arguments);
        args.shift();
        return this.each(function () {
            var $this = $(this),
                data = $this.data('timepicker'),
                options = typeof option === 'object' && option;

            if (!data) {
                $this.data('timepicker', (data = new Timepicker(this, $.extend({}, $.fn.timepicker.defaults, options, $(this).data()))));
            }

            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    };

    $.fn.timepicker.defaults = {
        defaultTime: 'current',
        disableFocus: false,
        disableMousewheel: false,
        isOpen: false,
        minuteStep: 15,
        modalBackdrop: false,
        orientation: { x: 'auto', y: 'auto' },
        secondStep: 15,
        snapToStep: false,
        showSeconds: false,
        showInputs: true,
        showMeridian: true,
        template: 'dropdown',
        appendWidgetTo: 'body',
        showWidgetOnAddonClick: true,
        icons: {
            up: 'glyphicon glyphicon-chevron-up',
            down: 'glyphicon glyphicon-chevron-down'
        },
        maxHours: 24,
        explicitMode: false
    };

    $.fn.timepicker.Constructor = Timepicker;

    $(document).on(
        'focus.timepicker.data-api click.timepicker.data-api',
        '[data-provide="timepicker"]',
        function (e) {
            var $this = $(this);
            if ($this.data('timepicker')) {
                return;
            }
            e.preventDefault();
            // component click requires us to explicitly show it
            $this.timepicker();
        }
    );

}(jQuery, window, document);


/* ========================================================================
 * Bootstrap: lanaiui.js  v2.0.0.0
 * https://gitee.com/lvzhig/Lanai-ui
 * ========================================================================
 * Copyright 2013-2018 Twitter Bootstrap
 * Licensed under MIT (https://gitee.com/lvzhig/Lanai-ui/LICENSE)
 * ======================================================================== */
/* Layout()
 * ========
 * Implements Lanai layout.
 * Fixes the layout height in case min-height fails.
 *
 * @usage activated automatically upon window load.
 *        Configure any options by passing data-option="value"
 *        to the body tag.
 */
+function ($) {
    'use strict'

    var DataKey = 'lte.layout'

    var Default = {
        slimscroll : true,
        resetHeight: true
    }

    var Selector = {
        wrapper       : '.wrapper',
        contentWrapper: '.content-wrapper',
        layoutBoxed   : '.layout-boxed',
        mainFooter    : '.main-footer',
        mainHeader    : '.main-header',
        sidebar       : '.sidebar',
        controlSidebar: '.control-sidebar',
        fixed         : '.fixed',
        sidebarMenu   : '.sidebar-menu',
        logo          : '.main-header .logo'
    }

    var ClassName = {
        fixed         : 'fixed',
        holdTransition: 'hold-transition'
    }

    var Layout = function (options) {
        this.options      = options
        this.bindedResize = false
        this.activate()
    }

    Layout.prototype.activate = function () {
        this.fix()
        this.fixSidebar()

        $('body').removeClass(ClassName.holdTransition)

        if (this.options.resetHeight) {
            $('body, html, ' + Selector.wrapper).css({
                'height'    : 'auto',
                'min-height': '100%'
            })
        }

        if (!this.bindedResize) {
            $(window).resize(function () {
                this.fix()
                this.fixSidebar()

                $(Selector.logo + ', ' + Selector.sidebar).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                    this.fix()
                    this.fixSidebar()
                }.bind(this))
            }.bind(this))

            this.bindedResize = true
        }

        $(Selector.sidebarMenu).on('expanded.tree', function () {
            this.fix()
            this.fixSidebar()
        }.bind(this))

        $(Selector.sidebarMenu).on('collapsed.tree', function () {
            this.fix()
            this.fixSidebar()
        }.bind(this))
    }

    Layout.prototype.fix = function () {
        // Remove overflow from .wrapper if layout-boxed exists
        $(Selector.layoutBoxed + ' > ' + Selector.wrapper).css('overflow', 'hidden')

        // Get window height and the wrapper height
        var footerHeight  = $(Selector.mainFooter).outerHeight() || 0
        var neg           = $(Selector.mainHeader).outerHeight() + footerHeight
        var windowHeight  = $(window).height()
        var sidebarHeight = $(Selector.sidebar).height() || 0

        // Set the min-height of the content and sidebar based on
        // the height of the document.
        if ($('body').hasClass(ClassName.fixed)) {
            $(Selector.contentWrapper).css('min-height', windowHeight - footerHeight)
        } else {
            var postSetHeight

            if (windowHeight >= sidebarHeight) {
                $(Selector.contentWrapper).css('min-height', windowHeight - neg)
                postSetHeight = windowHeight - neg
            } else {
                $(Selector.contentWrapper).css('min-height', sidebarHeight)
                postSetHeight = sidebarHeight
            }

            // Fix for the control sidebar height
            var $controlSidebar = $(Selector.controlSidebar)
            if (typeof $controlSidebar !== 'undefined') {
                if ($controlSidebar.height() > postSetHeight)
                    $(Selector.contentWrapper).css('min-height', $controlSidebar.height())
            }
        }
    }

    Layout.prototype.fixSidebar = function () {
        // Make sure the body tag has the .fixed class
        if (!$('body').hasClass(ClassName.fixed)) {
            if (typeof $.fn.slimScroll !== 'undefined') {
                $(Selector.sidebar).slimScroll({ destroy: true }).height('auto')
            }
            return
        }

        // Enable slimscroll for fixed layout
        if (this.options.slimscroll) {
            if (typeof $.fn.slimScroll !== 'undefined') {
                // Destroy if it exists
                $(Selector.sidebar).slimScroll({ destroy: true }).height('auto')

                // Add slimscroll
                $(Selector.sidebar).slimScroll({
                    height: ($(window).height() - $(Selector.mainHeader).height()) + 'px',
                    color : 'rgba(0,0,0,0.2)',
                    size  : '3px'
                })
            }
        }
    }

    // Plugin Definition
    // =================
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data(DataKey)

            if (!data) {
                var options = $.extend({}, Default, $this.data(), typeof option === 'object' && option)
                $this.data(DataKey, (data = new Layout(options)))
            }

            if (typeof option === 'string') {
                if (typeof data[option] === 'undefined') {
                    throw new Error('No method named ' + option)
                }
                data[option]()
            }
        })
    }

    var old = $.fn.layout

    $.fn.layout            = Plugin
    $.fn.layout.Constuctor = Layout

    // No conflict mode
    // ================
    $.fn.layout.noConflict = function () {
        $.fn.layout = old
        return this
    }

    // Layout DATA-API
    // ===============
    $(window).on('load', function () {
        Plugin.call($('body'))
    })
}(jQuery)


/* PushMenu()
 * ==========
 * Adds the push menu functionality to the sidebar.
 *
 * @usage: $('.btn').pushMenu(options)
 *          or add [data-toggle="push-menu"] to any button
 *          Pass any option as data-option="value"
 */
+function ($) {
    'use strict'

    var DataKey = 'lte.pushmenu'

    var Default = {
        collapseScreenSize   : 767,
        expandOnHover        : false,
        expandTransitionDelay: 200
    }

    var Selector = {
        collapsed     : '.sidebar-collapse',
        open          : '.sidebar-open',
        mainSidebar   : '.main-sidebar',
        contentWrapper: '.content-wrapper',
        searchInput   : '.sidebar-form .form-control',
        button        : '[data-toggle="push-menu"]',
        mini          : '.sidebar-mini',
        expanded      : '.sidebar-expanded-on-hover',
        layoutFixed   : '.fixed'
    }

    var ClassName = {
        collapsed    : 'sidebar-collapse',
        open         : 'sidebar-open',
        mini         : 'sidebar-mini',
        expanded     : 'sidebar-expanded-on-hover',
        expandFeature: 'sidebar-mini-expand-feature',
        layoutFixed  : 'fixed'
    }

    var Event = {
        expanded : 'expanded.pushMenu',
        collapsed: 'collapsed.pushMenu'
    }

    // PushMenu Class Definition
    // =========================
    var PushMenu = function (options) {
        this.options = options
        this.init()
    }

    PushMenu.prototype.init = function () {
        if (this.options.expandOnHover
            || ($('body').is(Selector.mini + Selector.layoutFixed))) {
            this.expandOnHover()
            $('body').addClass(ClassName.expandFeature)
        }

        $(Selector.contentWrapper).click(function () {
            // Enable hide menu when clicking on the content-wrapper on small screens
            if ($(window).width() <= this.options.collapseScreenSize && $('body').hasClass(ClassName.open)) {
                this.close()
            }
        }.bind(this))

        // __Fix for android devices
        $(Selector.searchInput).click(function (e) {
            e.stopPropagation()
        })
    }

    PushMenu.prototype.toggle = function () {
        var windowWidth = $(window).width()
        var isOpen      = !$('body').hasClass(ClassName.collapsed)

        if (windowWidth <= this.options.collapseScreenSize) {
            isOpen = $('body').hasClass(ClassName.open)
        }

        if (!isOpen) {
            this.open()
        } else {
            this.close()
        }
    }

    PushMenu.prototype.open = function () {
        var windowWidth = $(window).width()

        if (windowWidth > this.options.collapseScreenSize) {
            $('body').removeClass(ClassName.collapsed)
                .trigger($.Event(Event.expanded))
        }
        else {
            $('body').addClass(ClassName.open)
                .trigger($.Event(Event.expanded))
        }
    }

    PushMenu.prototype.close = function () {
        var windowWidth = $(window).width()
        if (windowWidth > this.options.collapseScreenSize) {
            $('body').addClass(ClassName.collapsed)
                .trigger($.Event(Event.collapsed))
        } else {
            $('body').removeClass(ClassName.open + ' ' + ClassName.collapsed)
                .trigger($.Event(Event.collapsed))
        }
    }

    PushMenu.prototype.expandOnHover = function () {
        $(Selector.mainSidebar).hover(function () {
            if ($('body').is(Selector.mini + Selector.collapsed)
                && $(window).width() > this.options.collapseScreenSize) {
                this.expand()
            }
        }.bind(this), function () {
            if ($('body').is(Selector.expanded)) {
                this.collapse()
            }
        }.bind(this))
    }

    PushMenu.prototype.expand = function () {
        setTimeout(function () {
            $('body').removeClass(ClassName.collapsed)
                .addClass(ClassName.expanded)
        }, this.options.expandTransitionDelay)
    }

    PushMenu.prototype.collapse = function () {
        setTimeout(function () {
            $('body').removeClass(ClassName.expanded)
                .addClass(ClassName.collapsed)
        }, this.options.expandTransitionDelay)
    }

    // PushMenu Plugin Definition
    // ==========================
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data(DataKey)

            if (!data) {
                var options = $.extend({}, Default, $this.data(), typeof option == 'object' && option)
                $this.data(DataKey, (data = new PushMenu(options)))
            }

            if (option == 'toggle') data.toggle()
        })
    }

    var old = $.fn.pushMenu

    $.fn.pushMenu             = Plugin
    $.fn.pushMenu.Constructor = PushMenu

    // No Conflict Mode
    // ================
    $.fn.pushMenu.noConflict = function () {
        $.fn.pushMenu = old
        return this
    }

    // Data API
    // ========
    $(document).on('click', Selector.button, function (e) {
        e.preventDefault()
        Plugin.call($(this), 'toggle')
    })
    $(window).on('load', function () {
        Plugin.call($(Selector.button))
    })
}(jQuery)


/* Tree()
 * ======
 * Converts a nested list into a multilevel
 * tree view menu.
 *
 * @Usage: $('.my-menu').tree(options)
 *         or add [data-widget="tree"] to the ul element
 *         Pass any option as data-option="value"
 */
+function ($) {
    'use strict'

    var DataKey = 'lte.tree'

    var Default = {
        animationSpeed: 500,
        accordion     : true,
        followLink    : false,
        trigger       : '.treeview a'
    }

    var Selector = {
        tree        : '.tree',
        treeview    : '.treeview',
        treeviewMenu: '.treeview-menu',
        open        : '.menu-open, .active',
        li          : 'li',
        data        : '[data-widget="tree"]',
        active      : '.active'
    }

    var ClassName = {
        open: 'menu-open',
        tree: 'tree',
        active:'active'
    }

    var Event = {
        collapsed: 'collapsed.tree',
        expanded : 'expanded.tree'
    }

    // Tree Class Definition
    // =====================
    var Tree = function (element, options) {
        this.element = element
        this.options = options

        $(this.element).addClass(ClassName.tree)

        $(Selector.treeview + Selector.active, this.element).addClass(ClassName.open)

        this._setUpListeners()
    }

    Tree.prototype.toggle = function (link, event) {
        var treeviewMenu = link.next(Selector.treeviewMenu)
        var parentLi     = link.parent()
        var isOpen       = parentLi.hasClass(ClassName.open)

        if (!parentLi.is(Selector.treeview)) {
            return
        }

        if (!this.options.followLink || link.attr('href') == '#') {
            event.preventDefault()
        }

        if (isOpen) {
            this.collapse(treeviewMenu, parentLi)
        } else {
            this.expand(treeviewMenu, parentLi)
        }
    }

    Tree.prototype.expand = function (tree, parent) {
        var expandedEvent = $.Event(Event.expanded)

        if (this.options.accordion) {
            var openMenuLi = parent.siblings(Selector.open)
            var openTree   = openMenuLi.children(Selector.treeviewMenu)
            this.collapse(openTree, openMenuLi)
        }

        parent.addClass(ClassName.open)
        tree.slideDown(this.options.animationSpeed, function () {
            $(this.element).trigger(expandedEvent)
        }.bind(this))
    }

    Tree.prototype.collapse = function (tree, parentLi) {
        var collapsedEvent = $.Event(Event.collapsed)

        tree.find(Selector.open).removeClass(ClassName.open)
        parentLi.removeClass(ClassName.open)
        tree.slideUp(this.options.animationSpeed, function () {
            tree.find(Selector.open + ' > ' + Selector.treeview).slideUp()
            $(this.element).trigger(collapsedEvent)
        }.bind(this))
    }

    // Private

    Tree.prototype._setUpListeners = function () {
        var that = this

        $(this.element).on('click', this.options.trigger, function (event) {
            that.toggle($(this), event)

            var parentLi = $(this).parent()
            if (parentLi.parent().is(Selector.treeviewMenu)){
                $(Selector.treeviewMenu +' > '+ Selector.li + Selector.active).removeClass(ClassName.active)
            }
            if (parentLi.parent().is(Selector.tree)){
                $(Selector.tree + ' > ' + Selector.li + Selector.active).removeClass(ClassName.active)
            }
            if (parentLi) {
                $(parentLi).addClass(ClassName.active)
            }
        })
    }

    // Plugin Definition
    // =================
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data(DataKey)

            if (!data) {
                var options = $.extend({}, Default, $this.data(), typeof option == 'object' && option)
                $this.data(DataKey, new Tree($this, options))
            }
        })
    }

    var old = $.fn.tree

    $.fn.tree             = Plugin
    $.fn.tree.Constructor = Tree

    // No Conflict Mode
    // ================
    $.fn.tree.noConflict = function () {
        $.fn.tree = old
        return this
    }

    // Tree Data API
    // =============
    $(window).on('load', function () {
        $(Selector.data).each(function () {
            Plugin.call($(this))
        })
    })

}(jQuery)

/* =========================================================
 * bootstrap-treeview.js v1.2.0
 * =========================================================
 * Copyright 2013 Jonathan Miles
 * Project URL : http://www.jondmiles.com/bootstrap-treeview
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

+ function ($, window, document, undefined) {

    /*global jQuery, console*/

    'use strict';

    var pluginName = 'treeview';

    var _default = {};

    _default.settings = {

        injectStyle: true,

        levels: 2,

        expandIcon: 'glyphicon glyphicon-plus',
        collapseIcon: 'glyphicon glyphicon-minus',
        emptyIcon: 'glyphicon',
        nodeIcon: '',
        selectedIcon: '',
        checkedIcon: 'glyphicon glyphicon-check',
        uncheckedIcon: 'glyphicon glyphicon-unchecked',

        color: undefined, // '#000000',
        backColor: undefined, // '#FFFFFF',
        borderColor: undefined, // '#dddddd',
        onhoverColor: '#F5F5F5',
        selectedColor: '#FFFFFF',
        selectedBackColor: '#428bca',
        searchResultColor: '#D9534F',
        searchResultBackColor: undefined, //'#FFFFFF',

        enableLinks: false,
        highlightSelected: true,
        highlightSearchResults: true,
        showBorder: true,
        showIcon: true,
        showCheckbox: false,
        showTags: false,
        multiSelect: false,

        // Event handlers
        onNodeChecked: undefined,
        onNodeCollapsed: undefined,
        onNodeDisabled: undefined,
        onNodeEnabled: undefined,
        onNodeExpanded: undefined,
        onNodeSelected: undefined,
        onNodeUnchecked: undefined,
        onNodeUnselected: undefined,
        onSearchComplete: undefined,
        onSearchCleared: undefined
    };

    _default.options = {
        silent: false,
        ignoreChildren: false
    };

    _default.searchOptions = {
        ignoreCase: true,
        exactMatch: false,
        revealResults: true
    };

    var Tree = function (element, options) {

        this.$element = $(element);
        this.elementId = element.id;
        this.styleId = this.elementId + '-style';

        this.init(options);

        return {

            // Options (public access)
            options: this.options,

            // Initialize / destroy methods
            init: $.proxy(this.init, this),
            remove: $.proxy(this.remove, this),

            // Get methods
            getNode: $.proxy(this.getNode, this),
            getParent: $.proxy(this.getParent, this),
            getSiblings: $.proxy(this.getSiblings, this),
            getSelected: $.proxy(this.getSelected, this),
            getUnselected: $.proxy(this.getUnselected, this),
            getExpanded: $.proxy(this.getExpanded, this),
            getCollapsed: $.proxy(this.getCollapsed, this),
            getChecked: $.proxy(this.getChecked, this),
            getUnchecked: $.proxy(this.getUnchecked, this),
            getDisabled: $.proxy(this.getDisabled, this),
            getEnabled: $.proxy(this.getEnabled, this),

            // Select methods
            selectNode: $.proxy(this.selectNode, this),
            unselectNode: $.proxy(this.unselectNode, this),
            toggleNodeSelected: $.proxy(this.toggleNodeSelected, this),

            // Expand / collapse methods
            collapseAll: $.proxy(this.collapseAll, this),
            collapseNode: $.proxy(this.collapseNode, this),
            expandAll: $.proxy(this.expandAll, this),
            expandNode: $.proxy(this.expandNode, this),
            toggleNodeExpanded: $.proxy(this.toggleNodeExpanded, this),
            revealNode: $.proxy(this.revealNode, this),

            // Expand / collapse methods
            checkAll: $.proxy(this.checkAll, this),
            checkNode: $.proxy(this.checkNode, this),
            uncheckAll: $.proxy(this.uncheckAll, this),
            uncheckNode: $.proxy(this.uncheckNode, this),
            toggleNodeChecked: $.proxy(this.toggleNodeChecked, this),

            // Disable / enable methods
            disableAll: $.proxy(this.disableAll, this),
            disableNode: $.proxy(this.disableNode, this),
            enableAll: $.proxy(this.enableAll, this),
            enableNode: $.proxy(this.enableNode, this),
            toggleNodeDisabled: $.proxy(this.toggleNodeDisabled, this),

            // Search methods
            search: $.proxy(this.search, this),
            clearSearch: $.proxy(this.clearSearch, this)
        };
    };

    Tree.prototype.init = function (options) {

        this.tree = [];
        this.nodes = [];

        if (options.data) {
            if (typeof options.data === 'string') {
                options.data = $.parseJSON(options.data);
            }
            this.tree = $.extend(true, [], options.data);
            delete options.data;
        }
        this.options = $.extend({}, _default.settings, options);

        this.destroy();
        this.subscribeEvents();
        this.setInitialStates({ nodes: this.tree }, 0);
        this.render();
    };

    Tree.prototype.remove = function () {
        this.destroy();
        $.removeData(this, pluginName);
        $('#' + this.styleId).remove();
    };

    Tree.prototype.destroy = function () {

        if (!this.initialized) return;

        this.$wrapper.remove();
        this.$wrapper = null;

        // Switch off events
        this.unsubscribeEvents();

        // Reset this.initialized flag
        this.initialized = false;
    };

    Tree.prototype.unsubscribeEvents = function () {

        this.$element.off('click');
        this.$element.off('nodeChecked');
        this.$element.off('nodeCollapsed');
        this.$element.off('nodeDisabled');
        this.$element.off('nodeEnabled');
        this.$element.off('nodeExpanded');
        this.$element.off('nodeSelected');
        this.$element.off('nodeUnchecked');
        this.$element.off('nodeUnselected');
        this.$element.off('searchComplete');
        this.$element.off('searchCleared');
    };

    Tree.prototype.subscribeEvents = function () {

        this.unsubscribeEvents();

        this.$element.on('click', $.proxy(this.clickHandler, this));

        if (typeof (this.options.onNodeChecked) === 'function') {
            this.$element.on('nodeChecked', this.options.onNodeChecked);
        }

        if (typeof (this.options.onNodeCollapsed) === 'function') {
            this.$element.on('nodeCollapsed', this.options.onNodeCollapsed);
        }

        if (typeof (this.options.onNodeDisabled) === 'function') {
            this.$element.on('nodeDisabled', this.options.onNodeDisabled);
        }

        if (typeof (this.options.onNodeEnabled) === 'function') {
            this.$element.on('nodeEnabled', this.options.onNodeEnabled);
        }

        if (typeof (this.options.onNodeExpanded) === 'function') {
            this.$element.on('nodeExpanded', this.options.onNodeExpanded);
        }

        if (typeof (this.options.onNodeSelected) === 'function') {
            this.$element.on('nodeSelected', this.options.onNodeSelected);
        }

        if (typeof (this.options.onNodeUnchecked) === 'function') {
            this.$element.on('nodeUnchecked', this.options.onNodeUnchecked);
        }

        if (typeof (this.options.onNodeUnselected) === 'function') {
            this.$element.on('nodeUnselected', this.options.onNodeUnselected);
        }

        if (typeof (this.options.onSearchComplete) === 'function') {
            this.$element.on('searchComplete', this.options.onSearchComplete);
        }

        if (typeof (this.options.onSearchCleared) === 'function') {
            this.$element.on('searchCleared', this.options.onSearchCleared);
        }
    };

    /*
		Recurse the tree structure and ensure all nodes have
		valid initial states.  User defined states will be preserved.
		For performance we also take this opportunity to
		index nodes in a flattened structure
	*/
    Tree.prototype.setInitialStates = function (node, level) {

        if (!node.nodes) return;
        level += 1;

        var parent = node;
        var _this = this;
        $.each(node.nodes, function checkStates(index, node) {

            // nodeId : unique, incremental identifier
            node.nodeId = _this.nodes.length;

            // parentId : transversing up the tree
            node.parentId = parent.nodeId;

            // if not provided set selectable default value
            if (!node.hasOwnProperty('selectable')) {
                node.selectable = true;
            }

            // where provided we should preserve states
            node.state = node.state || {};

            // set checked state; unless set always false
            if (!node.state.hasOwnProperty('checked')) {
                node.state.checked = false;
            }

            // set enabled state; unless set always false
            if (!node.state.hasOwnProperty('disabled')) {
                node.state.disabled = false;
            }

            // set expanded state; if not provided based on levels
            if (!node.state.hasOwnProperty('expanded')) {
                if (!node.state.disabled &&
                    (level < _this.options.levels) &&
                    (node.nodes && node.nodes.length > 0)) {
                    node.state.expanded = true;
                }
                else {
                    node.state.expanded = false;
                }
            }

            // set selected state; unless set always false
            if (!node.state.hasOwnProperty('selected')) {
                node.state.selected = false;
            }

            // index nodes in a flattened structure for use later
            _this.nodes.push(node);

            // recurse child nodes and transverse the tree
            if (node.nodes) {
                _this.setInitialStates(node, level);
            }
        });
    };

    Tree.prototype.clickHandler = function (event) {

        if (!this.options.enableLinks) event.preventDefault();

        var target = $(event.target);
        var node = this.findNode(target);
        if (!node || node.state.disabled) return;

        var classList = target.attr('class') ? target.attr('class').split(' ') : [];
        if ((classList.indexOf('expand-icon') !== -1)) {

            this.toggleExpandedState(node, _default.options);
            this.render();
        }
        else if ((classList.indexOf('check-icon') !== -1)) {

            this.toggleCheckedState(node, _default.options);
            this.render();
        }
        else {

            if (node.selectable) {
                this.toggleSelectedState(node, _default.options);
            } else {
                this.toggleExpandedState(node, _default.options);
            }

            this.render();
        }
    };

    // Looks up the DOM for the closest parent list item to retrieve the
    // data attribute nodeid, which is used to lookup the node in the flattened structure.
    Tree.prototype.findNode = function (target) {

        var nodeId = target.closest('li.list-group-item').attr('data-nodeid');
        var node = this.nodes[nodeId];

        if (!node) {
            console.log('Error: node does not exist');
        }
        return node;
    };

    Tree.prototype.toggleExpandedState = function (node, options) {
        if (!node) return;
        this.setExpandedState(node, !node.state.expanded, options);
    };

    Tree.prototype.setExpandedState = function (node, state, options) {

        if (state === node.state.expanded) return;

        if (state && node.nodes) {

            // Expand a node
            node.state.expanded = true;
            if (!options.silent) {
                this.$element.trigger('nodeExpanded', $.extend(true, {}, node));
            }
        }
        else if (!state) {

            // Collapse a node
            node.state.expanded = false;
            if (!options.silent) {
                this.$element.trigger('nodeCollapsed', $.extend(true, {}, node));
            }

            // Collapse child nodes
            if (node.nodes && !options.ignoreChildren) {
                $.each(node.nodes, $.proxy(function (index, node) {
                    this.setExpandedState(node, false, options);
                }, this));
            }
        }
    };

    Tree.prototype.toggleSelectedState = function (node, options) {
        if (!node) return;
        this.setSelectedState(node, !node.state.selected, options);
    };

    Tree.prototype.setSelectedState = function (node, state, options) {

        if (state === node.state.selected) return;

        if (state) {

            // If multiSelect false, unselect previously selected
            if (!this.options.multiSelect) {
                $.each(this.findNodes('true', 'g', 'state.selected'), $.proxy(function (index, node) {
                    this.setSelectedState(node, false, options);
                }, this));
            }

            // Continue selecting node
            node.state.selected = true;
            if (!options.silent) {
                this.$element.trigger('nodeSelected', $.extend(true, {}, node));
            }
        }
        else {

            // Unselect node
            node.state.selected = false;
            if (!options.silent) {
                this.$element.trigger('nodeUnselected', $.extend(true, {}, node));
            }
        }
    };

    Tree.prototype.toggleCheckedState = function (node, options) {
        if (!node) return;
        this.setCheckedState(node, !node.state.checked, options);
    };

    Tree.prototype.setCheckedState = function (node, state, options) {

        if (state === node.state.checked) return;

        if (state) {

            // Check node
            node.state.checked = true;

            if (!options.silent) {
                this.$element.trigger('nodeChecked', $.extend(true, {}, node));
            }
        }
        else {

            // Uncheck node
            node.state.checked = false;
            if (!options.silent) {
                this.$element.trigger('nodeUnchecked', $.extend(true, {}, node));
            }
        }
    };

    Tree.prototype.setDisabledState = function (node, state, options) {

        if (state === node.state.disabled) return;

        if (state) {

            // Disable node
            node.state.disabled = true;

            // Disable all other states
            this.setExpandedState(node, false, options);
            this.setSelectedState(node, false, options);
            this.setCheckedState(node, false, options);

            if (!options.silent) {
                this.$element.trigger('nodeDisabled', $.extend(true, {}, node));
            }
        }
        else {

            // Enabled node
            node.state.disabled = false;
            if (!options.silent) {
                this.$element.trigger('nodeEnabled', $.extend(true, {}, node));
            }
        }
    };

    Tree.prototype.render = function () {

        if (!this.initialized) {

            // Setup first time only components
            this.$element.addClass(pluginName);
            this.$wrapper = $(this.template.list);

            this.injectStyle();

            this.initialized = true;
        }

        this.$element.empty().append(this.$wrapper.empty());

        // Build tree
        this.buildTree(this.tree, 0);
    };

    // Starting from the root node, and recursing down the
    // structure we build the tree one node at a time
    Tree.prototype.buildTree = function (nodes, level) {

        if (!nodes) return;
        level += 1;

        var _this = this;
        $.each(nodes, function addNodes(id, node) {

            var treeItem = $(_this.template.item)
                .addClass('node-' + _this.elementId)
                .addClass(node.state.checked ? 'node-checked' : '')
                .addClass(node.state.disabled ? 'node-disabled' : '')
                .addClass(node.state.selected ? 'node-selected' : '')
                .addClass(node.searchResult ? 'search-result' : '')
                .attr('data-nodeid', node.nodeId)
                .attr('style', _this.buildStyleOverride(node));

            // Add indent/spacer to mimic tree structure
            for (var i = 0; i < (level - 1) ; i++) {
                treeItem.append(_this.template.indent);
            }

            // Add expand, collapse or empty spacer icons
            var classList = [];
            if (node.nodes) {
                classList.push('expand-icon');
                if (node.state.expanded) {
                    classList.push(_this.options.collapseIcon);
                }
                else {
                    classList.push(_this.options.expandIcon);
                }
            }
            else {
                classList.push(_this.options.emptyIcon);
            }

            treeItem
                .append($(_this.template.icon)
                    .addClass(classList.join(' '))
                );


            // Add node icon
            if (_this.options.showIcon) {

                var classList = ['node-icon'];

                classList.push(node.icon || _this.options.nodeIcon);
                if (node.state.selected) {
                    classList.pop();
                    classList.push(node.selectedIcon || _this.options.selectedIcon ||
                        node.icon || _this.options.nodeIcon);
                }

                treeItem
                    .append($(_this.template.icon)
                        .addClass(classList.join(' '))
                    );
            }

            // Add check / unchecked icon
            if (_this.options.showCheckbox) {

                var classList = ['check-icon'];
                if (node.state.checked) {
                    classList.push(_this.options.checkedIcon);
                }
                else {
                    classList.push(_this.options.uncheckedIcon);
                }

                treeItem
                    .append($(_this.template.icon)
                        .addClass(classList.join(' '))
                    );
            }

            // Add text
            if (_this.options.enableLinks) {
                // Add hyperlink
                treeItem
                    .append($(_this.template.link)
                        .attr('href', node.href)
                        .append(node.text)
                    );
            }
            else {
                // otherwise just text
                treeItem
                    .append(node.text);
            }

            // Add tags as badges
            if (_this.options.showTags && node.tags) {
                $.each(node.tags, function addTag(id, tag) {
                    treeItem
                        .append($(_this.template.badge)
                            .append(tag)
                        );
                });
            }

            // Add item to the tree
            _this.$wrapper.append(treeItem);

            // Recursively add child ndoes
            if (node.nodes && node.state.expanded && !node.state.disabled) {
                return _this.buildTree(node.nodes, level);
            }
        });
    };

    // Define any node level style override for
    // 1. selectedNode
    // 2. node|data assigned color overrides
    Tree.prototype.buildStyleOverride = function (node) {

        if (node.state.disabled) return '';

        var color = node.color;
        var backColor = node.backColor;

        if (this.options.highlightSelected && node.state.selected) {
            if (this.options.selectedColor) {
                color = this.options.selectedColor;
            }
            if (this.options.selectedBackColor) {
                backColor = this.options.selectedBackColor;
            }
        }

        if (this.options.highlightSearchResults && node.searchResult && !node.state.disabled) {
            if (this.options.searchResultColor) {
                color = this.options.searchResultColor;
            }
            if (this.options.searchResultBackColor) {
                backColor = this.options.searchResultBackColor;
            }
        }

        return 'color:' + color +
            ';background-color:' + backColor + ';';
    };

    // Add inline style into head
    Tree.prototype.injectStyle = function () {

        if (this.options.injectStyle && !document.getElementById(this.styleId)) {
            $('<style type="text/css" id="' + this.styleId + '"> ' + this.buildStyle() + ' </style>').appendTo('head');
        }
    };

    // Construct trees style based on user options
    Tree.prototype.buildStyle = function () {

        var style = '.node-' + this.elementId + '{';

        if (this.options.color) {
            style += 'color:' + this.options.color + ';';
        }

        if (this.options.backColor) {
            style += 'background-color:' + this.options.backColor + ';';
        }

        if (!this.options.showBorder) {
            style += 'border:none;';
        }
        else if (this.options.borderColor) {
            style += 'border:1px solid ' + this.options.borderColor + ';';
        }
        style += '}';

        if (this.options.onhoverColor) {
            style += '.node-' + this.elementId + ':not(.node-disabled):hover{' +
                'background-color:' + this.options.onhoverColor + ';' +
                '}';
        }

        return this.css + style;
    };

    Tree.prototype.template = {
        list: '<ul class="list-group"></ul>',
        item: '<li class="list-group-item"></li>',
        indent: '<span class="indent"></span>',
        icon: '<span class="icon"></span>',
        link: '<a href="#" style="color:inherit;"></a>',
        badge: '<span class="badge"></span>'
    };

    Tree.prototype.css = '.treeview .list-group-item{cursor:pointer}.treeview span.indent{margin-left:10px;margin-right:10px}.treeview span.icon{width:12px;margin-right:5px}.treeview .node-disabled{color:silver;cursor:not-allowed}'


    /**
     Returns a single node object that matches the given node id.
     @param {Number} nodeId - A node's unique identifier
     @return {Object} node - Matching node
     */
    Tree.prototype.getNode = function (nodeId) {
        return this.nodes[nodeId];
    };

    /**
     Returns the parent node of a given node, if valid otherwise returns undefined.
     @param {Object|Number} identifier - A valid node or node id
     @returns {Object} node - The parent node
     */
    Tree.prototype.getParent = function (identifier) {
        var node = this.identifyNode(identifier);
        return this.nodes[node.parentId];
    };

    /**
     Returns an array of sibling nodes for a given node, if valid otherwise returns undefined.
     @param {Object|Number} identifier - A valid node or node id
     @returns {Array} nodes - Sibling nodes
     */
    Tree.prototype.getSiblings = function (identifier) {
        var node = this.identifyNode(identifier);
        var parent = this.getParent(node);
        var nodes = parent ? parent.nodes : this.tree;
        return nodes.filter(function (obj) {
            return obj.nodeId !== node.nodeId;
        });
    };

    /**
     Returns an array of selected nodes.
     @returns {Array} nodes - Selected nodes
     */
    Tree.prototype.getSelected = function () {
        return this.findNodes('true', 'g', 'state.selected');
    };

    /**
     Returns an array of unselected nodes.
     @returns {Array} nodes - Unselected nodes
     */
    Tree.prototype.getUnselected = function () {
        return this.findNodes('false', 'g', 'state.selected');
    };

    /**
     Returns an array of expanded nodes.
     @returns {Array} nodes - Expanded nodes
     */
    Tree.prototype.getExpanded = function () {
        return this.findNodes('true', 'g', 'state.expanded');
    };

    /**
     Returns an array of collapsed nodes.
     @returns {Array} nodes - Collapsed nodes
     */
    Tree.prototype.getCollapsed = function () {
        return this.findNodes('false', 'g', 'state.expanded');
    };

    /**
     Returns an array of checked nodes.
     @returns {Array} nodes - Checked nodes
     */
    Tree.prototype.getChecked = function () {
        return this.findNodes('true', 'g', 'state.checked');
    };

    /**
     Returns an array of unchecked nodes.
     @returns {Array} nodes - Unchecked nodes
     */
    Tree.prototype.getUnchecked = function () {
        return this.findNodes('false', 'g', 'state.checked');
    };

    /**
     Returns an array of disabled nodes.
     @returns {Array} nodes - Disabled nodes
     */
    Tree.prototype.getDisabled = function () {
        return this.findNodes('true', 'g', 'state.disabled');
    };

    /**
     Returns an array of enabled nodes.
     @returns {Array} nodes - Enabled nodes
     */
    Tree.prototype.getEnabled = function () {
        return this.findNodes('false', 'g', 'state.disabled');
    };


    /**
     Set a node state to selected
     @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
     @param {optional Object} options
     */
    Tree.prototype.selectNode = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setSelectedState(node, true, options);
        }, this));

        this.render();
    };

    /**
     Set a node state to unselected
     @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
     @param {optional Object} options
     */
    Tree.prototype.unselectNode = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setSelectedState(node, false, options);
        }, this));

        this.render();
    };

    /**
     Toggles a node selected state; selecting if unselected, unselecting if selected.
     @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
     @param {optional Object} options
     */
    Tree.prototype.toggleNodeSelected = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.toggleSelectedState(node, options);
        }, this));

        this.render();
    };


    /**
     Collapse all tree nodes
     @param {optional Object} options
     */
    Tree.prototype.collapseAll = function (options) {
        var identifiers = this.findNodes('true', 'g', 'state.expanded');
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setExpandedState(node, false, options);
        }, this));

        this.render();
    };

    /**
     Collapse a given tree node
     @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
     @param {optional Object} options
     */
    Tree.prototype.collapseNode = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setExpandedState(node, false, options);
        }, this));

        this.render();
    };

    /**
     Expand all tree nodes
     @param {optional Object} options
     */
    Tree.prototype.expandAll = function (options) {
        options = $.extend({}, _default.options, options);

        if (options && options.levels) {
            this.expandLevels(this.tree, options.levels, options);
        }
        else {
            var identifiers = this.findNodes('false', 'g', 'state.expanded');
            this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
                this.setExpandedState(node, true, options);
            }, this));
        }

        this.render();
    };

    /**
     Expand a given tree node
     @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
     @param {optional Object} options
     */
    Tree.prototype.expandNode = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setExpandedState(node, true, options);
            if (node.nodes && (options && options.levels)) {
                this.expandLevels(node.nodes, options.levels - 1, options);
            }
        }, this));

        this.render();
    };

    Tree.prototype.expandLevels = function (nodes, level, options) {
        options = $.extend({}, _default.options, options);

        $.each(nodes, $.proxy(function (index, node) {
            this.setExpandedState(node, (level > 0) ? true : false, options);
            if (node.nodes) {
                this.expandLevels(node.nodes, level - 1, options);
            }
        }, this));
    };

    /**
     Reveals a given tree node, expanding the tree from node to root.
     @param {Object|Number|Array} identifiers - A valid node, node id or array of node identifiers
     @param {optional Object} options
     */
    Tree.prototype.revealNode = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            var parentNode = this.getParent(node);
            while (parentNode) {
                this.setExpandedState(parentNode, true, options);
                parentNode = this.getParent(parentNode);
            };
        }, this));

        this.render();
    };

    /**
     Toggles a nodes expanded state; collapsing if expanded, expanding if collapsed.
     @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
     @param {optional Object} options
     */
    Tree.prototype.toggleNodeExpanded = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.toggleExpandedState(node, options);
        }, this));

        this.render();
    };


    /**
     Check all tree nodes
     @param {optional Object} options
     */
    Tree.prototype.checkAll = function (options) {
        var identifiers = this.findNodes('false', 'g', 'state.checked');
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setCheckedState(node, true, options);
        }, this));

        this.render();
    };

    /**
     Check a given tree node
     @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
     @param {optional Object} options
     */
    Tree.prototype.checkNode = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setCheckedState(node, true, options);
        }, this));

        this.render();
    };

    /**
     Uncheck all tree nodes
     @param {optional Object} options
     */
    Tree.prototype.uncheckAll = function (options) {
        var identifiers = this.findNodes('true', 'g', 'state.checked');
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setCheckedState(node, false, options);
        }, this));

        this.render();
    };

    /**
     Uncheck a given tree node
     @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
     @param {optional Object} options
     */
    Tree.prototype.uncheckNode = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setCheckedState(node, false, options);
        }, this));

        this.render();
    };

    /**
     Toggles a nodes checked state; checking if unchecked, unchecking if checked.
     @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
     @param {optional Object} options
     */
    Tree.prototype.toggleNodeChecked = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.toggleCheckedState(node, options);
        }, this));

        this.render();
    };


    /**
     Disable all tree nodes
     @param {optional Object} options
     */
    Tree.prototype.disableAll = function (options) {
        var identifiers = this.findNodes('false', 'g', 'state.disabled');
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setDisabledState(node, true, options);
        }, this));

        this.render();
    };

    /**
     Disable a given tree node
     @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
     @param {optional Object} options
     */
    Tree.prototype.disableNode = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setDisabledState(node, true, options);
        }, this));

        this.render();
    };

    /**
     Enable all tree nodes
     @param {optional Object} options
     */
    Tree.prototype.enableAll = function (options) {
        var identifiers = this.findNodes('true', 'g', 'state.disabled');
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setDisabledState(node, false, options);
        }, this));

        this.render();
    };

    /**
     Enable a given tree node
     @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
     @param {optional Object} options
     */
    Tree.prototype.enableNode = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setDisabledState(node, false, options);
        }, this));

        this.render();
    };

    /**
     Toggles a nodes disabled state; disabling is enabled, enabling if disabled.
     @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
     @param {optional Object} options
     */
    Tree.prototype.toggleNodeDisabled = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setDisabledState(node, !node.state.disabled, options);
        }, this));

        this.render();
    };


    /**
     Common code for processing multiple identifiers
     */
    Tree.prototype.forEachIdentifier = function (identifiers, options, callback) {

        options = $.extend({}, _default.options, options);

        if (!(identifiers instanceof Array)) {
            identifiers = [identifiers];
        }

        $.each(identifiers, $.proxy(function (index, identifier) {
            callback(this.identifyNode(identifier), options);
        }, this));
    };

    /*
		Identifies a node from either a node id or object
	*/
    Tree.prototype.identifyNode = function (identifier) {
        return ((typeof identifier) === 'number') ?
            this.nodes[identifier] :
            identifier;
    };

    /**
     Searches the tree for nodes (text) that match given criteria
     @param {String} pattern - A given string to match against
     @param {optional Object} options - Search criteria options
     @return {Array} nodes - Matching nodes
     */
    Tree.prototype.search = function (pattern, options) {
        options = $.extend({}, _default.searchOptions, options);

        this.clearSearch({ render: false });

        var results = [];
        if (pattern && pattern.length > 0) {

            if (options.exactMatch) {
                pattern = '^' + pattern + '$';
            }

            var modifier = 'g';
            if (options.ignoreCase) {
                modifier += 'i';
            }

            results = this.findNodes(pattern, modifier);

            // Add searchResult property to all matching nodes
            // This will be used to apply custom styles
            // and when identifying result to be cleared
            $.each(results, function (index, node) {
                node.searchResult = true;
            })
        }

        // If revealResults, then render is triggered from revealNode
        // otherwise we just call render.
        if (options.revealResults) {
            this.revealNode(results);
        }
        else {
            this.render();
        }

        this.$element.trigger('searchComplete', $.extend(true, {}, results));

        return results;
    };

    /**
     Clears previous search results
     */
    Tree.prototype.clearSearch = function (options) {

        options = $.extend({}, { render: true }, options);

        var results = $.each(this.findNodes('true', 'g', 'searchResult'), function (index, node) {
            node.searchResult = false;
        });

        if (options.render) {
            this.render();
        }

        this.$element.trigger('searchCleared', $.extend(true, {}, results));
    };

    /**
     Find nodes that match a given criteria
     @param {String} pattern - A given string to match against
     @param {optional String} modifier - Valid RegEx modifiers
     @param {optional String} attribute - Attribute to compare pattern against
     @return {Array} nodes - Nodes that match your criteria
     */
    Tree.prototype.findNodes = function (pattern, modifier, attribute) {

        modifier = modifier || 'g';
        attribute = attribute || 'text';

        var _this = this;
        return $.grep(this.nodes, function (node) {
            var val = _this.getNodeValue(node, attribute);
            if (typeof val === 'string') {
                return val.match(new RegExp(pattern, modifier));
            }
        });
    };

    /**
     Recursive find for retrieving nested attributes values
     All values are return as strings, unless invalid
     @param {Object} obj - Typically a node, could be any object
     @param {String} attr - Identifies an object property using dot notation
     @return {String} value - Matching attributes string representation
     */
    Tree.prototype.getNodeValue = function (obj, attr) {
        var index = attr.indexOf('.');
        if (index > 0) {
            var _obj = obj[attr.substring(0, index)];
            var _attr = attr.substring(index + 1, attr.length);
            return this.getNodeValue(_obj, _attr);
        }
        else {
            if (obj.hasOwnProperty(attr)) {
                return obj[attr].toString();
            }
            else {
                return undefined;
            }
        }
    };

    var logError = function (message) {
        if (window.console) {
            window.console.error(message);
        }
    };

    // Prevent against multiple instantiations,
    // handle updates and method calls
    $.fn[pluginName] = function (options, args) {

        var result;

        this.each(function () {
            var _this = $.data(this, pluginName);
            if (typeof options === 'string') {
                if (!_this) {
                    logError('Not initialized, can not call method : ' + options);
                }
                else if (!$.isFunction(_this[options]) || options.charAt(0) === '_') {
                    logError('No such method : ' + options);
                }
                else {
                    if (!(args instanceof Array)) {
                        args = [args];
                    }
                    result = _this[options].apply(_this, args);
                }
            }
            else if (typeof options === 'boolean') {
                result = _this;
            }
            else {
                $.data(this, pluginName, new Tree(this, $.extend(true, {}, options)));
            }
        });

        return result || this;
    };

}(jQuery, window, document);


/* ControlSidebar()
 * ===============
 * Toggles the state of the control sidebar
 *
 * @Usage: $('#control-sidebar-trigger').controlSidebar(options)
 *         or add [data-toggle="control-sidebar"] to the trigger
 *         Pass any option as data-option="value"
 */
+function ($) {
    'use strict'

    var DataKey = 'lte.controlsidebar'

    var Default = {
        slide: true
    }

    var Selector = {
        sidebar: '.control-sidebar',
        data   : '[data-toggle="control-sidebar"]',
        open   : '.control-sidebar-open',
        bg     : '.control-sidebar-bg',
        wrapper: '.wrapper',
        content: '.content-wrapper',
        boxed  : '.layout-boxed'
    }

    var ClassName = {
        open : 'control-sidebar-open',
        fixed: 'fixed'
    }

    var Event = {
        collapsed: 'collapsed.controlsidebar',
        expanded : 'expanded.controlsidebar'
    }

    // ControlSidebar Class Definition
    // ===============================
    var ControlSidebar = function (element, options) {
        this.element         = element
        this.options         = options
        this.hasBindedResize = false

        this.init()
    }

    ControlSidebar.prototype.init = function () {
        // Add click listener if the element hasn't been
        // initialized using the data API
        if (!$(this.element).is(Selector.data)) {
            $(this).on('click', this.toggle)
        }

        this.fix()
        $(window).resize(function () {
            this.fix()
        }.bind(this))
    }

    ControlSidebar.prototype.toggle = function (event) {
        if (event) event.preventDefault()

        this.fix()

        if (!$(Selector.sidebar).is(Selector.open) && !$('body').is(Selector.open)) {
            this.expand()
        } else {
            this.collapse()
        }
    }

    ControlSidebar.prototype.expand = function () {
        if (!this.options.slide) {
            $('body').addClass(ClassName.open)
        } else {
            $(Selector.sidebar).addClass(ClassName.open)
        }

        $(this.element).trigger($.Event(Event.expanded))
    }

    ControlSidebar.prototype.collapse = function () {
        $('body, ' + Selector.sidebar).removeClass(ClassName.open)
        $(this.element).trigger($.Event(Event.collapsed))
    }

    ControlSidebar.prototype.fix = function () {
        if ($('body').is(Selector.boxed)) {
            this._fixForBoxed($(Selector.bg))
        }
    }

    // Private

    ControlSidebar.prototype._fixForBoxed = function (bg) {
        bg.css({
            position: 'absolute',
            height  : $(Selector.wrapper).height()
        })
    }

    // Plugin Definition
    // =================
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data(DataKey)

            if (!data) {
                var options = $.extend({}, Default, $this.data(), typeof option == 'object' && option)
                $this.data(DataKey, (data = new ControlSidebar($this, options)))
            }

            if (typeof option == 'string') data.toggle()
        })
    }

    var old = $.fn.controlSidebar

    $.fn.controlSidebar             = Plugin
    $.fn.controlSidebar.Constructor = ControlSidebar

    // No Conflict Mode
    // ================
    $.fn.controlSidebar.noConflict = function () {
        $.fn.controlSidebar = old
        return this
    }

    // ControlSidebar Data API
    // =======================
    $(document).on('click', Selector.data, function (event) {
        if (event) event.preventDefault()
        Plugin.call($(this), 'toggle')
    })

}(jQuery)



/*! Copyright (c) 2011 Piotr Rochala (http://rocha.la)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *  Slimscroll()
 * Version: 1.3.8
 *
 */
+(function ($) {

    $.fn.extend({
        slimScroll: function (options) {

            var defaults = {

                // width in pixels of the visible scroll area
                width: 'auto',

                // height in pixels of the visible scroll area
                height: '250px',

                // width in pixels of the scrollbar and rail
                size: '7px',

                // scrollbar color, accepts any hex/color value
                color: '#000',

                // scrollbar position - left/right
                position: 'right',

                // distance in pixels between the side edge and the scrollbar
                distance: '1px',

                // default scroll position on load - top / bottom / $('selector')
                start: 'top',

                // sets scrollbar opacity
                opacity: .4,

                // enables always-on mode for the scrollbar
                alwaysVisible: false,

                // check if we should hide the scrollbar when user is hovering over
                disableFadeOut: false,

                // sets visibility of the rail
                railVisible: false,

                // sets rail color
                railColor: '#333',

                // sets rail opacity
                railOpacity: .2,

                // whether  we should use jQuery UI Draggable to enable bar dragging
                railDraggable: true,

                // defautlt CSS class of the slimscroll rail
                railClass: 'slimScrollRail',

                // defautlt CSS class of the slimscroll bar
                barClass: 'slimScrollBar',

                // defautlt CSS class of the slimscroll wrapper
                wrapperClass: 'slimScrollDiv',

                // check if mousewheel should scroll the window if we reach top/bottom
                allowPageScroll: false,

                // scroll amount applied to each mouse wheel step
                wheelStep: 20,

                // scroll amount applied when user is using gestures
                touchScrollStep: 200,

                // sets border radius
                borderRadius: '7px',

                // sets border radius of the rail
                railBorderRadius: '7px'
            };

            var o = $.extend(defaults, options);

            // do it for every element that matches selector
            this.each(function () {

                var isOverPanel, isOverBar, isDragg, queueHide, touchDif,
                    barHeight, percentScroll, lastScroll,
                    divS = '<div></div>',
                    minBarHeight = 30,
                    releaseScroll = false;

                // used in event handlers and for better minification
                var me = $(this);

                // ensure we are not binding it again
                if (me.parent().hasClass(o.wrapperClass)) {
                    // start from last bar position
                    var offset = me.scrollTop();

                    // find bar and rail
                    bar = me.siblings('.' + o.barClass);
                    rail = me.siblings('.' + o.railClass);

                    getBarHeight();

                    // check if we should scroll existing instance
                    if ($.isPlainObject(options)) {
                        // Pass height: auto to an existing slimscroll object to force a resize after contents have changed
                        if ('height' in options && options.height == 'auto') {
                            me.parent().css('height', 'auto');
                            me.css('height', 'auto');
                            var height = me.parent().parent().height();
                            me.parent().css('height', height);
                            me.css('height', height);
                        } else if ('height' in options) {
                            var h = options.height;
                            me.parent().css('height', h);
                            me.css('height', h);
                        }

                        if ('scrollTo' in options) {
                            // jump to a static point
                            offset = parseInt(o.scrollTo);
                        }
                        else if ('scrollBy' in options) {
                            // jump by value pixels
                            offset += parseInt(o.scrollBy);
                        }
                        else if ('destroy' in options) {
                            // remove slimscroll elements
                            bar.remove();
                            rail.remove();
                            me.unwrap();
                            return;
                        }

                        // scroll content by the given offset
                        scrollContent(offset, false, true);
                    }

                    return;
                }
                else if ($.isPlainObject(options)) {
                    if ('destroy' in options) {
                        return;
                    }
                }

                // optionally set height to the parent's height
                o.height = (o.height == 'auto') ? me.parent().height() : o.height;

                // wrap content
                var wrapper = $(divS)
                    .addClass(o.wrapperClass)
                    .css({
                        position: 'relative',
                        overflow: 'hidden',
                        width: o.width,
                        height: o.height
                    });

                // update style for the div
                me.css({
                    overflow: 'hidden',
                    width: o.width,
                    height: o.height
                });

                // create scrollbar rail
                var rail = $(divS)
                    .addClass(o.railClass)
                    .css({
                        width: o.size,
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        display: (o.alwaysVisible && o.railVisible) ? 'block' : 'none',
                        'border-radius': o.railBorderRadius,
                        background: o.railColor,
                        opacity: o.railOpacity,
                        zIndex: 90
                    });

                // create scrollbar
                var bar = $(divS)
                    .addClass(o.barClass)
                    .css({
                        background: o.color,
                        width: o.size,
                        position: 'absolute',
                        top: 0,
                        opacity: o.opacity,
                        display: o.alwaysVisible ? 'block' : 'none',
                        'border-radius': o.borderRadius,
                        BorderRadius: o.borderRadius,
                        MozBorderRadius: o.borderRadius,
                        WebkitBorderRadius: o.borderRadius,
                        zIndex: 99
                    });

                // set position
                var posCss = (o.position == 'right') ? { right: o.distance } : { left: o.distance };
                rail.css(posCss);
                bar.css(posCss);

                // wrap it
                me.wrap(wrapper);

                // append to parent div
                me.parent().append(bar);
                me.parent().append(rail);

                // make it draggable and no longer dependent on the jqueryUI
                if (o.railDraggable) {
                    bar.bind("mousedown", function (e) {
                        var $doc = $(document);
                        isDragg = true;
                        t = parseFloat(bar.css('top'));
                        pageY = e.pageY;

                        $doc.bind("mousemove.slimscroll", function (e) {
                            currTop = t + e.pageY - pageY;
                            bar.css('top', currTop);
                            scrollContent(0, bar.position().top, false);// scroll content
                        });

                        $doc.bind("mouseup.slimscroll", function (e) {
                            isDragg = false; hideBar();
                            $doc.unbind('.slimscroll');
                        });
                        return false;
                    }).bind("selectstart.slimscroll", function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                        return false;
                    });
                }

                // on rail over
                rail.hover(function () {
                    showBar();
                }, function () {
                    hideBar();
                });

                // on bar over
                bar.hover(function () {
                    isOverBar = true;
                }, function () {
                    isOverBar = false;
                });

                // show on parent mouseover
                me.hover(function () {
                    isOverPanel = true;
                    showBar();
                    hideBar();
                }, function () {
                    isOverPanel = false;
                    hideBar();
                });

                // support for mobile
                me.bind('touchstart', function (e, b) {
                    if (e.originalEvent.touches.length) {
                        // record where touch started
                        touchDif = e.originalEvent.touches[0].pageY;
                    }
                });

                me.bind('touchmove', function (e) {
                    // prevent scrolling the page if necessary
                    if (!releaseScroll) {
                        e.originalEvent.preventDefault();
                    }
                    if (e.originalEvent.touches.length) {
                        // see how far user swiped
                        var diff = (touchDif - e.originalEvent.touches[0].pageY) / o.touchScrollStep;
                        // scroll content
                        scrollContent(diff, true);
                        touchDif = e.originalEvent.touches[0].pageY;
                    }
                });

                // set up initial height
                getBarHeight();

                // check start position
                if (o.start === 'bottom') {
                    // scroll content to bottom
                    bar.css({ top: me.outerHeight() - bar.outerHeight() });
                    scrollContent(0, true);
                }
                else if (o.start !== 'top') {
                    // assume jQuery selector
                    scrollContent($(o.start).position().top, null, true);

                    // make sure bar stays hidden
                    if (!o.alwaysVisible) { bar.hide(); }
                }

                // attach scroll events
                attachWheel(this);

                function _onWheel(e) {
                    // use mouse wheel only when mouse is over
                    if (!isOverPanel) { return; }

                    var e = e || window.event;

                    var delta = 0;
                    if (e.wheelDelta) { delta = -e.wheelDelta / 120; }
                    if (e.detail) { delta = e.detail / 3; }

                    var target = e.target || e.srcTarget || e.srcElement;
                    if ($(target).closest('.' + o.wrapperClass).is(me.parent())) {
                        // scroll content
                        scrollContent(delta, true);
                    }

                    // stop window scroll
                    if (e.preventDefault && !releaseScroll) { e.preventDefault(); }
                    if (!releaseScroll) { e.returnValue = false; }
                }

                function scrollContent(y, isWheel, isJump) {
                    releaseScroll = false;
                    var delta = y;
                    var maxTop = me.outerHeight() - bar.outerHeight();

                    if (isWheel) {
                        // move bar with mouse wheel
                        delta = parseInt(bar.css('top')) + y * parseInt(o.wheelStep) / 100 * bar.outerHeight();

                        // move bar, make sure it doesn't go out
                        delta = Math.min(Math.max(delta, 0), maxTop);

                        // if scrolling down, make sure a fractional change to the
                        // scroll position isn't rounded away when the scrollbar's CSS is set
                        // this flooring of delta would happened automatically when
                        // bar.css is set below, but we floor here for clarity
                        delta = (y > 0) ? Math.ceil(delta) : Math.floor(delta);

                        // scroll the scrollbar
                        bar.css({ top: delta + 'px' });
                    }

                    // calculate actual scroll amount
                    percentScroll = parseInt(bar.css('top')) / (me.outerHeight() - bar.outerHeight());
                    delta = percentScroll * (me[0].scrollHeight - me.outerHeight());

                    if (isJump) {
                        delta = y;
                        var offsetTop = delta / me[0].scrollHeight * me.outerHeight();
                        offsetTop = Math.min(Math.max(offsetTop, 0), maxTop);
                        bar.css({ top: offsetTop + 'px' });
                    }

                    // scroll content
                    me.scrollTop(delta);

                    // fire scrolling event
                    me.trigger('slimscrolling', ~~delta);

                    // ensure bar is visible
                    showBar();

                    // trigger hide when scroll is stopped
                    hideBar();
                }

                function attachWheel(target) {
                    if (window.addEventListener) {
                        target.addEventListener('DOMMouseScroll', _onWheel, false);
                        target.addEventListener('mousewheel', _onWheel, false);
                    }
                    else {
                        document.attachEvent("onmousewheel", _onWheel)
                    }
                }

                function getBarHeight() {
                    // calculate scrollbar height and make sure it is not too small
                    barHeight = Math.max((me.outerHeight() / me[0].scrollHeight) * me.outerHeight(), minBarHeight);
                    bar.css({ height: barHeight + 'px' });

                    // hide scrollbar if content is not long enough
                    var display = barHeight == me.outerHeight() ? 'none' : 'block';
                    bar.css({ display: display });
                }

                function showBar() {
                    // recalculate bar height
                    getBarHeight();
                    clearTimeout(queueHide);

                    // when bar reached top or bottom
                    if (percentScroll == ~~percentScroll) {
                        //release wheel
                        releaseScroll = o.allowPageScroll;

                        // publish approporiate event
                        if (lastScroll != percentScroll) {
                            var msg = (~~percentScroll == 0) ? 'top' : 'bottom';
                            me.trigger('slimscroll', msg);
                        }
                    }
                    else {
                        releaseScroll = false;
                    }
                    lastScroll = percentScroll;

                    // show only when required
                    if (barHeight >= me.outerHeight()) {
                        //allow window scroll
                        releaseScroll = true;
                        return;
                    }
                    bar.stop(true, true).fadeIn('fast');
                    if (o.railVisible) { rail.stop(true, true).fadeIn('fast'); }
                }

                function hideBar() {
                    // only hide when options allow it
                    if (!o.alwaysVisible) {
                        queueHide = setTimeout(function () {
                            if (!(o.disableFadeOut && isOverPanel) && !isOverBar && !isDragg) {
                                bar.fadeOut('slow');
                                rail.fadeOut('slow');
                            }
                        }, 1000);
                    }
                }

            });

            // maintain chainability
            return this;
        }
    });

    $.fn.extend({
        slimscroll: $.fn.slimScroll
    });

})(jQuery);


/*
* ControlSideBar
* v3.3.1 - 2017-07-07
* (c) Sindre Sorhus; MIT License
*/
+function ($) {
    'use strict'

    $('[data-toggle="control-sidebar"]').controlSidebar()
    $('[data-toggle="push-menu"]').pushMenu()

    var $pushMenu = $('[data-toggle="push-menu"]').data('lte.pushmenu')
    var $controlSidebar = $('[data-toggle="control-sidebar"]').data('lte.controlsidebar')
    var $layout = $('body').data('lte.layout')

    /**
     * List of all the available skins
     *
     * @type Array
     */
    var mySkins = [
        'skin-blue',
        'skin-black',
        'skin-red',
        'skin-yellow',
        'skin-purple',
        'skin-green',
        'skin-blue-light',
        'skin-black-light',
        'skin-red-light',
        'skin-yellow-light',
        'skin-purple-light',
        'skin-green-light'
    ]


    /**
     * Get a prestored setting
     *
     * @param String name Name of of the setting
     * @returns String The value of the setting | null
     */
    function get(name) {
        if (typeof (Storage) !== 'undefined') {
            return localStorage.getItem(name)
        } else {
            window.alert('Please use a modern browser to properly view this template!')
        }
    }

    /**
     * Store a new settings in the browser
     *
     * @param String name Name of the setting
     * @param String val Value of the setting
     * @returns void
     */
    function store(name, val) {
        if (typeof (Storage) !== 'undefined') {
            localStorage.setItem(name, val)
        } else {
            window.alert('Please use a modern browser to properly view this template!')
        }
    }

    /**
     * Toggles layout classes
     *
     * @param String cls the layout class to toggle
     * @returns void
     */
    function changeLayout(cls) {
        $('body').toggleClass(cls)
        var $layout = $('body').data('lte.layout')

        $layout.fixSidebar()
        if ($('body').hasClass('fixed') && cls == 'fixed') {
            $pushMenu.expandOnHover()
            $layout.activate()
        }
        $controlSidebar.fix()
    }

    /**
     * Replaces the old skin with the new skin
     * @param String cls the new skin class
     * @returns Boolean false to prevent link's default action
     */
    function changeSkin(cls) {
        $.each(mySkins, function (i) {
            $('body').removeClass(mySkins[i])
        })

        $('body').addClass(cls)
        store('skin', cls)
        return false
    }

    var tmp = get('skin')
    if (tmp && $.inArray(tmp, mySkins))
        changeSkin(tmp)

    // Add the change skin listener
    $('[data-skin]').on('click', function (e) {
        if ($(this).hasClass('knob'))
            return
        e.preventDefault()
        changeSkin($(this).data('skin'))
    });

    // Add the layout manager
    $('[data-layout]').on('click', function () {
        changeLayout($(this).data('layout'))
    })

    $('[data-controlsidebar]').on('click', function () {
        changeLayout($(this).data('controlsidebar'))
        var slide = !$controlSidebar.options.slide

        $controlSidebar.options.slide = slide
        if (!slide)
            $('.control-sidebar').removeClass('control-sidebar-open')
    })

    $('[data-sidebarskin="toggle"]').on('click', function () {
        var $sidebar = $('.control-sidebar')
        if ($sidebar.hasClass('control-sidebar-dark')) {
            $sidebar.removeClass('control-sidebar-dark')
            $sidebar.addClass('control-sidebar-light')
        } else {
            $sidebar.removeClass('control-sidebar-light')
            $sidebar.addClass('control-sidebar-dark')
        }
    })

    //  Reset options
    if ($('body').hasClass('fixed')) {
        $('[data-layout="fixed"]').attr('checked', 'checked')
    }
    if ($('body').hasClass('layout-boxed')) {
        $('[data-layout="layout-boxed"]').attr('checked', 'checked')
    }
    if ($('body').hasClass('sidebar-collapse')) {
        $('[data-layout="sidebar-collapse"]').attr('checked', 'checked')
    }

    //右侧工具条Checkbox转为Switch
    //$("input[name='toolbar-switch']").bootstrapSwitch({ 'size': 'mini' });
    $('[data-toggle="tooltip"]').tooltip()
}(jQuery)


/* left tooptips()
* ===============
*/
+function ($) {

    var tooltips = {
        fullscreen: '[data-widget="tooltip-fullscreen"]',
        lock: '[data-widget="tooltip-lock"]',
        unlock:'[data-widget="tooltip-unlock"]',
        refresh: '[data-widget="tooltip-refresh"]'
    }
    //刷新当前页
    $('body').on('click', tooltips.refresh, function () {
        $(".iframeClass").each(function(i,el){
            if($(el).parent().hasClass("active"))
            {
                //显示加载中
                $.blockUI({
                    target: '.tab-content',
                    boxed: true,
                    message: '<div class="loaderbox"><div class="loading-activity"></div> 加载中...</div>',
                    animate: true
                });

                var iframe = $(el)[0];
                if (iframe) {
                    iframe.contentWindow.location.reload(true);
                }
            }
        })
    });
}(jQuery)

//-------ChatArea End ----
/*!
 * jQuery blockUI plugin
 * Version 2.70.0-2014.11.23
 * Requires jQuery v1.7 or later
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007-2013 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to Amir-Hossein Sobhi for some excellent contributions!
 */

+(function() {
    /*jshint eqeqeq:false curly:false latedef:false */
    "use strict";

    function setup($) {
        $.fn._fadeIn = $.fn.fadeIn;

        var noOp = $.noop || function() {};

        // this bit is to ensure we don't call setExpression when we shouldn't (with extra muscle to handle
        // confusing userAgent strings on Vista)
        var msie = /MSIE/.test(navigator.userAgent);
        var ie6  = /MSIE 6.0/.test(navigator.userAgent) && ! /MSIE 8.0/.test(navigator.userAgent);
        var mode = document.documentMode || 0;
        var setExpr = $.isFunction( document.createElement('div').style.setExpression );

        // global $ methods for blocking/unblocking the entire page
        $.blockUI   = function(opts) { install(window, opts); };
        $.unblockUI = function(opts) { remove(window, opts); };

        // convenience method for quick growl-like notifications  (http://www.google.com/search?q=growl)
        $.growlUI = function(title, message, timeout, onClose) {
            var $m = $('<div class="growlUI"></div>');
            if (title) $m.append('<h1>'+title+'</h1>');
            if (message) $m.append('<h2>'+message+'</h2>');
            if (timeout === undefined) timeout = 3000;

            // Added by konapun: Set timeout to 30 seconds if this growl is moused over, like normal toast notifications
            var callBlock = function(opts) {
                opts = opts || {};

                $.blockUI({
                    message: $m,
                    fadeIn : typeof opts.fadeIn  !== 'undefined' ? opts.fadeIn  : 700,
                    fadeOut: typeof opts.fadeOut !== 'undefined' ? opts.fadeOut : 1000,
                    timeout: typeof opts.timeout !== 'undefined' ? opts.timeout : timeout,
                    centerY: false,
                    showOverlay: false,
                    onUnblock: onClose,
                    css: $.blockUI.defaults.growlCSS
                });
            };

            callBlock();
            var nonmousedOpacity = $m.css('opacity');
            $m.mouseover(function() {
                callBlock({
                    fadeIn: 0,
                    timeout: 30000
                });

                var displayBlock = $('.blockMsg');
                displayBlock.stop(); // cancel fadeout if it has started
                displayBlock.fadeTo(300, 1); // make it easier to read the message by removing transparency
            }).mouseout(function() {
                $('.blockMsg').fadeOut(1000);
            });
            // End konapun additions
        };

        // plugin method for blocking element content
        $.fn.block = function(opts) {
            if ( this[0] === window ) {
                $.blockUI( opts );
                return this;
            }
            var fullOpts = $.extend({}, $.blockUI.defaults, opts || {});
            this.each(function() {
                var $el = $(this);
                if (fullOpts.ignoreIfBlocked && $el.data('blockUI.isBlocked'))
                    return;
                $el.unblock({ fadeOut: 0 });
            });

            return this.each(function() {
                if ($.css(this,'position') == 'static') {
                    this.style.position = 'relative';
                    $(this).data('blockUI.static', true);
                }
                this.style.zoom = 1; // force 'hasLayout' in ie
                install(this, opts);
            });
        };

        // plugin method for unblocking element content
        $.fn.unblock = function(opts) {
            if ( this[0] === window ) {
                $.unblockUI( opts );
                return this;
            }
            return this.each(function() {
                remove(this, opts);
            });
        };

        $.blockUI.version = 2.70; // 2nd generation blocking at no extra cost!

        // override these in your code to change the default behavior and style
        $.blockUI.defaults = {
            // message displayed when blocking (use null for no message)
            message:  '<div class="loaderbox"><div class="loading-activity"></div> <h1>Please wait...</h1></div>',

            title: null,		// title string; only used when theme == true
            draggable: true,	// only used when theme == true (requires jquery-ui.js to be loaded)

            theme: false, // set to true to use with jQuery UI themes

            // styles for the message when blocking; if you wish to disable
            // these and use an external stylesheet then do this in your code:
            // $.blockUI.defaults.css = {};
            css: {
                padding:	0,
                margin:		0,
                width:		'30%',
                top:		'40%',
                left:		'35%',
                textAlign:	'center',
                color:		'#000',
                border:		'0px',
                backgroundColor:'transparent',
                cursor:		'wait'
            },

            // minimal style set used when themes are used
            themedCSS: {
                width:	'30%',
                top:	'40%',
                left:	'35%'
            },

            // styles for the overlay
            overlayCSS:  {
                backgroundColor:	'#000',
                opacity:			0.6,
                cursor:				'wait'
            },

            // style to replace wait cursor before unblocking to correct issue
            // of lingering wait cursor
            cursorReset: 'default',

            // styles applied when using $.growlUI
            growlCSS: {
                width:		'350px',
                top:		'10px',
                left:		'',
                right:		'10px',
                border:		'none',
                padding:	'5px',
                opacity:	0.6,
                cursor:		'default',
                color:		'#fff',
                backgroundColor: '#000',
                '-webkit-border-radius':'10px',
                '-moz-border-radius':	'10px',
                'border-radius':		'10px'
            },

            // IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
            // (hat tip to Jorge H. N. de Vasconcelos)
            /*jshint scripturl:true */
            iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',

            // force usage of iframe in non-IE browsers (handy for blocking applets)
            forceIframe: false,

            // z-index for the blocking overlay
            baseZ: 1000,

            // set these to true to have the message automatically centered
            centerX: true, // <-- only effects element blocking (page block controlled via css above)
            centerY: true,

            // allow body element to be stetched in ie6; this makes blocking look better
            // on "short" pages.  disable if you wish to prevent changes to the body height
            allowBodyStretch: true,

            // enable if you want key and mouse events to be disabled for content that is blocked
            bindEvents: true,

            // be default blockUI will supress tab navigation from leaving blocking content
            // (if bindEvents is true)
            constrainTabKey: true,

            // fadeIn time in millis; set to 0 to disable fadeIn on block
            fadeIn:  200,

            // fadeOut time in millis; set to 0 to disable fadeOut on unblock
            fadeOut:  400,

            // time in millis to wait before auto-unblocking; set to 0 to disable auto-unblock
            timeout: 0,

            // disable if you don't want to show the overlay
            showOverlay: true,

            // if true, focus will be placed in the first available input field when
            // page blocking
            focusInput: true,

            // elements that can receive focus
            focusableElements: ':input:enabled:visible',

            // suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
            // no longer needed in 2012
            // applyPlatformOpacityRules: true,

            // callback method invoked when fadeIn has completed and blocking message is visible
            onBlock: null,

            // callback method invoked when unblocking has completed; the callback is
            // passed the element that has been unblocked (which is the window object for page
            // blocks) and the options that were passed to the unblock call:
            //	onUnblock(element, options)
            onUnblock: null,

            // callback method invoked when the overlay area is clicked.
            // setting this will turn the cursor to a pointer, otherwise cursor defined in overlayCss will be used.
            onOverlayClick: null,

            // don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
            quirksmodeOffsetHack: 4,

            // class name of the message block
            blockMsgClass: 'blockMsg',

            // if it is already blocked, then ignore it (don't unblock and reblock)
            ignoreIfBlocked: false
        };

        // private data and functions follow...

        var pageBlock = null;
        var pageBlockEls = [];

        function install(el, opts) {
            var css, themedCSS;
            var full = (el == window);
            var msg = (opts && opts.message !== undefined ? opts.message : undefined);
            opts = $.extend({}, $.blockUI.defaults, opts || {});

            if (opts.ignoreIfBlocked && $(el).data('blockUI.isBlocked'))
                return;

            opts.overlayCSS = $.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS || {});
            css = $.extend({}, $.blockUI.defaults.css, opts.css || {});
            if (opts.onOverlayClick)
                opts.overlayCSS.cursor = 'pointer';

            themedCSS = $.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS || {});
            msg = msg === undefined ? opts.message : msg;

            // remove the current block (if there is one)
            if (full && pageBlock)
                remove(window, {fadeOut:0});

            // if an existing element is being used as the blocking content then we capture
            // its current place in the DOM (and current display style) so we can restore
            // it when we unblock
            if (msg && typeof msg != 'string' && (msg.parentNode || msg.jquery)) {
                var node = msg.jquery ? msg[0] : msg;
                var data = {};
                $(el).data('blockUI.history', data);
                data.el = node;
                data.parent = node.parentNode;
                data.display = node.style.display;
                data.position = node.style.position;
                if (data.parent)
                    data.parent.removeChild(node);
            }

            $(el).data('blockUI.onUnblock', opts.onUnblock);
            var z = opts.baseZ;

            // blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
            // layer1 is the iframe layer which is used to supress bleed through of underlying content
            // layer2 is the overlay layer which has opacity and a wait cursor (by default)
            // layer3 is the message content that is displayed while blocking
            var lyr1, lyr2, lyr3, s;
            if (msie || opts.forceIframe)
                lyr1 = $('<iframe class="blockUI" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+opts.iframeSrc+'"></iframe>');
            else
                lyr1 = $('<div class="blockUI" style="display:none"></div>');

            if (opts.theme)
                lyr2 = $('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:'+ (z++) +';display:none"></div>');
            else
                lyr2 = $('<div class="blockUI blockOverlay" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');

            if (opts.theme && full) {
                s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:fixed">';
                if ( opts.title ) {
                    s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>';
                }
                s += '<div class="ui-widget-content ui-dialog-content"></div>';
                s += '</div>';
            }
            else if (opts.theme) {
                s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:absolute">';
                if ( opts.title ) {
                    s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>';
                }
                s += '<div class="ui-widget-content ui-dialog-content"></div>';
                s += '</div>';
            }
            else if (full) {
                s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage" style="z-index:'+(z+10)+';display:none;position:fixed"></div>';
            }
            else {
                s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement" style="z-index:'+(z+10)+';display:none;position:absolute"></div>';
            }
            lyr3 = $(s);

            // if we have a message, style it
            if (msg) {
                if (opts.theme) {
                    lyr3.css(themedCSS);
                    lyr3.addClass('ui-widget-content');
                }
                else
                    lyr3.css(css);
            }

            // style the overlay
            if (!opts.theme /*&& (!opts.applyPlatformOpacityRules)*/)
                lyr2.css(opts.overlayCSS);
            lyr2.css('position', full ? 'fixed' : 'absolute');

            // make iframe layer transparent in IE
            if (msie || opts.forceIframe)
                lyr1.css('opacity',0.0);

            //$([lyr1[0],lyr2[0],lyr3[0]]).appendTo(full ? 'body' : el);
            var layers = [lyr1,lyr2,lyr3], $par = full ? $('body') : $(el);
            $.each(layers, function() {
                this.appendTo($par);
            });

            if (opts.theme && opts.draggable && $.fn.draggable) {
                lyr3.draggable({
                    handle: '.ui-dialog-titlebar',
                    cancel: 'li'
                });
            }

            // ie7 must use absolute positioning in quirks mode and to account for activex issues (when scrolling)
            var expr = setExpr && (!$.support.boxModel || $('object,embed', full ? null : el).length > 0);
            if (ie6 || expr) {
                // give body 100% height
                if (full && opts.allowBodyStretch && $.support.boxModel)
                    $('html,body').css('height','100%');

                // fix ie6 issue when blocked element has a border width
                if ((ie6 || !$.support.boxModel) && !full) {
                    var t = sz(el,'borderTopWidth'), l = sz(el,'borderLeftWidth');
                    var fixT = t ? '(0 - '+t+')' : 0;
                    var fixL = l ? '(0 - '+l+')' : 0;
                }

                // simulate fixed position
                $.each(layers, function(i,o) {
                    var s = o[0].style;
                    s.position = 'absolute';
                    if (i < 2) {
                        if (full)
                            s.setExpression('height','Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:'+opts.quirksmodeOffsetHack+') + "px"');
                        else
                            s.setExpression('height','this.parentNode.offsetHeight + "px"');
                        if (full)
                            s.setExpression('width','jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"');
                        else
                            s.setExpression('width','this.parentNode.offsetWidth + "px"');
                        if (fixL) s.setExpression('left', fixL);
                        if (fixT) s.setExpression('top', fixT);
                    }
                    else if (opts.centerY) {
                        if (full) s.setExpression('top','(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
                        s.marginTop = 0;
                    }
                    else if (!opts.centerY && full) {
                        var top = (opts.css && opts.css.top) ? parseInt(opts.css.top, 10) : 0;
                        var expression = '((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + '+top+') + "px"';
                        s.setExpression('top',expression);
                    }
                });
            }

            // show the message
            if (msg) {
                if (opts.theme)
                    lyr3.find('.ui-widget-content').append(msg);
                else
                    lyr3.append(msg);
                if (msg.jquery || msg.nodeType)
                    $(msg).show();
            }

            if ((msie || opts.forceIframe) && opts.showOverlay)
                lyr1.show(); // opacity is zero
            if (opts.fadeIn) {
                var cb = opts.onBlock ? opts.onBlock : noOp;
                var cb1 = (opts.showOverlay && !msg) ? cb : noOp;
                var cb2 = msg ? cb : noOp;
                if (opts.showOverlay)
                    lyr2._fadeIn(opts.fadeIn, cb1);
                if (msg)
                    lyr3._fadeIn(opts.fadeIn, cb2);
            }
            else {
                if (opts.showOverlay)
                    lyr2.show();
                if (msg)
                    lyr3.show();
                if (opts.onBlock)
                    opts.onBlock.bind(lyr3)();
            }

            // bind key and mouse events
            bind(1, el, opts);

            if (full) {
                pageBlock = lyr3[0];
                pageBlockEls = $(opts.focusableElements,pageBlock);
                if (opts.focusInput)
                    setTimeout(focus, 20);
            }
            else
                center(lyr3[0], opts.centerX, opts.centerY);

            if (opts.timeout) {
                // auto-unblock
                var to = setTimeout(function() {
                    if (full)
                        $.unblockUI(opts);
                    else
                        $(el).unblock(opts);
                }, opts.timeout);
                $(el).data('blockUI.timeout', to);
            }
        }

        // remove the block
        function remove(el, opts) {
            var count;
            var full = (el == window);
            var $el = $(el);
            var data = $el.data('blockUI.history');
            var to = $el.data('blockUI.timeout');
            if (to) {
                clearTimeout(to);
                $el.removeData('blockUI.timeout');
            }
            opts = $.extend({}, $.blockUI.defaults, opts || {});
            bind(0, el, opts); // unbind events

            if (opts.onUnblock === null) {
                opts.onUnblock = $el.data('blockUI.onUnblock');
                $el.removeData('blockUI.onUnblock');
            }

            var els;
            if (full) // crazy selector to handle odd field errors in ie6/7
                els = $('body').children().filter('.blockUI').add('body > .blockUI');
            else
                els = $el.find('>.blockUI');

            // fix cursor issue
            if ( opts.cursorReset ) {
                if ( els.length > 1 )
                    els[1].style.cursor = opts.cursorReset;
                if ( els.length > 2 )
                    els[2].style.cursor = opts.cursorReset;
            }

            if (full)
                pageBlock = pageBlockEls = null;

            if (opts.fadeOut) {
                count = els.length;
                els.stop().fadeOut(opts.fadeOut, function() {
                    if ( --count === 0)
                        reset(els,data,opts,el);
                });
            }
            else
                reset(els, data, opts, el);
        }

        // move blocking element back into the DOM where it started
        function reset(els,data,opts,el) {
            var $el = $(el);
            if ( $el.data('blockUI.isBlocked') )
                return;

            els.each(function(i,o) {
                // remove via DOM calls so we don't lose event handlers
                if (this.parentNode)
                    this.parentNode.removeChild(this);
            });

            if (data && data.el) {
                data.el.style.display = data.display;
                data.el.style.position = data.position;
                data.el.style.cursor = 'default'; // #59
                if (data.parent)
                    data.parent.appendChild(data.el);
                $el.removeData('blockUI.history');
            }

            if ($el.data('blockUI.static')) {
                $el.css('position', 'static'); // #22
            }

            if (typeof opts.onUnblock == 'function')
                opts.onUnblock(el,opts);

            // fix issue in Safari 6 where block artifacts remain until reflow
            var body = $(document.body), w = body.width(), cssW = body[0].style.width;
            body.width(w-1).width(w);
            body[0].style.width = cssW;
        }

        // bind/unbind the handler
        function bind(b, el, opts) {
            var full = el == window, $el = $(el);

            // don't bother unbinding if there is nothing to unbind
            if (!b && (full && !pageBlock || !full && !$el.data('blockUI.isBlocked')))
                return;

            $el.data('blockUI.isBlocked', b);

            // don't bind events when overlay is not in use or if bindEvents is false
            if (!full || !opts.bindEvents || (b && !opts.showOverlay))
                return;

            // bind anchors and inputs for mouse and key events
            var events = 'mousedown mouseup keydown keypress keyup touchstart touchend touchmove';
            if (b)
                $(document).bind(events, opts, handler);
            else
                $(document).unbind(events, handler);

            // former impl...
            //		var $e = $('a,:input');
            //		b ? $e.bind(events, opts, handler) : $e.unbind(events, handler);
        }

        // event handler to suppress keyboard/mouse events when blocking
        function handler(e) {
            // allow tab navigation (conditionally)
            if (e.type === 'keydown' && e.keyCode && e.keyCode == 9) {
                if (pageBlock && e.data.constrainTabKey) {
                    var els = pageBlockEls;
                    var fwd = !e.shiftKey && e.target === els[els.length-1];
                    var back = e.shiftKey && e.target === els[0];
                    if (fwd || back) {
                        setTimeout(function(){focus(back);},10);
                        return false;
                    }
                }
            }
            var opts = e.data;
            var target = $(e.target);
            if (target.hasClass('blockOverlay') && opts.onOverlayClick)
                opts.onOverlayClick(e);

            // allow events within the message content
            if (target.parents('div.' + opts.blockMsgClass).length > 0)
                return true;

            // allow events for content that is not being blocked
            return target.parents().children().filter('div.blockUI').length === 0;
        }

        function focus(back) {
            if (!pageBlockEls)
                return;
            var e = pageBlockEls[back===true ? pageBlockEls.length-1 : 0];
            if (e)
                e.focus();
        }

        function center(el, x, y) {
            var p = el.parentNode, s = el.style;
            var l = ((p.offsetWidth - el.offsetWidth)/2) - sz(p,'borderLeftWidth');
            var t = ((p.offsetHeight - el.offsetHeight)/2) - sz(p,'borderTopWidth');
            if (x) s.left = l > 0 ? (l+'px') : '0';
            if (y) s.top  = t > 0 ? (t+'px') : '0';
        }

        function sz(el, p) {
            return parseInt($.css(el,p),10)||0;
        }

    }


    /*global define:true */
    if (typeof define === 'function' && define.amd && define.amd.jQuery) {
        define(['jquery'], setup);
    } else {
        setup(jQuery);
    }

})();

/**
 * Website: http://git.oschina.net/hbbcs/bootStrap-addTabs
 *
 * Version : 2.0
 *
 */
+function ($) {
    var settings = {
        content: '', //直接指定所有页面TABS内容
        close: true, //是否可以关闭
        closeicon:'fa fa-remove',
        monitor: 'body', //监视的区域
        iframe: true, //使用iframe还是ajax
        iframeHeight: function () {
            return $(".content-wrapper").height() - 42//42为 nav-tabs 高度
        }, //固定TAB中IFRAME高度,根据需要自己修改
        target: '.menu-tabs',
        contextmenu: true, //是否使用右键菜单
        //asyncleftmenu: true,
        //leftmenu:'.sidebar-menu',
        local: {
            'refreshLabel': ' 刷新',
            'closeThisLabel': ' 关闭',
            'closeOtherLabel': ' 关闭',
            'closeLeftLabel': ' 关闭左侧',
            'closeRightLabel': ' 关闭右侧'
        },
        callback: function () { //关闭后回调函数
        }
    };
    var target;
    _click = function (obj) {
        var a_obj, a_target;
        a_obj = (typeof obj.data('addtab') == 'object') ? obj.data('addtab') : obj.data();
        if (!a_obj.id && !a_obj.addtab) {
            a_obj.id = Math.random().toString(36).substring(3, 35);
            obj.data('id', a_obj.id);
        }
        $.addtabs.add({
            'target': a_obj.target ? a_obj.target : target,
            'id': a_obj.id ? a_obj.id : a_obj.addtab,
            'title': a_obj.title ? a_obj.title : obj.html(),
            'content': settings.content ? settings.content : a_obj.content,
            'url': a_obj.url,
            'ajax': a_obj.ajax ? true : false
        });
    };
    _createMenu = function (right, icon, text) {
        return $('<a>', {
            'href': 'javascript:void(0);',
            'class': "list-group-item",
            'data-right': right
        }).append($('<i>', {
            'class': 'fa ' + icon
        })).append(text);
    }
    _pop = function (id, e, mouse) {
        $('body').find('#popMenu').remove();
        var refresh = e.attr('id') ? _createMenu('refresh', 'fa-refresh', settings.local.refreshLabel) : '';
        var remove = e.attr('id') ? _createMenu('remove', 'fa-remove', settings.local.closeThisLabel) : '';
        var left = e.prev('li').attr('id') ? _createMenu('remove-left', 'fa-chevron-left', settings.local.closeLeftLabel) : '';
        var right = e.next('li').attr('id') ? _createMenu('remove-right', 'fa-chevron-right', settings.local.closeRightLabel) : '';
        var popHtml = $('<ul>', {
            'aria-controls': id,
            'class': 'rightMenu list-group',
            id: 'popMenu',
            'aria-url': e.attr('aria-url'),
            'aria-ajax': e.attr('aria-ajax')
        }).append(refresh).append(remove).append(_createMenu('remove-circle', 'fa-times-circle-o', settings.local.closeOtherLabel)).append(left).append(right);
        popHtml.css({
            'top': mouse.pageY,
            'left': mouse.pageX
        });
        popHtml.appendTo($('body')).fadeIn('fast');
        //刷新页面
        $('ul.rightMenu a[data-right=refresh]').on('click', function () {
            var id = $(this).parent('ul').attr("aria-controls");
            var url = $(this).parent('ul').attr('aria-url');
            var ajax = $(this).parent('ul').attr('aria-ajax');

            $.addtabs.add({
                'id': id,
                'url': url,
                'refresh': true,
                'ajax': ajax
            });
        });
        //关闭自身
        $('ul.rightMenu a[data-right=remove]').on('click', function () {
            var id = $(this).parent("ul").attr("aria-controls");
            $.addtabs.close({
                "id": id
            });
            $.addtabs.drop();
        });
        //关闭其他
        $('ul.rightMenu a[data-right=remove-circle]').on('click', function () {
            var tab_id = $(this).parent('ul').attr("aria-controls");
            target.find('li').each(function () {
                var id = $(this).attr('id');
                if (id && id != 'tab_' + tab_id) {
                    $.addtabs.close({
                        "id": $(this).children('a').attr('aria-controls')
                    });
                }
            });
            $.addtabs.drop();
        });
        //关闭左侧
        $('ul.rightMenu a[data-right=remove-left]').on('click', function () {
            var tab_id = $(this).parent('ul').attr("aria-controls");
            $('#tab_' + tab_id).prevUntil().each(function () {
                var id = $(this).attr('id');
                if (id && id != 'tab_' + tab_id) {
                    $.addtabs.close({
                        "id": $(this).children('a').attr('aria-controls')
                    });
                }
            });
            $.addtabs.drop();
        });
        //关闭右侧
        $('ul.rightMenu a[data-right=remove-right]').on('click', function () {
            var tab_id = $(this).parent('ul').attr("aria-controls");
            var r;
            if (target.find('#tab_' + tab_id).length > 0) r = $('#tab_' + tab_id);
            else r = target.find('a[href=#' + tab_id + ']').parent('li');
            r.nextUntil().each(function () {
                var id = $(this).attr('id');
                if (id && id != 'tab_' + tab_id) {
                    $.addtabs.close({
                        "id": $(this).children('a').attr('aria-controls')
                    });
                }
            });
            $.addtabs.drop();
        });
        popHtml.mouseleave(function () {
            $(this).fadeOut('slow');
        });
        $('body').click(function () {
            popHtml.fadeOut('slow');
        })
    };
    _listen = function () {
        $(settings.monitor).on('click', '[data-addtab]', function () {
            _click($(this));
            $.addtabs.drop();
        });
        $('body').on('click', '.close-tab', function () {
            var id = $(this).prev("a").attr("aria-controls");
            $.addtabs.close({
                'id': id
            });
            $.addtabs.drop();
        });
        if (settings.contextmenu) {
            //obj上禁用右键菜单
            $('body').on('contextmenu', 'li[role=presentation]', function (e) {
                var id = $(this).children('a').attr('aria-controls');
                _pop(id, $(this), e);
                return false;
            });
        }
        var el;
        $('body').on('dragstart.h5s', '.nav-tabs li', function (e) {
            el = $(this);
        }).on('dragover.h5s dragenter.h5s drop.h5s', '.nav-tabs li', function (e) {
            if (el == $(this)) return;
            $('.dragBack').removeClass('dragBack');
            $(this).addClass('dragBack');
            el.insertAfter($(this))
        }).on('dragend.h5s', '.nav-tabs li', function () {
            $('.dragBack').removeClass('dragBack');
        });

        $(window).resize(function () {
            $.addtabs.drop();
        });
    };

    $.addtabs = function (options) {
        $.addtabs.set(options);
        _listen();
    };
    $.addtabs.set = function () {
        if (arguments[0]) {
            if (typeof arguments[0] == 'object') {
                settings = $.extend(settings, arguments[0] || {});
            } else {
                settings[arguments[0]] = arguments[1];
            }
        }
        if (typeof settings.target == 'object') {
            target = settings.target;
        } else {
            target = $('body').find(settings.target).length > 0 ? $(settings.target).first() : $('body').find('.nav-tabs').first();
        }
    };

    $.addtabs.add = function (opts) {
        var a_target, content;
        opts.id = opts.id ? opts.id : Math.random().toString(36).substring(3, 35);
        if (typeof opts.target == 'object') {
            a_target = opts.target;
        } else if (typeof opts.target == 'string') {
            a_target = $('body').find(opts.target);
        } else {
            a_target = target;
        }
        var id = opts.id;
        var tab_li = a_target;
        var tab_content = tab_li.next('.tab-content');
        tab_li.find('li[role = "presentation"].active').removeClass('active');
        tab_content.find('div[role = "tabpanel"].active').removeClass('active');

        //如果TAB不存在，创建一个新的TAB
        if (tab_li.find('#tab_' + id).length < 1) {
            //创建新TAB的title
            var title = $('<li>', {
                'role': 'presentation',
                'id': 'tab_' + id,
                'aria-url': opts.url,
                'aria-ajax': opts.ajax ? true : false,
                'class': 'nav-tabs-header'
            }).append($('<a>', {
                'href': '#' + id,
                'aria-controls': id,
                'role': 'tab',
                'data-toggle': 'tab',
            }).html(opts.title));

            title.on('dblclick', function () {
                //显示加载中
                $.blockUI({
                    target: '.tab-content',
                    boxed: true,
                    message: '<div class="loaderbox"><div class="loading-activity"></div> 加载中...</div>',
                    animate: true
                });

                var iframe = tab_content.find('#' + id).find(".iframeClass")[0];

                if (iframe) {
                    iframe.contentWindow.location.reload(true);//带参数刷新
                }
            });
            //是否允许关闭
            if (settings.close) {
                title.append($('<i>', {
                    'class': 'close-tab fa fa-times-circle'
                }));
            }
            //创建新TAB的内容
            var content = $('<div>', {
                'class': 'tab-pane',
                'id': id,
                'role': 'tabpanel',
                'height': settings.iframeHeight()
            });
            //加入TABS
            tab_li.append(title);
            tab_content.append(content);
        } else if (!opts.refresh) {
            $('#tab_' + id).addClass('active');
            $('#' + id).addClass('active');
            return;
        } else {
            content = $('#' + id);
            content.html('');
        }
        //是否指定TAB内容
        if (opts.content) {
            content.append(opts.content);
        } else if (settings.iframe == true && (opts.ajax == 'false' || !opts.ajax)) {
            //没有内容，使用IFRAME打开链接
            $.blockUI({
                target: '.tab-content',
                boxed: true,
                message: '<div class="loaderbox"><div class="loading-activity"></div> 加载中...</div>',
                animate: true
            });
            var $iframe=$("<iframe>", {
                'class': 'iframeClass',
                'height': settings.iframeHeight(),
                'frameborder': "no",
                'border': "0",
                'src': opts.url,
                'seamless': 'seamless'
            });
            $iframe.on('load',function () {
                $.unblockUI('.tab-content');
            });
            content.append($iframe);
        } else {
            content.load(opts.url);
        }
        //激活TAB
        tab_li.find('#tab_' + id).addClass('active');
        tab_content.find('#' + id).addClass('active');

        $.addtabs.drop();
        settings.callback();
    };
    $.addtabs.close = function (opts) {
        //如果关闭的是当前激活的TAB，激活他的前一个TAB
        if ($("#tab_" + opts.id).hasClass('active')) {
            if ($('#tab_' + opts.id).parents('li.tabdrop').length > 0 && !$('#tab_' + opts.id).parents('li.tabdrop').hasClass('hide')) {
                $('#tab_' + opts.id).parents('.nav-tabs').find('li').last().addClass('active');
            } else {
                $("#tab_" + opts.id).prev('li').addClass('active');
            }
            $("#" + opts.id).prev().addClass('active');
        }
        //关闭TAB
        $("#tab_" + opts.id).remove();
        $("#" + opts.id).remove();
        $.addtabs.drop();
        settings.callback();
    };
    $.addtabs.closeself = function () {
        var currentid = target.find("li.active").children('a:first').attr('aria-controls');
        var opts = { 'id': currentid };
        $.addtabs.close(opts);
    };
    ///子页点击关闭
    $.addtabs.closeTo = function (targetid) {
        var currentid = target.find("li.active").children('a:first').attr('aria-controls');
        if ($("#tab_" + targetid).length > 0) {
            $("#tab_" + currentid).remove();
            $("#" + currentid).remove();
            $.addtabs.drop();
            settings.callback();

            var id = $($("#tab_" + targetid)).children("a").attr("aria-controls");
            var url = $($("#tab_" + targetid)).attr('aria-url');
            var ajax = $($("#tab_" + targetid)).attr('aria-ajax');
            $.addtabs.add({
                'id': id,
                'url': url,
                'refresh': true,
                'ajax': ajax
            });
        }
        else {
            $.addtabs.close({ 'id': currentid });
        }

    };
    $.addtabs.closeAll = function (target) {
        if (typeof target == 'string') {
            target = $('body').find(target);
        }
        $.each(target.find('li[id]'), function () {
            var id = $(this).children('a').attr('aria-controls');
            $("#tab_" + id).remove();
            $("#" + id).remove();
        });
        target.find('li[role = "presentation"]').first().addClass('active');
        var firstID = target.find('li[role = "presentation"]').first().children('a').attr('aria-controls');
        $('#' + firstID).addClass('active');
        $.addtabs.drop();
    };
    $.addtabs.drop = function () {
        //创建下拉标签
        var dropdown = $('<li>', {
            'class': 'dropdown pull-right hide tabdrop tab-drop nav-tabs-header'
        }).append($('<a>', {
            'class': 'dropdown-toggle',
            'data-toggle': 'dropdown',
            'href': '#'
        }).append($('<i>', {
            'class': "fa fa-align-justify"
        })).append($('<b>', {
            'class': 'caret'
        }))).append($('<ul>', {
            'class': "dropdown-menu"
        }))
        $('.content-wrapper').find('.menu-tabs').each(function () {
            var element = $(this);
            //检测是否已增加
            if (element.find('.tabdrop').length < 1) {
                dropdown.prependTo(element);
            } else {
                dropdown = element.find('.tabdrop');
            }
            //检测是否有下拉样式
            if (element.parent().is('.tabs-below')) {
                dropdown.addClass('dropup');
            }
            var collection = 0;
            //检查超过一行的标签页
            element.append(dropdown.find('li')).find('>li').not('.tabdrop').each(function () {
                //console.log(this.offsetTop);
                if (this.offsetTop > 0 || element.width() - $(this).position().left - $(this).width() < 83) {
                    dropdown.find('ul').prepend($(this));
                    collection++;
                }
            });
            //如果有超出的，显示下拉标签
            if (collection > 0) {
                dropdown.removeClass('hide');
                if (dropdown.find('.active').length == 1) {
                    dropdown.addClass('active');
                } else {
                    dropdown.removeClass('active');
                }
            } else {
                dropdown.addClass('hide');
            }
        })
    }
}(jQuery);



+function ($) {
    $.addtabs();
}(jQuery);


