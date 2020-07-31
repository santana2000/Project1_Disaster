//距离测量，忽略地球曲率影响*********************************************************
//*********************************************************************************
function getLineDis(startPoint, endPoint) {
    var x2 = (endPoint.x - startPoint.x) * (endPoint.x - startPoint.x)
    var y2 = (endPoint.y - startPoint.y) * (endPoint.y - startPoint.y);
    var dis = Math.sqrt(x2 + y2) / 1000;
    return dis.toFixed(2);
}

function sum(arr) {
    var s = 0;
    for (var i = arr.length - 1; i >= 0; i--) {
        s += Number(arr[i]);
    }
    return s;
}


//地图聚合简易版*******************************************************************
//********************************************************************************
function showDetails(){
    //视角飞行
    viewer.scene.camera.flyTo( {
        destination : Cesium.Cartesian3.fromDegrees( 128.402, 21.747, 10000000 ),
        orientation : {
            heading : Cesium.Math.toRadians( -5 ),
            pitch : Cesium.Math.toRadians( -85 ),
            roll : Cesium.Math.toRadians( 0 )
        },
        duration : 3,//动画持续时间

    } );
    var KR = viewer.entities.add({
        id: "KR",
        position: new Cesium.Cartesian3.fromDegrees(127.837, 35.892, 30000),
        billboard: {
            image: "images/test/sanjiao.png",
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scale: 1.6,
            minimumPixelSize :188,
        },
        // show:false
    });
    var JP = viewer.entities.add({
        id: "JP",
        position: new Cesium.Cartesian3.fromDegrees(136.48, 35.267, 30000),
        billboard: {
            image: "images/test/sanjiao.png",
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scale: 1.6,
            minimumPixelSize :188,
        },
    });  
    {
        var x1 = new Cesium.Cartesian3.fromDegrees(127.02,  37.088, 60000); //kr
        var x2 = new Cesium.Cartesian3.fromDegrees(126.934, 36.173, 60000);
        var x3 = new Cesium.Cartesian3.fromDegrees(139.101, 35.483, 60000); //jp
        var x4 = new Cesium.Cartesian3.fromDegrees(128.667, 34.355, 60000);
    }
    //尝试使用computeflight函数替代自建数组
    var twoLevel = [x1, x2, x3, x4];
    for(var i=0; i<twoLevel.length;i++){
        twoLevel[i] = viewer.entities.add({
            id: "poi"+ (i+1),
            position: twoLevel[i],
            billboard: {
                image: "images/test/军事.png",
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                scale: 0.25,
                minimumPixelSize :68,
            },
            show:false
        });   
        // console.log(twoLevel[i].id);
        // return twoLevel
        // console.log('return后的内容不再执行');
    }
    // viewer.scene.postRender.removeEventListener(this.poipoi);
    viewer.scene.postRender.addEventListener(function(movement){
        var nowHeight = viewer.scene.globe.ellipsoid.cartesianToCartographic( viewer.scene.camera.position ).height;
        if(nowHeight < 2900000){
            JP.show = false;
            KR.show = false;
            for(var k=0; k<=3; k++){
                twoLevel[k].show = true;
                //获取方法二
                // var kk = 'poi' + k;
                // viewer.entities.getById(kk).show = true;
            }
        }
        if(nowHeight > 2900000){
            JP.show = true;
            KR.show = true;
            for(var k=0; k<=3; k++){
                twoLevel[k].show = false;
            }
        }
    });
    //后续点击事件监听--------------
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function(movement) {
        var pick = viewer.scene.pick(movement.position);
        // var earthPosition = viewer.camera.pickEllipsoid(
        // movement.position,
        // viewer.scene.globe.ellipsoid
        // ); //视角穿过球面点的位置
        console.log(pick);
        if (Cesium.defined(pick) && pick.id.id === "poi1") {
            console.log(pick.id.id);
            // _this.shipInfoVisible = true;
            // _this.shipValue = 0;
        } else if (Cesium.defined(pick) && pick.id.id === "poi2") {
            console.log(pick.id.id);
        }       
    },Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.setInputAction(function(movement) {
        handler = handler.destroy();
        // $("#infobox").hide();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

};



//********************************************************************************
//*******************************对外接口*****************************************
//********************************************************************************

module.exports = {
    getLineDis:getLineDis,
    sum:sum,
    showDetails:showDetails

}