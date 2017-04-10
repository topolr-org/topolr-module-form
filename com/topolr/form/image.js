/**
 * @packet form.image;
 * @require form.base;
 * @template form.template.imagetemp;
 * @css form.style.imagestyle;
 * @require util.file;
 */
Module({
    name:"imageuploader",
    extend:"@base.fieldview",
    className:"form-imageuploader",
    template:"@imagetemp.imageuploader",
    option:{
        height:240,
        isCavas:true,
        accept: "image/gif,image/jpeg,image/jpg,image/png,image/bmp",
        maxSize:52428800000
    },
    init:function () {
        this.render(this.option);
    },
    find_input:function (dom) {
        var ths=this;
        dom.bind("change",function (e) {
            var files = e.target.files || e.dataTransfer.files;
            ths.appendImage(files[0]);
        });
    },
    appendImage:function (file) {
        var _file=require("@file")(file);
        if(this.option.isCavas){
            var ths=this;
            var canvas=_file.createImageCanvas(this.finders("con").width(),this.finders("con").height()).then(function (a) {
                ths.finders("bg").empty().append(a.element);
            });
        }else {
            var url = _file.getFileURL();
            this.finders("bg").css("background-image", "url(" + url + ")");
        }
    },
    setValue:function () {},
    getValue:function () {},
    check:function () {},
    reset:function () {},
    clear:function () {},
    disabled:function () {},
    undisabled:function () {},
    showError:function () {},
    hideError:function () {}
});
Module({
    name:"multiimageuploader",
    extend:"@base.fieldgroup",
    className:"form-multiimageuploader",
    template:"@imagetemp.multiimageuploader",
    option:{},
    init:function () {
    },
    setValue:function () {},
    getValue:function () {},
    check:function () {},
    reset:function () {},
    clear:function () {},
    disabled:function () {},
    undisabled:function () {},
    showError:function () {},
    hideError:function () {}
});