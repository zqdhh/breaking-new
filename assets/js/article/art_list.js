$(function () {
    // layui 表单
    var form = layui.form;
    // layui 分页
    var laypage = layui.laypage;

    initCate();
    function initCate() {
        // 获取分类渲染分类数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                var str = template('tpl-cate', res);
                $('[name="cate_id"]').html(str);
                // 重新渲染表单
                form.render(); //更新全部
            }
        });
    }

    // 准备好文章列表的参数 设置对象记录
    var params = {
        pagenum: 1, //页码值 默认从第一页开始请求
        pagesize: 2,// 一页展示多少条数据 默认展示2条
        cate_id: '', //分类 id
        state: ''// 状态值
    };

    // 渲染列表
    initTable();
    function initTable() {
        // 获取文章列表数据
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: params,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                console.log(res);
                var str = template('tpl-table', res);
                $('tbody').html(str);
                // 渲染分页数据
                renderpage(res.total);

            }
        });
    };

    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单的值
        var cateid = $('[name=cate_id]').val();
        var state = $('[name=state]').val();

        // 更新请求接口的数据
        params.cate_id = cateid;
        params.state = state;
        // 根据新的筛选条件 重新请求渲染数据
        initTable();
    });


    function renderpage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox',  //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: params.pagesize, //每页展示的条数
            limits: [2, 3, 5, 10], //每页显示条数选项
            curr: params.pagenum, //起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                params.pagenum = obj.curr;
                params.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    //do something
                    initTable();
                }
            }

        });
    }

    // 删除操作
    $('body').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length;
        var id = $(this).attr('data-id');

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status != 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('删除分类成功');
                    layer.close(index);
                    if (len === 1) {
                        // 如果当前页 都删完了
                        // 将请求参数页码 -1(确认页码必须要比1大)
                        params.pagenum = params.pagenum === 1 ? 1: params.pagenum - 1;
                    }
                    // 删除重新渲染
                    initTable();

                }
            });
        });

    });
});