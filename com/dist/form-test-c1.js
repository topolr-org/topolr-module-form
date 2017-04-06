window.topolr.source({"packet":[{"p":"form.test","h":"1db19d2094","c":"/**\r\n * @packet form.test;\r\n * @require form.base;\r\n */\nOption({\r\n    name:\"boot\",\r\n    option:{\r\n        override:{\r\n            onendinit:function () {\r\n                this.addChild({\r\n                    type:\"@base.form\",\r\n                    option:{\r\n                        fields:[\r\n                            {type:\"@base.text\",option:\"@.text\"},\r\n                            {type:\"@base.test\",option:{\r\n                                name:\"text3\",\r\n                                label:\"text3\"\r\n                            }},\r\n                            {type:\"@base.text\",option:{\r\n                                name:\"text2\",\r\n                                label:\"text2\"\r\n                            }}\r\n                        ]\r\n                    },\r\n                    container:this.finders(\"container\")\r\n                });\r\n            },\r\n            bind_setvalue:function () {\r\n                this.getChildAt(0).setValue({\r\n                    text1:\"text1-value\",\r\n                    text2:\"text2-value\"\r\n                });\r\n                console.log(\"> setValue\")\r\n            },\r\n            bind_getvalue:function () {\r\n                this.getChildAt(0).getValue().then(function (val) {\r\n                    console.log(\"> getValue -> %o\",val);\r\n                })\r\n            },\r\n            bind_check:function () {\r\n                this.getChildAt(0).check().then(function () {\r\n                    console.log(\"> check -> check ok\");\r\n                },function () {\r\n                    console.log(\"> check -> check fail\");\r\n                });\r\n            },\r\n            bind_reset:function () {\r\n                this.getChildAt(0).reset();\r\n            },\r\n            bind_clear:function () {\r\n                this.getChildAt(0).clear();\r\n            },\r\n            bind_disabled:function () {\r\n                this.getChildAt(0).disabled();\r\n            },\r\n            bind_undisabled:function () {\r\n                this.getChildAt(0).undisabled();\r\n            }\r\n        }\r\n    }\r\n});\r\nOption({\r\n    name:\"text\",\r\n    option:{\r\n        label:\"text-text\",\r\n        desc:\"just for test\",\r\n        name:\"text1\"\r\n    }\r\n});"},{"p":"form.base","h":"9b1c076d6d","c":"/**\r\n * @packet form.base;\r\n * @template form.template.form;\r\n * @css form.style.formstyle;\r\n */\nModule({\r\n    name:\"field\",\r\n    option:{\r\n        name:\"\",\r\n        label:\"\",\r\n        value:\"\",\r\n        disabled:false,\r\n        required:false,\r\n        desc:\"\"\r\n    },\r\n    getName:function () {\r\n        return this.option.name;\r\n    },\r\n    getLabel:function () {\r\n        return this.option.label;\r\n    },\r\n    isRequired:function () {\r\n        return this.option.required;\r\n    },\r\n    isDisabled:function () {\r\n        return this.option.disabled;\r\n    },\r\n    setValue:function () {},\r\n    getValue:function () {},\r\n    check:function () {},\r\n    reset:function () {},\r\n    clear:function () {},\r\n    disabled:function () {},\r\n    undisabled:function () {}\r\n});\r\nModule({\r\n    name:\"fieldview\",\r\n    extend:[\"view\",\"@.field\"]\r\n});\r\nModule({\r\n    name:\"fieldgroup\",\r\n    extend:[\"viewgroup\",\"@.field\"]\r\n});\r\nModule({\r\n    name:\"form\",\r\n    extend:\"viewgroup\",\r\n    layout:\"@form.form\",\r\n    option:{\r\n        fields:[\r\n            {type:\"\",option:\"\"}\r\n        ]\r\n    },\r\n    getAllFiles:function () {\r\n        var r=[];\r\n        this.childEach(function (view) {\r\n            if(view.typeOf(\"@.field\")){\r\n                r.push(view);\r\n            }\r\n        });\r\n        return r;\r\n    },\r\n    getFieldByName:function (name) {\r\n        var r=null;\r\n        this.childEach(function (view) {\r\n            if(view.typeOf(\"@.field\")&&view.getName()===name){\r\n                r=view;\r\n                return false;\r\n            }\r\n        });\r\n        return r;\r\n    },\r\n    getValue:function () {\r\n        var fields=this.getAllFiles(),ps=$.promise(),r={};\r\n        var queue=$.queue();\r\n        queue.complete(function () {\r\n            ps.resolve(r);\r\n        });\r\n        for(var i=0;i<fields.length;i++){\r\n            queue.add(function (a,b) {\r\n                var val=b.getValue(),ths=this;\r\n                if(val.then&&val.done){\r\n                    val.then(function (_val) {\r\n                        r[b.getName()]=_val;\r\n                        ths.next();\r\n                    });\r\n                }else{\r\n                    r[b.getName()]=val;\r\n                    ths.next();\r\n                }\r\n            },function () {\r\n                this.next();\r\n            },fields[i]);\r\n        }\r\n        queue.run();\r\n        return ps;\r\n    },\r\n    setValue:function (vals) {\r\n        var fields=this.getAllFiles();\r\n        for(var i=0;i<fields.length;i++){\r\n            var field=fields[i];\r\n            var val=vals[field.getName()];\r\n            if(val!==undefined){\r\n                field.setValue(val);\r\n            }\r\n        }\r\n        return this;\r\n    },\r\n    check:function () {\r\n        var fields=this.getAllFiles(),ps=$.promise(),r=true;\r\n        var queue=$.queue();\r\n        queue.complete(function () {\r\n            if(r){\r\n                ps.resolve();\r\n            }else{\r\n                ps.reject();\r\n            }\r\n        });\r\n        for(var i=0;i<fields.length;i++){\r\n            queue.add(function (a,b) {\r\n                var a=b.check(),ths=this;\r\n                if(a.then&&a.done){\r\n                    a.then(function () {\r\n                        ths.next();\r\n                    },function () {\r\n                        r=false;\r\n                        ths.end();\r\n                    })\r\n                }else if(a===false){\r\n                    r=false;\r\n                    ths.end();\r\n                }else{\r\n                    ths.next();\r\n                }\r\n            },function () {\r\n                this.next();\r\n            },fields[i]);\r\n        }\r\n        queue.run();\r\n        return ps;\r\n    },\r\n    reset:function () {\r\n        var fields=this.getAllFiles();\r\n        for(var i=0;i<fields.length;i++){\r\n            fields[i].reset();\r\n        }\r\n        return this;\r\n    },\r\n    clear:function () {\r\n        var fields=this.getAllFiles();\r\n        for(var i=0;i<fields.length;i++){\r\n            fields[i].clear();\r\n        }\r\n        return this;\r\n    },\r\n    disabled:function () {\r\n        var fields=this.getAllFiles();\r\n        for(var i=0;i<fields.length;i++){\r\n            fields[i].disabled();\r\n        }\r\n        return this;\r\n    },\r\n    undisabled:function () {\r\n        var fields=this.getAllFiles();\r\n        for(var i=0;i<fields.length;i++){\r\n            fields[i].undisabled();\r\n        }\r\n        return this;\r\n    },\r\n    oninitchild:function (child) {\r\n        var id=child.getId();\r\n        var ops=this.option.fields[id];\r\n        if(ops&&$.is.isObject(ops.option)) {\r\n            $.extend(child.option, ops.option);\r\n        }\r\n    },\r\n    submit:function () {\r\n    }\r\n});\r\n\r\nModule({\r\n    name:\"text\",\r\n    extend:\"@.fieldview\",\r\n    template:\"@form.text\",\r\n    className:\"form-text\",\r\n    option:{\r\n        inputType:\"text\",\r\n        placeHolder:\"\",\r\n        reg:\"\",\r\n        maxLen:40,\r\n        minLen:1\r\n    },\r\n    init:function () {\r\n        this.render(this.option);\r\n    },\r\n    setValue:function (val) {\r\n        this.finders(\"input\").val(val);\r\n        return this;\r\n    },\r\n    getValue:function () {\r\n        return this.finders(\"input\").val();\r\n    },\r\n    check:function () {\r\n        if(this.isRequired()){\r\n            if(this.checkLength()){\r\n                return this.checkReg();\r\n            }else{\r\n                return false;\r\n            }\r\n        }else{\r\n            return true;\r\n        }\r\n    },\r\n    checkLength:function () {\r\n        var val=this.getValue();\r\n        return val>=this.option.minLen&&val<=this.option.maxLen\r\n    },\r\n    checkReg:function () {\r\n        if(this.option.reg) {\r\n            var reg=null;\r\n            if ($.is.isString(this.option.reg)) {\r\n                reg=new RegExp(this.option.reg);\r\n            }else if(this.option.reg instanceof RegExp){\r\n                reg=this.option.reg;\r\n            }\r\n            if(reg){\r\n                return reg.text(this.getValue());\r\n            }else{\r\n                return true;\r\n            }\r\n        }else{\r\n            return true;\r\n        }\r\n    },\r\n    reset:function () {\r\n        return this.setValue(this.option.value||\"\");\r\n    },\r\n    clear:function () {\r\n        return this.setValue(\"\");\r\n    },\r\n    disabled:function () {\r\n        this.finders(\"input\").get(0).disable=true;\r\n        return this;\r\n    },\r\n    undisabled:function () {\r\n        this.finders(\"input\").get(0).disable=false;\r\n        return this;\r\n    }\r\n});\r\n\r\nModule({\r\n    name:'test',\r\n    extend:\"@.text\",\r\n    init:function () {\r\n        this.render(this.option);\r\n    },\r\n    getValue:function () {\r\n        var ps=$.promise();\r\n        setTimeout(function () {\r\n            ps.resolve(\"test-value\");\r\n        },2000);\r\n        return ps;\r\n    },\r\n    check:function () {\r\n        var ps=$.promise();\r\n        setTimeout(function () {\r\n            var a=Math.round(Math.random()*10);\r\n            if(a%2===0){\r\n                ps.resolve();\r\n            }else{\r\n                ps.reject();\r\n            }\r\n        },2000);\r\n        return ps;\r\n    }\r\n});"}],"template":[{"p":"form.template.form","h":"5b8de7938a","c":"<!--[text]--><div class=\"form-text-label\"><%=data.label;%></div><div class=\"form-text-input\"><input type=\"<%=data.inputType;%> value=\"<%=data.value;%>\" placeholder=\"<%=data.placeHolder;%>\" data-find=\"input\"/></div><%if(data.desc){%><div class=\"form-text-desc\"><%=data.desc;%></div><%}%><div class=\"form-text-tip\"></div><!--[form]--><%for(var i=0;i<data.fields.length;i++){%><@module type=\"{{data.fields[i].type}}\" option=\"{{$.is.isString(data.fields[i].option)?data.fields[i].option:''}}\" id=\"{{i}}\"/><%}%>"}],"css":[{"p":"form.style.formstyle","h":"981441e630","c":".form-text {\n  margin-bottom: 10px; }\n  .form-text .form-text-label {\n    line-height: 25px;\n    font-weight: 400;\n    font-size: 13px; }\n  .form-text .form-text-input input {\n    box-sizing: border-box;\n    border: 0;\n    border-bottom: 1px solid #D7D7D7;\n    height: 30px;\n    width: 100%;\n    outline: none; }\n  .form-text .form-text-desc {\n    line-height: 20px;\n    font-size: 12px;\n    color: #5F5D5D; }\n"}]});