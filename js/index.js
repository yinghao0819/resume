let loadingRender =(function(){
    let $loadingBox = $('.loadingBox'),
        $run = $loadingBox.find('.run');

    //=>我们需要处理的图片
    let imgList = ["img/clock.jpg","img/zf-cube1.png","img/zf-cube2.jpg","img/zf-cube3.jpg","img/zf-cube4.jpg","img/zf-cube5.jpg","img/zf_cubeBg.jpg"];

    let total = imgList.length,
        cur = 0;

    //=>控制图片加载进度，计算滚动条加载长度
    let computed  = function(){
        imgList.forEach(function(item){
            let tempImg = new Image;
            tempImg.src= item;
            tempImg.onload = function(){
                cur++;
                tempImg = null;
                runFn();
            }
        });
    };

    //=>计算加载长度
    let runFn = function(){
        $run.css('width',cur/total*100+'%');
        if(cur>=total){
            //=>需要延迟的图片都加载成功了:进入到下一个区域(设置一个缓冲等待时间，当加载完成，让用户看到加载完成的效果，再进入到下一个区域)
            let delayTimer = setTimeout(()=>{
                $loadingBox.remove();
                phoneRender.init();
                clearTimeout(delayTimer);
            },1500);
        }
    }

    return {
        init:function(){
            $loadingBox.css('display','block');//=>我们在CSS中把所有区域的display都设置为none,以后开发的时候，开发哪个区域，就执行哪个区域的INIT方法，在这个方法中首先控制当前区域展示（开发哪个区域哪个区域展示，其他都是隐藏的）
            computed();
        }
    }
})();

let phoneRender =(function($){
    let $phoneBox = $('.phoneBox'),
        $time = $phoneBox.find('.time'),
        $listen = $phoneBox.find('.listen'),
        $listenTouch = $listen.find('.touch'),
        $detail = $phoneBox.find('.detail'),
        $detailTouch = $detail.find('.touch');
    let audioBell = $('#audioBell')[0],
        audioSay = $('#audioSay')[0];

    let $phonePlan = $.Callbacks();

    //=>控制盒子的显示隐藏
    $phonePlan.add(function(){
        $listen.remove();
        $detail.css('transform','translateY(0)');
    });

    //=>控制SAY播放
    $phonePlan.add(function(){
        audioBell.pause();
        audioSay.play();
        audioSay.volume = .1;
        $time.css('display','block');

        //=>控制播放时间
        let sayTimer = setInterval(()=>{
            //=>总时间和已经播放时间：单位秒
            let duration = audioSay.duration,
                current=audioSay.currentTime;

            //=>播放结束
            if(current>=duration){
                clearInterval(sayTimer);
                enterNext();
            }

            let minute = Math.floor(current/60);
            let second = Math.floor(current-minute*60);

            minute<10?minute='0'+minute:null;
            second<10?second='0'+second:null;

            $time.html(`${minute}:${second}`);
        },1000);
    });

    //=>DETAIL-TOUCH
    $phonePlan.add(()=>$detailTouch.tap(enterNext));

    //=>进入下一个区域
    let enterNext=function(){
        audioSay.pause();
        $phoneBox.remove();
        messageRender.init();
    };

    return {
        init:function(){
            $phoneBox.css('display','block');

            //=>控制BELL播放
            audioBell.play();
            audioBell.volume=.1;

            //LISTEN-TOUCH
            $listenTouch.tap($phonePlan.fire);
        }
    }
})(Zepto);

/*----MESSAGE---*/
let messageRender =(function($){
    let $messageBox = $('.messageBox');
    return {
        init:function(){
            $messageBox.css('display','block');
        }
    }
})(Zepto);


loadingRender.init();