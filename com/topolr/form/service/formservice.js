/**
 * @packet form.service.formservice;
 */
Module({
    name:"selectservice",
    extend:"privateservice",
    refresh:function () {
        if(this.data.url) {
            this.stop();
            var et = {};
            if(this.data.parameterName) {
                et[this.data.parameterName] = this.data.parameterVal;
            }
            this.postRequest(this.data.url,et).scope(this).then(function (data) {
                this.data.options=this.data._default.concat(data);
                this.start();
                this.trigger();
            },function () {
                this.data.options=[].concat(this.data._default);
                this.start();
                this.trigger();
            });
        }else{
            this.trigger();
        }
    },
    action_set:function (data) {
        this.data=$.extend(true,{},data);
        this.data._default=data.options||[];
        this.refresh();
    },
    action_getvalue:function () {
        return this.data.value;
    },
    action_setvalue:function (val) {
        this.data.value=val;
        this.trigger("reset",null);
    },
    action_resetvalue:function (val) {
        this.data.value=val;
        this.trigger("reset",this.data);
    },
    service_refresh:function (val) {
        this.data.parameterVal=val;
        this.refresh();
    }
});