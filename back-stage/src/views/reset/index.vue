<template>
    <div class="container">
        <h1>设置新的密码</h1>
        <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
        >
            <el-form-item label="新密码" prop="pass">
                <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
//引入网络请求
import { Modification } from "@/api/index";

import {jsEncrypt} from "@/utils/jsencrypt"

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!/^(?=.*[0-9])(?=.*[a-zA-Z])(.{6,})$/.test(value)) {
        callback(new Error("密码格式应为数字字母六位数以上"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (!/^(?=.*[0-9])(?=.*[a-zA-Z])(.{6,})$/.test(value)) {
        callback(new Error("密码格式应为数字字母六位数以上"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        checkPass: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let data = {
            token: this.$route.params.id,
            pass: jsEncrypt(this.ruleForm.pass)
          };
          //注意前端把密码加密后再发给后端 利用key对应的加密方式
          let resault = await Modification(data);
          console.log(resault.data.msg);
          if (resault.data.code) {
            this.$message({
              message: resault.data.msg,
              type: "success"
            });
          } else {
               this.$message.error(resault.data.msg);
          }
        } else {
          this.$message({
          message: '亲，密码还没设置呢',
          type: 'warning'
        });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 50%;
  margin: 100px auto 0;
  text-align: center;
  h1 {
    margin: 30px 0;
  }
}
</style>

