let ProtoBuf = require('protobufjs');
ProtoBuf.Util.IS_NODE = cc.sys.isNative;

let cccVer = cc.ENGINE_VERSION.match(/\d+\.\d+/)[0];
function compareVer(v1, v2) {
    let array1 = v1.split('.').map(i => parseInt(i));
    let array2 = v2.split('.').map(i => parseInt(i));
    let diff = 0;
    for(let i = 0; i < array1.length; i++) {
        diff = array1[i] - array2[i];
        if (diff !== 0) {
            return diff > 0 ? 1 : -1;
        }
    }
    return 0;
}
ProtoBuf.Util.IS_NODE = false;


/**
 * 加载proto
 */
let loadProto = ProtoBuf.loadProto.bind(ProtoBuf);
ProtoBuf.loadProto = function(asset, builder, filename) {
    try {
        if (typeof asset === 'string') {
            loadProto(asset, builder, filename);    
        } else if (asset.text) {
            loadProto(asset.text, builder, filename);
        }
    } catch(e) {
        cc.warn(`${filename}: protobuf syntax error`);
    }
};


/**
 * 加载json文件 
 */
ProtoBuf.loadJsonFile = function(filename, callback, builder) {
    if (callback && typeof callback === 'object')
        builder = callback,
        callback = null;
    else if (!callback || typeof callback !== 'function')
        callback = null;
    if (callback)
        return ProtoBuf.Util.fetch(typeof filename === 'string' ? filename : filename["root"]+"/"+filename["file"], function(contents) {
            if (contents === null) {
                callback(Error("Failed to fetch file"));
                return;
            }
            try {
                callback(null, ProtoBuf.loadJson(JSON.parse(contents), builder, filename));
            } catch (e) {
                callback(e);
            }
        });

    let url = typeof filename === 'object' ? filename["root"]+"/"+filename["file"] : filename;
    let json;
    if (ProtoBuf.preloaded) {
        let content = cc.loader.getRes(url, cc.JsonAsset);
        if (content) {
            json = cc.JsonAsset ? content.json : content;
        }
        
    } else {
        let content = ProtoBuf.Util.fetch(url);
        if (content) {
            json = JSON.parse(content);
        }
    }

    return json ? ProtoBuf.loadJson(json, builder, filename) : null;
};

module.exports = {
    root: 'pb',
    
    preload(cb) {
        ProtoBuf.Util.fetch = cc.loader.getRes.bind(cc.loader);
        cc.loader.loadResDir(this.root, (error, data) => {
            ProtoBuf.preloaded = !error;
            cb();
        });
    },
    /**
     * 加载文件proto文件，支持json、proto格式
     * @param {String|Array} files 
     */
    loadFromFile(fileNames, packageName) {
        if ((cc.sys.isNative || cc.sys.platform === cc.sys.WECHAT_GAME) && !ProtoBuf.preloaded) {
            cc.error('原生或微信小游戏上，需要先调用preload函数');
            return;
        }
        if (typeof fileNames === 'string') {
            fileNames = [fileNames];
        }

        let builder = ProtoBuf.newBuilder();
        if (compareVer(cccVer, '1.10.0') >= 0  && ProtoBuf.preloaded) {
            builder.importRoot = this.root;
        } else {
            builder.importRoot = cc.url.raw(`resources/${this.root}`);
        }
        
        fileNames.forEach((fileName) => {
            let extname = cc.path.extname(fileName); 
            let fullPath = `${builder.importRoot}/${fileName}`;
            if (extname === '.proto') {
                ProtoBuf.loadProtoFile(fullPath, builder); 
            } else if (extname === '.json') {
                ProtoBuf.loadJsonFile(fullPath, builder);
            } else {
                cc.log(`nonsupport file extname, only support 'proto' or 'json'`+fileName);
            }
        });

        return builder.build(packageName);
    },

    /**
     * 加载所有proto文件
     * @param {String} extname 
     * @param {String} packageName 
     */
    loadAll(extname = 'proto', packageName = '') {
        let files = [];
        if (this.root.endsWith('/') || this.root.endsWith('\\')) {
            this.root = this.root.substr(0, this.root.length - 1);
        }
        
        //获取this.root下的所有文件名
        cc.loader._resources.getUuidArray(this.root, null, files);
        files = files.map((filePath) => {
            let str = filePath.substr(this.root.length + 1);
            return `${str}.${extname}`;
        });
        return this.loadFromFile(files, packageName);
    },

    loadData(url, callback) {
        if (cc.sys.isNative) {
            let data = jsb.fileUtils.getDataFromFile(url);
            setTimeout(() => {
                callback(data);    
            }, 0);
        } else {
            var xhr = ProtoBuf.Util.XHR();
            xhr.open('GET', url, true);
            xhr.setRequestHeader('Accept', 'text/plain');
            xhr.responseType = 'arraybuffer'; 
            if (typeof xhr.overrideMimeType === 'function') xhr.overrideMimeType('text/plain');
            if (callback) {
                xhr.onreadystatechange = function() {
                    if (xhr.readyState != 4) return;
                    if (/* remote */ xhr.status == 200 || /* local */ (xhr.status == 0))
                        callback(xhr.response);
                    else
                        callback(null);
                };
                if (xhr.readyState == 4)
                    return;
                xhr.send(null);
            }
        }
    }
}