<template>
	<div class="home">
		<!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
		
		<div id="cesiumContainer">
			
			
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
			<el-button type="primary" plain >主要按钮</el-button>
			<el-button type="primary" plain>主要按钮</el-button>
			<el-button type="primary" plain>主要按钮</el-button>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

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
				animation : false,//是否创建动画小器件，左下角仪表
				baseLayerPicker : false,//是否显示图层选择器
				fullscreenButton : false,//是否显示全屏按钮
				geocoder : false,//是否显示geocoder小器件，右上角查询按钮
				homeButton : false,//是否显示Home按钮
				infoBox : false,//是否显示信息框
				sceneModePicker : false,//是否显示3D/2D选择器
				selectionIndicator : false,//是否显示选取指示器组件
				timeline : false,//是否显示时间轴
				navigationHelpButton : false,//是否显示右上角的帮助按钮
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

			// window.viewer = viewer;

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
			console.log(map);
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

</style>