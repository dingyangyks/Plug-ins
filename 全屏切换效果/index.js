(function($){
    var PageSwitch = {
        PageSwitch:function(){
            this.element = element;
        }
    };

    PageSwitch.prototype = {
        // 初始化的一个方法
        init:function(){
            
        }
        //获取页面数量
        //获取滑动宽度/高度
        // 向上滑动一页
        // 向下滑动一页
        // 横屏情况下布局
        // 竖屏情况下布局
        // 滚动鼠标事件/键盘事件
        // 滑动动画
            
        
    }




    $.fn.PageSwitch = function () {
        var me = $(this);
        var instance = me.data('PageSwitch');
        if(!instance){
            me.data('PageSwitch',(instance = new PageSwitch()));//如果没有就创建一个'PageSwitch'对象
        }
    }//在$原型上定义一个方法 这个方法用来判断所选取的元素上面是否存在Pageswitch这个对象 没有则创建，有则返回

    // 配置参数,pageSwitch上面自定义一个参数属性，用来设置所需要的参数
    $.fn.pageSwitch.parameter = {
        neededClass:{
            container:'.container',
            item:'.item',
            page:'.page',
            active:'.active'
        },
        index:0,//从第几页开始
        direction:'vertical',//水平的horizontal
        loop:true,//是否可以循环
        paging:true,//是否进行分页处理
        keyboard:true,//是否支持键盘事件
        // 动画
        duration:500,
        easing:'easing',
        callback:''
    }
    console.log()
})(jQuery);

// 单例模式
