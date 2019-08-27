<template>
  <div>
    <Row>
      <Card>
        <div class="step-header-con">
          <h3>{{ stepData.title }}</h3>
          <h5>{{ stepData.describe }}</h5>
        </div>
        <p class="step-content"></p>
        <Row>
          <i-col span="8">
            <Alert type="warning" show-icon>
              注意事项:
              <span slot="desc">
              1.必须填写查询说明
              <br>
              2.根据查询条件预估所需的查询时间
              <br>
              3.所有提交的查询语句均会进行审计记录
              <br>
              4.仅支持select语句,不可使用非查询语句
              <br>
              5.已限制最大limit数，如自己输入的limit数大于平台配置的最大limit数则已平台配置的Limit数为准
            </span>
            </Alert>
          </i-col>
          <i-col span="12">
            <Form ref="step" :model="step" :rules="stepRules" :label-width="150">
              <FormItem label="机房:" prop="computer_room">
                <Select v-model="step.computer_room" @on-change="Connection_Name">
                  <Option v-for="i in datalist.computer_roomlist" :key="i" :value="i">{{i}}</Option>
                </Select>
              </FormItem>

              <FormItem label="连接名:" prop="connection_name">
                <Select v-model="step.connection_name" filterable multiple>
                  <Option v-for="i in datalist.connection_name_list" :value="i.connection_name"
                          :key="i.connection_name">{{ i.connection_name }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="审核人:" prop="person">
                <Select v-model="step.person" filterable>
                  <Option v-for="i in personlist" :value="i" :key="i">{{ i }}</Option>
                </Select>
              </FormItem>
              <FormItem label="是否需要导出数据:" prop="export">
                <RadioGroup v-model="step.export">
                  <Radio label="1">是</Radio>
                  <Radio label="0">否</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="查询说明：" prop="opinion">
                <Input v-model="step.opinion" type="textarea" :autosize="{minRows: 4,maxRows: 8}"
                       placeholder="请填写查询说明"/>
              </FormItem>
              <FormItem label="查询时限：">
                <InputNumber
                  v-model="step.timer"
                  :formatter="value => `${value}小时`"
                  :parser="value => value.replace('小时', '')"
                  :min="1">
                </InputNumber>
                 <a>(1-168小时,最长申请7天)</a>
              </FormItem>
              <FormItem label="">
                <Button @click="handleSubmit" style="width:100px;" type="primary">提交</Button>
              </FormItem>
            </Form>
          </i-col>
        </Row>
<!--        <Steps style="margin-left: 10%">
          <Step v-for="item in stepList1" :title="item.title" :content="item.describe" :key="item.title"></Step>
        </Steps>-->
        <Row>
          <Card>
            <p slot="title">
              <Icon type="person"></Icon>
              我的申请
            </p>
            <Row>
              <Col span="24">
                <Table border :columns="permissoncolums" :data="query_info" stripe ref="selection"
                       @on-selection-change="delrecordList"></Table>
                <br>
                <Page :total="per_pn" show-elevator @on-change="permisson_list" :page-size="5" ref="perpage"></Page>
              </Col>
            </Row>
          </Card>
        </Row>

        <Modal v-model="editInfodModal" :width="800">
          <h3 slot="header" style="color:#2D8CF0">查询申请单详细内容</h3>
          <Form :label-width="120" label-position="right">
            <FormItem label="机房">
              <p>{{query.computer_room}}</p>
            </FormItem>
            <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
            <br>
            <FormItem label="连接名:">
              <p>{{query.connection_name}}</p>
            </FormItem>
            <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
            <br>
            <FormItem label="查询时限:">
              <p>{{query.timer}}小时</p>
            </FormItem>
            <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
            <br>
            <FormItem label="导出数据:">
              <p v-if="query.export === 1">是</p>
              <p v-else>否</p>
            </FormItem>
            <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
            <br>
            <FormItem label="查询说明:">
              <Input v-model="query.instructions" type="textarea" :autosize="{minRows: 5,maxRows: 8}" readonly></Input>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="primary" @click="del_apply">撤销</Button>
            <Button type="primary" @click="editInfodModal=false">返回</Button>
          </div>
        </Modal>

      </Card>
    </Row>
  </div>
</template>

<script>
  //
  import axios from 'axios'
  import util from '../../libs/util'

  export default {
    name: 'work_flow',
    props: ['msg'],
    data () {
      return {
        stepData: {
          title: 'Yearning SQL查询系统',
          describe: `欢迎你！ ${sessionStorage.getItem('user')}`
        },
        step: {
          remark: '',
          timer: 1,
          computer_room: '',
          connection_name: '',
          person: '',
          export: '0'
        },
        stepList1: [
          {
            title: '提交',
            describe: '提交查询申请'
          },
          {
            title: '审核',
            describe: '等待审核结果'
          },
          {
            title: '查询',
            describe: '审核完毕，进入查询页面'
          }
        ],
        stepRules: {
          opinion: [
            {required: true, message: '请填写查询说明', trigger: 'blur'}
          ],
          computer_room: [{
            required: true,
            message: '机房地址不得为空',
            trigger: 'change'
          }],
          basename: [{
            required: true,
            message: '数据库名不得为空',
            trigger: 'change'
          }],
          person: [{
            required: true,
            message: '审核人不得为空',
            trigger: 'change'
          }]
        },
        item: {},
        personlist: [],
        datalist: {
          connection_name_list: [],
          basenamelist: [],
          sqllist: [],
          computer_roomlist: util.computer_room
        },
        // from audit
        query_info: [],
        permissoncolums: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '申请编号',
            key: 'work_id'
          },
          {
            title: '时间',
            key: 'time'
          },
          {
            title: '审批人',
            key: 'audit'
          },
          {
            title: '状态',
            key: 'query_per',
            width: 150,
            render: (h, params) => {
              const row = params.row
              let color = ''
              let text = ''
              if (row.query_per === 2) {
                color = 'blue'
                text = '待审核'
              } else if (row.query_per === 0) {
                color = 'red'
                text = '驳回'
              } else if (row.query_per === 1) {
                color = 'green'
                text = '同意'
              } else {
                color = 'yellow'
                text = '查询结束'
              }
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, text)
            },
            sortable: true,
            filters: [{
              label: '同意',
              value: 1
            },
              {
                label: '驳回',
                value: 0
              },
              {
                label: '待审核',
                value: 2
              },
              {
                label: '查询结束',
                value: 3
              }
            ],
            //            filterMultiple: false 禁止多选,
            filterMethod (value, row) {
              if (value === 1) {
                return row.query_per === 1
              } else if (value === 2) {
                return row.query_per === 2
              } else if (value === 0) {
                return row.query_per === 0
              } else if (value === 3) {
                return row.query_per === 3
              }
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    size: 'small',
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.modalinfo(params.row)
                    }
                  }
                }, '查看')
              ])
            }
          }
        ],
        per_pn: 1,
        delrecord: [],
        editInfodModal: false,
        query: {}
      }
    },
    methods: {
      Connection_Name (val) {
        this.datalist.connection_name_list = []
        this.datalist.basenamelist = []
        this.step.connection_name = ''
        this.step.basename = ''
        if (val) {
          this.ScreenConnection(val)
        }
      },
      ScreenConnection (val) {
        this.datalist.connection_name_list = this.item.filter(item => {
          if (item.computer_room === val) {
            return item
          }
        })
      },
      handleSubmit () {
        this.$refs['step'].validate((valid) => {
          if (valid) {
            axios.put(`${util.url}/query_worklf`, {
              'mode': 'put',
              'instructions': this.step.opinion,
              'timer': this.step.timer,
              'connection_name': this.step.connection_name,
              'computer_room': this.step.computer_room,
              'export': this.step.export,
              'audit': this.step.person
            })
              .then(() => {
                this.$router.push({
                  name: 'queryready'
                })
              })
          }
        })
      },
      // from audit
      permisson_list (vl = 1) {
        axios.get(`${util.url}/query_order?page=${vl}&type=myorder`)
          .then(res => {
            this.query_info = res.data['data']
            this.per_pn = res.data['pn']
          })
          .catch(error => {
            util.err_notice(error)
          })
      },
      delrecordData () {
        axios.post(`${util.url}/query_order/`, {'work_id': JSON.stringify(this.delrecord)})
          .then(res => {
            util.notice(res.data)
            this.$refs.perpage.currentPage = 1
            this.permisson_list()
          })
          .catch(error => {
            util.err_notice(error)
          })
      },
      delrecordList (vl) {
        this.delrecord = vl.map(vl => vl.work_id)
      },
      modalinfo (vl) {
        this.editInfodModal = true
        this.query = vl
      },
      del_apply () {
        axios.delete(`${util.url}/query_worklf`)
          .then(() => {
            this.$router.push({
              name: 'serach-sql'
            })
          })
      }
    },
    mounted () {
      axios.put(`${util.url}/workorder/connection`, {'permissions_type': 'query'})
        .then(res => {
          this.item = res.data['connection']
          this.personlist = res.data['assigend']
          this.datalist.computer_roomlist = res.data['custom']
        })
        .catch(error => {
          util.err_notice(error)
        })
/*      axios.put(`${util.url}/query_worklf`, {'mode': 'status'})
        .then(res => {
          if (res.data === 1) {
            this.$router.push({
              name: 'querypage'
            })
          } else if (res.data === 2) {
            this.$router.push({
              name: 'queryready'
            })
          }
        }) */
        // from audit
      this.permisson_list()
    }
  }
</script>

<style lang="less">
  .step {
    &-header-con {
      text-align: center;
      h3 {
        margin: 10px 0;
      }
      h5 {
        margin: 0 0 5px;
      }
    }
    &-content {
      padding: 5px 20px 26px;
      margin-bottom: 20px;
      border-bottom: 1px solid #dbdddf;
    }
    &-form {
      padding-bottom: 10px;
      border-bottom: 1px solid #dbdddf;
      margin-bottom: 20px;
    }
  }
</style>
