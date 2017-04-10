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
    }
});