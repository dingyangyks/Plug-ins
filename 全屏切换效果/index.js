// 全屏滚动插件
(function ($) {
    // 把该对象注册在$上
    $.fn.ScreenSwitch = function (setting) {
        var screenSwitch = new ScreenSwitch(this, setting);
        screenSwitch.init();
    }

    // 构造函数
    function ScreenSwitch(elem, setting) {
        this.elem = elem;
        this.$wrap = $('.wrap');
        this.$switch= $('.screenSwitch');
        this.canScroll = true;
        this.index = 0;
        this.setting = $.extend({
            loop: false,
            keyboard: true,
            direction: 'vertical',//滑动方向vertical,horizontal
            easing: "ease",		//动画效果
            duration: 500		//动画执行时间
        }, setting);
    }

    // 原型 方法
    ScreenSwitch.prototype = {
        // 初始化
        init: function () {
            this.initContainer();
            this.setHtml();
            this.bindEvent();
            return this;
        },
        initContainer: function () {
            this.$wrap.addClass(this.setting.direction);
            this.$switch.width(this.$wrap.width() * this.setting.imgArr.length);
        },
        // 设置html
        setHtml: function () {
            // 设置背景图片
            var me = this;//dom对象 ScreenSwitch
            var arr = this.setting.imgArr;
            var direction = me.setting.direction;
            var $wrap = $('.wrap');
            var itemSize = "width:" + $wrap.width() + "px;height:" + $wrap.height() + "px;"
            var html = '';
            var point_html = '';
            point_html = '<div class="js-points-wrap points-wrap">';
            for (var i = 0; i < arr.length; i++) {
                html += '<div class="item" style="' + itemSize + 'background-image:url(' + arr[i] + ')" id="item' + (i + 1) + '"></div>';
                point_html += '<i class="js-points points"  data-index ="' + (i + 1) + '"></i>';
            }
            point_html += '</div>';
            me.$switch.html(html).parent().append(point_html);
            $('.js-points:first').addClass('active');
        },

        // 页面数量
        pageCount: function () {
            return $('.item').length;
        },

        // 获取屏幕的宽高
        getSize: function () {
            var me = this;
            if (me.setting.direction === 'vertical') {
                return me.$wrap.height();
            }
            return me.$wrap.width();
        },

        // 滚动
        bindEvent: function () {
            var me = this;
            // 滚轮事件
            me.elem.on('mousewheel', function (ev) {
                if (!me.canScroll) return;
                var data = ev.originalEvent.wheelDelta;
                if (data < 0) {
                    me.next();
                } else if (data > 0) {
                    me.prev();
                }
            })

            // 键盘事件
            if (me.setting.keyboard) {
                $(window).keydown(function (ev) {
                    var keyCode = ev.keyCode;
                    if (keyCode === 38) {
                        me.prev();
                    } else if (keyCode === 40) {
                        me.next();
                    }
                })
            }

            // 焦点点击事件
            $('.js-points-wrap').delegate('i', 'click', function (ev) {
                var target = ev.target;
                me.index = target.dataset.index - 1;
                me.scrollPage();
            })

            // 动画结束
            me.elem.on('transitionend', function () {
                me.canScroll = true;
            })
        },

        // 下一屏
        next: function () {
            var me = this;
            var loopState = me.setting.loop;
            me.index++;
            if (me.index > me.pageCount() - 1) {
                if (!loopState) {
                    me.index--;
                    return;
                } else {
                    me.index = 1;
                    return;
                }
            }
            me.scrollPage();
        },
        // 上一屏
        prev: function () {
            var me = this;
            var loopState = me.setting.loop;
            if (me.index > 0) {
                me.index--;
            } else {//=0
                if (loopState) {
                    me.index = me.pageCount() ;
                    return;
                } else {
                    return;
                }
            }
            me.scrollPage();
        },

        // 动画
        scrollPage: function () {
            var me = this;
            me.canScroll = false;
            var translate_direction = me.setting.direction === 'vertical' ? 'translateY' : 'translateX';
            me.$switch.css("transition", "all " + me.setting.duration + "ms " + me.setting.easing);
            me.$switch.css("transform", translate_direction + "(-" + me.getSize() * me.index + "px)");
            me.pointColor();
        },

        // 焦点改变颜色
        pointColor: function () {
            $('.js-points').eq(this.index).addClass('active').siblings("i").removeClass('active');
        }
    }
})(jQuery)
