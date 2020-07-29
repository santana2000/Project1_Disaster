<template>
	<div class="home" ref="home">
		<!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
		<!-- 右边添加一排竖直方向的iconfont -->

		<div id="cesiumContainer" ref="getMap">
		</div>

		<div id="changeMap">
			<el-select v-model="value" placeholder="切换图层" @change="changeBaseMap">
					<el-option v-for="item in baseMaps" 
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
			</el-select>
		</div>
		<div class="menu">
			<el-button type="primary" plain @click="getMyPosition">位置查询  </el-button>
			<!-- <el-button type="primary" plain	@click="getMyDistance">距离测量</el-button> -->
			<!-- <el-button type="primary" plain @click="getHotMap">热力图  </el-button> -->
			<el-button type="primary" plain @click="getMapPhoto">专题图  </el-button>
			<!-- <el-button type="primary" plain @click="addModel">模型  </el-button> -->
			<el-button type="primary" plain @click="addPOI">POI点 </el-button>

		</div>
		<div id="poi">
			经纬度
		</div>
		<!-- <div id="putMap">

		</div> -->
	</div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import CesiumNavigation from "cesium-navigation-es6";
import echarts from 'echarts'
import html2canvas from 'html2canvas'; 

import RegisterCoordinateSystem from "../js/RegisterCoordinateSystem";
import "../js/EchartsLayer.js";

export default {
	name: "Home",
	components: {
		HelloWorld,
	},
	data(){
		return{
			age:20,
			value:'',
			baseMaps: [{
				value: '选项1',
				label: '矢量地图'
				}, {
				value: '选项2',
				label: '影像地图'
				}]
		}
	},
	mounted(){
		this.initMap();
	},
	methods:{
		initMap(){
        	Cesium.Ion.defaultAccessToken ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZTA3YWQ1MC04NGEwLTRiNGItYjlmMC03YmYyYjU2NWY5OTEiLCJpZCI6OTEwMywic2NvcGVzIjpbImFzbCIsImFzciIsImFzdyIsImdjIiwicHIiXSwiaWF0IjoxNTk0MTExNjM0fQ.yUm357eFGBOmUhDba64eAsSpXrYNpRg7cCpwzyz5FjE';
			
			var cesiumContainer = document.getElementById("cesiumContainer");
			window.viewer= new Cesium.Viewer("cesiumContainer",{
				animation : false,				//是否创建动画小器件，左下角仪表
				baseLayerPicker : false,		//是否显示图层选择器
				fullscreenButton : false,		//是否显示全屏按钮
				geocoder : false,				//是否显示geocoder小器件，右上角查询按钮
				homeButton : false,				//是否显示Home按钮
				infoBox : false,				//是否显示信息框
				sceneModePicker : false,		//是否显示3D/2D选择器
				selectionIndicator : false, 	//是否显示选取指示器组件
				timeline : false,				//是否显示时间轴
				navigationHelpButton : false,	//是否显示右上角的帮助按钮
				CreditsDisplay: false,
				contextOptions: {
					webgl:{
						alpha: true,
						depth:true,
						stencil:true,
						antialias:true,
						premultipliedAlpha:true,
						//通过canvas.toDataURL()实现截图需要将该项设置为true
						preserveDrawingBuffer:true,
						failIfMajorPerformanceCaveat:true
					}
				},
			});
			viewer._cesiumWidget._creditContainer.style.display="none";
    		viewer.scene.debugShowFramesPerSecond = true; //显示帧率
			window.myCanvas = viewer.canvas;
			window.camera = viewer.scene.camera;

			var navOptions = {};
			CesiumNavigation(viewer, navOptions);

			window.vecLayer = new Cesium.WebMapTileServiceImageryProvider({
				url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=ebf64362215c081f8317203220f133eb",
				layer: "tdtBasicLayer",
				style: "default",
				format: "tiles",
				tileMatrixSetID: "GoogleMapsCompatible",
				show: false,
				maximumLevel: 18
            })  //天地图矢量底图
        	viewer.imageryLayers.addImageryProvider(vecLayer);

        	window.annotationLayer = new Cesium.WebMapTileServiceImageryProvider({ //电子地图添加中文标记
				url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=d6a72a78a43a2c17294b72ab26354cd6",
				layer: "tdtAnnoLayer",
				style: "default",
				format: "tiles",
				tileMatrixSetID: "GoogleMapsCompatible",
				show: false,
            })  //天地图影像注记
        	viewer.imageryLayers.addImageryProvider(annotationLayer);

        	window.tiffLayer = new Cesium.WebMapTileServiceImageryProvider({
				url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=ebf64362215c081f8317203220f133eb",
				layer: "tdtBasicLayer",
				style: "default",
				format: "tiles",
				tileMatrixSetID: "GoogleMapsCompatible",
				show: true,
				maximumLevel: 18
			}); //天地图影像底图
			console.log("init");

		},
		changeBaseMap(item){
			console.log(item);
		
			if(item == '选项1' ){

				if(tiffLayer._layer == 'tdtBasicLayer'){
					viewer.imageryLayers.remove(tiffLayer);
					// console.log('xxxxx');
				}
				viewer.imageryLayers.addImageryProvider(vecLayer);
				viewer.imageryLayers.addImageryProvider(annotationLayer);
				// console.log(tiffLayer._layer);
				// console.log(vecLayer._layer);

			}else if( item == '选项2'){
				if(vecLayer._layer == 'tdtBasicLayer'){
					viewer.imageryLayers.remove(vecLayer);
				}
				viewer.imageryLayers.addImageryProvider(tiffLayer);
				viewer.imageryLayers.addImageryProvider(annotationLayer);
			}else {

			}
		},
		getMapPhoto(){
			const opts = {
				useCORS:true,
			};
			console.log('aa');
			html2canvas(this.$refs.getMap,opts).then(canvas =>{
				// $("#putMap").append(canvas)
				let link = document.createElement("a");
				link.href = canvas.toDataURL();//下载链接
				// ink.href = ximg.src;//下载链接
				link.setAttribute("download","专题图.png");
				link.style.display = "none";//a标签隐藏
				document.body.appendChild(link);
				link.click();
			});

		},
		getMyPosition(){
			var vhandler = new Cesium.ScreenSpaceEventHandler(myCanvas);
			vhandler.setInputAction(function(event){
				var myEarthPosition = viewer.camera.pickEllipsoid(event.position,viewer.scene.globe.ellipsoid)
				console.log(myEarthPosition); //Cartesian3格式
				var cartographic = Cesium.Cartographic.fromCartesian(myEarthPosition, viewer.scene.globe.ellipsoid, new Cesium.Cartographic());
				var lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
				var lng = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
				var height=(viewer.camera.positionCartographic.height/1000).toFixed(2); 

			},Cesium.ScreenSpaceEventType.LEFT_CLICK);
			vhandler.setInputAction(function(event) {
            vhandler = vhandler.destroy();
            	// $("#infoboxx").hide();
			}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
		},
		addModel(){
			viewer.entities.add({
				// 和时间轴关联
				id: "tower2",
				position: new Cesium.Cartesian3.fromDegrees(114.51, 9.92, 60000),
				// 模型数据
				model: {
				uri: "models/FeiTing.glb",
				minimumPixelSize: 188
				// scale: 1
				}
			});
			// zoomT
			viewer.entities.add({
				// 和时间轴关联
				id: "tower3",
				position: new Cesium.Cartesian3.fromDegrees(118.51, 9.92, 60000),
				// 模型数据
				model: {
				uri: "models/FeiTing.glb",
				minimumPixelSize: 188
				// scale: 1
				}
			});
		},
		addPOI(){
			var dataPoi = [
                {name: '海门', value: 9},
                {name: '鄂尔多斯', value: 12},
                {name: '招远', value: 12},
                {name: '舟山', value: 12},
                {name: '齐齐哈尔', value: 14},
                {name: '盐城', value: 15},
                {name: '赤峰', value: 16},
                {name: '青岛', value: 18},
                {name: '乳山', value: 18},
                {name: '金昌', value: 19},
                {name: '泉州', value: 21},
                {name: '莱西', value: 21},
                {name: '日照', value: 21},
                {name: '胶南', value: 22},
                {name: '南通', value: 23},
                {name: '拉萨', value: 24},
                {name: '云浮', value: 24},
                {name: '梅州', value: 25},
                {name: '文登', value: 25},
                {name: '上海', value: 25},
                {name: '攀枝花', value: 25},
                {name: '威海', value: 25},
                {name: '承德', value: 25},
                {name: '厦门', value: 26},
                {name: '汕尾', value: 26},
                {name: '潮州', value: 26},
                {name: '丹东', value: 27},
                {name: '太仓', value: 27},
                {name: '曲靖', value: 27},
                {name: '烟台', value: 28},
                {name: '福州', value: 29},
                {name: '瓦房店', value: 30},
                {name: '即墨', value: 30},
                {name: '抚顺', value: 31},
                {name: '玉溪', value: 31},
                {name: '张家口', value: 31},
                {name: '阳泉', value: 31},
                {name: '莱州', value: 32},
                {name: '湖州', value: 32},
                {name: '汕头', value: 32},
                {name: '昆山', value: 33},
                {name: '宁波', value: 33},
                {name: '湛江', value: 33},
                {name: '揭阳', value: 34},
                {name: '荣成', value: 34},
                {name: '连云港', value: 35},
                {name: '葫芦岛', value: 35},
                {name: '常熟', value: 36},
                {name: '东莞', value: 36},
                {name: '河源', value: 36},
                {name: '淮安', value: 36},
                {name: '泰州', value: 36},
                {name: '南宁', value: 37},
                {name: '营口', value: 37},
                {name: '惠州', value: 37},
                {name: '江阴', value: 37},
                {name: '蓬莱', value: 37},
                {name: '韶关', value: 38},
                {name: '嘉峪关', value: 38},
                {name: '广州', value: 38},
                {name: '延安', value: 38},
                {name: '太原', value: 39},
                {name: '清远', value: 39},
                {name: '中山', value: 39},
                {name: '昆明', value: 39},
                {name: '寿光', value: 40},
                {name: '盘锦', value: 40},
                {name: '长治', value: 41},
                {name: '深圳', value: 41},
                {name: '珠海', value: 42},
                {name: '宿迁', value: 43},
                {name: '咸阳', value: 43},
                {name: '铜川', value: 44},
                {name: '平度', value: 44},
                {name: '佛山', value: 44},
                {name: '海口', value: 44},
                {name: '江门', value: 45},
                {name: '章丘', value: 45},
                {name: '肇庆', value: 46},
                {name: '大连', value: 47},
                {name: '临汾', value: 47},
                {name: '吴江', value: 47},
                {name: '石嘴山', value: 49},
                {name: '沈阳', value: 50},
                {name: '苏州', value: 50},
                {name: '茂名', value: 50},
                {name: '嘉兴', value: 51},
                {name: '长春', value: 51},
                {name: '胶州', value: 52},
                {name: '银川', value: 52},
                {name: '张家港', value: 52},
                {name: '三门峡', value: 53},
                {name: '锦州', value: 54},
                {name: '南昌', value: 54},
                {name: '柳州', value: 54},
                {name: '三亚', value: 54},
                {name: '自贡', value: 56},
                {name: '吉林', value: 56},
                {name: '阳江', value: 57},
                {name: '泸州', value: 57},
                {name: '西宁', value: 57},
                {name: '宜宾', value: 58},
                {name: '呼和浩特', value: 58},
                {name: '成都', value: 58},
                {name: '大同', value: 58},
                {name: '镇江', value: 59},
                {name: '桂林', value: 59},
                {name: '张家界', value: 59},
                {name: '宜兴', value: 59},
                {name: '北海', value: 60},
                {name: '西安', value: 61},
                {name: '金坛', value: 62},
                {name: '东营', value: 62},
                {name: '牡丹江', value: 63},
                {name: '遵义', value: 63},
                {name: '绍兴', value: 63},
                {name: '扬州', value: 64},
                {name: '常州', value: 64},
                {name: '潍坊', value: 65},
                {name: '重庆', value: 66},
                {name: '台州', value: 67},
                {name: '南京', value: 67},
                {name: '滨州', value: 70},
                {name: '贵阳', value: 71},
                {name: '无锡', value: 71},
                {name: '本溪', value: 71},
                {name: '克拉玛依', value: 72},
                {name: '渭南', value: 72},
                {name: '马鞍山', value: 72},
                {name: '宝鸡', value: 72},
                {name: '焦作', value: 75},
                {name: '句容', value: 75},
                {name: '北京', value: 79},
                {name: '徐州', value: 79},
                {name: '衡水', value: 80},
                {name: '包头', value: 80},
                {name: '绵阳', value: 80},
                {name: '乌鲁木齐', value: 84},
                {name: '枣庄', value: 84},
                {name: '杭州', value: 84},
                {name: '淄博', value: 85},
                {name: '鞍山', value: 86},
                {name: '溧阳', value: 86},
                {name: '库尔勒', value: 86},
                {name: '安阳', value: 90},
                {name: '开封', value: 90},
                {name: '济南', value: 92},
                {name: '德阳', value: 93},
                {name: '温州', value: 95},
                {name: '九江', value: 96},
                {name: '邯郸', value: 98},
                {name: '临安', value: 99},
                {name: '兰州', value: 99},
                {name: '沧州', value: 100},
                {name: '临沂', value: 103},
                {name: '南充', value: 104},
                {name: '天津', value: 105},
                {name: '富阳', value: 106},
                {name: '泰安', value: 112},
                {name: '诸暨', value: 112},
                {name: '郑州', value: 113},
                {name: '哈尔滨', value: 114},
                {name: '聊城', value: 116},
                {name: '芜湖', value: 117},
                {name: '唐山', value: 119},
                {name: '平顶山', value: 119},
                {name: '邢台', value: 119},
                {name: '德州', value: 120},
                {name: '济宁', value: 120},
                {name: '荆州', value: 127},
                {name: '宜昌', value: 130},
                {name: '义乌', value: 132},
                {name: '丽水', value: 133},
                {name: '洛阳', value: 134},
                {name: '秦皇岛', value: 136},
                {name: '株洲', value: 143},
                {name: '石家庄', value: 147},
                {name: '莱芜', value: 148},
                {name: '常德', value: 152},
                {name: '保定', value: 153},
                {name: '湘潭', value: 154},
                {name: '金华', value: 157},
                {name: '岳阳', value: 169},
                {name: '长沙', value: 175},
                {name: '衢州', value: 177},
                {name: '廊坊', value: 193},
                {name: '菏泽', value: 194},
                {name: '合肥', value: 229},
                {name: '武汉', value: 273},
                {name: '大庆', value: 279}
			];
			var geoCoordMap = {
                '海门':[121.15,31.89],
                '鄂尔多斯':[109.781327,39.608266],
                '招远':[120.38,37.35],
                '舟山':[122.207216,29.985295],
                '齐齐哈尔':[123.97,47.33],
                '盐城':[120.13,33.38],
                '赤峰':[118.87,42.28],
                '青岛':[120.33,36.07],
                '乳山':[121.52,36.89],
                '金昌':[102.188043,38.520089],
                '泉州':[118.58,24.93],
                '莱西':[120.53,36.86],
                '日照':[119.46,35.42],
                '胶南':[119.97,35.88],
                '南通':[121.05,32.08],
                '拉萨':[91.11,29.97],
                '云浮':[112.02,22.93],
                '梅州':[116.1,24.55],
                '文登':[122.05,37.2],
                '上海':[121.48,31.22],
                '攀枝花':[101.718637,26.582347],
                '威海':[122.1,37.5],
                '承德':[117.93,40.97],
                '厦门':[118.1,24.46],
                '汕尾':[115.375279,22.786211],
                '潮州':[116.63,23.68],
                '丹东':[124.37,40.13],
                '太仓':[121.1,31.45],
                '曲靖':[103.79,25.51],
                '烟台':[121.39,37.52],
                '福州':[119.3,26.08],
                '瓦房店':[121.979603,39.627114],
                '即墨':[120.45,36.38],
                '抚顺':[123.97,41.97],
                '玉溪':[102.52,24.35],
                '张家口':[114.87,40.82],
                '阳泉':[113.57,37.85],
                '莱州':[119.942327,37.177017],
                '湖州':[120.1,30.86],
                '汕头':[116.69,23.39],
                '昆山':[120.95,31.39],
                '宁波':[121.56,29.86],
                '湛江':[110.359377,21.270708],
                '揭阳':[116.35,23.55],
                '荣成':[122.41,37.16],
                '连云港':[119.16,34.59],
                '葫芦岛':[120.836932,40.711052],
                '常熟':[120.74,31.64],
                '东莞':[113.75,23.04],
                '河源':[114.68,23.73],
                '淮安':[119.15,33.5],
                '泰州':[119.9,32.49],
                '南宁':[108.33,22.84],
                '营口':[122.18,40.65],
                '惠州':[114.4,23.09],
                '江阴':[120.26,31.91],
                '蓬莱':[120.75,37.8],
                '韶关':[113.62,24.84],
                '嘉峪关':[98.289152,39.77313],
                '广州':[113.23,23.16],
                '延安':[109.47,36.6],
                '太原':[112.53,37.87],
                '清远':[113.01,23.7],
                '中山':[113.38,22.52],
                '昆明':[102.73,25.04],
                '寿光':[118.73,36.86],
                '盘锦':[122.070714,41.119997],
                '长治':[113.08,36.18],
                '深圳':[114.07,22.62],
                '珠海':[113.52,22.3],
                '宿迁':[118.3,33.96],
                '咸阳':[108.72,34.36],
                '铜川':[109.11,35.09],
                '平度':[119.97,36.77],
                '佛山':[113.11,23.05],
                '海口':[110.35,20.02],
                '江门':[113.06,22.61],
                '章丘':[117.53,36.72],
                '肇庆':[112.44,23.05],
                '大连':[121.62,38.92],
                '临汾':[111.5,36.08],
                '吴江':[120.63,31.16],
                '石嘴山':[106.39,39.04],
                '沈阳':[123.38,41.8],
                '苏州':[120.62,31.32],
                '茂名':[110.88,21.68],
                '嘉兴':[120.76,30.77],
                '长春':[125.35,43.88],
                '胶州':[120.03336,36.264622],
                '银川':[106.27,38.47],
                '张家港':[120.555821,31.875428],
                '三门峡':[111.19,34.76],
                '锦州':[121.15,41.13],
                '南昌':[115.89,28.68],
                '柳州':[109.4,24.33],
                '三亚':[109.511909,18.252847],
                '自贡':[104.778442,29.33903],
                '吉林':[126.57,43.87],
                '阳江':[111.95,21.85],
                '泸州':[105.39,28.91],
                '西宁':[101.74,36.56],
                '宜宾':[104.56,29.77],
                '呼和浩特':[111.65,40.82],
                '成都':[104.06,30.67],
                '大同':[113.3,40.12],
                '镇江':[119.44,32.2],
                '桂林':[110.28,25.29],
                '张家界':[110.479191,29.117096],
                '宜兴':[119.82,31.36],
                '北海':[109.12,21.49],
                '西安':[108.95,34.27],
                '金坛':[119.56,31.74],
                '东营':[118.49,37.46],
                '牡丹江':[129.58,44.6],
                '遵义':[106.9,27.7],
                '绍兴':[120.58,30.01],
                '扬州':[119.42,32.39],
                '常州':[119.95,31.79],
                '潍坊':[119.1,36.62],
                '重庆':[106.54,29.59],
                '台州':[121.420757,28.656386],
                '南京':[118.78,32.04],
                '滨州':[118.03,37.36],
                '贵阳':[106.71,26.57],
                '无锡':[120.29,31.59],
                '本溪':[123.73,41.3],
                '克拉玛依':[84.77,45.59],
                '渭南':[109.5,34.52],
                '马鞍山':[118.48,31.56],
                '宝鸡':[107.15,34.38],
                '焦作':[113.21,35.24],
                '句容':[119.16,31.95],
                '北京':[116.46,39.92],
                '徐州':[117.2,34.26],
                '衡水':[115.72,37.72],
                '包头':[110,40.58],
                '绵阳':[104.73,31.48],
                '乌鲁木齐':[87.68,43.77],
                '枣庄':[117.57,34.86],
                '杭州':[120.19,30.26],
                '淄博':[118.05,36.78],
                '鞍山':[122.85,41.12],
                '溧阳':[119.48,31.43],
                '库尔勒':[86.06,41.68],
                '安阳':[114.35,36.1],
                '开封':[114.35,34.79],
                '济南':[117,36.65],
                '德阳':[104.37,31.13],
                '温州':[120.65,28.01],
                '九江':[115.97,29.71],
                '邯郸':[114.47,36.6],
                '临安':[119.72,30.23],
                '兰州':[103.73,36.03],
                '沧州':[116.83,38.33],
                '临沂':[118.35,35.05],
                '南充':[106.110698,30.837793],
                '天津':[117.2,39.13],
                '富阳':[119.95,30.07],
                '泰安':[117.13,36.18],
                '诸暨':[120.23,29.71],
                '郑州':[113.65,34.76],
                '哈尔滨':[126.63,45.75],
                '聊城':[115.97,36.45],
                '芜湖':[118.38,31.33],
                '唐山':[118.02,39.63],
                '平顶山':[113.29,33.75],
                '邢台':[114.48,37.05],
                '德州':[116.29,37.45],
                '济宁':[116.59,35.38],
                '荆州':[112.239741,30.335165],
                '宜昌':[111.3,30.7],
                '义乌':[120.06,29.32],
                '丽水':[119.92,28.45],
                '洛阳':[112.44,34.7],
                '秦皇岛':[119.57,39.95],
                '株洲':[113.16,27.83],
                '石家庄':[114.48,38.03],
                '莱芜':[117.67,36.19],
                '常德':[111.69,29.05],
                '保定':[115.48,38.85],
                '湘潭':[112.91,27.87],
                '金华':[119.64,29.12],
                '岳阳':[113.09,29.37],
                '长沙':[113,28.21],
                '衢州':[118.88,28.97],
                '廊坊':[116.7,39.53],
                '菏泽':[115.480656,35.23375],
                '合肥':[117.27,31.86],
                '武汉':[114.31,30.52],
                '大庆':[125.03,46.58]
			};
			var convertData = function (data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var geoCoord = geoCoordMap[data[i].name];
                    if (geoCoord) {
                        res.push({
                            name: data[i].name,
                            value: geoCoord.concat(data[i].value)
                        });
                    }
                }
                return res;
			};
			var option = {
                animation:0,
                title: {
                    text: '全国洪涝灾害分布情况',
                    // subtext: 'datame from PM25.in',
                    // sublink: 'http://www.pm25.in',
                    left: 'center'
                },
                tooltip : {
                    trigger: 'item'
                },
                GLMap:{},
                series : [
                    {
                        name: 'pm2.5',
                        type: 'scatter',
                        coordinateSystem: 'GLMap',
                        data: convertData(dataPoi),
                        symbolSize: function (val) {
                            return 10;
                        },
                        encode: {
                            value: 2
                        },
                        // label: {
                        //     formatter: '{b}',
                        //     position: 'right',
                        //     show: false
                        // },
                        itemStyle: {
                            color: 'purple'
                        },
                        emphasis: {
                            label: {
                                show: true
                            }
                        }
                    },
                    {
                        name: 'Top 5',
                        type: 'effectScatter',
                        coordinateSystem: 'GLMap',
                        data: convertData(dataPoi.sort(function (a, b) {
                            return b.value - a.value;
                        }).slice(0, 6)),
                        symbolSize: function (val) {
                            return val[2] / 10;
                        },
                        encode: {
                            value: 2
                        },
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true,
                        label: {
                            formatter: '{b}',
                            position: 'right',
                            show: true
                        },
                        itemStyle: {
                            color: 'purple',
                            shadowBlur: 10,
                            shadowColor: '#333'
                        },
                        zlevel: 1
                    }
                ]
            };
            new Cesium.EchartsLayer(viewer, option)
		}
	},
};
</script>

<style >
	.home{
		background-color: rgba(173, 169, 168, 0.466);
		width: 100%;
		height: 100%;
	}
	#cesiumContainer{
		width: 100%;
		height: 80%;
		/* z-index: 5; */
		position: absolute;
	}
	.cesium-widget-credits{
		display: none;
	}
	.menu{
		position: absolute;
		right: 20px;
		top: 120px;
		z-index: 10;
	}
	/* .el-select{
		position: absolute;
		left: 20px;
		top: 200px;
		z-index: 10;	
	} */
	#changeMap{
		position: absolute;
		left: 20px;
		top: 120px;
		z-index: 10;
		width: 140px;

		/* color: black; */
	}
	#putMap{
		z-index: 50;
		position: absolute;
		left: 20px;
		bottom: 20px;
		border: coral 3px solid;
	}

</style>