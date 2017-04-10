/**
 * @packet form.file;
 * @require form.base;
 * @template form.template.filetemp;
 * @css form.style.filestyle;
 */
Module({
    name:"fileuploader",
    extend:"@base.fieldview",
    className:"form-fileuploader",
    template:"@filetemp.fileuploader",
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