<style lang="less">
  @import '../../styles/common.less';
  @import '../Order/components/table.less';

  .top {
    padding: 10px;
    background: rgba(0, 153, 229, .7);
    color: #fff;
    text-align: center;
    border-radius: 2px;
  }
</style>
<template>
  <div>
    <Row>
      <Card>
        <p slot="title" style="height: 45px">
          <Icon type="android-send"></Icon>
          工单{{ this.$route.query.workid }}详细信息
          <br>
          <Button type="text" v-if="this.$route.query.status === 1" @click.native="_RollBack()">查看回滚语句</Button>
          <Button type="text" v-else-if="this.$route.query.status === 0 && this.$route.query.type === 1"
                  @click.native="PutData()">重新提交
          </Button>
          <!--<Button type="text" v-if="this.$route.query.status === 2" @click.native="delorder()">工单撤销</Button>-->
        </p>
        <p slot="extra">
          <i-button type="primary" @click.native="$router.go(-1)" >
            <Icon type="chevron-left"></Icon>
            返回
          </i-button>
          <i-button type="primary" @click="showdetail()">
            申请内容
          </i-button>
          <i-button type="primary">
            催办
            <Icon type="chevron-right"></Icon>
          </i-button>
        </p>
        <Row>
          <Steps :current="workflow_record.length">
              <Step :title="wf.step_name" v-for="(wf, index) in workflow_config" :key="index"></Step>
          </Steps>
        </Row>
        <Row>
          <br>
          <Steps  direction="vertical" :current="workflow_record.length">
            <Step icon="person-add" v-for="(step, index) in workflow_record" :key="index">
              <i-col span="24">
                <Card>
                  <Row style="background-color: rgba(236,255,255,0.63); height: 35px;">
                    <i-col span="8">
                      <Icon type="pie-graph"></Icon>
                      <span style="font-weight:bold">任务名称：{{step.step_name}}</span>
                    </i-col>
                    <i-col  span="8">
                      <Icon type="person"></Icon>
                      <span style="font-weight:bold">处理人：{{step.handler_user}}</span>
                    </i-col>
                    <i-col>
                      <Icon type="calendar"></Icon>
                      <span style="font-weight:bold">处理时间： {{step.create_time}}</span>
                    </i-col>
                  </Row>
                  <br>
                  <Row>
                    <i-col span="2">
                      <span style="font-weight:bold">处理结果：</span>
                    </i-col>
                    <i-col span="18">
                      <span>{{step.handler_result}}</span>
                    </i-col>
                  </Row>
                  <Row>
                    <i-col span="2">
                      <span style="font-weight:bold">审批意见：</span>
                    </i-col>
                    <i-col span="16">
                      <span>{{step.opinion}}</span>
                    </i-col>
                  </Row>
                </Card>
              </i-col>
            </Step>
            <!--多展示一列下一步审批信息-->
            <Step icon="clock">
              <i-col span="24">
                <Card>
                  <!--任务标题-->
                  <Row style="background-color: rgba(236,255,255,0.63); height: 35px;">
                    <i-col span="8">
                      <Icon type="pie-graph"></Icon>
                      <span style="font-weight:bold">任务名称：{{workflow_next.step_name}}</span>
                    </i-col>
                    <i-col  span="8">
                      <Icon type="person"></Icon>
                      <span style="font-weight:bold">处理人：{{workflow_next.handler_user}}</span>
                    </i-col>
                  </Row>
                  <br>
                  <!--任务处理结果-->
                  <Row v-show="true">
                    <i-col span="24">
                      <!--<Icon type="clock" size="50"></Icon>-->
                      <span >处理中……</span>
                    </i-col>
                  </Row>
                  <br>
                </Card>
              </i-col>
            </Step>
          </Steps>
        </Row>
      </Card>
      <Card>
        <!--处理-->
        <Step icon="social-twitter">
          <Card>
            <Row style="background-color: rgba(236,255,255,0.63); height: 35px;">
              <span style="font-weight:bold">审批意见：</span>
            </Row>
            <Row>
              <RadioGroup size="large" style="width:100%" v-model="auditresult">
                  <i-col span="3"  offset="2">
                    <Radio label="agree">
                      <Icon type="checkmark"></Icon>
                      <span style="font-size: medium">同意</span>
                    </Radio>
                  </i-col>
                  <i-col span="3">
                    <Radio label="disagree">
                      <Icon type="close"></Icon>
                      <span style="font-size: medium">驳回</span>
                    </Radio>
                  </i-col>
                  <i-col span="8">
                    <span @click="getperson()">
                    <Radio label="otherperson">
                      <span style="font-size: medium">转交</span>
                      <i-select v-model="auditother" filterable>
                        <Option v-for="item in personlist" :value="item" :key="item">{{ item }}</Option>
                      </i-select>
                    </Radio>
                    </span>
                  </i-col>
              </RadioGroup>
            </Row>
            <Row>
              <i-col span="2">
                <span style="font-size: medium">审批建议:{{auditresult}}{{auditadvice}}{{auditother}}</span>
              </i-col>
              <i-col span="10">
                <i-input type="textarea" v-model="auditadvice" :rows="4" placeholder="同意"></i-input>
              </i-col>
            </Row>
            <br>
            <Row>
              <i-col span="10" offset="2">
                <Button type="primary" long @click="submit_audit()">提交</Button>
              </i-col>
            </Row>
          </Card>
        </Step>
      </Card>
    </Row>
    <BackTop :height="100" :bottom="200">
      <div class="top">返回顶端</div>
    </BackTop>

    <!--工单详细内容-->
    <Modal v-model="modaldetail" width="900">
      <p slot="header" style="color:#f60;font-size: 16px">
        <Icon type="information-circled"></Icon>
        <span>SQL工单详细信息</span>
      </p>
      <Form label-position="right">
        <FormItem label="连接名称:">
          <span>{{ formdetail.bundle_id }}</span>
        </FormItem>
        <FormItem label="SQL语句:">
          <br>
          <div class="tree">
            <p v-for="i in ordersql">{{ i }}</p>
          </div>
        </FormItem>
      </Form>
      <template>
        <p class="pa">SQL检查结果:</p>
        <Table :columns="columnsName" :data="dataId" stripe border width="860" height="200"></Table>
      </template>
      <div slot="footer">
        <Button type="warning" @click.native="test_button()">检测sql</Button>
        <Button @click="modaldetail = false">取消</Button>
        <!--<Button type="error" @click="out_button()">驳回</Button>-->
        <!--<template v-if="switch_show">-->
          <!--<template>-->
            <!--<Button type="success" @click="agreed_button()" :disabled="summit" v-if="auth === 'admin'">同意</Button>-->
            <!--&lt;!&ndash;<Button type="success" @click="put_button()" v-else-if="auth === 'perform'">执行</Button>&ndash;&gt;-->
          <!--</template>-->
          <!--<template v-else>-->
            <!--<Button type="error" @click="out_button()" :disabled="summit">驳回</Button>-->
            <!--&lt;!&ndash;<Button type="success" @click="put_button()" :disabled="summit">执行</Button>&ndash;&gt;-->
          <!--</template>-->
        <!--</template>-->
      </div>
    </Modal>

    <Modal v-model="reloadsql" :ok-text="'提交工单'" width="800" @on-ok="_Putorder">
      <Row>
        <Card>
          <div class="step-header-con">
            <h3>Yearning SQL平台审核工单</h3>
          </div>
          <p class="step-content"></p>
          <Form class="step-form" :label-width="100">
            <FormItem label="用户名:">
              <p>{{formItem.username}}</p>
            </FormItem>
            <FormItem label="机房:">
              <p>{{formItem.computer_room}}</p>
            </FormItem>
            <FormItem label="连接名:">
              <p>{{formItem.connection_name}}</p>
            </FormItem>
            <FormItem label="数据库库名:">
              <p>{{formItem.basename}}</p>
            </FormItem>
            <FormItem label="执行SQL:">
              <template v-if="sqltype===0">
                <Input v-model="sql" type="textarea" :rows="8"></Input>
              </template>
              <template v-else>
                <p v-for="i in ddlsql">{{i}}</p>
              </template>
            </FormItem>
            <FormItem label="工单提交说明:">
              <Input v-model="formItem.text" placeholder="最多不超过20个字"></Input>
            </FormItem>
            <FormItem label="是否备份">
              <RadioGroup v-model="formItem.backup">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>
          </Form>
        </Card>
      </Row>
    </Modal>
  </div>
</template>

<script>
  import util from '../../libs/util'
  import axios from 'axios'
  //
  export default {
    name: 'myorder-list',
    data () {
      return {
        auditresult: '',
        auditadvice: '',
        auditother: '',
        personlist: ['www', 'jjj', 'fff'],
        ordersql: [],
        dataId: [],
        formdetail: {},
        modaldetail: false,
        workflow_config: [],
        workflow_record: [],
        workflow_next: [],
        columnsName: [
          {
            title: 'ID',
            key: 'ID',
            width: 60,
            fixed: 'left'
          },
          {
            title: '阶段状态',
            key: 'stagestatus',
            width: 150
          },
          {
            title: '当前检查的sql',
            key: 'sql',
            width: 500
          },
          {
            title: '错误信息',
            key: 'errormessage',
            width: 300
          },
          {
            title: '影响行数',
            key: 'affected_rows',
            width: 90
          },
          {
            title: 'SQLSHA1',
            key: 'SQLSHA1',
            width: 200
          }
        ],
        tabcolumns: [
          {
            title: 'sql语句',
            key: 'sql'
          },
          {
            title: '状态',
            key: 'state',
            width: 250
          },
          {
            title: '错误信息',
            key: 'error',
            width: 400
          },
          {
            title: '影响行数',
            key: 'affectrow',
            width: 100
          },
          {
            title: '执行时间/秒',
            key: 'execute_time',
            width: 200
          }
        ],
        TableDataNew: [],
        sql: '',
        openswitch: false,
        single: false,
        reloadsql: false,
        formItem: {
          computer_room: '',
          connection_name: '',
          basename: '',
          username: '',
          bundle_id: null
        },
        ddlsql: [],
        sqltype: null,
        dmlorddl: null
      }
    },
    methods: {
      getperson () {
        axios.put(`${util.url}/audit_sql`, {
          'type': 'getpersonall'
        })
          .then(res => {
           this.personlist = res.data
          })
          .catch(error => {
            util.err_notice(error)
          })
      },
      submit_audit () {
        if (this.auditresult == null || this.auditresult.length === 0) {
          util.err_notice('请选择审批结果!');
        } else if (this.auditresult === 'otherperson' && (this.auditother == null || this.auditother.length === 0)) {
          util.err_notice('转交人不能为空!');
        } else if (this.auditadvice == null || this.auditadvice.length === 0) {
          util.err_notice('审批意见不能为空！')
        } else {
          axios.put(`${util.url}/audit_sql`, {
            'type': 'auditorder',
            'workid': this.$route.query.workid,
            'auditresult': this.auditresult,  // agree, disagree, otherpersion
            'auditother': this.auditother,
            'auditadvice': this.auditadvice
          })
            .then(res => {
              this.personlist = res.data
            })
            .catch(error => {
              util.err_notice(error)
            })
        }
      },
      // 测试sql按钮
      test_button () {
        this.osclist = []
        axios.put(`${util.url}/audit_sql`, {
          'type': 'test',
          'workid': this.$route.query.workid
        })
          .then(res => {
            if (res.data.status === 200) {
              let osclist
              this.dataId = res.data.result
              osclist = this.dataId.filter(vl => {
                if (vl.SQLSHA1 !== '') {
                  return vl
                }
              })
              this.osclist = osclist
              this.summit = false
              sessionStorage.setItem('osc', JSON.stringify(osclist))
            } else {
              util.err_notice(res.data.status)
            }
          })
          .catch(error => {
            util.err_notice(error)
          })
      },
      // 显示详细信息模态框
      showdetail: function () {
        this.modaldetail = true
      },
      _RollBack () {
        if (this.TableDataNew[1].state.length === 40) {
          this.openswitch = true
          let opid = this.TableDataNew.map(item => item.sequence)
          opid.splice(0, 1)
          axios.post(`${util.url}/detail/`, {'opid': JSON.stringify(opid), 'id': this.$route.query.id})
            .then(res => {
              this.formItem = res.data.data
              this.formItem.backup = '0'
              this.ddlsql = res.data.sql
              this.sqltype = res.data.type
              this.reloadsql = true
            })
            .catch(() => {
              util.err_notice('无法获得相关回滚数据,请确认备份库配置正确及备份规则')
            })
        } else {
          this.$Message.error('此工单没有备份或语句执行失败!')
        }
      },
      PutData () {
        axios.put(`${util.url}/detail`, {'id': this.$route.query.id})
          .then(res => {
            this.formItem = res.data.data
            this.sql = res.data.sql
            this.sqltype = res.data.type
          })
          .catch(error => {
            util.err_notice(error)
          })
        this.reloadsql = true
      },
      _Putorder () {
        if (this.sqltype === 0) {
          let _tmpsql = this.sql.replace(/(;|；)$/gi, '').replace(/\s/g, ' ').replace(/；/g, ';').split(';')
          axios.post(`${util.url}/sqlsyntax/`, {
            'data': JSON.stringify(this.formItem),
            'sql': JSON.stringify(_tmpsql),
            'user': sessionStorage.getItem('user'),
            'type': this.dmlorddl,
            'id': this.formItem.bundle_id
          })
            .then(() => {
              util.notice('工单已提交成功')
            })
            .catch(error => {
              util.err_notice(error)
            })
        } else {
          axios.post(`${util.url}/sqlsyntax/`, {
            'data': JSON.stringify(this.formItem),
            'sql': JSON.stringify(this.ddlsql),
            'user': sessionStorage.getItem('user'),
            'type': this.dmlorddl,
            'id': this.formItem.bundle_id
          })
            .then(() => {
              util.notice('工单已提交成功')
            })
            .catch(error => {
              util.err_notice(error)
            })
        }
      },
      delorder () {
        let _list = []
        _list.push({'status': this.$route.query.status, 'id': this.$route.query.id})
        axios.post(`${util.url}/undoOrder`, {
          'id': JSON.stringify(_list)
        })
          .then(res => {
            util.notice(res.data)
            this.$router.go(-1)
          })
          .catch(error => {
            util.err_notice(error)
          })
      }
    },
    mounted () {
      axios.get(`${util.url}/detail?workid=${this.$route.query.workid}`)
        .then(res => {
          this.workflow_config = res.data.workflow_info;
          this.workflow_record = res.data.workflow_record;
          this.workflow_next = res.data.workflow_next;
          this.formdetail = res.data.order_info;
          this.ordersql = this.formdetail.sql.split(';')
        })
        .catch(error => {
          util.err_notice(error)
        })
    }
  }
</script>
