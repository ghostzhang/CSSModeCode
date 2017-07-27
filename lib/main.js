var __prefs_file = "prefs.json";
var defaultkey = {
    name: "",
    author: "",
    version: "",
    type: "",
    explain: "",
    relating: "",
    dependent: ""
}, csskey = {
    name: "",
    author: "",
    version: "",
    type: "",
    explain: "",
    relating: "",
    dependent: ""
}, _set = {
    mark: false,
    cr: air.File.lineEnding
}
//get首选项
function getPrefs(){
    var file, fStream, prefs;
    file = air.File.applicationStorageDirectory.resolvePath(__prefs_file);
    fStream = new air.FileStream();
    try {
        fStream.open(file, air.FileMode.READ);
        prefs = JSON.parse(fStream.readUTFBytes(fStream.bytesAvailable));
        fStream.close();
    } 
    catch (error) {
        air.trace(error);
        doTimer("<span style='color#FF0000'>读取默认值失败！</span>");
    }
    $.extend(defaultkey, prefs);
}

//set首选项
function setPrefs(e){
    var file, fStream;
    file = air.File.applicationStorageDirectory.resolvePath(__prefs_file);
    fStream = new air.FileStream();
    try {
        fStream.open(file, air.FileMode.WRITE);
        fStream.writeUTFBytes(JSON.stringify(defaultkey));
        fStream.close();
        doTimer(e + " 保存成功！");
    } 
    catch (error) {
        air.trace(error);
        doTimer("<span style='color:#FF0000'>" + e + " 保存失败！</span>");
    }
}

function doTimer(txt){
    $("#hint_txt").css("display", "block");
    $("#hint_txt").html(txt);
    setTimeout(function(){
        $("#hint_txt").css("display", "none")
    }, 2000);
}

var cssCode = function(){
    function cssMode(){
        this.name = csskey.name;
        this.author = csskey.author;
        this.version = csskey.version;
        this.type = csskey.type;
        this.explain = csskey.explain;
        this.relating = csskey.relating;
        this.dependent = csskey.dependent;
        this.checkText = function(t){
            t = t.replace(/@|\*/g, "");
            return t;
        }
        this.checkContText = function(t){
            t = t.replace(/\/\*{2}((.|\s)*?)\*\//g, "");
            t = t.replace(/\/\* @end \*{2}\//g, "");
            return t;
        }
        this.content = $("#code-inputtext").val();
        this.ext_text = function(t){
            t = t.replace(/;( *)/g, ";");
            t = t.replace(/\/\*((.|\s)*?)\*\//g, "");
            t = t.replace(/@(import|charset)( *.*?);+/g, "");
            t = t.replace(/\}(\r\n)+/g, "}");
            t = t.replace(/\r\n/g, " ");
            t = t.replace(/[\f\n\r\t\v]*/g, "");
            t = t.replace(/( *),( *)/g, ",");
            t = t.replace(/({|;)( +)/g, "$1");
            t = t.replace(/ *: */g, ":");
            t = t.replace(/\x20*\{/g, "{");
            t = t.replace(/  +/g, " ");
            t = t.replace(/^ /g, "");
            t = t.replace(/;;*/g, ";");
            t = t.replace(/\"\"*/g, "\"");
            t = t.replace(/:0[px|pt|em|%]+/g, ":0");
            t = t.replace(/ +0[px|pt|em|%]+/g, " 0");
            t = t.replace(/content:\";/g, "content:\"\";");
            t = t.replace(/\} */g, "}" + _set.cr);
            t = t.replace(/\}[\f\n\r\t\v]*\}/g, "}}");
            return t;
        }
    }
    //输出结果
    function outputText(e){
        var temp = "/**" + _set.cr;
        temp += "* @name\t\t:" + e.checkText(e.name) + _set.cr;
        temp += "* @author\t:" + e.checkText(e.author) + _set.cr;
        temp += "* @version\t:" + e.checkText(e.version) + _set.cr;
        temp += "* @type\t\t:" + e.checkText(e.type) + _set.cr;
        temp += "* @explain\t:" + e.checkText(e.explain) + _set.cr;
        temp += "* @relating\t:" + e.checkText(e.relating) + _set.cr;
        temp += "* @dependent:" + e.checkText(e.dependent) + _set.cr;
        temp += "*/" + _set.cr;
        
        if (_set.mark) {
            temp += e.ext_text(e.content);
        }
        else {
            temp += e.checkContText(e.content) + _set.cr;
        }
        temp += "/* @end **/" + _set.cr;
        
        $("#code-outputtext").attr("value", temp);
    }
    //取得值
    function setkey(){
        csskey.name = $("#code-name").val();
        csskey.author = $("#code-author").val();
        csskey.version = $("#code-version").val();
        csskey.type = $("#code-type").val();
        csskey.explain = $("#code-explain").val();
        csskey.relating = $("#code-relating").val();
        csskey.dependent = $("#code-dependent").val();
    }
    //使用默认值
    function outDefaultKey(e){
        var e = e.substr(9);
        var t = "#code-" + e;
        $(t).val(defaultkey[e]);
    }
    function inDefaultKey(e){
        var e = e.substr(8);
        var t = "#code-" + e;
        defaultkey[e] = $(t).val();
        setPrefs(e);
    }
    //复制所有样式
    function copyId(e){
        var copy = $("#" + e).val();
        if (copy != "") {
            air.Clipboard.generalClipboard.clear();
            air.Clipboard.generalClipboard.setData(air.ClipboardFormats.TEXT_FORMAT, copy);
            doTimer("复制成功！");
        }
        else {
            doTimer("<span style='color:#FF0000'>内容为空！</span>");
        }
    }
    function copyText(e){
        if (e != "") {
            air.Clipboard.generalClipboard.clear();
            air.Clipboard.generalClipboard.setData(air.ClipboardFormats.TEXT_FORMAT, e);
            doTimer("复制成功！");
        }
        else {
            doTimer("<span style='color:#FF0000'>内容为空！</span>");
        }
    }
    function load(){
        /*getPrefs();
         $(".outdefaultkey").click(function(){
         outDefaultKey(this.id);
         });
         $(".indefaultkey").click(function(){
         inDefaultKey(this.id);
         });*/
        $("#bt-ltr").click(function(){
            ltr();
        });
        $("#bt-copytext").click(function(){
            copyId("code-outputtext");
        });
        $("#bt-copymergetext").click(function(){
            var e = new cssMode();
            var t = air.Clipboard.generalClipboard.getData(air.ClipboardFormats.TEXT_FORMAT);
            if (t != "") {
                var text = e.ext_text(t);
                copyText(text);
            }
            else {
                doTimer("<span style='color:#FF0000'>内容为空！</span>");
            }
        });
        $("#ck-mergetext").click(function(){
            if ($(this).is(":checked")) {
                _set.mark = true;
            }
            else {
                _set.mark = false;
            }
        });
    }
    function ltr(){
        setkey();
        var e = new cssMode();
        outputText(e);
    }
    
    return {
        load: load
    }
}();
