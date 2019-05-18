export default class {
  constructor (data){
    this.data = data || []
  }

  getChildsById (item){
    var foo = item =>{
      var result = []
      this.data.forEach(original =>{
        if(item.id === original.father_id){
          original.childs = foo(original)
          result.push(original)
        }
      })
      
      return result
    }

    return foo(item) 
  }

  toTree (){
    // 获取全部根目录（为什么不用father_id == 0来判断：在有关键词搜索时无法正确找到根目录）
    var roots = this.data.filter(catalog =>{
      return !this.data.some(original => catalog.father_id == original.id)
    })

    roots.forEach(root =>{
      root.childs = this.getChildsById(root)
    })


    return roots
  }
}