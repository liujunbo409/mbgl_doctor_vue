<template>
  <!-- 无重新加载按钮 todo 文章目录没有找到怎么展示 -->
  <div class="com-container">
    <vue-header title="全部文章"></vue-header>
    <vux-tab :animate="false">
      <tab-item ref="firstTab" @click.native="selected = 'recently'" class="needsclick">最近更新</tab-item>
      <tab-item v-for="({name, id}, index) in jiao_xue_ji_bing_Data" :key="index"
                @click.native="getMuluByIllId(id,index)"
      >{{ name }}
      </tab-item>
    </vux-tab>

    <vux-tab :animate="false" v-show="visibleTypeTabs">
      <tab-item ref="typeFirstTab" @click.native="selectType(2)" class="needsclick">科普文</tab-item>
      <tab-item ref="typeLastTab" @click.native="selectType()" class="needsclick">专业文</tab-item>
    </vux-tab>

    <view-box minus="88px" v-if="visibleArticleList" ref="articleList">
      <vux-group class="com-group-noMarginTop">

        <div class="search-bar" v-if="selected !== 'recently' && showArticleList.length">
          <div class="com-input-container">
            <input type="text" v-model="articleKeyword" placeholder="请输入要搜索的文章名">
          </div>
        </div>

        <div class="catalog-articles" v-if="showArticleList.length">
          <p class="subtitle">文章</p>
          <article-item v-for="(item, index) in showArticleList" :key="index" :ret="item"
                        @click.native="toArticle(item)"
          ></article-item>
        </div>

        <!-- 如果文章目录都没有 -->
        <div class="noArticleData"
             v-if="selected !== 'recently' && mulu_list.length === 0"
        >暂无数据
        </div>
      </vux-group>
    </view-box>


    <view-box minus="79px" v-if="selected !== 'recently' && !show_article_static">
      <p  class="subtitle">目录</p>
      <div class="catalogBox"  v-if="mulu_list != undefined">
        <div v-for="(mulu,index) in mulu_list" :key="index" @click="showArticle(mulu.id,index)">
          <div class="title-line" style="display: flex;justify-content: space-between;">
            <span>{{ mulu.catalog_name }}</span>
            <x-icon type="ios-arrow-right" size="16" class="com-xicon-gray icon"></x-icon>
          </div>
        </div>
      </div>
      <div v-else style="display: flex;justify-content: center;margin-top: 45px;font-size: 20px;color: #888888;">
        暂无数据
      </div>
    </view-box>
    <view-box minus="79px" v-show="selected !== 'recently' && show_article_static">
      <p  class="subtitle">文章</p>
      <vux-tab>
        <tab-item ref="kePuWen" @click.native="showArticle(mulu_id,mulu_index,2)">科普文</tab-item>
        <tab-item ref="zhuanYeWen" @click.native="showArticle(mulu_id,mulu_index,1)">专业文</tab-item>
      </vux-tab>
      <div class="backBtn" @click="backCatalog" style="padding-left: 15px;color: #03A9F4">
        <span>返回目录</span>
        <img src="@img/btn/dir-back.png" width="20px">
      </div>
      <div v-if="article_list != undefined && article_show">
        <cell-box :is-link="true" v-for="(item, index) in article_list" :key="index" @click.native="splicingToArticleData(item.article.id,jiao_xue_ji_bing_Data[jibing_index].id,mulu_id)">
          <div class="container">
            <p class="title">{{ item.article.title }}</p>
            <div class="info">
              <div class="count">
                <div class="category">{{jiao_xue_ji_bing_Data[jibing_index].name}}</div>
                <div class="watched icon">{{ item.article_data.doctor_show_num + item.article_data.user_show_num }}</div>
                <div class="good icon">{{ item.article_data.accept_num }}</div>
                <div class="star icon">{{ item.article_data.used_num }}</div>
              </div>
              <div class="media">
                <div class="hasVideo icon" v-if="item.article.video_url">视频</div>
                <div class="hasAudio icon" v-if="item.article.voice_url">音频</div>
                <div class="hasWord icon">文稿</div>

              </div>
            </div>
          </div>
        </cell-box>
      </div>
      <div v-else style="display: flex;justify-content: center;margin-top: 45px;font-size: 20px;color: #888888;">
        暂无数据
      </div>
    </view-box>
  </div>
</template>

<script>
    import {Tab, TabItem,CellBox} from 'vux'
    import ArticleItem from '@c/item/ArticleItem'
    import CatalogGroup from '@c/Catalog/CatalogGroup'

    // 这是一个类，用来树化疾病目录
    import List from '@u/list'

    export default {
        components: {
            VuxTab: Tab, TabItem,CellBox,
            ArticleItem, CatalogGroup
        },

        data() {
            return {
                articleList: [],
                cache: {},                 // 缓存列表
                visibleArticleList: true, //文章列表显示

                articleListStatus: 1,         // 文章列表状态
                catalogStatus: 1,         // 目录状态
                selected: 'recently',      // 疾病选择状态，最近更新为recently，疾病时为疾病id
                dirDepth: [],      // 层级深度
                typeSelected: 2,  // 专业科普选择状态
                visibleTypeTabs: true,  // 专业科普tab显示状态

                keyword: '',
                articleKeyword: '',
                visibleSearchBar: false,  // 搜索栏显示

                illLists: [],
                visibleCatalog: false,
                openingMenuId: 0,

                lastListScroll: 0,

                jiao_xue_ji_bing_Data:null, //tab名称列表

                mulu_list:null,  //疾病下的目录
                mulu_id:0,  //目录Id
                jibing_index:0, //疾病标识
                mulu_index: 0,  //目录标识
                article_list:null, //目录下的文章
                article_show:false, //
                show_article_static:false, //文章展示
            }
        },

        beforeRouteLeave(to, from, next) {
            if (this.$refs.articleList) {
                this.lastListScroll = this.$refs.articleList.getScrollTop();
            } else {
                this.lastListScroll = 0;
            }
            next();
        },

        mounted() {
            this.$refs.firstTab.$el.click();
            this.$refs.typeFirstTab.$el.click();
            this.getKeshiIll();
            this.load(2, 'recently');
        },

        activated() {
            Vue.nextTick(() => {
                if (this.$refs.articleList) {
                    this.$refs.articleList.scrollTo(this.lastListScroll);
                }
            })
        },

        computed: {
            // 基础疾病列表
            baseIllList() {
                return this.jiao_xue_ji_bing_Data;
            },

            // 过滤文章列表
            showArticleList() {
                return this.articleList.filter(val => val.article.title.toString().indexOf(this.articleKeyword) >= 0);
            },

            // 过滤目录列表
            showillList() {
                let list = new List(this.illLists.filter(val => {
                    return val.catalog_name.toString().indexOf(this.keyword) >= 0;
                }));
                return list.toTree();
            }
        },

        watch: {
            // 基本思路：以多个变量控制不同ui显示
            selected(val) {
                if (this.baseIllList.map(val => val.id).includes(val)) {
                    this.loadillList(val);
                    this.visibleTypeTabs = false;
                    this.visibleArticleList = false;
                    this.visibleSearchBar = true;
                    this.visibleCatalog = true;
                }
                if (val === 'recently') {
                    this.visibleTypeTabs = true;
                    this.visibleArticleList = true;
                    this.visibleSearchBar = false;
                    this.visibleCatalog = false;
                    Vue.nextTick(() => {
                        if (this.cache['recently'].selectedType) {
                            this.$refs[`${this.cache['recently'].selectedType === 2 ? 'typeFirstTab' : 'typeLastTab'}`].$el.click();
                        } else {
                            this.$refs.typeFirstTab.$el.click();
                        }
                    })
                }
            },

            typeSelected(val) {
                if (this.selected === 'recently') {
                    this.load(val, 'recently');
                } else {
                    this.load(val);
                }
            },
        },

        methods: {
            //获取疾病下目录带有排序
            getMuluByIllId(ill_id,index){
                if (this.jibing_index == index && this.selected != 'recently'){
                    return;
                }
                this.show_article_static = false;
                this.jibing_index = index;
                this.selected = ill_id;
                this.$bus.$emit('vux.spinner.show');
                _request({
                    url:'article/getShowMulu',
                    params:{
                        ill_id:ill_id
                    }
                }).then(res =>{
                    this.$bus.$emit('vux.spinner.hide');
                    this.mulu_list = res.data.ret;
                });
            },

            //点击目录展示目录下的文章
            showArticle(mulu_id,index,article_style = 2){
                if (article_style == 2){
                    this.$refs.kePuWen.$el.click();
                }else {
                    this.$refs.zhuanYeWen.$el.click();
                }
                this.show_article_static = true;
                let self = this;
                this.$bus.$emit('vux.spinner.show');
                _request({
                    url:'article/getShowMuluArticle',
                    params:{
                        mulu_id:mulu_id,
                        article_style:article_style,
                    }
                }).then(res =>{
                    this.$bus.$emit('vux.spinner.hide');
                    self.article_list = res.data.ret;
                    // console.log(JSON.stringify(res.data.ret[0]));
                    self.mulu_index = index;
                    self.mulu_id = mulu_id;
                    self.article_show = true;
                });
            },

            //拼接去文章详情数据
            splicingToArticleData(article_id,ill_id,mulu_id){
                let data = {
                    ill_id:ill_id,
                    mulu_id:mulu_id,
                    article:{
                        id:article_id,
                    },
                };
                this.toArticle(data);
            },

            //获取科室下的疾病 *必须有*
            getKeshiIll(){
                let ke_shi = null;
                _request({
                    url: `apply/${this.$store.state.user.userInfo.role}Apply`
                }).then(({data}) => {
                    if (data.result) {
                        var {ret} = data;
                        ke_shi = ret.department_id_cache ? ret.department_id_cache : ''; //获取科室ID
                    }
                    let req = () => {
                        return _request({
                            url: 'apply/departmentIllList',
                            params: {
                                department_id: ke_shi
                            }
                        }).then(({data}) => {
                            if (data.result) {
                                this.jiao_xue_ji_bing_Data = data.ret.map(val => ({name: val.name, id: val.id})); //科室下所有疾病
                            }
                        })
                    };
                    // 出错后再试一次
                    req().catch(e => {
                        console.log(e);
                        req()
                    });
                });
            },
            // 加载文章，当catalogId为recently时，加载最近更新
            load(type = 2, catalogId) {
                catalogId = catalogId || this.openingMenuId;
                // 判断是否有缓存
                if (type === 1 && this.cache[catalogId] && this.cache[catalogId].zhuanYe) {
                    this.articleList = this.cache[catalogId].zhuanYe;
                    return;
                }
                if (type === 2 && this.cache[catalogId] && this.cache[catalogId].kePu) {
                    this.articleList = this.cache[catalogId].kePu;
                    return;
                }

                this.articleListStatus = 2;
                if (!this.cache[catalogId]) {
                    this.cache[catalogId] = {};
                }
                this.articleList = [];
                this.$bus.$emit('vux.spinner.show');
                _request({
                    url: `article/${catalogId === 'recently' ? 'newArticleList' : 'articleList'}`,
                    params: {
                        style: type,
                        ...(catalogId !== 'recently' ? {mulu_id: catalogId} : {})
                    }
                }).then(({data}) => {
                    this.$bus.$emit('vux.spinner.hide');
                    if (data.result) {
                        this.articleListStatus = 3;
                        if (type === 1) {
                            this.cache[catalogId].zhuanYe = data.ret.data;
                            if (this.typeSelected === 1) {
                                this.articleList = data.ret.data;
                            }
                        }
                        if (type === 2) {
                            this.cache[catalogId].kePu = data.ret.data;
                            if (this.typeSelected === 2) {
                                this.articleList = data.ret.data;
                            }
                        }
                    } else {
                        this.articleListStatus = 0 + type;
                        this.$bus.$emit('vux.toast', data.message);
                    }
                }).catch(e => {
                    this.articleListStatus = 0 + type;
                    this.$bus.$emit('vux.spinner.hide');
                    console.log(e);
                    this.$bus.$emit('vux.toast', {
                        type: 'cancel',
                        text: '网络错误'
                    })
                })
            },

            selectType(index = 1) {
                this.typeSelected = index;
                if (this.selected === 'recently') {
                    if (!this.cache[this.selected]) {
                        this.cache[this.selected] = {};
                    }
                    this.cache[this.selected].selectedType = index;
                } else {
                    if (!this.cache[this.openingMenuId]) {
                        this.cache[this.openingMenuId] = {};
                    }
                    this.cache[this.openingMenuId].selectedType = index;
                }
            },

            // 跳转至文章
            toArticle(data) {
                this.$toView('article_all/article', {
                    params: {
                        data,
                        type: this.typeSelected,
                        listType: this.selected === 'recently' ? 'recently' : 'menu'
                    }
                })
            },


            // 点击catalog的目录标题时的事件
            onClickTitle(menu) {
                this.visibleCatalog = false;
                this.visibleSearchBar = false;
                this.visibleArticleList = true;
                this.visibleTypeTabs = true;

                this.openingMenuId = menu.id;
                var list = new List(this.illLists);
                this.dirDepth = list.getParents(menu);
                this.load(2);

                this.typeSelected = this.cache[this.openingMenuId].selectedType;

                // 若有记忆的tab选项则读取
                Vue.nextTick(() => {
                    if (this.cache[this.openingMenuId].selectedType) {
                        this.$refs[`${this.cache[this.openingMenuId].selectedType === 2 ? 'typeFirstTab' : 'typeLastTab'}`].$el.click();
                        this.load(this.cache[this.openingMenuId].selectedType);
                    } else {
                        this.$refs.typeFirstTab.$el.click();
                    }

                    this.$refs.dirHint.scrollTo(this.$refs.dirHint.scrollWidth, 0);
                })
            },

            // 加载目录原始数据
            loadillList(ill_id) {
                this.catalogStatus = 2;
                this.illLists = [];
                this.$bus.$emit('vux.spinner.show');
                _request({
                    url: 'article/mulu',
                    params: {ill_id}
                }).then(({data}) => {
                    this.$bus.$emit('vux.spinner.hide');
                    if (data.result) {
                        this.catalogStatus = 3;
                        this.illLists = data.ret;
                    } else {
                        this.catalogStatus = 0;
                        this.$bus.$emit('vux.toast', data.message);
                    }
                }).catch(e => {
                    this.$bus.$emit('vux.spinner.hide');
                    console.log(e);
                    this.catalogStatus = 0;
                })
            },

            enterChildCatalog(item) {
                this.onClickTitle(item);
            },

            // 后退按钮
            backCatalog() {
                this.article_show = false;
                this.show_article_static = false;
                this.visibleTypeTabs = false;
                this.visibleArticleList = false;
                this.visibleSearchBar = true;
                this.visibleCatalog = true;
            }
        }
    }
</script>

<style lang="less" scoped>
  .com-container {
    background-color: white;
  }

  .scrollable .vux-tab-item {
    flex: 0 0 20%;
  }

  .catalogList {
    max-height: calc(~'100% - 90px - 44px'); // 减去上栏 + 两个tab高度
  }

  .search-bar {
    height: 35px;

    .com-input-container {
      height: 100%;
      box-sizing: border-box;
      background-color: #eee;
      border-top: 1px #ccc solid;
      border-bottom: 1px #ccc solid;

      > input {
        padding: 10px;

      }
    }
  }

  .child-catalogs {
    border-bottom: 5px #eee solid;
  }

  .child-catalogs,
  .catalog-articles {
    /deep/ .weui-cell:first-of-type {
      &::before {
        display: none;
      }
    }
  }

  .catalog {
    margin-left: 10px;
  }

  .subtitle {
    line-height: 40px;
    font-size: 16px;
    text-align: center;
    border-bottom: 1px #ccc solid;
  }

  .noArticleData {
    position: fixed;
    height: calc(~'100% - 164px');
    width: 100%;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #eee;
    color: #666;
    font-size: 18px;
  }

  .currentDir {
    box-sizing: border-box;
    font-size: 13px;
    padding: 5px;

    > * {
      vertical-align: middle;
    }

    .prifix {
      position: relative;
      top: 0.5px;
    }

    .dir-text {
      display: inline-block;
      width: calc(~'100% - 100px - 5em');
      overflow: auto;
      white-space: nowrap;
    }

    .backBtn {
      color: @theme;
      font-size: 14px;
      float: right;
      margin-right: 5px;
      position: relative;
      top: -1px;

      > * {
        vertical-align: middle;
      }
    }
  }

  .catalogBox{
    width: 100%;
    box-sizing: border-box;
    padding: 2.5px 10px 2.5px;
    color: #666;
    font-size: 16px;
  }

  .title-line{
    position: relative;
  }
  .container {
    width: 100%;
    height: 100%;

  .title {
    width: 80%;
    flex-basis: 100%;
    line-height: 1.6;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .info {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    white-space: nowrap;

  @media screen and (max-width: 330px) {
    font-size: 12px;
  }

  .count, .media {
    display: flex;
  }

  .media {
    margin-right: 20px;
  }

  .icon {
    background-size: 1em;
    background-repeat: no-repeat;
    background-position: left center;
    padding-left: 1.2em;
    margin-left: 5px;
  }

  .category {
    font-size: #c6c6c6;
    margin-right: 3px;
  }

  .watched {
    background-image: url('~@img/sub/eye.png');
  }

  .good {
    background-image: url('~@img/sub/good.png');
  }

  .star {
    background-image: url('~@img/sub/star.png');
  }

  .hasAudio {
    background-image: url('~@img/sub/audio.png');
  }

  .hasVideo {
    background-image: url('~@img/sub/video.png');
  }

  .hasWord {
    background-image: url('~@img/sub/word.png');
  }
  }
  }
</style>
