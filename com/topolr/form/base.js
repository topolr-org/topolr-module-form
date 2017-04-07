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
    undisabled:function () {}
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
    submit:function () {
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
        reg:"",
        maxLen:40,
        minLen:1
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
        if(this.isRequired()){
            if(this.checkLength()){
                return this.checkReg();
            }else{
                return false;
            }
        }else{
            return true;
        }
    },
    checkLength:function () {
        var val=this.getValue();
        return val>=this.option.minLen&&val<=this.option.maxLen
    },
    checkReg:function () {
        if(this.option.reg) {
            var reg=null;
            if ($.is.isString(this.option.reg)) {
                reg=new RegExp(this.option.reg);
            }else if(this.option.reg instanceof RegExp){
                reg=this.option.reg;
            }
            if(reg){
                return reg.text(this.getValue());
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
    }
});
Module({
    name:"textarea",
    extend:"@.fieldview",
    template:"@form.textarea",
    className:"form-textarea",
    services:{"service":"@formservice.textareaservice"},
    autodom:true,
    option:{
        placeHolder:"",
        maxLen:100,
        minLen:1,
        showNum:true,
        resizeable:false
    },
    init:function () {
        this.getService("service").action("set",$.extend({},this.option,{
            num:0
        }));
    },
    find_input:function (dom) {
        var ths=this;
        dom.bind("keyup",function () {
            ths.getService("service").action("val",$(this).val());
        });
    }
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