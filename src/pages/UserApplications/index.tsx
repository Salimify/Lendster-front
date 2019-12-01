import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  message,
} from 'antd';
import React, {Component, Fragment} from 'react';

import {Dispatch, Action} from 'redux';
import {FormComponentProps} from 'antd/es/form';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {SorterResult} from 'antd/es/table';
import {connect} from 'dva';
import moment from 'moment';
import {StateType} from './model';
import CreateForm from './components/CreateForm';
import StandardTable, {StandardTableColumnProps} from './components/StandardTable';
import UpdateForm, {FormValueType} from './components/UpdateForm';
import {TableListItem, TableListPagination, TableListParams} from './data.d';

import styles from './style.less';
import route from "../../../mock/route";
import {router} from "umi";

const FormItem = Form.Item;
const {Option} = Select;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

type IStatusMapType = 'success' | 'processing' | 'error';
const statusMap = ['success', 'processing', 'error'];
const status = [{APPROVED: 'success'}, {INPROGRESS: 'processing'}, {DECLINED: 'error'}];

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<Action<| 'userApplications/add'
    | 'userApplications/fetch'
    | 'userApplications/remove'
    | 'userApplications/update'>>;
  loading: boolean;
  userApplications: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
     userApplications,
     loading,
   }: {
    userApplications: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    userApplications,
    loading: loading.models.userApplications,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns: StandardTableColumnProps[] = [
    {
      title: 'Client name',
      dataIndex: 'client.name',
    },
    {
      title: 'Purpose',
      dataIndex: 'purpose',
    },
    {
      title: 'Amount',
      dataIndex: 'amountRequested',
    },
    {
      title: 'Project Description',
      dataIndex: 'projectDescription',
    },
    {
      title: 'Market Description',
      dataIndex: 'marketDescription',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(val: IStatusMapType) {
        console.log(status.val)
        let vl = val.replace(/\s+/g, '');
        return <Badge status={statusMap[0]} text={val}/>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
    },
  ];

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'userApplications/fetch',
    });
  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'userApplications/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'userApplications/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const {expandForm} = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = (e: { key: string }) => {
    const {dispatch} = this.props;
    const {selectedRows} = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'userApplications/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const {dispatch, form} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'userApplications/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: FormValueType) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = (fields: { desc: any }) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'userApplications/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('Added successfully');
    this.handleModalVisible();
  };

  handleUpdate = (fields: FormValueType) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'userApplications/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('Configuration succeeded');
    this.handleUpdateModalVisible();
  };

  goToNew() {
    router.push('/applications/add')
  }

  renderSimpleForm() {
    const {form} = this.props;
    const {getFieldDecorator} = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="Client name">
              {getFieldDecorator('name')(<Input placeholder="Please enter"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Status of use">
              {getFieldDecorator('status')(
                <Select placeholder="Please choose" style={{width: '100%'}}>
                  <Option value="APPROVED">APPROVED</Option>
                  <Option value="IN PROGRESS">IN PROGRESS</Option>
                  <Option value="DECLINED">DECLINED</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                Inquire
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                Reset
              </Button>
              <a style={{marginLeft: 8}} onClick={this.toggleForm}>
                Expand <Icon type="down"/>
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="Rule name">
              {getFieldDecorator('name')(<Input placeholder="Please enter"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Status of use">
              {getFieldDecorator('status')(
                <Select placeholder="Please choose" style={{width: '100%'}}>
                  <Option value="0">shut down</Option>
                  <Option value="1">In operation</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Number of calls">
              {getFieldDecorator('number')(<InputNumber style={{width: '100%'}}/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="Updated">
              {getFieldDecorator('date')(
                <DatePicker style={{width: '100%'}} placeholder="Please enter an update date"/>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Status of use">
              {getFieldDecorator('status3')(
                <Select placeholder="Please choose" style={{width: '100%'}}>
                  <Option value="0">shut down</Option>
                  <Option value="1">In operation</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="status of use">
              {getFieldDecorator('status4')(
                <Select placeholder="Please choose" style={{width: '100%'}}>
                  <Option value="0">shut down</Option>
                  <Option value="1">In operation</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{overflow: 'hidden'}}>
          <div style={{float: 'right', marginBottom: 24}}>
            <Button type="primary" htmlType="submit">
              Inquire
            </Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
              Reset
            </Button>
            <a style={{marginLeft: 8}} onClick={this.toggleForm}>
              Put away <Icon type="up"/>
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const {expandForm} = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      userApplications: {data},
      loading,
    } = this.props;
    console.log(data);
    const {selectedRows, modalVisible, updateModalVisible, stepFormValues} = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">delete</Menu.Item>
        <Menu.Item key="approval">Batch approval</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.goToNew()}>
                New
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>Batch operation</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      More actions <Icon type="down"/>
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
