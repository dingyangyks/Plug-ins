(function ($) {

    $.fn.Carousel = function (setting) {
        var carousel = new Carousel(this, setting);//this = 所选取的元素
        return carousel.init();
    };

    function Carousel(elem, setting) {
        this.elem = elem;
        this.elemListWrap = $(elem).find('ul');//ul
        // 默认参数
        this.setting = $.extend({
            // 缩放
            scale:1,
            // 速度
            // 是否淡入淡出
            // 是否滑动
            // 从第几张显示
        }, setting);
    }

    Carousel.prototype = {
        init: function () {
            this.setImg();
            this.setBtn();
            return this;
        },

        // 插入图片
        setImg: function () {
            var me = this;
            var img_html = '';
            var arr = me.setting.imgArr;
            img_html = '<li><img class="holder" data-src=' + arr[arr.length - 1] + '></li>';
            $.each(arr, function (index, item) {
                img_html += '<li><img class="holder" data-src=' + item + '></li>';
            })
            img_html += '<li><img class="holder" data-src=' + arr[0] + '></li>';
            $('.carousel>ul').html(img_html);
            me.loadImage(me.setSize.bind(me));
        },
        // 设置按钮和焦点
        setBtn: function () {
            var me = this;
            var btn_html = '';
            var arr = me.setting.imgArr;
            var scale = me.setting.scale;
            btn_html = '<div class="slideshow-left-btn" id="slideshow-left-btn"></div><div class="slideshow-right-btn" id="slideshow-right-btn"></div>';
            $('.carousel').append(btn_html);

            var point_html = '<div class="img-point">';
            for (var i = 0; i < arr.length; i++){
                point_html += '<i data-index="'+ (i+1) +'"></i>'
            }
            point_html += '</div>'
            $('.carousel').append(point_html);
            $('.img-point>i:first').addClass('select');
            var oldWidth = $('.img-point>i:first').width();
            $.each($('.img-point>i'),function (index,item) {
                $(item).width(oldWidth * scale);
                $(item).height(oldWidth * scale);
            });
        },

        // 设置尺寸
        setSize: function () {
            var me = this;
            var scale = me.setting.scale;
            // ul的宽度是所有图片宽度之和
            var children = $(this.elemListWrap).find('img');//this = ul;
            me.elemListWrap.css('width', function () {//this = Carousel
                var perWidth = children.eq(0).width() * scale;
                children.width(perWidth);
                $(me.elem).css('width', perWidth);
                return perWidth * children.length;
            });
        }, 

        loadImage: function (callback) {
            var list = $('.holder');
            var len = list.length;
            if (!len) return;
            list.each(function (index, item) {
                var img = new Image();
                var url = $(item).data('src');
                img.onload = function () {
                    img.onload = null;
                    // console.log(url)
                    $(item).attr('src', url).removeClass('holder');
                    --len == 0 && callback();
                }
                img.onerror = function () {
                    len--;
                    console.log('第' + index + '张图片：' + url + '图片加载错误时,发生调用');
                };
                img.src = url;
            })
        },

        prev: function () {
            console.log('qianyige');
        }
    };



})(jQuery);

