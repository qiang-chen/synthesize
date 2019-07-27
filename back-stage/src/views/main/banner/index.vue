<template>
  <div class="addbanner">
    <div class="btn">
      <el-button type="primary" @click="dialogFormVisible = true">添加banner</el-button>
    </div>
    <el-dialog title="添加banner图" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="请输入图片地址" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="请输入备注信息" :label-width="formLabelWidth">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <div class="form">
      <el-table
        :data="tableData"
        style="width: 100%"
        height="440"
      >
        <el-table-column label="图片" props="bannerPath">
          <template scope="scope">
            <img :src="scope.row.bannerPath" width="100" height="100" class="head_pic">
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column align="right">
        
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
//上传banner图接口

import { Banner, getBannerList ,removeBanner} from "@/api/index";

export default {
  data() {
    return {
      tableData: [
        // {
        //   imgPath: "2016-05-02",
        //   imgName: "王小虎",
        //
        // }
      ],
      search: "",
      dialogFormVisible: false,
      form: {
        name: "",
        remark: ""
      },
      formLabelWidth: "120px"
    };
  },
  async created() {
    let data = await getBannerList();
    //console.log(data.data.msg);
    this.tableData = data.data.msg;
  },
  methods: {
    async add() {
      console.log(this.form);
      let data = await Banner(this.form.name, this.form.remark);
      if (data.data.code) {
        this.$message({
          message: data.data.msg,
          type: "success",
          duration: 1000
        });
      } else {
        this.$message.error(resault.data.msg);
      }
      this.dialogFormVisible = false;
      let datas = await getBannerList();
      //console.log(data.data.msg);
      this.tableData = datas.data.msg;
    },
    async handleDel(index, row) {
      console.log(index, row);
      let data=await removeBanner(row.bannerPath)
      console.log(data);
      if (data.data.code) {
        this.$message({
          message: data.data.msg,
          type: "success",
          duration: 1000
        });
      } else {
        this.$message.error(resault.data.msg);
      }
       let datas = await getBannerList();
      //console.log(data.data.msg);
      this.tableData = datas.data.msg;
    }
  }
};
</script>

<style lang="scss" scoped>
.addbanner {
  text-align: center;
}
.btn {
  margin: 20px 0;
}
</style>


