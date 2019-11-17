<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>电商管理后台系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click = "toggleMenu">|||</div>
        <!-- 左侧菜单 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b" router unique-opened :collapse-transition="false" :collapse="isCollapse">
          <el-submenu :index="item.id+''" v-for="item in menuArr" :key="item.id">
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span @click="savePath('/'+subItem.path)">{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
        //左侧菜单列表
        menuArr:[],
        // 字体图标
        iconList:{
            '125':'el-icon-user-solid',
            '103':'el-icon-user-solid',
            '101':'el-icon-user-solid',
            '102':'el-icon-user-solid',
            '145':'el-icon-user-solid',
        },
        //控制左侧折叠动画
        isCollapse:false,
        // 左侧菜单点击path
        activePath:''
    };
  },
  created(){
      //获取左侧菜单数据
      this.getMenuData();
        //页面刷新后保存地址
      this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods: {
      //获取左侧菜单数据
      getMenuData(){
          this.$axios.get('menus')
            .then(res=>{
                window.console.log(res);
                if(res.status !== 200) return this.$message.error('获取列表失败')
                this.$message.success('获取成功');
                this.menuArr = res.data.data;
                
            })
      },
      //退出
    loginOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //切换左侧菜单宽
    toggleMenu(){
       this.isCollapse = !this.isCollapse; 
    },
    //保存当前菜单的path
    savePath(activePath){
        window.sessionStorage.setItem('activePath',activePath);
        this.activePath = activePath
    }
  }
};
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 60px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}

//切换按钮
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.el-menu {
  border-right: 0;
}
</style>