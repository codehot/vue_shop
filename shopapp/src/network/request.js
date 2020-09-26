import axios from 'axios'

export function request (config){
    const instance = axios.create({
        baseURL : 'http://www.v2.com/index.php/',
        timeOut : 500
    })
    //请求拦截
    instance.interceptors.request.use(config=>{
        //处理成功请求拦截操作
        //添加请求header
        //添加请求小图标
        return config
    },err=>{
        // 处理请求失败拦截
        return config
    })

    //相应拦截
    instance.interceptors.response.use(res=>{
        // console.log(res)
        return res.data
    },err=>{
        console.log(err)
    })
    return instance(config)
}