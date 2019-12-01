import { Button, DatePicker, Form, Input, Modal, Radio, Select, Steps, Descriptions } from 'antd';
import React, { Component } from 'react';

import { FormComponentProps } from 'antd/es/form';
import { TableListItem } from '../data.d';

export interface FormValueType extends Partial<TableListItem> {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
}

export interface UpdateFormProps extends FormComponentProps {
  handleUpdateModalVisible: (flag?: boolean, formVals?: FormValueType) => void;
  handleUpdate: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
}
const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

export interface UpdateFormState {
  formVals: FormValueType;
  currentStep: number;
}

class UpdateForm extends Component<UpdateFormProps, UpdateFormState> {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  constructor(props: UpdateFormProps) {
    super(props);

    this.state = {
      formVals: {
        purpose: props.values.purpose,
        desc: props.values.desc,
        key: props.values.key,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      id: 1,
      currentStep: 0,
    };
  }

  handleNext = (currentStep: number) => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 2) {
            this.forward();
          } else {
            handleUpdate(formVals);
          }
        },
      );
    });
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  handleOk = value => e => {
    const { form, handleUpdate } = this.props;
    handleUpdate({ id: value.id, action: 'approve'})
  };

  handleCancel = value => e => {
    const { form, handleUpdate } = this.props;
    handleUpdate({ id: value.id, action: 'decline'})
  };


  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  renderContent = (currentStep: number, formVals: FormValueType) => {
    const { values } = this.props;
    return [
      <div>
        <Descriptions bordered>
          <Descriptions.Item label="Purpose">{values.purpose}</Descriptions.Item>
          <Descriptions.Item label="Amount Requested">{values.amountRequested}</Descriptions.Item>
          <Descriptions.Item label="Status">{values.status}</Descriptions.Item>
          <Descriptions.Item label="Project Description">{values.projectDescription}</Descriptions.Item>
          <Descriptions.Item label="Market Description">{values.marketDescription}</Descriptions.Item>
          <Descriptions.Item label="Repay Description">{values.repayDescription}</Descriptions.Item>
          <Descriptions.Item label="Date">{values.date}</Descriptions.Item>
          <Descriptions.Item label="Terms In">{values.termsIn}</Descriptions.Item>
          <Descriptions.Item label="Date">{values.date}</Descriptions.Item>
          <Descriptions.Item label="Client Name">{values.client?.name}</Descriptions.Item>
          <Descriptions.Item label="Client Job">{values.client?.job}</Descriptions.Item>
          <Descriptions.Item label="Client Address">{values.client?.address}</Descriptions.Item>
          <Descriptions.Item label="Client Email">{values.client?.email}</Descriptions.Item>
          <Descriptions.Item label="Client Phone">{values.client?.phone}</Descriptions.Item>
          <Descriptions.Item label="Client Branch">{values.bank?.branch}</Descriptions.Item>
          <Descriptions.Item label="Client Account Number">{values.bank?.accountNumber}</Descriptions.Item>
          <Descriptions.Item label="Client Account Type">{values.bank?.accountType}</Descriptions.Item>
        </Descriptions>
      </div>
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { currentStep, formVals } = this.state;
    return (
      <Modal
        width={940}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="Approve Loan"
        onOk={this.handleOk(values)}
        okText='Approve'
        cancelText='Decline'
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        {this.renderContent(currentStep, formVals)}
      </Modal>
    );
  }
}

export default Form.create<UpdateFormProps>()(UpdateForm);
