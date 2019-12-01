import { Form, Input, Modal } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';

const FormItem = Form.Item;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (fieldsValue: { desc: string }) => void;
  handleModalVisible: () => void;
}
const CreateForm: React.FC<CreateFormProps> = props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="Create"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="description">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: 'Please enter a rule description of at least five characters！', min: 5 }],
        })(<Input placeholder="Please enter" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
