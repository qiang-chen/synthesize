
<template>
  <div>
    <!-- 标题 -->
    <div class="uploading">
      <el-button size="mini" @click="dialogForm=true">上传文件</el-button>
    </div>
    <!-- 表格 -->
    <div class="form">
      <el-table
        :data="tableData"
        style="width: 100%"
        height="440"
      >
        <el-table-column label="文章标题" props="articleTitle">
          <template scope="scope">
            <img :src="scope.row.imgPath" width="100" height="100" class="head_pic">
          </template>
        </el-table-column>
        <el-table-column label="文章链接" prop="articleLink"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column align="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">复制链接</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[2, 3, 5, 10]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 弹框组件 -->
      <Dialog :dialogForm="dialogForm" :close="close"></Dialog>
  </div>
</template>

<script>
import { Upload, getUploadList ,searchLoad} from "@/api/index";

//引入复制作用的插件包

import clipboard from "clipboard-polyfill"

//引入弹框的组件

import Dialog from "@/components/Dialog"

export default {
  data() {
    return {
      tableData: [
        // {
        //   imgPath: "2016-05-02",
        //   imgName: "王小虎",
        //   createTime: "上海市普陀区金沙江路 1518 弄"
        // }
      ],
      search: "",
      page: 1,
      limit: 3,
      total:0,
      dialogForm:false//控制弹框显示
    };
  },
  components:{
    Dialog
  },
  created() {
    this.getList();
  },
  methods: {
    //点击上传文件
    async upload(e) {
      var formData = new FormData();
      formData.append("file", e.target.files[0]);
      //这里单独发送ajax请求 将时间设置的久点
      let data = await Upload(formData);
      console.log(data);
      if (data.data.code) {
        this.$message({
          message: data.data.msg,
          type: "success",
          duration: 1000,
          onClose: () => {
            this.getList();
          }
        });
      } else {
        this.$message.error(data.data.msg);
      }
    },
    //关闭弹框函数
    close(){
      this.dialogForm=false
    },
    //写个方法获取上传列表的最新数据 多次调用
    async getList() {
      let data = await getUploadList(this.page, this.limit);
      this.tableData = data.data.msg;
      this.total=data.data.total
    },
    //点击复制链接
    handleEdit(index, row) {
      console.log(index, row);
      clipboard.writeText(row.imgPath)
        this.$message({
          message: "复制成功",
          type: "success",
          duration:1500
        });
    },
    handleSizeChange(e){
      this.limit=e;
      //console.log(this.page,this.limit,"===")
      this.getList();
      
    },
    handleCurrentChange(e){
      this.page=e;
      this.getList();
      //console.log(this.page,"当前页")
    },
    //模糊搜索功能
    async searchfn(e){
      console.log(this.search)
      //失去焦点的时候搜索
    let data=await searchLoad(this.search);
    console.log(data.data.msg)
    this.tableData=data.data.msg
    }
  }
};
</script>

<style lang="scss" scoped>
.uploading {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  user-select: none;
  cursor: pointer;
}
.el-pagination{
  text-align: right;
  margin: 30px 0 10px 0;
}
</style>
