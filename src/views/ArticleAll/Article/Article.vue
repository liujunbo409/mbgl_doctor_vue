<template>
  <article-view
    v-bind="{ art, source, near, next, last, nextStatus, lastStatus, nexus, headerLeft: '返回目录' }"
    minusHeight="46px - 60px"
    @onClickLast="clickNear"
    @onClickNext="clickNear"
    @onClickNexus="clickNexus"
  >
    <footer>
      <div class="btn" @click="$toView('article_all/article/test', { params: { id } })">
        <img src="@img/btn/test.png">
        <div class="text">考核问题</div>
      </div>
      <div class="btn" @click="$toView('article_all/article/feedback', { params: { id } })">
        <img src="@img/btn/feedback.png">
        <div class="text">文章反馈</div>
      </div>
      <div class="btn" :class="{ disabled: collectPostStatus === 2 }">
        <img src="@img/btn/collected.png" v-if="collected" @click="toggleCollectStatus">
        <img src="@img/btn/uncollected.png" v-else @click="toggleCollectStatus">
        <div class="text">文章收藏</div>
      </div>
      <div class="btn" v-if="visibleAcceptBtn" :class="{ disabled: acceptPostStatus === 2 }">
        <img src="@img/btn/good_fill.png" v-if="accepted" @click="toggleAcceptStatus">
        <img src="@img/btn/good.png" v-else @click="toggleAcceptStatus">
        <div class="text">认可文章</div>
      </div>
    </footer>
    <div class="com-ab-center com-reloadBtn" v-if="!status" @click="reload">重新加载</div>
  </article-view>
</template>

<script>
    import ArticleView from '@c/layout/ArticleView'

    export default {
        components: {
            ArticleView
        },

        data() {
            return {
                id: '',     // 文章id
                illId: '',
                muLu_Id: '',
                type: '',   // 文章类型（专业，科普）
                listType: '',   //  列表类型，目前有最近更新列表和目录列表

                // 这些都是要传给articleView的
                art: null,
                source: null,
                near: true,   // 是否显示上下篇
                next: null,
                last: null,
                nextStatus: 1,
                lastStatus: 1,
                nexus: null,

                status: 1,   // 文章主体状态，如果文章主体加载失败，则显示重新加载按钮
                collected: false,
                accepted: false,
                collectChangeCount: 0,   // 计数，防止用户短时间内频繁修改收藏状态
                collectPostStatus: 1,   // 收藏按钮的提交状态

                visibleAcceptBtn: false,  // 有权限认可才显示认可按钮
                acceptPostStatus: 1,  // 认可按钮提交状态
                acceptChangeCount: 0,  // 认可按钮计数

                articleCache: [],  //文章缓存
                tappedGotoHome: false,  //home图标跳转
            }
        },

        beforeRouteLeave(to, from, next) {
            if (this.tappedGotoHome) {
                this.tappedGotoHome = false;
                next();
            } else {
                let data = this.articleCache.pop();
                if (!this.articleCache.length) {
                    return next()
                }

                if (data.id == this.id) data = this.articleCache.pop();

                this.reload(data, true);
                next(false)
            }
        },

        mounted() {
            document.querySelector('#header-homeBtn').addEventListener('mousedown', () => {
                this.tappedGotoHome = true
            })
        },

        activated() {
            let {data} = this.$route.params;
            if (data) {
                this.id = data.article.id || data.id;
                this.illId = data.ill_id;
                this.muLu_Id = data.mulu_id;
                this.type = this.$route.params.type;
                this.listType = this.$route.params.listType;
                if ('near' in this.$route.params) {
                    this.near = this.$route.params.near
                }

                this.init();
                this.load();
                this.loadNear();
                this.loadNear('last');
                this.getCollectStatus();
                this.getNexus();
                this.getAccpetStatus();
                this.checkRight();
            }
        },

        methods: {
            // 因为使用了组件缓存，需要手动初始化
            init() {
                this.art = null;
                this.source = null;
                this.next = null;
                this.last = null;
                this.nexus = null;
                this.nextStatus = 1;
                this.lastStatus = 1;
                this.collectChangeCount = 0;
                this.collectPostStatus = 1;
                this.visibleAcceptBtn = false;
                this.acceptChangeCount = 0;
            },

            // 加载文章主体和参考文献
            load(noCache = false) {
                this.status = 2;
                this.$bus.$emit('vux.spinner.show');

                Promise.all([
                    _request({
                        url: 'article/article',
                        params: {
                            article_id: this.id,
                            ill_id: this.illId
                        }
                    }),

                    _request({
                        url: 'article/source',
                        params: {article_id: this.id}
                    }),
                ]).then(([{data: article}, {data: source}]) => {
                    this.articleCache.push({
                        id: this.id,
                        type: article.ret.style
                    });
                    this.$bus.$emit('vux.spinner.hide');
                    if (article.result && source.result) {
                        this.status = 3;
                        this.art = article.ret;
                        this.source = source.ret;
                    } else {
                        this.status = 0;
                    }
                }).catch(e => {
                    this.$bus.$emit('vux.spinner.hide');
                    this.status = 0;
                    console.log(e);
                    this.$bus.$emit('vux.toast', {
                        type: 'cancel',
                        text: '网络错误'
                    })
                })
            },

            // 加载上下篇
            loadNear(type = 'next') {
                _request({
                    url: `article/${this.listType === 'recently' ? 'newNearArticle' : 'nearArticle'}`,
                    params: {
                        article_id: this.id,
                        mulu_id: this.muLu_Id,
                        type,
                        style: this.type
                    }
                }).then(({data}) => {
                    if (data.result) {
                        this[`${type}Status`] = 3;
                        this[type] = data.ret;
                    } else {
                        this[`${type}Status`] = 0;
                    }
                }).catch(e => {
                    console.log(e);
                    this[`${type}Status`] = 0;
                })
            },

            // 获取收藏状态
            getCollectStatus() {
                _request({
                    url: 'article/collect',
                    params: {
                        article_id: this.id
                    }
                }).then(({data}) => {
                    if (data.result) {
                        this.collected = data.ret;
                    }
                }).catch(e => {
                    console.log(e)
                })
            },

            // 获取认可状态
            getAccpetStatus() {
                _request({
                    url: 'article/accept',
                    params: {
                        role: this.$store.state.user.userInfo.role,
                        article_id: this.id,
                    }
                }).then(({data}) => {
                    if (data.result) {
                        this.accepted = data.ret;
                    } else {
                        this.$bus.$emit('vux.toast', data.message);
                    }
                })
            },

            // 获取关联文章
            getNexus() {
                _request({
                    url: 'article/nexus',
                    params: {article_id: this.id}
                }).then(({data}) => {
                    if (data.result) {
                        this.nexus = data.ret
                    }
                }).catch(e => {
                    console.log(e)
                })
            },

            checkRight() {
                _request({
                    url: 'article/acceptTitle',
                    params: {
                        ill_id: this.illId,
                        article_id: this.id,
                        role: this.$store.state.user.userInfo.role
                    }
                }).then(({data}) => {
                    this.visibleAcceptBtn = data.result
                })
            },

            // 切换收藏状态
            toggleCollectStatus() {
                this.collectChangeCount++;
                setTimeout(() => {
                    this.collectChangeCount--
                }, 10000);

                if (this.collectChangeCount > 4) {
                    this.$bus.$emit('vux.toast', '您的操作过于频繁');
                    return;
                }

                if (this.collectPostStatus === 2) {
                    return;
                }
                this.collectPostStatus = 2;
                _request({
                    url: 'article/collectPost',
                    method: 'post',
                    data: {
                        article_id: this.id,
                        ill_id: this.illId
                    }
                }).then(({data}) => {
                    if (data.result) {
                        this.collectPostStatus = 3;
                        this.collected = !this.collected;
                        this.$bus.$emit('vux.toast', `已${this.collected ? '加入' : '取消'}收藏`);
                    } else {
                        this.collectPostStatus = 0;
                        this.$bus.$emit('vux.toast', data.message);
                    }
                }).catch(e => {
                    this.collectPostStatus = 0;
                    console.log(e);
                    this.$bus.$emit('vux.toast', {
                        type: 'cancel',
                        text: '网络错误'
                    })
                })
            },

            // 切换认可状态
            toggleAcceptStatus() {
                this.acceptChangeCount++;
                setTimeout(() => {
                    this.acceptChangeCount--
                }, 10000);

                if (this.acceptChangeCount > 4) {
                    this.$bus.$emit('vux.toast', '您的操作过于频繁');
                    return;
                }

                if (this.acceptPostStatus === 2) {
                    return;
                }
                this.acceptPostStatus = 2;
                _request({
                    url: 'article/acceptPost',
                    method: 'post',
                    data: {
                        ill_id: this.illId,
                        article_id: this.id,
                        role: this.$store.state.user.userInfo.role
                    }
                }).then(({data}) => {
                    if (data.result) {
                        this.acceptPostStatus = 3;
                        this.accepted = !this.accepted;
                        this.$bus.$emit('vux.toast', `已${this.accepted ? '添加' : '取消'}认可`);
                    } else {
                        this.acceptPostStatus = 0;
                        this.$bus.$emit('vux.toast', data.message);
                    }
                }).catch(e => {
                    this.acceptPostStatus = 0;
                    console.log(e);
                    this.$bus.$emit('vux.toast', {
                        type: 'cancel',
                        text: '网络错误'
                    });
                })
            },

            // 重新加载
            reload(data, noCache = false) {
                if (data) {
                    this.id = data.id;
                    this.type = data.type;
                }
                this.init();
                this.load(noCache);
                this.loadNear();
                this.loadNear('last');
                this.getCollectStatus();
                this.getNexus();
                this.getAccpetStatus();
                this.checkRight();
            },

            // 点击上下篇时切换
            clickNear(data) {
                if (data.id === 0) {
                    return;
                }
                this.id = data.id;
                this.reload();
            },

            // 点击关联文章时切换
            clickNexus(data) {
                this.id = data.major_id;
                this.type = data.style;
                this.reload();
            },
        }
    }


</script>

<style lang="less" scoped>
  footer {
    display: flex;
    width: 100%;
    height: 60px;
    background-color: white;

    .btn {
      flex: 1;
      text-align: center;
      position: relative;
      padding: 5px;
      box-sizing: border-box;

      > img {
        width: 25px;
      }

      &::before {
        content: '';
        position: absolute;
        width: 1px;
        height: 50%;
        background-color: #c6c6c6;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }

      &:first-child::before {
        display: none;
      }
    }
  }
</style>
