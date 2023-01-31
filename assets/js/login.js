 $(function () {
    // 点击 去注册账号
    $('#link_reg').click(function () {
        $('.reg-box').show();
        $('.login-box').hide();
    });

    // 点击 去登录
    $('#link_login').click(function () {
        $('.reg-box').hide();
        $('.login-box').show();
    });

    // 获取 layUI 中的弹层模块
    var layer = layui.layer;
    // 获取 layui 中的表单模块
    var form = layui.form;

    // form.verify() 自定义验证规则
    form.verify({
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) { //value：表单的值、item：表单的DOM对象
            // 判断 value 和注册模块输入的密码中的值是否一致
            let pwd = $('.reg-pwd').val();
            if (value != pwd) {
                return '两次密码不一致';
            }
        }
    });

    // 监听注册表单的提交事件
    $('#formReg').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault();

        // 发起 ajax 请求
        var data = {
            username: $('.reg-name').val(),
            password: $('.reg-pwd').val()
        };
        $.post('/api/reguser', data, function (res) {
            console.log(res);
            if (res.status != 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功,请登录');
            $('#link_login').click();
        });
    });
     
    $('#form_login').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault();

        // 发起 ajax 请求
        // 快速获取表单的数据
        var data = $(this).serialize();
        console.log(data);
        $.post('/api/login', data, function (res) {
            console.log(res);
            if (res.status != 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功');
            // 将登录成功得到的 token 字符串 ,保存到 localstorage 中
            localStorage.setItem('token', res.token);
            location.href = 'index.html';
        
        });
    });
});