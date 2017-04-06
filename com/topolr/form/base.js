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
    value:null,
    customCheck:null,
    setValue:function (a) {
        this.value = a;
        return this;
    },
    getValue:function () {
        return this.value;
    },
    check:function () {
        if (this.customCheck) {
            return this.customCheck.call(this);
        } else {
            return true;
        }
    },
    reset:function () {
        this.setValue(this.value);
        return this;
    },
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