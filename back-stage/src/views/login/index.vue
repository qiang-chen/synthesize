<template>
  <div class="list">
    <div class="select">
      <el-select v-model="value" placeholder="请选择" @change="handleChangeLanguage(value)">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <!-- 第一个login是模块名 第二个login是变量名 -->
    <div class="content">
      <h1 class="title">{{$t("login.login")}}</h1>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="$t('login.usernamePlaceholder')">
          <el-input v-model="ruleForm.user" aria-placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item :label="$t('login.passwordPlaceholder')" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <div class="verify">
          <el-form-item label="请输入验证码" class="verifyForm">
            <el-input v-model="ruleForm.verify"></el-input>
          </el-form-item>
          <div class="img" v-html="exchange.img"></div>
          <div class="exchange" @click="exchangefn">换一张</div>
        </div>
        <div class="remember">
          <el-checkbox v-model="checked" @change="save">{{$t("login.remember")}}</el-checkbox>
        </div>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">{{$t("login.submit")}}</el-button>
          <el-button @click="resetForm('ruleForm')">{{$t("login.reset")}}</el-button>
          <el-button @click="$router.history.push('/registry')">{{$t("login.register")}}</el-button>
          <el-button @click="$router.history.push('/retrieve')">{{$t("login.retrieve")}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { Login, Verify ,Remember} from "@/api/index";

//引入加密函数封装

import { jsEncrypt ,decode} from "@/utils/jsencrypt.js";

//引入第三方包cookie处理器

//import Cookies from "js-cookie"

import { setCookeies ,getCookeies} from "@/utils/cookie";

//引入辅助函数
import { mapState, mapMutations } from "vuex";
//console.log(setCookeies)
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("login.passwordPlaceholder")));
        this.flag = false;
      } else if (!/^(?=.*[0-9])(?=.*[a-zA-Z])(.{6,})$/.test(value)) {
        callback(new Error("密码格式不对"));
        this.flag = false;
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        this.flag = true;
        callback();
      }
    };
    return {
      checked: localStorage.getItem("checked")||false,
      ruleForm: {
        pass: "",
        user: "",
        verify: ""
      },
      flag: true,
      exchange: {
        img: "",
        keyId: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }]
      },
      options: [
        {
          value: "zh-CN",
          label: "中文"
        },
        {
          value: "en-US",
          label: "英文"
        },
        {
          value: "zh-TW",
          label: "繁体字"
        }
      ],
      //如果本地有就取本地的值  没有模式显示中文语言
      value: localStorage.getItem("language_type") || "zh-CN"
    };
  },
  async created() {
    //console.log(this.token,"---");
    
    let data = await Verify(); //在页面刚加载的时候发送ajax请求然后显示验证码
    this.exchange.img = data.data.data.captcha;
    this.exchange.keyId = data.data.data.keyId;
    //console.log(JSON.parse(localStorage.getItem("checked")));
    this.checked=JSON.parse(localStorage.getItem("checked"))
    this.remember()
  },
  computed: {
    ...mapState({
      token: state => state.login.token
    })
  },
  watch: {
    checked(){
      //console.log(JSON.parse(localStorage.getItem("checked")),"watch");
    //this.checked=JSON.parse(localStorage.getItem("checked"))
    }
  },
  methods: {
    ...mapMutations({
      saveToken: "login/SAVE_TOKEN"
    }),
    //将check存到本地
    save(){
      localStorage.setItem("checked",this.checked);
    },
    //记住密码功能
    async remember(){
      //console.log(this.checked)
      if(this.checked&&getCookeies()){
        //如果多选框被选中的状态 那用户下次登录进来就要把用户名和密码展示在页面上
        //通过axios发送验证信息 //将本地的token发送给后台 用来查找到用户名和密码展示在页面上
        let token=getCookeies();
        let data=await Remember(token)
        //console.log(data.data.info);
        let {password,user}=data.data.info;
        //此时密码是加密过的密码 对其进行解密
        let pwd=decode(password);
        //console.log(pwd)
        this.ruleForm.pass=pwd;
        this.ruleForm.user=user;
      }
    },
    //图形验证码的点击切换验证
    async exchangefn() {
      let data = await Verify(); //在页面刚加载的时候发送ajax请求然后显示验证码
      this.exchange.img = data.data.data.captcha;
      this.exchange.keyId = data.data.data.keyId;
      //console.log(this.exchange)
    },
    //下拉框的语言切换
    handleChangeLanguage(value) {
      localStorage.setItem("language_type", value);
      window.location.reload();
    },
    successOpen(msg) {
      return new Promise((resolve, reject) => {
        this.$message({
          message: msg,
          type: "success",
          duration: 1000,
          onClose: () => {
            resolve();
          }
        });
      });
    },
    //点击提交按钮就行的逻辑操作
    async submitForm(formName) {
      let opj = {};
      opj.user = this.ruleForm.user;
      opj.pwd = jsEncrypt(this.ruleForm.pass);
      // opj.exchange ={
      //   keyId:this.exchange.keyId,
      //   img:this.ruleForm.verify
      // };
      opj.keyId=this.exchange.keyId;
     opj.img=this.ruleForm.verify;
      //console.log(opj);
      //成功的时候执行
      console.log(this.flag,"===")
      if (this.ruleForm.user && this.ruleForm.pass && this.flag && this.ruleForm.verify) {
        let data = await Login(opj);
        data = data.data;
        console.log(data, "登录返回结果");
        if (data.code) {
          //将接受到的token存到cookie中去 用来判断用户是否一登录
          //Cookies.set('token', data.token, { expires: 1/24 });
          //调用封装好的方法
          //console.log(setCookeies)
          //显示一个弹框
          await this.successOpen(data.msg);
          setCookeies(data.token);
          //将token存到仓库中去
          this.saveToken({ token: data.token });
          //console.log(this.$router.history)
          this.$router.history.push("/main/uploading");
        } else {
          this.$message.error(data.msg);
          //失败的话重新刷新验证码
          let reault = await Verify(); //在页面刚加载的时候发送ajax请求然后显示验证码
          this.exchange.img = reault.data.data.captcha;
          this.exchange.keyId = reault.data.data.keyId;
          
        }
      } else {
        //失败的话重新刷新验证码
        let reault = await Verify(); //在页面刚加载的时候发送ajax请求然后显示验证码
        this.exchange.img = reault.data.data.captcha;
        this.exchange.keyId = reault.data.data.keyId;
        this.$message.error("请输入正确的用户名和密码");
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.remember {
  margin: 10px 0;
}
.title {
  width: 100%;
  height: 50px;
  text-align: center;
  line-height: 50px;
  margin: 35px 0;
  margin-top: 100px;
}
.exchange {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  cursor: pointer;
  user-select: none;
}
.verify {
  display: flex;
  justify-content: space-between;
  .img {
    width: 30%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #eee;
    .image {
      width: 100%;
      height: 40px;
    }
  }
}
.verifyForm {
  width: 50%;
}
.content {
  width: 40%;
  margin: 0 auto;
}
.list {
  width: 100%;
  height: 100%;
  padding: 0.2rem 0.1rem;
  padding-right: 0.4rem;
  box-sizing: border-box;

  .select {
    height: 1rem;
    line-height: 1rem;
    text-align: right;
    padding-right: 100px;
    box-sizing: border-box;
  }

  h1 {
    width: 100%;
    height: 1.5rem;
    text-align: center;
    line-height: 1.5rem;
  }
  .skip {
    width: 100%;
    height: 1rem;
    text-align: center;
    line-height: 1rem;
    margin-top: 0.2rem;
  }
}
</style>

