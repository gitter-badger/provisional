/*
 * Author:liaohs
 * Date:2016.3.24
 * Name:boomgame
 */

// dataport.headimg

var myLoginInfo = JSON.parse(localStorage.getItem("myLoginInfo"))

var applyStatues = {
    apply: [true, false, false, false],
    wait: [false, true, false, false],
    teached: [false, false, true, false],
    end: [false, false, false, true]
}


mainApp.controller('color', ["$scope", "$http", 'ajax', function ($scope, $http, ajax) {

    $scope.myTeacherId = 4;

    $scope.$watch('myTeacherId', function (newVal, oldVal) {

        try {
            $scope.myTeacherQQ = teacherContact[newVal].qq || '291656130'
        } catch (e) {
            $scope.myTeacherQQ = '291656130'
        }

    })

//获取老师信息
    $scope.allTeachers = {};
    ajax.get(
        dataport.getAllteachers,
        function (data, status, header, config) {
            if (!data.error) {
                try {
                    angular.forEach(data.data, function (v, i) {
                        $scope.allTeachers[v.userId] = v
                    })
                    $scope.getApplyStatue();
                    $scope.getAllTeachersComments();
                    console.log($scope.allTeachers);
                } catch (e) {
                }
            }
        },
        function (err) {
        }
    )


    /* --------------------- 获取基础信息 --------------------  */

    $scope.student = myLoginInfo
    // console.log(myLoginInfo)
    /* --------------------- 获取申请状态 --------------------  */
    $scope.getApplyStatue = function () {
        $http.get(dataport.applyStatue + "?studentNum=" + myLoginInfo.studentNum, {
            contentType: 'application/json;charset=UTF-8',
            datatype: "json"
        })
            .success(function (data) {
                if (!data.error) {
                    var applyStatue = data.data.statue
                    $scope.applyStatue = applyStatues[applyStatue]

                    try {
                        $scope.myTeacherId = data.data.data.applyDetail.teacherId || 4;
                    } catch (e) {
                        $scope.myTeacherId = 4
                    }

                    setTimeout(function () {
                        $(".applyparts").removeClass("hidden")
                    }, 100)

                    switch (data.data.statue) {
                        case "apply":

                            break;
                        case "wait":
                            var waitapplyDetail = data.data.data.applyDetail

                            var waitTotal = (waitapplyDetail.teachTime - waitapplyDetail.applyTime) / (24 * 60 * 60 * 1000); //总共等待天数
                            var waitNeed = data.data.data.waitDays; //还需等待天数
                            var waitAlready = waitTotal - waitNeed; //以等待天数
                            var barwidth = (waitAlready * 100 / waitTotal).toFixed(2)

                            var teacherId = data.data.data.applyDetail.teacherId;

                            var teacher = $scope.allTeachers[teacherId];
                            console.log(teacher);
                            if (teacher) {
                                $scope.teacherQQ = teacher.qq;
                            } else {
                                $scope.teacherQQ = '2638987608';
                            }


                            waitapplyDetail.barwidth = Number(barwidth)
                            waitapplyDetail.waitNeed = waitNeed
                            waitapplyDetail.YMD = Timehandle1(waitapplyDetail.teachTime)
                            waitapplyDetail.hm = Timehandle2(waitapplyDetail.teachTime)

                            if (waitapplyDetail.teacherId == null) {
                                waitapplyDetail.teacherShow = false
                            }
                            if (waitapplyDetail.teacherId != null) {
                                waitapplyDetail.teacherShow = true
                                waitapplyDetail.teacherName = waitapplyDetail.teacherId ? ($scope.allTeachers[waitapplyDetail.teacherId] ? $scope.allTeachers[waitapplyDetail.teacherId].name : "") : "";
                            }
                            if (waitapplyDetail.teachModeType == 0) {
                                waitapplyDetail.heroShow = true
                            }
                            if (waitapplyDetail.teachModeType == 1) {
                                waitapplyDetail.heroShow = false
                            }
                            waitapplyDetail.teachMode1 = waitapplyDetail.teachMode.replace(/&/gi, ' ')
                            // console.log(waitapplyDetail)

                            $scope.waitInfo = waitapplyDetail;


                            break;
                        case "teached":


                            break;
                        case "end":

                            $scope.waitDays = data.data.data.waitDays

                            break;
                    }

                }
            })
            .error(function (e) {
                // console.log(e)
            });

    }


    /* --------------------- 获取申请状态 --------------------  */


    /* --------------------- mybaseInfo --------------------  */

// dataport.teachersComments

// ============
// 获取我的信息


    $http.get(dataport.userStatue, {contentType: 'application/json;charset=UTF-8', datatype: "json"})
        .success(function (data) {
            console.log(data)
            BOOMLogging.Action({
                studentNum: data.auth.studentNum,
                classId: data.boomClass.classId,
                actionName: "一对一",
                project: 'school'
            })
            $scope.myClassInfos = data.boomClass;
        })
        .error()
    $http.get(dataport.growthPlanInfo, {contentType: 'application/json;charset=UTF-8', datatype: "json"})
        .success(function (data) {
            if (data.data) {
                $scope.myteacherId1 = data.data.teacherId
            } else {
                $scope.myteacherId1 = 10
            }
        })
        .error(function () {
            $scope.myteacherId1 = ''
        })


    /* --------------------- allteachers --------------------  */

    $scope.teachers = []
    ajax.get(dataport.getAllteachers,
        function (data) {
            if (data.error) {
            }
            else {
                if (data.data) {
                    teachersFunc(data.data, showTeachers)
                }
            }
        }, function (err) {

        })

    function teachersFunc(data, callback) {
        var arr = []
        for (var i = 0; i < data.length; i++) {
            var v = data[i]
            arr[v.userId] = v
        }
        console.log(arr);
        callback(arr)
    }

    function showTeachers(data) {
        // console.log(data)
        // console.log(teachersOrder.length)

        for (var i = 0; i < teachersOrder.length; i++) {

            var index = teachersOrder[i]

            if (data[index]) {

                data[index].headimg = dataport.headimg + data[index].header
                $scope.teachers.push(data[index])
            }


        }
        console.log($scope.teachers)
        $scope.$watch('myteacherId1', function (n, o) {
            console.log(n)
            for (var i = 0; i < $scope.teachers.length; i++) {

                if (n == $scope.teachers[i].userId) {
                    var a = $scope.teachers[0]
                    var b = $scope.teachers[i]
                    $scope.teachers[0] = b
                    $scope.teachers[i] = a
                }
            }
            setTimeout(function () {

                $("#teacher-list").slide({
                    titCell: "",
                    mainCell: "#teacher-list-ul",

                    effect: "leftLoop",
                    autoPlay: true,
                    vis: 3,
                    scroll: 1,
                    delayTime: 500,
                    interTime: 3000,
                    nextCell: ".star-cycle",
                    mouseOverStop: true,
                    //returnDefault:true,
                    easing: "swing",
                    pnLoop: true
                });
            }, 200)

        })
    }


    $http.get(dataport.onetooneAllteachers, {contentType: 'application/json;charset=UTF-8', datatype: "json"})
        .success(function (data) {
            if (!data.error) {
                if (typeof data.data != undefined) {
                    for (var i = 0; i < data.data.length; i++) {
                        var a = data.data[i]
                        a.well = (a.wellPrecent > 0) ? a.wellPrecent : 100;
                        var a1 = a.teacherId
                        for (var i1 in $scope.teachers) {
                            var b1 = $scope.teachers[i1].teacherId
                            if (a1 == b1) {
                                $scope.teachers[i1].well = a.well
                            }
                        }
                    }
                }

            }

            $scope.serviceIsOpen = false
            /*  能否预约   */
            $http.get(dataport.serviceIsOpen, {contentType: 'application/json;charset=UTF-8', datatype: "json"})
                .success(function (data) {
                    $scope.isGotTs = !0

                    if (!data.error) {
                        if (data.data.ok) {
                            $scope.serviceIsOpen = true
                        }
                    }

                })
                .error(function (e) {
                    // console.log(e)
                });


            $scope.$watch('teachers', function (n, v) {


            })
        })
        .error(function (e) {
            // console.log(e)
        })
    /* --------------------- allteachers --------------------  */


    /* --------------------- allteacherscomments --------------------  */


    $scope.getAllTeachersComments = function () {

        $http.post(dataport.teachersComments, {page: 0, size: 10}, {datatype: "json"})
            .success(function (data) {
                // console.log(data)
                $scope.pagesArr = {
                    now: data.nowPage,
                }
                $scope.pagesArr.prev = (function () {
                    return (data.nowPage - 1 > 0) ? data.nowPage - 1 : 0
                })()
                $scope.pagesArr.next = (function () {
                    return (data.nowPage + 1 < data.totalPage - 1) ? data.nowPage + 1 : data.totalPage - 1
                })()

                CommentFunc(data)

            })
            .error(function (e) {
                // console.log(e)
            })
    }


    $scope.pagesShow = false
    $scope.pagesShow1 = false
    $scope.pagesShowTottle1 = function () {
        $scope.pagesShow1 = !$scope.pagesShow1
    }
    $scope.pagesShowTottle = function () {
        $scope.pagesShow = !$scope.pagesShow
    }


    $scope.commentChange = function (a) {
        $scope.pagesShow = false
        $scope.pagesShow1 = false
        $http.post(dataport.teachersComments, {page: a, size: 10}, {datatype: "json"})
            .success(function (data) {
                $scope.pagesArr = {
                    now: data.nowPage,
                }
                $scope.pagesArr.prev = (function () {
                    return (data.nowPage - 1 > 0) ? data.nowPage - 1 : 0
                })()
                $scope.pagesArr.next = (function () {
                    return (data.nowPage + 1 < data.totalPage - 1) ? data.nowPage + 1 : data.totalPage - 1
                })()

                CommentFunc(data)

            })
            .error(function (e) {
                // console.log(e)
            })
    }


    /* --------------------- allteacherscomments --------------------  */


// dataport.serviceIsOpen
    /* --------------------- serviceIsOpen --------------------  */
    $http.get(dataport.serviceIsOpen, {contentType: 'application/json;charset=UTF-8', datatype: "json"})
        .success(function (data) {
        })
        .error(function (e) {
            // console.log(e)
        })

    /* --------------------- serviceIsOpen --------------------  */

// dataport.applyPraise=publicport+"boot/oneToOne/applyPraise" //评论点赞 studentNum,applyId//点赞
    /* --------------------- 点赞 --------------------  */
    $scope.applyPraise = function (a, b, c) {

        $http.get(dataport.applyPraise + "?studentNum=" + a + "&applyId=" + b, {
            contentType: 'application/json;charset=UTF-8',
            datatype: "json"
        })
            .success(function (data) {
                if (data.data == null) { //已点赞

                } else {  //未点赞
                    for (var i in $scope.listsData) {
                        if ($scope.listsData[i].$$hashKey == c) {
                            $scope.listsData[i].praise += 1
                        }
                    }
                }
            })
            .error(function (e) {
                // console.log(e)
            })
    }
    /* --------------------- 点赞 --------------------  */


    function CommentFunc(data) {
        if (!data.error) {
            data.nowpage = data.nowPage + 1

            data.pageList = (function () {
                var arr = []
                for (var i = 0; i < data.totalPage; i++) {
                    var b = {}
                    b.num = i
                    arr.push(b)
                }

                return arr
            })()

            try {
                data.pageList[data.nowPage].css = "active"
            } catch (e) {
            }

            $scope.teachersComments = data
            $scope.teachersComments.nowlists = (function () {

                var a = $scope.teachersComments.nowPage * $scope.teachersComments.size + 1
                var b = ($scope.teachersComments.nowPage + 1) * $scope.teachersComments.size
                if (b > $scope.teachersComments.totalElement) {
                    b = $scope.teachersComments.totalElement
                }
                return a + "-" + b
            })()

            for (var i = 0; i < data.data.length; i++) {
                data.data[i].teacherName = data.data[i].teacherId ? ($scope.allTeachers[data.data[i].teacherId] ? $scope.allTeachers[data.data[i].teacherId].name : "") : "";
            }


            $scope.listsData = data.data
            for (var i = 0; i < $scope.listsData.length; i++) {
                var header = $scope.listsData[i].header

                if (header == null || header == "") {
                    $scope.listsData[i].headimg = localPath.defaultimg + "defaultIco.png"
                } else {
                    $scope.listsData[i].headimg = dataport.headimg + header
                }

                var timeDiffermm = Math.floor(($scope.listsData[i].now - $scope.listsData[i].closeTime) / (1000 * 60))
                var timeDifferhh = Math.floor(timeDiffermm / 60)
                var timeDifferdd = Math.floor(timeDifferhh / 24)

                if (timeDifferdd > 0) {
                    $scope.listsData[i].timeBefore = timeDifferdd + "天前"
                } else {
                    if (timeDifferhh > 0) {
                        $scope.listsData[i].timeBefore = timeDifferhh + "小时前"
                    } else {
                        if (timeDiffermm > 0) {
                            $scope.listsData[i].timeBefore = timeDiffermm + "分钟前"
                        } else {
                            $scope.listsData[i].timeBefore = "刚刚"
                        }
                    }
                }
            }
            // console.log($scope.listsData)
        }
    }

}])