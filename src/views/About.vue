<template>
    <div>
        <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="90%" :before-close="handleClose">
            <!-- <span>这是一段信息</span> -->

            <div id="mapPanel">
                <div id="leftPanel">
                    <!-- 
            tabs标签栏
            label + input + color + button
            transfer

                    添加至视图按钮-->
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="用户管理" name="first">
                            <el-transfer v-model="value" :data="data"></el-transfer>
                        </el-tab-pane>

                        <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>

                        <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
                    </el-tabs>
                </div>

                <div id="rightPanel">
                    <!-- 
            标题栏
            文件内容
            日期
                    -->
                    <span>标题栏</span>
                    <span>标题栏</span>
                    <span>日期</span>
                    <img src alt />
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <div id="myaddkey">
            <el-input v-model="inputkey"  placeholder="请输入内容" ref="mapkey"></el-input>
            <el-color-picker v-model="elecolor"></el-color-picker>
            <el-button type="primary" plain @click="addMapKey">添加</el-button> 
        </div>

        <div id="mytransfer">
            <el-transfer v-model="value" :data="data"> </el-transfer>
            
        </div>

        <!-- axios测试 -->
        <el-button type="primary" plain @click="getMyAxios" >请求数据</el-button>



    </div>
</template>

<script>
export default {
    data() {
        // const generateData = (_) => {
        //     const data = [];
        //     for (let i = 1; i <= 6; i++) {
        //         data.push({
        //             key: i,
        //             label: `备选项 ${i}`,
        //             disabled: i % 4 === 0,
        //         });
        //     }
        //     return data;
        // };
        return {
            dialogVisible: false,
            activeName: "second",
            data: [],
            value: [1, 4],
            inputkey:'',
            elecolor:'#409EFF',
            i:2,
        };
    },
    methods: {
        handleClose(done) {
            this.$confirm("确认关闭？")
                .then((_) => {
                    done();
                })
                .catch((_) => {});
        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        addMapKey(){
            console.log(this.$refs.mapkey.value);
                var j = ++this.i
            this.data.push({
                key: ++this.i,
                label: this.$refs.mapkey.value
            }) 
            // console.log(this.data);
            console.log($(".el-checkbox__input")[1]);
            console.log($(".el-checkbox__input").get(1));
            $(".el-checkbox__input")[1].after("<b>hello</b>")
            $(".el-checkbox__input").get(1).after("<b>hello</b>")
            console.log(this.elecolor);
        },
        getMyAxios(){
            this.$axios.get("https://api.coindesk.com/v1/bpi/currentprice.json")
                .then(res => {
                        console.log(res.data.time);
                        console.log('a');
                }
            ); 
            //写法二
            // this.$axios.request({
            //     // url:"https://easy-mock.com/mock/5b2240e2fcfce63e92dc3dbf/lianxi/lianxi",
            //     method:"GET"
            // }).then(res => {
            //         if(res.data.status === 0){
            //             console.log(res.data);
            //         }
            //     }
            // ); 
        }

    //methods结束-------------------------------------------------------------------------------
    },
};
</script>

<style scoped>
#myaddkey{
    display: flex;
    justify-content: space-around;
    width: 25%;
}
#myaddkey >>> .el-input{
    width: 50%;
}

#mapPanel{
	display: flex;
	justify-content: space-around;
	height: 100%;
}
.el-dialog{
	height: 70%;
}
.el-dialog__body{
	height: 65%;
}
/* ************************************************************************************************ */
#leftPanel{
	height: 100%;
	width: 90%;
	background-color: rgba(140, 193, 207, 0.664);
}
#mytransfer >>> .el-transfer-panel__item .el-checkbox__input{
	left: 35px;
}
#mytransfer >>> .el-checkbox:last-of-type{
	margin-right: 30px;
}
/* #mytransfer >>> .el-transfer__buttons{
    display: flex;
    flex-direction: column;
    width: 15px;
} */
/* ************************************************************************************************ */
#rightPanel{
	height: 100%;
	width: 15%;
	background-color: rgb(140, 192, 207,0.664);
}
</style>>

</style>