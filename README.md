# SeaTable app template

## 目录结构

```
build ------------------------------------ 项目编译后的文件夹
config ----------------------------------- 项目编译配置文件夹
public ----------------------------------- 项目本地开发静态文件文件夹
scripts ---------------------------------- 项目打包脚本
src -------------------------------------- 项目源码文件夹
   api ----------------------------------- 访问服务端的接口文件
   locale -------------------------------- 项目国际化支持文件夹
     lang -------------------------------- 语言文件夹
     index.js ---------------------------- 国际化语言支持入口文件
   pages --------------------------------- 页面模块
   utils --------------------------------- 常用工具函数
   app.js -------------------------------- 项目主代码
   context.js ---------------------------- 管理全局参数及dtable-web相关api
   entry.js ------------------------------ app在集成环境下的入口文件
   index.js ------------------------------ 开发环境下入口文件
   mediator.js --------------------------- app集成环境下配置文件
   setting.js ---------------------------- 开发环境下配置文件
   setting.local.dist.js ----------------- 本地开发环境配置文件样例
   setting.local.js ---------------------- 本地开发环境下配置文件 (从样例拷贝后再修改)
```
## 代码层次及相关作用

### 代码结构图
> 本地开发及集成开发中全局变量的构建及管理

![你好](./public/media/images/seatable-app-template.png)

如上图: 
1. 开发环境中用到的变量通过 setting.local.js 文件进行配置
2. 部署环境中用到的变量通过 mediator.js 统一收集所有app需要的参数信息(由上层应用提供)
3. 通过 context 工具类对上层传递的参数进行统一管理, 向 app 提供统一的接口
4. app 的开发只需关注 context 提供的 api 即可, 避免 app 内部需要多次判断当前是开发环境还是部署环境
5. app 内部各模块的开发根据需及设计进行处理

## 开发流程
> template 中提供了部分公共组件, 可以直接使用

1. 基于需求及设计按步骤进行开发
2. 合理划分组件及目录结构
3. 按照模块进行开发
   
## 集成步骤

1. 完成翻译任务
```
   1) 将本地需要翻译的内容放入 `/public/local/en/**.json` 文件中
   2) 执行 `npm run push-translate` 将需要翻译的文件提交到翻译平台
   3) 在 [transifex](https://www.transifex.com/) 完成支持语言的翻译工作
   4) 执行 npm run pull-translate, 将翻译好的内容从翻译平台拉取下来
```

2. 完成打包工作, 执行 `npm run build`
3. 将打包好的文件放入 dtable-web 项目
```
   1) copy 将打包好的文件 main.css, main.js(打包好的文件在 build 文件夹下)
   20 paste 到 dtable-web 项目 /media/dtable-apps/**/ 文件夹下
```

4. 更新配置文件
```
对 dtable-web 项目 /media/dtable-apps/ 文件夹下的 config.json 进行更新
添加新的 app 的配置文件
{
   "app_name": "app-name",
   "app_type": "app-name",
   "version": "0.0.1",
   "display_name": {
      "de": "",
      "en": "app-name",
      "fr": "",
      "zh-cn": ""
   },
   "description": {
      "de": "",
      "en": "",
      "fr": "",
      "zh-cn": ""
   }
}
```

## 注意事项

### 参数添加
当 app 需要新的参数时, 
1. 需要更新 setting.local.js 文件满足开发环境的需要
2. 需要更新 mediator.js 文件满足部署环境的需要

### 国际化

国际化的使用请异步 ➡️[react-intl-universal](https://github.com/alibaba/react-intl-universal)