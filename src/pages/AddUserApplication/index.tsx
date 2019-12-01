import {
  Button,
  Card,
  DatePicker,
  Form,
  Icon,
  Input,
  InputNumber,
  Radio,
  Select,
  Tooltip,
  Divider,
} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
let id = 0;

interface AddUserApplicationProps extends FormComponentProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
}

class AddUserApplication extends Component<AddUserApplicationProps> {
  handleSubmit = (e: React.FormEvent) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      let obj = values;
      obj.demands = [];
      obj.date = "2019-11-30";
      obj.clientId = 1;
      console.log(obj);
      if (!err) {
        dispatch({
          type: 'addUserApplication/submitRegularForm',
          payload: obj,
        });
      }
    });
  };

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };


  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...formItemLayoutWithOutLabel}
        label={index === 0 ? 'Demands' : ''}
        required={false}
        key={k}
      >
        {getFieldDecorator(`demands[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Please input passenger's name or delete this field.",
            },
          ],
        })(<div>
          <Input placeholder="Demand" style={{ width: '60%', marginRight: 8 }} />
          <InputNumber min={10} placeholder="Value" />
        </div>)}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <PageHeaderWrapper content={<FormattedMessage id="adduserapplication.basic.description" />}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="adduserapplication.title.label" />}>
              {getFieldDecorator('purpose', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'adduserapplication.required' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'adduserapplication.title.placeholder' })} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Amount Requested">
              {getFieldDecorator('amountRequested', {
                rules: [
                  {
                  required: true,
                    message: formatMessage({ id: 'adduserapplication.required' }),
                  },
                ],
              })(<InputNumber min={30} placeholder="Amount Requested"/>)}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="adduserapplication.projectdesc.label" />}>
              {getFieldDecorator('projectDescription', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'adduserapplication.required' }),
                  },
                ],
              })(<TextArea rows={4} placeholder={formatMessage({ id: 'adduserapplication.projectdesc.placeholder' })} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="adduserapplication.marketDescription.label" />}>
              {getFieldDecorator('marketDescription', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'adduserapplication.required' }),
                  },
                ],
              })(<TextArea rows={4} placeholder={formatMessage({ id: 'adduserapplication.marketDescription.placeholder' })} />)}
            </FormItem>

            <FormItem {...formItemLayout} label={<FormattedMessage id="adduserapplication.repayDescription.label" />}>
              {getFieldDecorator('repayDescription', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'adduserapplication.required' }),
                  },
                ],
              })(<TextArea rows={4} placeholder={formatMessage({ id: 'adduserapplication.repayDescription.placeholder' })} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="adduserapplication.termsIn.label" />}>
              {getFieldDecorator('termsIn', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'adduserapplication.required' }),
                  },
                ],
              })(
                <DatePicker />,
              )}
            </FormItem>
            <br/><br/>
            <Divider orientation="left">Add Demands</Divider>
            {formItems}
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                <Icon type="plus" /> Add field
              </Button>
            </Form.Item>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="adduserapplication.form.submit" />
              </Button>
              <Button style={{ marginLeft: 8 }}>
                <FormattedMessage id="adduserapplication.form.save" />
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<AddUserApplicationProps>()(
  connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
    submitting: loading.effects['addUserApplication/submitRegularForm'],
  }))(AddUserApplication),
);
