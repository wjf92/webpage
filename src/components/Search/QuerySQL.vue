<style lang="less">
  @import '../../styles/common.less';
  @import '../Order/components/table.less';

  .tree {
    word-wrap: break-word;
    word-break: break-all;
    overflow-y: scroll;
    overflow-x: scroll;
    min-height: 600px;
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    25%  { transform: rotate(90deg);}
    50%  { transform: rotate(180deg);}
    75%  { transform: rotate(270deg);}
    to   { transform: rotate(360deg);}
  }
  .demo-spin-col{
    height: 100px;
    position: relative;
    border: 1px solid #eee;
  }
</style>

<template>
  <div>
    <Row>
      <Col span="6">
        <Card>
          <p slot="title">
            <Icon type="ios-redo"></Icon>
            选择数据库
          </p>
          <div>
            <Form :label-width="80">
              <Form-item label="数据库连接:">
                <Select v-model="formItem_dic.namedata">
                  <Option v-for="i in TableList" :value="i" :key="i">{{ i }}</Option>
                </Select>
              </Form-item>
              <Form-item>
                <Button type="success" icon="ios-redo" @click.native="setdbselect(formItem_dic.namedata)">连接数据库</Button>
                <Button type="primary" icon="ios-cloud-download" @click.native="exportdata()">导出csv
                </Button>
              </Form-item>
              <Form-item label="搜索数据表:">
                <Select v-model="formItem_dic.table" @on-change="get_tab_meta(formItem_dic.table)">
                  <Option v-for="i in db_table_list" :value="i" :key="i">{{ i }}</Option>
                </Select>
              </Form-item>
              <Form-item label="操作:">
                <Button type="error" icon="trash-a" @click.native="ClearForm()">清除</Button>
                <Button type="info" icon="paintbucket" @click.native="beautify()">美化</Button>
                <Button type="success" icon="ios-redo" @click.native="Search_sql()">查询</Button>
              </Form-item>
            </Form>
          </div>
        </Card>
      </Col>
      <Col span="18" class="padding-left-10">
        <Card>
          <p slot="title">
            <Icon type="ios-crop-strong"></Icon>
            填写sql语句 &nbsp;&nbsp;&nbsp;
            <font color="red">当前选择的库: {{put_info.base}}</font>
          </p>
          <a slot="extra">
            <Button type="success" @click.native="addcollect_check()">添加收藏</Button>
            <Button type="success" @click.native="opencollect() ">打开收藏</Button>
            <Button type="primary" @click.native="addsearchpage()">新增页签</Button>
          </a>
          <!--<usercollect v-bind:showcollect="usercollectshow"></usercollect>-->
          <editor v-model="formItem.textarea"></editor>
        </Card>
      </Col>
    </Row>
    <Modal footer-hide v-model="usercollectshow" width="800" draggable title="SQL收藏夹">
      <!--<Table :columns="my_coll_cols" :data="my_coll_data" highlight-row ref="table"></Table>-->
      <Table border :columns="my_coll_cols" :data="my_coll_data"></Table>
    </Modal>
    <Modal v-model="inputaliasshow" width="500" title="请输入一个别名：" @on-ok="addcollect()">
      <Input v-model="collect_alias" placeholder="Enter alias..." style="width: 400px" />
    </Modal>
    <Row>
      <Card>
          <br>
          <p slot="title">
            <Icon type="ios-crop-strong"></Icon>
            查询结果:
          </p>
         <a slot="extra">
           elapsed_time(s):<Input v-model="elapse_time"  style="width: 80px"/>
           rows:<Input v-model="sql_rows"  style="width: 80px"/>
           offset:<Input v-model="sql_offset" placeholder="0" style="width: 80px" />
           limit:<Input v-model="sql_limit"  style="width: 80px" disabled/>
         </a>
        <Col class="demo-spin-col" v-show="loadshow" span="24">
          <Spin fix>
            <Icon type="load-c" size=28 class="demo-spin-icon-load"></Icon>
            <div>查询中</div>
          </Spin>
        </Col>
        <Table height="500" border stripe :columns="columnsName" :data="Testresults" highlight-row ref="table" v-show="! dic_data_show"></Table>
        <i-input type="textarea" v-model="dic_data" v-show="dic_data_show"  autosize></i-input>

        <!--<editor v-model="dic_data" v-show="dic_data_show" disabled ></editor>-->
        <br>
        <!-- <Page :total="total" show-total @on-change="splice_arr" ref="totol"></Page> -->
      </Card>
    </Row>
  </div>
</template>
<script>
  import flow from './work_flow'
  import ICol from '../../../node_modules/iview/src/components/grid/col.vue'
  import axios from 'axios'
  import util from '../../libs/util'
  import Csv from '../../../node_modules/iview/src/utils/csv'
  import ExportCsv from '../../../node_modules/iview/src/components/table/export-csv'

  const exportcsv = function exportCsv (params) {
    if (params.filename) {
      if (params.filename.indexOf('.csv') === -1) {
        params.filename += '.csv'
      }
    } else {
      params.filename = 'table.csv'
    }

    let columns = []
    let datas = []
    if (params.columns && params.data) {
      columns = params.columns
      datas = params.data
    } else {
      columns = this.columns
      if (!('original' in params)) params.original = true
      datas = params.original ? this.data : this.rebuildData
    }

    let noHeader = false
    if ('noHeader' in params) noHeader = params.noHeader
    const data = Csv(columns, datas, params, noHeader)
    if (params.callback) params.callback(data)
    else ExportCsv.download(params.filename, data)
  }
  export default {
    components: {
      ICol,
      flow,
      editor: require('../../libs/editor')
    },
    name: 'SearchSQL',
    data () {
      return {
        loadshow: false,
        inputaliasshow: false,
        usercollectshow: false,
        dic_data_show: false,
        dic_data: '',
        data1: [],
        validate_gen: true,
        formItem_dic: {
          info: [],
          data: [],
          select: '',
          namedata: '',
          table: ''
        },
        db_table_list: [],
        TableList: [],
        formItem: {
          textarea: ''
        },
        columnsName: [],
        Testresults: [],
        ruleValidate: {
          basename: [{
            required: true,
            message: '数据库名不得为空',
            trigger: 'change'
          }]
        },
        id: null,
        total: 0,
        allsearchdata: [],
        put_info: {
          base: '',
          tablename: ''
        },
        export_data: false,
        my_coll_cols: [],
        my_coll_data: [],
        collect_alias: '',
        sql_limit: '',
        sql_offset: 0,
        sql_rows: 0,
        elapse_time: 0.00
      }
    },
    methods: {
      addsearchpage () {
        util.openPage(this, 'serach-sql', this.$store.state.search_sql_num)
        this.$store.state.search_sql_num += 1
      },
      addcollect_check () {
      if (this.formItem_dic.namedata == null || this.formItem_dic.namedata.length === 0) {
        this.$Message.warning('没有选择数据库!');
      } else if (this.formItem.textarea == null || this.formItem.textarea.trim().length === 0) {
        this.$Message.warning('没有sql内容!');
      } else {
        this.inputaliasshow = true
      }
      },
      addcollect () {
        axios.put(`${util.url}/query_worklf`, {
          'mode': 'addcollect',
          'conn_name': this.formItem_dic.namedata,
          'sql_text': this.formItem.textarea,
          'alias_name': this.collect_alias
        })
          .then(res => {
            util.notice('已收藏')
          })
          .catch(error => {
            util.err_notice(error)
          })
      },
      delcollect (v1) {
        axios.put(`${util.url}/query_worklf`, {
          'mode': 'delcollect',
          'id': v1
        })
          .then(res => {
            this.opencollect()
          })
          .catch(error => {
            util.err_notice(error)
          })
      },
      setcollecttop (v1) {
        axios.put(`${util.url}/query_worklf`, {
          'mode': 'setcollecttop',
          'id': v1
        })
          .then(res => {
            this.opencollect()
          })
          .catch(error => {
            util.err_notice(error)
          })
      },
      //
      opencollect () {
        var coloperation = {
          title: 'Action',
            key: 'action',
          width: 200,
          align: 'center',
          fixed: 'left',
          render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  this.usecollect(this.my_coll_data[params.index])
                }
              }
            }, '使用'),
            h('Button', {
              props: {
                type: 'success',
                size: 'small'
              },
              on: {
                click: () => {
                  this.setcollecttop(this.my_coll_data[params.index].id)
                }
              }
            }, '置顶'),
            h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              on: {
                click: () => {
                  this.delcollect(this.my_coll_data[params.index].id)
                }
              }
            }, '删除')
          ]);
        }
        };
        var middata;
        axios.put(`${util.url}/query_worklf`, {
          'mode': 'getcollect'
        })
          .then(res => {
            middata = res.data['title'];
            middata.push(coloperation);
            this.my_coll_cols = middata;
            this.my_coll_data = res.data['data'];
            this.usercollectshow = true
          })
          .catch(error => {
            util.err_notice(error)
          })
      },
      usecollect (v1) {
        this.setdbselect(v1.connect_name);
        this.formItem.textarea = v1.sql_text;
        this.usercollectshow = false
      },
      // 设置当前选择的DB
      setdbselect (v1) {
        // this.formItem_dic.namedata
        this.put_info.base = v1;
        axios.put(`${util.url}/query_worklf`, {'mode': 'tablist', 'dbname': this.put_info.base})
          .then(res => {
            this.db_table_list = res.data
          })
          .catch(error => {
            util.err_notice(error)
          })
      },
      // 初始化加载数据库表名列表
      InitializationTableInfo (val) {
        if (this.formItem.namedata.length === 0) {
          return
        }
        axios.post(`${util.url}/sqldic/`, {
          'name': val
        })
          .then(res => {
            this.formItem.info = res.data.map(item => item.BaseName)
          })
          .catch(error => {
            util.err_notice(error)
          })
      },
      beautify () {
        axios.put(`${util.url}/sqlsyntax/beautify`, {
          'data': this.formItem.textarea
        })
          .then(res => {
            this.formItem.textarea = res.data
          })
          .catch(error => {
            util.err_notice(error)
          })
      },
      splice_arr (page) {
        this.Testresults = this.allsearchdata.slice(page * 10 - 10, page * 10)
      },
      ClearForm () {
        this.formItem.textarea = '';
        this.Testresults = [];
        this.columnsName = [];
        this.$refs.totol.currentPage = 1;
        this.sql_rows = 0;
        this.elapse_time = 0.00
      },
      Search_sql () {
        this.dic_data_show = false;
        this.sql_rows = 0;
        this.elapse_time = 0.00;
        this.loadshow = true;
        this.Testresults = [];
        this.columnsName = [];
        axios.post(`${util.url}/search`, {
          'sql': this.formItem.textarea,
          'address': this.put_info.base,
          'sql_offset': this.sql_offset
        })
          .then(res => {
            if (res.data['error']) {
              this.loadshow = false
              util.err_notice(res.data['error'])
            } else {
              this.loadshow = false
              this.dic_data_show = false;
              this.columnsName = res.data['title']
              this.allsearchdata = res.data['data']
              this.Testresults = this.allsearchdata
              this.sql_rows = res.data['len']
              this.elapse_time = res.data['elapsed_time']
            }
          })
          .catch(error => {
            util.err_notice(error)
          })
      },
      exportdata () {
        exportcsv({
          filename: 'Yearning_Data',
          original: false,
          data: this.allsearchdata,
          columns: this.columnsName
        })
      },
      get_tab_meta (v1) {
        axios.put(`${util.url}/query_worklf`, {
          'mode': 'tabmeta',
          'dbname': this.put_info.base,
          'tabname': v1
        })
          .then(res => {
            if (res.data['error']) {
              util.err_notice(res.data['error'])
            } else {
              this.dic_data_show = true;
              this.dic_data = res.data
            }
          })
          .catch(error => {
            util.err_notice(error)
          })
      }
    },
    mounted () {
          axios.put(`${util.url}/query_worklf`, {'mode': 'status'})
            .then(res => {
              this.sql_limit = res.data['limit']
            })
            .catch(error => {
              util.err_notice(error)
            });
            axios.put(`${util.url}/query_worklf`, {'mode': 'dblist'})
              .then(res => {
                this.TableList = res.data
              })
              .catch(error => {
                util.err_notice(error)
              })
            // axios.put(`${util.url}/query_worklf`, {'mode': 'info'})
            //   .then(res => {
            //     this.data1 = JSON.parse(res.data['info'])
            //     res.data['status'] === 1 ? this.export_data = true : this.export_data = false
            //   })
          }
    }
</script>
