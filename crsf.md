# CRSF

## 介绍

- CRSF是一种*跨站请求伪造*，csrf是伪装来自信任用户的请求来利用受信任的网站。

- CRSF：攻击者盗用你的身份，以你的名义向第三方网站发送恶意请求。

## CRSF攻击原理

![https://upload-images.jianshu.io/upload_images/5219651-7af31f65db312f64.png?imageMogr2/auto-orient/strip|imageView2/2/format/webp](https://upload-images.jianshu.io/upload_images/5219651-7af31f65db312f64.png?imageMogr2/auto-orient/strip|imageView2/2/format/webp)

1. 首先 用户 浏览并登录 了受信任站点 A；

2. 登录信息验证通过以后， 站点A会在返回浏览器的信息中带上已登录的 cookie，cookie 信息会在浏览器保存一定时间 ；

3. 用户 在没有清除 站点A 的情况下，访问恶意站点B ；

4. 恶意站点 B的 页面 向 站点A 发起请求， 而这个请求 带上 浏览器端保存的 站点A的cookie ；

5. 站点A根据 请求所带的cookie ， 判断请求 为用户 所发送；

因此， 站点A 会根据 用户 的权限 来 处理 恶意站点B所发送的请求， 而这个请求可能以 用户的身份 来进行 邮件、短信、消息，以及转账等操作， 这样恶意站点 B 就可以伪造 用户  请求 站点A 的操作。

- 登录 受信任 站点A ， 并在本地生成 cookie

- 在未 清除 cookie 的情况下 ， 访问 恶意站点 B


## CSRF的防御

1. 尽量使用POST, 限制GET

限制通过 <img src="xxx"> 的方式 访问 接口

也会出现 <form id="aaa" action="xxx" metdod="POST"> ;

post 也有问题 。 还有xss攻击 的风险。恶意注入代码

2. 将cookie设置为HttpOnly

防止 站内通过xss攻击盗取cookie。

3. 增加token 

4. 通过 Referer 识别

识别 请求的网站地址
