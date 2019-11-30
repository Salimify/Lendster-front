import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Icon,
  Input,
  List,
  Menu,
  Modal,
  Progress,
  Radio,
  Row,
  Select,
  Result,
} from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { StateType } from './model';
import { BasicListItemDataType } from './data.d';
import styles from './style.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;

interface ValidationListProps extends FormComponentProps {
  validationList: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}
interface ValidationListState {
  visible: boolean;
  done: boolean;
  current?: Partial<BasicListItemDataType>;
}
@connect(
  ({
    validationList,
    loading,
  }: {
    validationList: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    validationList,
    loading: loading.models.validationList,
  }),
)
class ValidationList extends Component<
  ValidationListProps,
  ValidationListState
> {
  state: ValidationListState = { visible: false, done: false, current: undefined };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  addBtn: HTMLButtonElement | undefined | null = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'validationList/fetch',
      payload: {
        count: 5,
      },
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  showEditModal = (item: BasicListItemDataType) => {
    this.setState({
      visible: true,
      current: item,
    });
  };

  handleDone = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';

    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    form.validateFields((err: string | undefined, fieldsValue: BasicListItemDataType) => {
      if (err) return;
      this.setState({
        done: true,
      });
      dispatch({
        type: 'validationList/submit',
        payload: { id, ...fieldsValue },
      });
    });
  };

  deleteItem = (id: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'validationList/submit',
      payload: { id },
    });
  };

  render() {
    const {
      validationList: { list },
      loading,
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { visible, done, current = {} } = this.state;

    const editAndDelete = (key: string, currentItem: BasicListItemDataType) => {
      if (key === 'edit') this.showEditModal(currentItem);
      else if (key === 'delete') {
        Modal.confirm({
          title: 'Delete task',
          content: 'Are you sure you want to delete this task？',
          okText: 'Confirm',
          cancelText: 'Cancel',
          onOk: () => this.deleteItem(currentItem.id),
        });
      }
    };

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const Info: React.FC<{
      title: React.ReactNode;
      value: React.ReactNode;
      bordered?: boolean;
    }> = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">All</RadioButton>
          <RadioButton value="progress">Processing</RadioButton>
          <RadioButton value="waiting">Waiting</RadioButton>
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="Please enter" onSearch={() => ({})} />
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };

    const ListContent = ({
      data: { owner, createdAt, percent, status },
    }: {
      data: BasicListItemDataType;
    }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>Owner</span>
          <p>{owner}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>Starting time</span>
          <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
          <Progress percent={percent} status={status} strokeWidth={6} style={{ width: 180 }} />
        </div>
      </div>
    );

    const MoreBtn: React.FC<{
      item: BasicListItemDataType;
    }> = ({ item }) => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => editAndDelete(key, item)}>
            <Menu.Item key="edit">edit</Menu.Item>
            <Menu.Item key="delete">delete</Menu.Item>
          </Menu>
        }
      >
        <a>
          More <Icon type="down" />
        </a>
      </Dropdown>
    );

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            status="success"
            title="Successful operation"
            subTitle="一The series of information descriptions can also be punctuated short."
            extra={
              <Button type="primary" onClick={this.handleDone}>
                Understood
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="Mission name" {...this.formLayout}>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please enter a task name' }],
              initialValue: current.title,
            })(<Input placeholder="Please enter" />)}
          </FormItem>
          <FormItem label="Starting time" {...this.formLayout}>
            {getFieldDecorator('createdAt', {
              rules: [{ required: true, message: 'Please select a start time' }],
              initialValue: current.createdAt ? moment(current.createdAt) : null,
            })(
              <DatePicker
                showTime
                placeholder="Please choose"
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
              />,
            )}
          </FormItem>
          <FormItem label="Task manager" {...this.formLayout}>
            {getFieldDecorator('owner', {
              rules: [{ required: true, message: 'Please select a task manager\n' }],
              initialValue: current.owner,
            })(
              <Select placeholder="please choose">
                <SelectOption value="Fu Xiaoxiao">Fu Xiaoxiao</SelectOption>
                <SelectOption value="Fu Xiaoxiao">Fu Xiaoxiao</SelectOption>
              </Select>,
            )}
          </FormItem>
          <FormItem {...this.formLayout} label="product description">
            {getFieldDecorator('subDescription', {
              rules: [{ message: 'Please enter a product description of at least five characters！', min: 5 }],
              initialValue: current.subDescription,
            })(<TextArea rows={4} placeholder="Please enter at least five characters" />)}
          </FormItem>
        </Form>
      );
    };
    return (
      <>
        <PageHeaderWrapper>
          <div className={styles.standardList}>
            <Card bordered={false}>
              <Row>
                <Col sm={8} xs={24}>
                  <Info title="My to-do" value="8 Tasks" bordered />
                </Col>
                <Col sm={8} xs={24}>
                  <Info title="Task average processing time this week" value="32 minute" bordered />
                </Col>
                <Col sm={8} xs={24}>
                  <Info title="Tasks completed this week" value="24 Tasks" />
                </Col>
              </Row>
            </Card>

            <Card
              className={styles.listCard}
              bordered={false}
              title="Basic list"
              style={{ marginTop: 24 }}
              bodyStyle={{ padding: '0 32px 40px 32px' }}
              extra={extraContent}
            >
              <Button
                type="dashed"
                style={{ width: '100%', marginBottom: 8 }}
                icon="plus"
                onClick={this.showModal}
                ref={component => {
                  // eslint-disable-next-line  react/no-find-dom-node
                  this.addBtn = findDOMNode(component) as HTMLButtonElement;
                }}
              >
                Add to
              </Button>
              <List
                size="large"
                rowKey="id"
                loading={loading}
                pagination={paginationProps}
                dataSource={list}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <a
                        key="edit"
                        onClick={e => {
                          e.preventDefault();
                          this.showEditModal(item);
                        }}
                      >
                        edit
                      </a>,
                      <MoreBtn key="more" item={item} />,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item.logo} shape="square" size="large" />}
                      title={<a href={item.href}>{item.title}</a>}
                      description={item.subDescription}
                    />
                    <ListContent data={item} />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </PageHeaderWrapper>

        <Modal
          title={done ? null : `task${current ? 'edit' : 'Add to'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </>
    );
  }
}

export default Form.create<ValidationListProps>()(ValidationList);
