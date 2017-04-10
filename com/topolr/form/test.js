/**
 * @packet form.test;
 * @require form.base;
 */
Option({
    name:"boot",
    option:{
        override:{
            onendinit:function () {
                this.addChild({
                    type:"@base.form",
                    option:{
                        fields:[
                            {type:"@base.text",option:"@.text"},
                            {type:"@base.test",option:{
                                name:"text3",
                                label:"text3"
                            }},
                            {type:"@base.text",option:{
                                name:"text2",
                                label:"text2"
                            }},
                            {type:"@base.textarea",option:{
                                name:"text4",
                                label:"text4"
                            }},
                            {type:"@base.select",option:{
                                name:"text5",
                                label:"text5",
                                url:sitePath+"mock/select",
                                target:"text6",
                                parameterName:"next",
                                options:[
                                    {name:"aa",value:"aa"},
                                    {name:"ee",value:"ee"}
                                ]
                            }},
                            {type:"@base.select",option:{
                                name:"text6",
                                label:"text6",
                                parameterName:"next",
                                url:sitePath+"mock/select",
                                options:[]
                            }},
                            {type:"@base.checkbox",option:{
                                name:"text6",
                                label:"text6",
                                checkboxs:[
                                    {name:"aa",value:"aa"},
                                    {name:"aa",value:"aa"},
                                    {name:"aa",value:"aa"},
                                    {name:"aa",value:"aa"},
                                    {name:"aa",value:"aa"}
                                ]
                            }},
                            {type:"@base.radio",option:{
                                name:"text7",
                                label:"text7",
                                radios:[
                                    {name:"aa",value:"aa"},
                                    {name:"aa",value:"aa"},
                                    {name:"aa",value:"aa"},
                                    {name:"aa",value:"aa"},
                                    {name:"aa",value:"aa"}
                                ]
                            }}
                        ]
                    },
                    container:this.finders("container")
                });
            },
            bind_setvalue:function () {
                this.getChildAt(0).setValue({
                    text1:"text1-value",
                    text2:"text2-value"
                });
                console.log("> setValue")
            },
            bind_getvalue:function () {
                this.getChildAt(0).getValue().then(function (val) {
                    console.log("> getValue -> %o",val);
                })
            },
            bind_check:function () {
                this.getChildAt(0).check().then(function () {
                    console.log("> check -> check ok");
                },function () {
                    console.log("> check -> check fail");
                });
            },
            bind_reset:function () {
                this.getChildAt(0).reset();
            },
            bind_clear:function () {
                this.getChildAt(0).clear();
            },
            bind_disabled:function () {
                this.getChildAt(0).disabled();
            },
            bind_undisabled:function () {
                this.getChildAt(0).undisabled();
            }
        }
    }
});
Option({
    name:"text",
    option:{
        label:"text-text",
        desc:"just for test",
        name:"text1"
    }
});