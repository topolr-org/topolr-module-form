/**
 * @packet form.test;
 * @require form.base;
 */
Option({
    name:"boot",
    option:{
        override:{
            layout:"<div data-find='container' style='width:400px;margin:0 auto;'></div>",
            onendinit:function () {
                console.log(this.finders("container"))
                this.addChild({
                    type:"@base.text",
                    option:{
                        label:"input-text"
                    },
                    container:this.finders("container")
                });
            }
        }
    }
});