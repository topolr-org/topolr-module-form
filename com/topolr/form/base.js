/**
 * @packet form.base;
 * @template form.template.form;
 * @css form.style.formstyle;
 * @require form.service.formservice;
 */
Module({
    name:"field",
    option:{
        name:"",
        label:"",
        value:"",
        disabled:false,
        required:false,
        desc:""
    },
    getName:function () {
        return this.option.name;
    },
    getLabel:function () {
        return this.option.label;
    },
    isRequired:function () {
        return this.option.required;
    },
    isDisabled:function () {
        return this.option.disabled;
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
    name:"fieldview",
    extend:["view","@.field"]
});
Module({
    name:"fieldgroup",
    extend:["viewgroup","@.field"]
});
Module({
    name:"form",
    extend:"viewgroup",
    layout:"@form.form",
    option:{
        action:"",
        fields:[
            {type:"",option:""}
        ]
    },
    getAllFiles:function () {
        var r=[];
        this.childEach(function (view) {
            if(view.typeOf("@.field")){
                r.push(view);
            }
        });
        return r;
    },
    getFieldByName:function (name) {
        var r=null;
        this.childEach(function (view) {
            if(view.typeOf("@.field")&&view.getName()===name){
                r=view;
                return false;
            }
        });
        return r;
    },
    getValue:function () {
        var fields=this.getAllFiles(),ps=$.promise(),r={};
        var queue=$.queue();
        queue.complete(function () {
            ps.resolve(r);
        });
        for(var i=0;i<fields.length;i++){
            queue.add(function (a,b) {
                var val=b.getValue(),ths=this;
                if(val.then&&val.done){
                    val.then(function (_val) {
                        r[b.getName()]=_val;
                        ths.next();
                    });
                }else{
                    r[b.getName()]=val;
                    ths.next();
                }
            },function () {
                this.next();
            },fields[i]);
        }
        queue.run();
        return ps;
    },
    setValue:function (vals) {
        var fields=this.getAllFiles();
        for(var i=0;i<fields.length;i++){
            var field=fields[i];
            var val=vals[field.getName()];
            if(val!==undefined){
                field.setValue(val);
            }
        }
        return this;
    },
    check:function () {
        var fields=this.getAllFiles(),ps=$.promise(),r=true;
        var queue=$.queue();
        queue.complete(function () {
            if(r){
                ps.resolve();
            }else{
                ps.reject();
            }
        });
        for(var i=0;i<fields.length;i++){
            queue.add(function (a,b) {
                var a=b.check(),ths=this;
                if(a.then&&a.done){
                    a.then(function () {
                        ths.next();
                    },function () {
                        r=false;
                        ths.end();
                    })
                }else if(a===false){
                    r=false;
                    ths.end();
                }else{
                    ths.next();
                }
            },function () {
                this.next();
            },fields[i]);
        }
        queue.run();
        return ps;
    },
    reset:function () {
        var fields=this.getAllFiles();
        for(var i=0;i<fields.length;i++){
            fields[i].reset();
        }
        return this;
    },
    clear:function () {
        var fields=this.getAllFiles();
        for(var i=0;i<fields.length;i++){
            fields[i].clear();
        }
        return this;
    },
    disabled:function () {
        var fields=this.getAllFiles();
        for(var i=0;i<fields.length;i++){
            fields[i].disabled();
        }
        return this;
    },
    undisabled:function () {
        var fields=this.getAllFiles();
        for(var i=0;i<fields.length;i++){
            fields[i].undisabled();
        }
        return this;
    },
    oninitchild:function (child) {
        var id=child.getId();
        var ops=this.option.fields[id];
        if(ops&&$.is.isObject(ops.option)) {
            $.extend(child.option, ops.option);
        }
    },
    onbeforesubmit:function (a) {
        return a;
    },
    showLoading:function () {},
    hideLoading:function (result) {},
    submit:function () {
        this.showLoading();
        return this.check().scope(this).then(function () {
            return this.getValue();
        }).then(function (val) {
            var val=this.onbeforesubmit(val);
            return this.postRequest(this.option.action,val);
        }).then(function () {
            this.hideLoading(true);
        },function () {
            this.hideLoading(false);
        });
    }
});

Module({
    name:"text",
    extend:"@.fieldview",
    template:"@form.text",
    className:"form-text",
    option:{
        inputType:"text",
        placeHolder:"",
        regular:{
            reg:"",
            errorMsg:""
        },
        lengths:{
            max:40,
            min:1,
            errorMsg:""
        }
    },
    init:function () {
        this.render(this.option);
    },
    setValue:function (val) {
        this.finders("input").val(val);
        return this;
    },
    getValue:function () {
        return this.finders("input").val();
    },
    check:function () {
        var r=true;
        if(this.isRequired()){
            if(this.checkLength()){
                r=this.checkReg();
                if(r===false){
                    this.showError(this.option.regular.errorMsg);
                }
            }else{
                r=false;
                this.showError(this.option.lengths.errorMsg);
            }
        }
        if(r===true){
            this.hideError();
        }
        return r;
    },
    checkLength:function () {
        var val=this.getValue().length,max=this.option.lengths.max,min=this.option.lengths.min;
        return val>=min&&val<=max;
    },
    checkReg:function () {
        if(this.option.regular.reg) {
            var reg=null;
            if ($.is.isString(this.option.regular.reg)) {
                reg=new RegExp(this.option.regular.reg);
            }else if(this.option.regular.reg instanceof RegExp){
                reg=this.option.regular.reg;
            }
            if(reg){
                return reg.test(this.getValue());
            }else{
                return true;
            }
        }else{
            return true;
        }
    },
    reset:function () {
        return this.setValue(this.option.value||"");
    },
    clear:function () {
        return this.setValue("");
    },
    disabled:function () {
        this.finders("input").get(0).disable=true;
        return this;
    },
    undisabled:function () {
        this.finders("input").get(0).disable=false;
        return this;
    },
    showError:function (msg) {
        this.dom.addClass("form-error");
        this.finders("tip").html(msg);
        return this;
    },
    hideError:function () {
        this.dom.removeClass("form-error");
        return this;
    }
});
Module({
    name:"hidetext",
    extend:"@.text",
    init:function () {
        this.dom.hide();
        this.render(this.option);
    }
});
Module({
    name:"textarea",
    extend:"@.text",
    template:"@form.textarea",
    className:"form-textarea",
    autodom:true,
    option:{
        placeHolder:"",
        maxLen:100,
        minLen:1,
        showNum:true,
        resizeable:false
    },
    init:function () {
        this._data=$.extend({
            num:this.option.value?this.option.value.length:0
        },this.option);
        this.render(this._data);
    },
    find_input:function (dom) {
        var ths=this;
        dom.bind("keyup",function () {
            ths._data.num=$(this).val().length;
            ths.update(ths._data);
        });
    }
});
Module({
    name:"select",
    extend:"@.fieldview",
    template:"@form.select",
    className:"form-select",
    autodom:true,
    option:{
        url:"",
        targetName:"",
        parameterName:"",
        parameterVal:"",
        options:[{name:"",value:""}],
        errorMes:"",
        autoload:true
    },
    init:function () {
        this.data={
            value:this.option.value,
            options:[].concat(this.option.options),
            desc:this.option.desc,
            label:this.option.label
        };
        this.render(this.data);
        if(this.option.url&&this.option.autoload){
            this.getRemoteData();
        }
    },
    bind_change:function (dom) {
        this.data.value=dom.val();
        this.triggerNext();
    },
    getRemoteData:function (val) {
        var ths=this;
        var p={};
        this.option.parameterVal=val||"";
        p[this.option.parameterName]=this.option.parameterVal;
        this.postRequest(this.option.url,p).then(function (data) {
            ths.data.options=this.option.options.concat(data);
            ths.update(ths.data);
        });
    },
    setValue:function (val) {
        this.data.value=val;
        this.update(this.data);
    },
    getValue:function () {
        return this.data.value;
    },
    check:function () {
        if(this.isRequired()){
            var e=this.getValue();
            if(e){
                this.hideError();
                return true;
            }else{
                this.showError(this.option.errorMes);
            }
        }else{
            return true;
        }
    },
    reset:function () {
    },
    clear:function () {
    },
    disabled:function () {},
    undisabled:function () {},
    showError:function () {},
    hideError:function () {},
    triggerNext:function () {
        var targetName=this.option.targetName;
        if(targetName!==this.getName()&&this.parentView&&this.parentView.typeOf&&this.parentView.typeOf("@.form")){
            var a=this.parentView.getFieldByName(targetName);
            if(a){
                a.getRemoteData&&a.getRemoteData(this.getValue());
            }
        }
    },
    onupdated:function () {
        this.data.value=this.finders("select").val();
        this.triggerNext();
    }
});
Module({
    name:"checkbox",
    extend:"@.fieldview",
    template:"@form.checkbox",
    className:"form-checkbox",
    autodom:true,
    option:{
        checkboxs:[{name:"",value:""}]
    },
    init:function () {
        this.render(this.option);
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
    name:'radio',
    extend:"@.fieldview",
    template:"@form.radio",
    className:"form-radio",
    autodom:true,
    option:{
        radios:[{name:"",value:""}]
    },
    init:function () {
        this.render(this.option);
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
    name:'test',
    extend:"@.text",
    init:function () {
        this.render(this.option);
    },
    getValue:function () {
        var ps=$.promise();
        setTimeout(function () {
            ps.resolve("test-value");
        },2000);
        return ps;
    },
    check:function () {
        var ps=$.promise();
        setTimeout(function () {
            var a=Math.round(Math.random()*10);
            if(a%2===0){
                ps.resolve();
            }else{
                ps.reject();
            }
        },2000);
        return ps;
    }
});