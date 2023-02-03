$(function () {

    var form = layui.form;

    initArticleList();
    function initArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                var str = template('tpl-table', res);
                $('tbody').html(str);
            }
        });
    }

    var index;
    $('#btnAddCate').on('click', function () {
        index = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类'
            , content: $('#dialog-add').html()
        });
    });

    // 通过代理形成给表单添加 提交 事件
    $('body').on('submit', '#fom-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'GET',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                initArticleList();
                layui.msg('新增分类成功');
                // 关闭添加弹层
                layer.close(index);
            }
        });
    });

    var indexEdit;
    // 通过代理形成给 编辑添加点击事件
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改文章分类'
            , content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id');
        // 根据id请求分类数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                form.val('form-edit', res.data);
            }
        });

    });

    // 修改分类
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }

                // 关闭添加弹层
                layer.close(indexEdit);

                initArticleList();
            }
        });
    });

    // 重置按钮
    $('body').on('click', '#rest', function (e) {
        e.preventDefault();

        var id = $('.btn-edit').attr('data-id');
        // 根据id请求分类数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                form.val('form-edit', res.data);
            }
        });

    });

    // 删除操作
    $('body').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status != 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('删除分类成功');
                    layer.close(index);

                }
            });
        });

    });

    
});