/**
 * @packet form.service.formservice;
 */
Module({
    name:"textareaservice",
    extend:"privateservice",
    init:function () {
    },
    action_set:function (data) {
        this.data=data;
        console.log(data)
        this.trigger();
    },
    action_val:function (val) {
        this.data.value=val;
        this.data.num=val.length;
        this.trigger();
    }
});
