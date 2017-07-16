import map from 'assets/js/map.js';

function transRoute(source, rootPath, level) {
    var result = checkType(source, 'Array') ? [] : {},
        currPath = rootPath,
        _level = level || 0;
    if (source['path'] !== undefined) {
        if (source['path']) {
            currPath += source['path'] !== '/' ?
                '/' + source['path'] :
                '/';
        } else {
            if (currPath.charAt(currPath.length - 1) !== '/') {
                //防止出现path为空的children与父同name的情况
                currPath += '/';
            }
        }
        source['name'] = currPath;

        source['component'] = getComponent({
            path: currPath,
            level: level,
            children: source.children
        });
        if (_level === 1 && !(source['children'] && source['children'].length)) {
            source.children = [{
                "path": "",
                "label": source.label,
                "component": getComponent({
                    path: "",
                    level: 2,
                    children: source.children
                })
            }];
        }
    }

    // level表示当前嵌套的层级，1表示第一层
    ++_level;

    for (var key in source) {
        // component组件内容无需遍历直接赋值
        if (checkType(source[key], 'Object') && key !== 'component') {
            if (source[key]['path'] !== undefined) {
                if (checkType(source, 'Array')) {
                    result.push(transRoute(source[key], currPath, _level));
                } else {
                    result[key] = transRoute(source[key], currPath, _level);
                }
            }
        } else if (checkType(source[key], 'Array')) {
            result[key] = transRoute(source[key], currPath, _level);
        } else {
            result[key] = source[key];
        }
    }
    return result;
}

function getComponent(opts) {
    var result = null,
        pathStr = opts.path.split('/').join('_') || '_';

    if (opts.level > 1) {
        if (opts.children && opts.children.length > 0) {
            // 有children还包含三级子目录
            result = require('src/pages/index/empty.vue');
        } else {
            result = map(pathStr) || require('src/pages/index/default/main.vue');
        }
    } else {
        result = require('src/pages/index/empty.vue');
    }

    return result;
}

function addAlias(list) {
    list[0].alias = '';
    if (list.children && list.children.length > 0) {
        addAlias(list.children);
    }
}

function checkType(source, type) {
    return Object.prototype.toString.call(source) === '[object ' + type + ']' ? true : false;
}

function makeMenu(resources, path) {
    // 初始化路由数据
    var listJson = resources;

    //根据菜单json生成index路由对象
    var indexMenu = transRoute(listJson, '');
    addAlias(indexMenu);

    return indexMenu;
}

export default (resources) => makeMenu(resources)