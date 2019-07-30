<template>
    <div class="main">
        <el-row class="tac">
            <el-col>
                <el-menu
                    :default-active="index"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                >
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>图片操作</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="1-1" @click="upload">上传图片</el-menu-item>
                            <el-menu-item index="1-2" @click="banner">添加banner</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item index="2" @click="article">
                        <i class="el-icon-menu"></i>
                        <span slot="title">文章管理</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      index:"1-1"
    }
  },
  created () {
    console.log(this.$route.path);
    if(this.$route.path=="/main/uploading"){
      this.index="1-1"
    }else if(this.$route.path=="/main/banner"){
        this.index="1-2"
    }else{
      this.index="2"
    }
  },
  methods: {
    //点击切换上传文件操作
    upload(){
        this.$router.history.push("/main/uploading")
        console.log(11);
    },
    //点击切换banner路由
    banner(){
        console.log(22);
        this.$router.history.push("/main/banner")
    },
    //点击文章列表切换的路由
    article(){
      this.$router.history.push("/main/article")
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      //console.log(key, keyPath);
    }
  }
};
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
}
.tac {
  flex: 3;
  background-color: #eee;
}
.content {
  flex: 7;
}
</style>
