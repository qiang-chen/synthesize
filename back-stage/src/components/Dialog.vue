<template>
    <div>
        <el-dialog title="请输入文章标题" :visible="dialogForm">
            <el-form :model="form">
                <el-form-item label="文章标题" :label-width="formLabelWidth">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="btn">取 消</el-button>
                <el-button type="primary" @click="confirmBtn">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  props: {
    dialogForm: {
      type: Boolean,
      default: false
    },
    close:{
        type:Function,
        default:()=>{}
    }
  },
  data() {
    return {
      form: {
        name: "",
        type: []
      },
      formLabelWidth: "120px"
    };
  },
  created() {
    console.log(this.dialogFormVisible);
  },
  methods: {
      btn(){
          this.close()
      },
      confirmBtn(){
          console.log(this.form.name)
          //发送ajax把这个标题带到后台
         this.close() 
      }
  },
};
</script>