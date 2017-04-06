/**
 * @packet form.base;
 * @template form.template.form;
 * @css form.style.formstyle;
 */
Module({
    name:"field",
    option:{
        name:"",
        label:"",
        value:"",
        disabled:false,
        required:false
    },
    setValue:function () {},
    getValue:function () {},
    check:function () {},
    reset:function () {},
    clear:function () {}
});
Module({
    name:"fieldview",
    extend:["view","@.field"]
});
Module({
    name:"fieldgroup",
    extend:["viewgroup","@.field"]
});

Module({
    name:"text",
    extend:"@.fieldview",
    template:"@form.text",
    className:"form-text",
    option:{
        inputType:"text",
        placeHolder:""
    },
    init:function () {
        this.render(this.option);
    }
});