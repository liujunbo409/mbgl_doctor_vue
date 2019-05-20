import Vue from 'vue'
import Router from 'vue-router'
import guard from './guard'

import Loading from '@v/sub/Loading'
import _Error from '@v/sub/Error'

import Home from '@v/Home/Home'
import Login from '@v/Login/Login'
import Register from '@v/Login/Register'


Vue.use(Router)

// 懒加载路由
function load(component){
  return () => ({
    component,
    loading: Loading,
    error: _Error,
    delay: 200,
    timeout: 7000
  })
}

const r = {
  ResetPassword: load(import('@v/Login/Reset')),
  sub: {
    BeforeCheckPsd: load(import('@v/sub/BeforeCheckPsd'))
  },
  My: {
    Index: load(import('@v/My/Index')),
    Info: load(import('@v/My/Info')),
    Account: {
      Index: load(import('@v/My/Account/Index')),
      ChangePsd: load(import('@v/My/Account/ChangePsd')),
      ChangePhone: load(import('@v/My/Account/ChangePhone')),
    },
    Role: {
      sub: {
        Jxjb: load(import('@v/My/Role/sub/Jxjb'))
      },
      Index: load(import('@v/My/Role/Index')),
      Doctor: load(import('@v/My/Role/Doctor')),
      Nurse: load(import('@v/My/Role/Nurse')),
    },
    Feedback: load(import('@v/My/Feedback'))
  },

  Visitplan: load(import('@v/Visitplan/Visitplan')),
  ArticleAssess: load(import('@v/ArticleAssess/ArticleAssess')),
  AssessContent: load(import('@v/ArticleAssess/AssessContent')),
  AssessInfo: load(import('@v/ArticleAssess/AssessInfo')),

  ArticleAll: {
    ArticleAll: load(import('@v/ArticleAll/ArticleAll')),
    Article: {
      Article: load(import('@v/ArticleAll/Article/Article')),
      Test: load(import('@v/ArticleAll/Article/Test')),
      Feedback: load(import('@v/ArticleAll/Article/Feedback'))
    }
  },

  ArticleFavorites: {
    ArticleFavorites: load(import('@v/ArticleFavorites/ArticleFavorites'))
  }
}

const keepAlive = true,
fromUrlStop = true

// 设置路由path和name
function p(name, path){
  return {
    path: `/${path ? path : name}`,
    name,
    meta: {}  // 防止未设置meta造成取到undefined的情况
  }
}

var routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      keepAlive
    }
  }, {  // 公用前置验证密码页面
    ...p('sub/before_check_psd'),
    component: r.sub.BeforeCheckPsd,
    meta: {
      fromUrlStop
    }
  }, {  // 登录
    ...p('login'),
    component: Login
  }, {  // 注册
    ...p('register'),
    component: Register
  }, {  // 重置密码
    ...p('reset_psd'),
    component: r.ResetPassword
  }, {  // 我的
    ...p('my'),
    component: r.My.Index
  }, {  // 我的/个人信息
    ...p('my/info'),
    component: r.My.Info,
    meta: {
      keepAlive
    }
  }, {  // 我的/帐号管理
    ...p('my/account'),
    component: r.My.Account.Index
  }, {  // 我的/帐号管理/修改密码
    ...p('my/account/change_psd'),
    component: r.My.Account.ChangePsd,
    meta: {
      fromUrlStop
    }
  }, {  // 我的/帐号管理/修改手机号
    ...p('my/account/change_phone'),
    component: r.My.Account.ChangePhone,
    meta: {
      fromUrlStop
    }
  }, {  // 我的/资格验证
    ...p('my/role'),
    component: r.My.Role.Index
  }, {  // 我的/资格验证/教学疾病选择
    ...p('my/role/sub/jxjb'),
    component: r.My.Role.sub.Jxjb,
    meta: {
      fromUrlStop
    }
  }, {  // 我的/资格验证/医生
    ...p('my/role/doctor'),
    component: r.My.Role.Doctor,
    meta: {
      keepAlive
    }
  }, {  // 我的/资格验证/护士
    ...p('my/role/nurse'),
    component: r.My.Role.Nurse,
    meta: {
      keepAlive
    }
  }, {  // 我的/反馈
    ...p('my/feedback'),
    component: r.My.Feedback
  }, {  // 出诊计划
    ...p('visitplan'),
    component: r.Visitplan
  }, {  // 文章审核
    ...p('article_assess'),
    component: r.ArticleAssess
  }, {  // 文章审核内容详情
    ...p('assess_content'),
    component: r.AssessContent,
    meta: {
      keepAlive,
      fromUrlStop
    }
  }, {  // 文章审核后信息详情
    ...p('assess_info'),
    component: r.AssessInfo
  }, {  // 所有文章
    ...p('article_all'),
    component: r.ArticleAll.ArticleAll,
    meta: {
      keepAlive
    }
  }, {  // 全部文章/文章详情
    ...p('article_all/article'),
    component: r.ArticleAll.Article.Article,
    meta: {
      keepAlive,
      fromUrlStop
    }
  }, {  // 全部文章/文章详情/考试
    ...p('article_all/article/test'),
    component: r.ArticleAll.Article.Test,
    meta: {
      fromUrlStop
    }
  }, {  // 全部文章/文章详情/反馈
    ...p('article_all/article/feedback'),
    component: r.ArticleAll.Article.Feedback
  }, {
    ...p('article_favorites'),
    component: r.ArticleFavorites.ArticleFavorites
  },
  
  { // 输入不存在的路由时，回到home
    path: '*',
    redirect: '/'
  }
]

// guard为路由实例添加全局守卫
export default guard(new Router({
  mode: 'history',
  routes
}))
