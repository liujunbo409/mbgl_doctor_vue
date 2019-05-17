export default class {
  constructor (data){
    this.data = data
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
    var roots = this.data.filter(val => val.father_id === 0)
    roots.forEach(root =>{
      root.childs = this.getChildsById(root)
    })

    return roots
  }
}