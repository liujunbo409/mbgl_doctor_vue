import Vue from 'vue'
import Router from 'vue-router'
import guard from './guard'

import Home from '@v/Home/Home'
import Login from '@v/Login/Login'
import Register from '@v/Login/Register'


Vue.use(Router)

const r = {
  ResetPassword: () => import('@v/Login/Reset'),
  sub: {
    BeforeCheckPsd: () => import('@v/sub/BeforeCheckPsd')
  },
  My: {
    Index: () => import('@v/My/Index'),
    Info: () => import('@v/My/Info'),
    Account: {
      Index: () => import('@v/My/Account/Index'),
      ChangePsd: () => import('@v/My/Account/ChangePsd'),
      ChangePhone: () => import('@v/My/Account/ChangePhone'),
    },
    Role: {
      sub: {
        Jxjb: () => import('@v/My/Role/sub/Jxjb')
      },
      Index: () => import('@v/My/Role/Index'),
      Doctor: () => import('@v/My/Role/Doctor'),
      Nurse: () => import('@v/My/Role/Nurse'),
    },
    Feedback: () => import('@v/My/Feedback')
  },

  Visitplan: () => import('@v/Visitplan/Visitplan'),
  ArticleAssess: () => import('@v/ArticleAssess/ArticleAssess'),
  AssessContent: () => import('@v/ArticleAssess/AssessContent'),
  AssessInfo: () => import('@v/ArticleAssess/AssessInfo'),

  ArticleAll: {
    ArticleAll: () => import('@v/ArticleAll/ArticleAll'),
    Article: {
      Article: () => import('@v/ArticleAll/Article/Article'),
      Test: () => import('@v/ArticleAll/Article/Test'),
      Feedback: () => import('@v/ArticleAll/Article/Feedback')
    }
  },

  ArticleFavorites: {
    ArticleFavorites: () => import('@v/ArticleFavorites/ArticleFavorites')
  },

  AllQA: {
    AllQA: () => import('@v/AllQA/AllQA'),
    QAInfo: () => import('@v/AllQA/QAInfo')
  },

  CollectionQA: {
    CollectionQA: () => import('@v/CollectionQA/CollectionQA'),
  },

  OpenQA: {
    OpenQA: () => import('@v/OpenQA/OpenQA'),
    AllIll: () => import('@v/OpenQA/AllIll'),

    QAInfo: {
      QAInfo: () => import('@v/OpenQA/QAInfo/QAInfo'),
      AnswerEditor: () => import('@v/OpenQA/QAInfo/AnswerEditor'),
      AnswerInfo: () => import('@v/OpenQA/QAInfo/AnswerInfo'),
      CommentEditor: () => import('@v/OpenQA/QAInfo/CommentEditor')
    },
    
    Question: {
      Question: () => import('@v/OpenQA/Question/Question'),
      Questioned: () => import('@v/OpenQA/Question/Questioned')
    }
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
    path: '/home',
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
  }, {  // 全部问答
    ...p('all_qa'),
    component: r.AllQA.AllQA,

    children: [
      { // 全部问答/问答详情
        ...p('all_qa/qa_info'),
        component: r.AllQA.QAInfo,
      }
    ]
  }, {  // 收藏问答
    ...p('collection_qa'),
    component: r.CollectionQA.CollectionQA,

    children: [
      { // 收藏问答/问答详情
        ...p('collection_qa/qa_info'),
        component: r.AllQA.QAInfo
      }
    ]
  }, {  // 公开问答
    ...p('open_qa'),
    component: r.OpenQA.OpenQA,
    meta: {
      keepAlive
    }
  }, { // 公开问答/提问成功
    ...p('open_qa/question/questioned'),
    component: r.OpenQA.Question.Questioned
  }, {  // 公开问答/更多疾病
    ...p('open_qa/all_ill'),
    component: r.OpenQA.AllIll,
    meta: {
      keepAlive
    }
  }, {  // 公开提问/问题详情
    ...p('open_qa/qa_info'),
    component: r.OpenQA.QAInfo.QAInfo,
    meta: {
      keepAlive, 
    },

    children: [
      {  // 公开提问/问题详情/写回答
        ...p('all_qa/qa_info/answer_editor'),
        component: r.OpenQA.QAInfo.AnswerEditor,
        meta: {
          fromUrlStop
        }
      }, {  // 公开提问/问题详情/回答详情  
        ...p('all_qa/qa_info/answer_info'),
        component: r.OpenQA.QAInfo.AnswerInfo,
        meta: {
          fromUrlStop
        },

        children: [
          {  // 公开提问/问题详情/评论
            ...p('all_qa/qa_info/answer_info/commentEditor'),
            component: r.OpenQA.QAInfo.CommentEditor,
            meta: {
              fromUrlStop
            }
          }
        ]
      }
    ]
  },
  
  { // 输入不存在的路由时，回到home
    path: '*',
    redirect: '/home'
  },
]

// guard为路由实例添加全局守卫
export default guard(new Router({
  mode: 'history',
  base: '/doctor/h5/vue',
  routes
}))
