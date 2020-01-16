<template>
    <div style="background:white;">
         <vue-header title="文章详情"></vue-header>
         <div style="padding:0 30px">
         <h2 style="text-align:center;line-height:60px">文章标题</h2>
         <h3 style="text-align:center;line-height:50px">文章出处，时间</h3>
         <p style="line-height:30px">正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文</p>
         </div>
         <div style="margin-top:30px;background:#ccc;padding-left:20px">参考文献</div>
         <p style="padding-left:20px;line-height:60px"> 文献标题文献标题文献标题文献标题文献标题</p>
         <div style="background:#ccc;padding-left:20px">我的投稿</div>
        <x-button text="投稿我的音频课" style="width:200px;margin-top:20px"></x-button>
        <div style="position:relative;overflow:hidden" >
            <div style="width:40%;float:left;"><img src="../../assets/images/btn/video.png" alt="" style="width:100%;"></div>
        <div  style="width:50%;float:left;">
            <P style="margin-top:25px"> 标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题</P>
            <p style="margin-top:10px;color:#ccc">审核中</p>
            <button style="position:absolute;top:90px;left:325px;background-color: white;padding:5px;border-radius:20px;border:1px solid #ccc">停用</button>
        </div>  
        </div>
        <div style="position:relative;overflow:hidden;" >
            <div style="width:40%;float:left;"><img src="../../assets/images/btn/video.png" alt="" style="width:100%;"></div>
        <div  style="width:50%;float:left;">
            <P style="margin-top:25px"> 标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题</P>
            <p style="margin-top:10px;color:#ccc">2020-01-01 09:03</p>
            <button style="position:absolute;top:90px;left:325px;background-color: white;padding:5px;border-radius:20px;border:1px solid #ccc">停用</button>
        </div>  
        </div>
    </div>
</template>
<script>
import {XButton} from 'vux'
export default {
     components:{
        XButton
    },
    data(){
        return{
            
        }
    }
}
</script>
<style lang="less" scoped>

</style>