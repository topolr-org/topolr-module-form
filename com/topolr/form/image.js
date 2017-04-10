/**
 * @packet form.image;
 * @require form.base;
 * @template form.template.imagetemp;
 * @css form.style.formstyle;
 */
Module({
    name:"imageuploader",
    extend:"@base.fieldview",
    className:"form-imageuploader",
    template:"@imagetemp.imageuploader",
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