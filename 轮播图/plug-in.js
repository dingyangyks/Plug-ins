(function ($) {

    $.fn.Carousel = function (setting) {
        var carousel = new Carousel(this, setting);//this = 所选取的元素
        return carousel.init();
    };

    function Carousel(elem, setting) {
        this.elem = elem;
        this.elemListWrap = $(elem).find('ul');//ul
        this.moveEnd = true;
        this.imgNum = 1;
        this.imgTimer = null;
        // 默认参数
        this.setting = $.extend({
            scale: 1,// 缩放
            speed: 'slow',// 速度slow,middle
        }, setting);
    }

    Carousel.prototype = {
        init: function () {
            this.setImg();
            this.setBtn();
            this.move();
            this.pointerEvent();
            this.imgAuto();
            this.imgStop();
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
            for (var i = 0; i < arr.length; i++) {
                point_html += '<i data-index="' + (i + 1) + '"></i>'
            }
            point_html += '</div>'
            $('.carousel').append(point_html);
            var $point = $('.img-point>i:first');
            $point.addClass('select');
            var oldWidth = $('.img-point>i:first').width();
            $.each($('.img-point>i'), function (index, item) {
                $(item).width(oldWidth * scale);
                $(item).height(oldWidth * scale);
            });
            var pointWidth = $point.outerWidth(true) * $('.img-point>i').length ;
            $('.img-point').css('width',pointWidth)
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
                me.elemListWrap.css('left', -perWidth);
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

        move: function () {
            var me = this;
            $('.slideshow-left-btn').on('click', function () {
                me.moveImg(-1);
            })
            $('.slideshow-right-btn').on('click', function () {
                me.moveImg(1);
            })
        },

        moveImg: function (index) {
            var me = this;
            if (!me.moveEnd) {//在点击一开始就要判断是否正在移动
                return;
            }
            me.imgNum += index;
            me.pointColor();
            var intervalTime = 10;
            var perDistance = 100;
            var distance = -$('.carousel li:first').width() * index;
            var imgSpeed = distance / (perDistance / intervalTime);
            var imgBox = $('.carousel ul');
            var leftAim = imgBox.position().left + distance;

            me.moveEnd = false;//移动开始之前把状态标记为正在移动
            imgGO();
            function imgGO() {
                var speed = me.setting.speed;
                switch (speed) {
                    case 'fast':
                        speed = 20;
                        break;
                    case 'middle':
                        speed = 50;
                        break;
                    case 'slow':
                        speed = 100;
                        break;
                    default:
                        console.log('请输入fast，middle，slow来设置速度');
                }

                var curPosition = imgBox.position().left;
                var curState = Math.ceil((leftAim - curPosition) / imgSpeed);
                if (curState >= 1) {
                    imgBox.css('left', curState >= 2 ? curPosition + imgSpeed : leftAim);
                    setTimeout(imgGO, speed);
                    return;
                }
                resetPosition();
            }

            function resetPosition() {
                me.moveEnd = true;//到到目标 停止移动 状态改为true 意为停止

                // var $imgBox = $('.carousel ul');
                var lenIndex = $('.carousel li').length;
                var initLeft = -$('.carousel li:first').width();
                var reSecondLeft = -$('.carousel li:first').width() * (lenIndex - 2);

                if (me.imgNum === 0) {
                    me.elemListWrap.css('left', reSecondLeft);
                    me.imgNum = 5;
                } else if (me.imgNum === 6) {
                    me.elemListWrap.css('left', initLeft);
                    me.imgNum = 1;
                }
            }

        },
        // 焦点改变颜色
        pointColor: function () {
            var me = this;
            $('.img-point').children().removeClass('select');
            newImgNum = me.imgNum == 0 ? 4 : (me.imgNum == 6 ? 0 : me.imgNum - 1)
            $('.img-point').children().eq(newImgNum).addClass('select');
            // console.log($('.img-point').children().eq(imgNum));
        },
        // 焦点事件
        pointerEvent: function () {
            var me = this;
            $('.img-point').delegate('i', 'click', function (event) {
                var target = event.target;
                me.moveImg(target.dataset.index - me.imgNum);
            })
        },

        // 自动播放
        imgAuto: function () {
            var me = this;
            me.imgTimer = setInterval(function () {
                me.moveImg(1);
            }, 5000);

        },

        // 停止自动播放
        imgStop: function () {
            var me = this;
            $('.carousel').on('mouseover', function () {
                clearInterval(me.imgTimer);
            }).on('mouseout', function () {
                me.imgAuto();
            });


        }
    }
})(jQuery);

