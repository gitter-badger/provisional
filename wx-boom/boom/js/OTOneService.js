/**
 * Created by Administrator on 2016/11/23.
 */
$(function () {

    var thisApi = {
        statue: {dev: "mock/statue.json",
            test: "http://192.168.1.150:9000/wx/school/v1.0/statue",
            product: "/wx/school/v1.0/statue"
        },
        //是否显示评论的接口
        evaluate: {
            dev: "mock/evaluate.json",
            test: "http://192.168.1.150:9000/wx/school/v1.0/oto/lol/hasNeedEvaluate?studentNum=666",
            product: "/wx/school/v1.0/evaluate"
        },
        //获取我的预约信息接口
        appoint: {
            dev: "mock/appoint.json",
            test: "http://192.168.1.150:9000/wx/school/v1.0/oto/lol/statue",
            product: "/wx/school/v1.0/appoint"
        },

        //获取推荐老师的接口
        recommend: {
            dev: "mock/recommend.json",
            test: "http://192.168.1.150:9000/wx/school/v1.0/oto/lol/recommend",
            product: "/wx/school/v1.0/recommend/"
        },
        //获取最新动态的接口
        dynamics: {
            dev: "mock/dynamics.json",
            test: "http://192.168.1.150:9000/wx/school/v1.0/oto/lol/latestDynamics",
            product: "/wx/school/v1.0/dynamics"
        }
    };
    bMock.setFace(thisApi);
    bMock.setEnv("dev")


    //获取登录状态
    function getStatus() {
        $.get(bMock.getFace("evaluate"), function (data, status) {
            if (!data.data) {
                window.location.href = "index.html?" + window.location.pathname + window.location.search;
            } else {
                console.log("登录成功！");
            }
        });
    }

    //时间戳转换
    function formatDate(now) {
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var week = now.getDay();
        var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        var hour = now.getHours();
        var minute = now.getMinutes();
        return month + " 月 " + date + " 日 " + " ( " + weekDay[week] + " ) " + hour + ":" + minute;
    }

    //老师信息查询
    function getTeacher(value) {
        var thisTeacher;
        $.ajax({
            async: false,
            url: bMock.getFace("teacher"),
            success: function (data, status) {
                thisTeacher = data.data;
            }
        });
        return thisTeacher;
    }

    //获取预约信息
    function getReserve(){
        $.get("wx/school/v1.0/statue", function (data, status) {
            if (!data.data) {
                window.location.href = "index.html?" + window.location.pathname + window.location.search;
            } else {
                console.log("登录成功！");
            }
        });
    }

    //获取评论信息
    function getEvaluate() {
        $.get(bMock.getFace("evaluate"), function (data, status) {
            console.log(data.data);
            var thisEvaluateStatus = data.data;
            if(thisEvaluateStatus.length===0){
                console.log("data中没有数据");
                $(".evaluate").show();
            }else{
                console.log("data中有数据");
                $(".evaluate").hide();
            }
        });
    }

    //获取我的预约信息
    function getAppoint(){
        $.get(bMock.getFace("appoint"), function (data, status) {
            switch (data.data.statue) {
                case "apply" :
                    console.log('无预约，隐藏预约模块');
                    $(".appoint").hide()
                    $(".deta").hide()
                    break;
                case "wait" :
                    console.log('已经有申请，需要等待');
                    var appointTime=data.data.lolServiceApplyDetailResponse.appointTime;
                    var nowTime=new Date().getTime()
                    if(nowTime-appointTime<=0){
                        console.log("更改（更多==》正在进行）,渲染数据");
                        $(".appointment>a").text("正在进行");

                    }else{
                        console.log("直接渲染数据");
                        $(".timer-two p:nth-child(1)")
                            .text(formatDate(new Date(data.data.lolServiceApplyDetailResponse.appointTime)));


                         //    点击更多显示
                        $(".appointment>a").click(function(){
                            if($(".appointment>a").text()!="正在进行"){
                                if($(".more-box").css("display")=="none" ){
//                $(".more-box").css("display","block");
                                    $(".more-box").show(1000);
                                    $(this).text("取消");
                                }else{
//                $(".more-box").css("display","none")
                                    $(".more-box").hide(1000);
                                    $(this).text("更多");
                                }
                            }

                        });
                        //     点击显示模态框
                        $(".more1").click(function(){
//            $(".bomb").show();
                            $(".bomb").fadeIn(1000)
                        });
                        //    点击取消显示
                        $(".submit").click(function(){
                            $(".bomb").fadeOut(1000);
                            $(".more-box").hide(1000);
                            $(".appointment>a").text("更多");
                        })


                    }

                    break;
                case "end" :
                    console.log('进入cd期');

                    var sday=Math.floor(data.data.waitDays/24);
                    var stime=data.data.waitDays-sday*24;
                    console.log("还剩"+sday+"天"+stime+"时");
                    $(".detailed").text("进入cd期，"+"还剩"+sday+"天"+stime+"时"+"后可以进行下次一对一教学")
                        .css({"text-align": "center","line-height": "80px"})
                    break;
                default:
                    console.log('一对一其他状态');
            };

        });
    }

    //获取优秀老师信息
    function getRecommend() {
        $.get(bMock.getFace("recommend"), function (data, status) {
            console.log(data.data);
            var sections="";
            $.each(data.data,function(i,v){
                var section1="";
                section1+= '<div class="teac2 teac">'+'<div class="teacher-in">'+'<img src="images/teacher.png" >'+'<div class="teacherInt2 teacherInt">'+'<h3>'+data.data[i].name+'</h3>'+'<a href="javascript:;">明天预约</a>'+'</div>'+'<div class="introduce">'+'<div class="introduce-one">'+'<p>授课范围:</p>'+'<p>累计完成:</p>'+'<p>擅长英雄:</p>'+'</div>'+'<div class="introduce-two2 introduce-two">'+'<p>'+data.data[i].teachRange+'</p>'+'<p>378次一对一教学</p>'+'<p>'+'<img class="in-img" src="'+data.data[i].imgs+'" >'+'<img class="in-img" src="images/in.png" >'+'<img class="in-img" src="images/in.png" >'+'<img class="in-img" src="images/in.png" >'+'<img class="in-img" src="images/in.png" >'+'</p>'+'</div>'+'</div>'+'<div class="clear"></div>'+'<p class="introduce-p">'+'<a class="introduce-th" href="revtProcessTmct.html?'+data.data[i].userId+'">预约老师</a>'+'</p>'+'</div>'+'</div>'

                sections+=section1;

            })
            $(".appointt").append(sections)

        });
    };





    //获取最新动态信息
    function getDynamics(){
        $.get(bMock.getFace("dynamics"), function (data, status) {
            console.log(data.data);
            var thisDynamicsStatus = data.data;
            $(".firsta").text((new Date(thisDynamicsStatus[0].teachFinishTime).getMinutes())+"分钟前");
            //studentEvaluate
            $(".dynamic-two1>div>span").text(thisDynamicsStatus[0].evaluateDetailDto.studentEvaluate);
            $(".dynamic-two2>div>span").text(thisDynamicsStatus[0].boomServiceTeacherEvaluateDto.teacherEvaluate);


        });
    }





    getStatus();
    getEvaluate();
    getAppoint();
    getRecommend();
    getDynamics();

})