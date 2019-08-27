webpackJsonp([12],{188:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=o(4),r=o.n(n),s=o(2);t.default={name:"work_flow",props:["msg"],data:function(){var e=this;return{stepData:{title:"Yearning SQL查询系统",describe:"欢迎你！ "+sessionStorage.getItem("user")},step:{remark:"",timer:1,computer_room:"",connection_name:"",person:"",export:"0"},stepList1:[{title:"提交",describe:"提交查询申请"},{title:"审核",describe:"等待审核结果"},{title:"查询",describe:"审核完毕，进入查询页面"}],stepRules:{opinion:[{required:!0,message:"请填写查询说明",trigger:"blur"}],computer_room:[{required:!0,message:"机房地址不得为空",trigger:"change"}],basename:[{required:!0,message:"数据库名不得为空",trigger:"change"}],person:[{required:!0,message:"审核人不得为空",trigger:"change"}]},item:{},personlist:[],datalist:{connection_name_list:[],basenamelist:[],sqllist:[],computer_roomlist:s.a.computer_room},query_info:[],permissoncolums:[{type:"selection",width:60,align:"center"},{title:"申请编号",key:"work_id"},{title:"时间",key:"time"},{title:"审批人",key:"audit"},{title:"状态",key:"query_per",width:150,render:function(e,t){var o=t.row,n="",r="";return 2===o.query_per?(n="blue",r="待审核"):0===o.query_per?(n="red",r="驳回"):1===o.query_per?(n="green",r="同意"):(n="yellow",r="查询结束"),e("Tag",{props:{type:"dot",color:n}},r)},sortable:!0,filters:[{label:"同意",value:1},{label:"驳回",value:0},{label:"待审核",value:2},{label:"查询结束",value:3}],filterMethod:function(e,t){return 1===e?1===t.query_per:2===e?2===t.query_per:0===e?0===t.query_per:3===e?3===t.query_per:void 0}},{title:"操作",key:"action",width:200,align:"center",render:function(t,o){return t("div",[t("Button",{props:{size:"small",type:"text"},on:{click:function(){e.modalinfo(o.row)}}},"查看")])}}],per_pn:1,delrecord:[],editInfodModal:!1,query:{}}},methods:{Connection_Name:function(e){this.datalist.connection_name_list=[],this.datalist.basenamelist=[],this.step.connection_name="",this.step.basename="",e&&this.ScreenConnection(e)},ScreenConnection:function(e){this.datalist.connection_name_list=this.item.filter(function(t){if(t.computer_room===e)return t})},handleSubmit:function(){var e=this;this.$refs.step.validate(function(t){t&&r.a.put(s.a.url+"/query_worklf",{mode:"put",instructions:e.step.opinion,timer:e.step.timer,connection_name:e.step.connection_name,computer_room:e.step.computer_room,export:e.step.export,audit:e.step.person}).then(function(){e.$router.push({name:"queryready"})})})},permisson_list:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;r.a.get(s.a.url+"/query_order?page="+t+"&type=myorder").then(function(t){e.query_info=t.data.data,e.per_pn=t.data.pn}).catch(function(e){s.a.err_notice(e)})},delrecordData:function(){var e=this;r.a.post(s.a.url+"/query_order/",{work_id:JSON.stringify(this.delrecord)}).then(function(t){s.a.notice(t.data),e.$refs.perpage.currentPage=1,e.permisson_list()}).catch(function(e){s.a.err_notice(e)})},delrecordList:function(e){this.delrecord=e.map(function(e){return e.work_id})},modalinfo:function(e){this.editInfodModal=!0,this.query=e},del_apply:function(){var e=this;r.a.delete(s.a.url+"/query_worklf").then(function(){e.$router.push({name:"serach-sql"})})}},mounted:function(){var e=this;r.a.put(s.a.url+"/workorder/connection",{permissions_type:"query"}).then(function(t){e.item=t.data.connection,e.personlist=t.data.assigend,e.datalist.computer_roomlist=t.data.custom}).catch(function(e){s.a.err_notice(e)}),this.permisson_list()}}},191:function(e,t,o){t=e.exports=o(77)(!0),t.push([e.i,".step-header-con{text-align:center}.step-header-con h3{margin:10px 0}.step-header-con h5{margin:0 0 5px}.step-content{padding:5px 20px 26px}.step-content,.step-form{margin-bottom:20px;border-bottom:1px solid #dbdddf}.step-form{padding-bottom:10px}","",{version:3,sources:["/Data/projects/yearning_1.2/webpage/src/components/Search/work_flow.vue"],names:[],mappings:"AACA,iBACE,iBAAmB,CACpB,AACD,oBACE,aAAe,CAChB,AACD,oBACE,cAAgB,CACjB,AACD,cACE,qBAAuB,CAGxB,AACD,yBAHE,mBAAoB,AACpB,+BAAiC,CAMlC,AAJD,WACE,mBAAqB,CAGtB",file:"work_flow.vue",sourcesContent:["\n.step-header-con {\n  text-align: center;\n}\n.step-header-con h3 {\n  margin: 10px 0;\n}\n.step-header-con h5 {\n  margin: 0 0 5px;\n}\n.step-content {\n  padding: 5px 20px 26px;\n  margin-bottom: 20px;\n  border-bottom: 1px solid #dbdddf;\n}\n.step-form {\n  padding-bottom: 10px;\n  border-bottom: 1px solid #dbdddf;\n  margin-bottom: 20px;\n}\n"],sourceRoot:""}])},212:function(e,t,o){var n=o(191);"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);o(78)("51de479c",n,!0,{})},214:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",[o("Row",[o("Card",[o("div",{staticClass:"step-header-con"},[o("h3",[e._v(e._s(e.stepData.title))]),e._v(" "),o("h5",[e._v(e._s(e.stepData.describe))])]),e._v(" "),o("p",{staticClass:"step-content"}),e._v(" "),o("Row",[o("i-col",{attrs:{span:"8"}},[o("Alert",{attrs:{type:"warning","show-icon":""}},[e._v("\n              注意事项:\n              "),o("span",{attrs:{slot:"desc"},slot:"desc"},[e._v("\n              1.必须填写查询说明\n              "),o("br"),e._v("\n              2.根据查询条件预估所需的查询时间\n              "),o("br"),e._v("\n              3.所有提交的查询语句均会进行审计记录\n              "),o("br"),e._v("\n              4.仅支持select语句,不可使用非查询语句\n              "),o("br"),e._v("\n              5.已限制最大limit数，如自己输入的limit数大于平台配置的最大limit数则已平台配置的Limit数为准\n            ")])])],1),e._v(" "),o("i-col",{attrs:{span:"12"}},[o("Form",{ref:"step",attrs:{model:e.step,rules:e.stepRules,"label-width":150}},[o("FormItem",{attrs:{label:"机房:",prop:"computer_room"}},[o("Select",{on:{"on-change":e.Connection_Name},model:{value:e.step.computer_room,callback:function(t){e.$set(e.step,"computer_room",t)},expression:"step.computer_room"}},e._l(e.datalist.computer_roomlist,function(t){return o("Option",{key:t,attrs:{value:t}},[e._v(e._s(t))])}),1)],1),e._v(" "),o("FormItem",{attrs:{label:"连接名:",prop:"connection_name"}},[o("Select",{attrs:{filterable:"",multiple:""},model:{value:e.step.connection_name,callback:function(t){e.$set(e.step,"connection_name",t)},expression:"step.connection_name"}},e._l(e.datalist.connection_name_list,function(t){return o("Option",{key:t.connection_name,attrs:{value:t.connection_name}},[e._v(e._s(t.connection_name)+"\n                  ")])}),1)],1),e._v(" "),o("FormItem",{attrs:{label:"审核人:",prop:"person"}},[o("Select",{attrs:{filterable:""},model:{value:e.step.person,callback:function(t){e.$set(e.step,"person",t)},expression:"step.person"}},e._l(e.personlist,function(t){return o("Option",{key:t,attrs:{value:t}},[e._v(e._s(t))])}),1)],1),e._v(" "),o("FormItem",{attrs:{label:"是否需要导出数据:",prop:"export"}},[o("RadioGroup",{model:{value:e.step.export,callback:function(t){e.$set(e.step,"export",t)},expression:"step.export"}},[o("Radio",{attrs:{label:"1"}},[e._v("是")]),e._v(" "),o("Radio",{attrs:{label:"0"}},[e._v("否")])],1)],1),e._v(" "),o("FormItem",{attrs:{label:"查询说明：",prop:"opinion"}},[o("Input",{attrs:{type:"textarea",autosize:{minRows:4,maxRows:8},placeholder:"请填写查询说明"},model:{value:e.step.opinion,callback:function(t){e.$set(e.step,"opinion",t)},expression:"step.opinion"}})],1),e._v(" "),o("FormItem",{attrs:{label:"查询时限："}},[o("InputNumber",{attrs:{formatter:function(e){return e+"小时"},parser:function(e){return e.replace("小时","")},min:1},model:{value:e.step.timer,callback:function(t){e.$set(e.step,"timer",t)},expression:"step.timer"}}),e._v(" "),o("a",[e._v("(1-168小时,最长申请7天)")])],1),e._v(" "),o("FormItem",{attrs:{label:""}},[o("Button",{staticStyle:{width:"100px"},attrs:{type:"primary"},on:{click:e.handleSubmit}},[e._v("提交")])],1)],1)],1)],1),e._v(" "),o("Row",[o("Card",[o("p",{attrs:{slot:"title"},slot:"title"},[o("Icon",{attrs:{type:"person"}}),e._v("\n              我的申请\n            ")],1),e._v(" "),o("Row",[o("Col",{attrs:{span:"24"}},[o("Table",{ref:"selection",attrs:{border:"",columns:e.permissoncolums,data:e.query_info,stripe:""},on:{"on-selection-change":e.delrecordList}}),e._v(" "),o("br"),e._v(" "),o("Page",{ref:"perpage",attrs:{total:e.per_pn,"show-elevator":"","page-size":5},on:{"on-change":e.permisson_list}})],1)],1)],1)],1),e._v(" "),o("Modal",{attrs:{width:800},model:{value:e.editInfodModal,callback:function(t){e.editInfodModal=t},expression:"editInfodModal"}},[o("h3",{staticStyle:{color:"#2D8CF0"},attrs:{slot:"header"},slot:"header"},[e._v("查询申请单详细内容")]),e._v(" "),o("Form",{attrs:{"label-width":120,"label-position":"right"}},[o("FormItem",{attrs:{label:"机房"}},[o("p",[e._v(e._s(e.query.computer_room))])]),e._v(" "),o("hr",{staticStyle:{height:"1px",border:"none","border-top":"1px dashed #dddee1"}}),e._v(" "),o("br"),e._v(" "),o("FormItem",{attrs:{label:"连接名:"}},[o("p",[e._v(e._s(e.query.connection_name))])]),e._v(" "),o("hr",{staticStyle:{height:"1px",border:"none","border-top":"1px dashed #dddee1"}}),e._v(" "),o("br"),e._v(" "),o("FormItem",{attrs:{label:"查询时限:"}},[o("p",[e._v(e._s(e.query.timer)+"小时")])]),e._v(" "),o("hr",{staticStyle:{height:"1px",border:"none","border-top":"1px dashed #dddee1"}}),e._v(" "),o("br"),e._v(" "),o("FormItem",{attrs:{label:"导出数据:"}},[1===e.query.export?o("p",[e._v("是")]):o("p",[e._v("否")])]),e._v(" "),o("hr",{staticStyle:{height:"1px",border:"none","border-top":"1px dashed #dddee1"}}),e._v(" "),o("br"),e._v(" "),o("FormItem",{attrs:{label:"查询说明:"}},[o("Input",{attrs:{type:"textarea",autosize:{minRows:5,maxRows:8},readonly:""},model:{value:e.query.instructions,callback:function(t){e.$set(e.query,"instructions",t)},expression:"query.instructions"}})],1)],1),e._v(" "),o("div",{attrs:{slot:"footer"},slot:"footer"},[o("Button",{attrs:{type:"primary"},on:{click:e.del_apply}},[e._v("撤销")]),e._v(" "),o("Button",{attrs:{type:"primary"},on:{click:function(t){e.editInfodModal=!1}}},[e._v("返回")])],1)],1)],1)],1)],1)},staticRenderFns:[]}},79:function(e,t,o){function n(e){o(212)}var r=o(1)(o(188),o(214),n,null,null);e.exports=r.exports}});
//# sourceMappingURL=12.5cfdad45e9183b9a2d44.js.map