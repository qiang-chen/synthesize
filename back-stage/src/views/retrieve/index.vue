<template>
    <div class="retrieve">
        <h1>请输入正确的邮箱找回密码</h1>
        <el-form
            :model="dynamicValidateForm"
            ref="dynamicValidateForm"
            label-width="100px"
            class="demo-dynamic"
        >
            <el-form-item
                prop="email"
                label="邮箱"
                :rules="[{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur']}]">
             <el-input v-model="dynamicValidateForm.email"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
                
                <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>


<script>
//引入封装一个好的请求函数
import {Retrieve} from "@/api/index"
export default {
  data() {
    return {
      dynamicValidateForm: {
        email: ""
      }
    };
  },
  methods: {
      //提交按钮进行的操作
     submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let {email}=this.dynamicValidateForm;
          //发送ajax请求 用来给用户找回密码
         let data=await Retrieve({email});
         //console.log(data);
         if (data.data.code) {
            this.$message({
              message: data.data.msg,
              type: "success"
            });
          } else {
               this.$message.error(data.data.msg);
          }
        } else {
          //console.log("error submit!!");
          return false;
        }
      });
    },
    //重置按钮的操作
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>


<style lang="scss" scoped>
    .retrieve{
        width: 50%;
        margin: 0 auto;
        h1{
            width: 100%;
            height: 50px;
            text-align: center;
            line-height: 50px;
            margin: 50px 0;
        }
    }
</style>
