<template>
    <div style="background:white;height:100%;">
         <vue-header title="文章详情"></vue-header>
         <div style="padding:0 30px">
         <h2 style="text-align:center;line-height:60px">文章标题</h2>
         <h3 style="text-align:center;line-height:50px">文章出处，时间</h3>
         <p style="line-height:30px">正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文</p>
         </div>
         <div style="margin-top:30px;background:#ccc;padding-left:20px">参考文献</div>
         <p style="padding-left:20px;line-height:60px"> 文献标题文献标题文献标题文献标题文献标题</p>
         <div style="background:#ccc;padding-left:20px">我的投稿</div>
        <x-button text="投稿我的音频课" style="width:200px;margin-top:30px"></x-button>
        <div style="position:relative">
            <div style="float:left;width:40%"><img src="../../assets/images/btn/video.png" alt=""></div>
        <div  style="width:50%;float:left;">
            <P> 标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题</P>
            <p>审核中</p>
            <button style="position:absolute;top:80px;left:325px;">停用</button>
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
