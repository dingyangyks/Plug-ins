$(document).ready(function () {
    // 轮播图
    creatImg();
})


// 轮播图片/home/wy/code/ding/Plug-ins/轮播图/img/598abe88N80fb9275.jpg
var img_item = ['./img/5995829aN84f0e71b.jpg',
    './img/599fcc82N9ff1002f.jpg',
    './img/598abe88N80fb9275.jpg',
    './img/59954e1dNb2e1cfb5.jpg',
    './img//599a868aNf83ce587.jpg'];

// 轮播图
var imgNum = 1;
var moveEnd = true;
var imgTimer = null;

// 插入轮播图片
function creatImg() {
    var img_html = '';
    img_html = '<li><img class="holder" data-src=' + img_item[img_item.length - 1] + '></li>';
    $.each(img_item, function (index, item) {
        img_html += '<li><img class="holder" data-src=' + item + '></li>';
    })
    img_html += '<li><img class="holder" data-src=' + img_item[0] + '></li>';
    $('.slideshow>ul').html(img_html);
    loadImage(createSlideshow);
}

// 创建轮播
function createSlideshow() {
    $('.slideshow ul').attr('width', function () {
        // 设置ul的宽度
        var actualWidth = $('.slideshow li').length * $('.slideshow li:first').width();
        var initLeft = -$('.slideshow li:first').width();
        $('.slideshow ul').css('width', actualWidth);
        $('.slideshow ul').css('left', initLeft);
    })

    // 按钮绑定事件
    $('#slideshow-left-btn').on('click', function () {
        imgMove(-1);//向左移动图片下标减1
    })
    $('#slideshow-right-btn').on('click', function () {
        imgMove(1);
    })

    $('.slideshow').on('mouseover', imgStop).on('mouseout', imgAuto);

    imgAuto();
    pointerEvent();
}

// 图片懒加载
function loadImage(callback) {
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
            // console.log(url + '图片加载错误时,发生调用');
        };
        img.src = url;
    })
}

// 图片移动
function imgMove(index) {
    if (!moveEnd) {//在点击一开始就要判断是否正在移动
        return;
    }
    imgNum = index + imgNum;
    pointColor();

    var intervalTime = 10;
    var perDistance = 100;
    var distance = -$('.slideshow li:first').width() * index;
    var speed = distance / (perDistance / intervalTime);
    var imgBox = $('.slideshow ul');
    var leftAim = imgBox.position().left + distance;

    moveEnd = false;//移动开始之前把状态标记为正在移动
    function imgGO() {
        if ((speed > 0 && imgBox.position().left < leftAim) || (speed < 0 && imgBox.position().left > leftAim)) {
            imgBox.css('left', function () {
                return imgBox.position().left + speed;
            })
            setTimeout(imgGO, 50);
            return;
        }
        resetPosition();
    }
    // 智障写法
    // function resetPosition() {
    //     var imgBox = $('.slideshow ul');
    //     var lenIndex = $('.slideshow li').length;
    //     var reSecondLeft = -$('.slideshow li:eq(' + (lenIndex - 2 )+ ')').position().left;
    //     var reFirstLeft = -$('.slideshow li:eq(' + (lenIndex - 1 )+ ')').position().left;
    //     var initLeft = -$('.slideshow li:first').width(); 
    //     console.log($('.slideshow li:eq(0)'));
    //     console.log($('.slideshow li').eq(0))
    //     console.log($('.slideshow li').eq(0))

    //     if (imgBox.position().left === 0) {
    //         imgBox.css('left',reSecondLeft);
    //     } else if(imgBox.position().left === reFirstLeft) {
    //         imgBox.css('left',initLeft);
    //     }
    // }

    function resetPosition() {
        moveEnd = true;//到到目标 停止移动 状态改为true 意为停止

        var $imgBox = $('.slideshow ul');
        var lenIndex = $('.slideshow li').length;
        var initLeft = -$('.slideshow li:first').width();
        var reSecondLeft = -$('.slideshow li:first').width() * (lenIndex - 2);

        if (imgNum === 0) {
            $imgBox.css('left', reSecondLeft);
            imgNum = 5;
        } else if (imgNum === 6) {
            $imgBox.css('left', initLeft);
            imgNum = 1
        }
    }
    imgGO();

}

// 焦点改变颜色
function pointColor() {
    $('.img-point').children().removeClass('select');
    newImgNum = imgNum == 0 ? 4 : (imgNum == 6 ? 0 : imgNum - 1)
    $('.img-point').children().eq(newImgNum).addClass('select');
    // console.log($('.img-point').children().eq(imgNum));
}

// 焦点点击事件
function pointerEvent() {
    $('.img-point').delegate('i', 'click', function (event) {
        var target = event.target;
        imgMove(target.dataset.index - imgNum);
    })
}

// 自动播放
function imgAuto() {
    imgTimer = setInterval(function () {
        imgMove(-1);
    }, 5000);
}

// 停止自动播放
function imgStop() {
    clearInterval(imgTimer);
}