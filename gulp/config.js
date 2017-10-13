const proxyMiddleware = require("http-proxy-middleware");

const devProxy1 = proxyMiddleware(['/management-center', '/platform', '/user-center'], {
    target: 'http://10.200.188.30:11300',
});

// 代理
const devProxy2 = proxyMiddleware(['/miniapp','/login'], {
    target: 'http://10.86.86.122:9180',
    changeOrigin: true
});

module.exports = {
    // 开发环境
    "dev": {
        //自定义全局变量
        "baseEnv":{
            "baseURL":"",
            "env":"dev"
        },
        "middleware": [devProxy1,devProxy1],
        "port":3010
    },
    // 测试环境
    "test": {
        //自定义全局变量
        "baseEnv":{
            "baseURL":"/sweet-ui",
            "env":"test"
        }
    },
    // 生产环境
    "production": {
        //自定义全局变量
        "baseEnv":{
            "baseURL":"/sweet-ui",
            "env":"production"
        }
    }
};
