import { Button, Input, Modal, Form, DatePicker, Select, message } from "antd";
import { motion } from "framer-motion";

import React, { useEffect, useState } from "react";
import { createFuelExpence } from "../../api/entities/fuelExpence";

const AddFuelRecordModal = ({ open, onClose, selectedCar, fetchCars }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedCar) return;
    
    form.setFieldValue("currentMillage", selectedCar.millage)
  
  }, [selectedCar]);

  const handleAddRecord = (values) => {
    setLoading(true);

    console.log("fuel values", values);

    createFuelExpence({ ...values, carId: selectedCar?.id })
      .then((res) => {
        console.log("res", res);

        fetchCars();
        onClose();
      })
      .catch((e) => {
        message.error(e?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      title={<span></span>}
      open={open}
      onCancel={onClose}
      footer={null}
      modalRender={(node) => (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
        >
          {node}
        </motion.div>
      )}
      className="[&_.ant-modal-content]:!bg-[#0a0a0f] [&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-white/10 [&_.ant-modal-header]:!bg-transparent [&_.ant-modal-header]:!border-b-white/10 [&_.ant-modal-title]:!text-white"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleAddRecord}
        initialValues={{ fullTank: true }}
      >
        <Form.Item
          name="date"
          label="Дата"
          rules={[{ required: true }]}
          className="[&_.ant-form-item-label_label]:!text-gray-300"
        >
          <DatePicker
            className="!bg-white/5 !border-white/10 !text-white w-full"
            format="DD.MM.YYYY"
          />
        </Form.Item>
        <Form.Item
          name="currentMillage"
          label="Пробег (км)"
          rules={[
            {
              required: true,
            },
          ]}
          className="[&_.ant-form-item-label_label]:!text-gray-300"
        >
          <Input
            type="number"
            placeholder="текущий пробег"
            suffix="км"
            className="!bg-white/5 !border-white/10 !text-white"
          />
        </Form.Item>
        <Form.Item
          name="liters"
          label="Литры"
          rules={[{ required: true, min: 0.1 }]}
          className="[&_.ant-form-item-label_label]:!text-gray-300"
        >
          <Input
            type="number"
            step="0.1"
            placeholder="объем топлива"
            suffix="л"
            className="!bg-white/5 !border-white/10 !text-white"
          />
        </Form.Item>
        <Form.Item
          name="cost"
          label="Стоимость (₽)"
          rules={[{ required: true }]}
          className="[&_.ant-form-item-label_label]:!text-gray-300"
        >
          <Input
            type="number"
            placeholder="сумма"
            suffix="₽"
            className="!bg-white/5 !border-white/10 !text-white"
          />
        </Form.Item>
        <Form.Item
          name="fullTank"
          label="Полный бак"
          className="[&_.ant-form-item-label_label]:!text-gray-300"
        >
          <Select
            options={[
              { value: true, label: "Да" },
              { value: false, label: "Нет" },
            ]}
            className="!bg-white/5"
          />
        </Form.Item>
        <Form.Item>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            block
            className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/20 !rounded-full !h-11"
          >
            Сохранить запись
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddFuelRecordModal;
