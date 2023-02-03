$(function () {
    var layer = layui.layer;
    var form = layui.form;

    // 定义加载文章分类的方法
    initCate();

    // 初始化富文本编辑器
    initEditor();
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg('初始化文章分类失败!')
                }

                // 调用模板引擎 渲染分类的下拉菜单
                var str = template('tpl-cate', res);
                $('[name="cate_id"]').html(str);
                // 重新渲染表单
                form.render(); //更新全部
            }
        });
    }

    var $image = $('#image')
    var options = {
        aspectRatio: 400 / 200,
        preview: '.img-preview'
    }
    $image.cropper(options);

    // 选择封面的按钮
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    });

    // 为文件选择框绑定change 事件
    $('#coverFile').on('change', function (e) {
        // 获取用户选择的文件
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择照片!');
        }
        // 1.拿到用户选择的文件
        var file = e.target.files[0];
        // 2.将文件 转化为路径
        var ingURL = URL.createObjectURL(file);

        // 3.重新初始化载剪区域
        $image
            .cropper('destroy') //销毁旧的裁剪区域
            .attr('src', ingURL) //重新设置图片路径
            .cropper(options)//重新初始化裁剪区域
    });

    // 定义文章的发布状态
    var art_state = '已发布';

    // 为存为草稿 绑定点击事件处理
    $('#btnSace2').on('click', function () {
        art_state = '草稿';
    });

    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();

        var fd = new FormData($(this)[0]);
        fd.append('state', art_state);
       
        $image
            .cropper('getCroppedCanvas', {
                width: 400,
                height: 200,
            })
            .toBlob(function (blob) {
                fd.append('cover_img', blob)
                publishArticle(fd);
            })
    });


    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意: 如果向服务器提交的是
            //FormData 格式的数据
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('发布文章分类失败!')
                }
                layer.msg('发布文章分类成功!');
                // 发布文章成功后 跳转到文章列表页面
                location.href = '/article/art_list.html';
            }
        });
    }
});