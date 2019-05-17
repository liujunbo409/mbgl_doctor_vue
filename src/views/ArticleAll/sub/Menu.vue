<script>
export default {
  render (h){
    var draw = list =>{
      return list.map(menu =>{
        var hasChild = menu.childs.length
        return <div class="menuBox">
          <p>
            <div class="com-jiao"></div>
            <span>{menu.catalog_name}</span> 
          </p>
          {hasChild ? <div class="menu">{draw(menu.childs)}</div> : ''} 
        </div>
      })
    }

    return <div class="container">{draw(this.list)}</div>
  },

  props: {
    list: {
      default: []
    }
  },

  data (){
    return {

    }
  },

  methods: {

  }
}
</script>

<style lang="less" scoped>
.container{
  position: relative;
  left: -15px;
}

.com-jiao{
  margin: 0 7px;
}

.menuBox{
  margin-left: 15px;
  color: #666;
}
</style>
