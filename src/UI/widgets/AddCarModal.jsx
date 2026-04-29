import React, { useState } from "react";
import { Button, Input, Modal, Form, DatePicker, Select, message } from "antd";
import { motion } from "framer-motion";
import { CarOutlined } from "@ant-design/icons";
import { createCar } from "../../api/entities/cars";

const AddCarModal = ({ open, onClose, fetchCars }) => {
  const [carForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleAddCar = (values) => {
    setLoading(true);

    createCar(values)
      .then((res) => {
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
      title={
        <span>
          <CarOutlined className="mr-2" /> Добавить автомобиль
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      modalRender={(node) => (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {node}
        </motion.div>
      )}
      className="[&_.ant-modal-content]:!bg-[#0a0a0f] [&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-white/10 [&_.ant-modal-header]:!bg-transparent [&_.ant-modal-header]:!border-b-white/10 [&_.ant-modal-title]:!text-white"
    >
      <Form form={carForm} layout="vertical" onFinish={handleAddCar}>
        <Form.Item
          name="name"
          label="Модель"
          rules={[{ required: true }]}
          className="[&_.ant-form-item-label_label]:!text-gray-300"
        >
          <Input
            placeholder="Tesla Model 3"
            className="!bg-white/5 !border-white/10 !text-white"
          />
        </Form.Item>
        <Form.Item
          name="number"
          label="Госномер"
          rules={[{ required: true }]}
          className="[&_.ant-form-item-label_label]:!text-gray-300"
        >
          <Input
            placeholder="A123BC"
            className="!bg-white/5 !border-white/10 !text-white"
          />
        </Form.Item>
        <Form.Item
          name="millage"
          label="Начальный пробег (км)"
          rules={[{ required: true }]}
          className="[&_.ant-form-item-label_label]:!text-gray-300"
        >
          <Input
            type="number"
            placeholder="0"
            className="!bg-white/5 !border-white/10 !text-white"
          />
        </Form.Item>
        <Form.Item
          name="consumption"
          label="Средний расход (л/100км)"
          rules={[{ required: true }]}
          className="[&_.ant-form-item-label_label]:!text-gray-300"
        >
          <Input
            type="number"
            step="0.1"
            placeholder="10.5"
            className="!bg-white/5 !border-white/10 !text-white"
          />
        </Form.Item>
        <Form.Item
          name="lastMaintanceDate"
          label="Дата последнего ТО"
          rules={[{ required: true }]}
          className="[&_.ant-form-item-label_label]:!text-gray-300"
        >
          <DatePicker
            format="DD.MM.YYYY"
            className="!bg-white/5 !border-white/10 !text-white w-full"
          />
        </Form.Item>
        <Form.Item
          name="nextMaintance"
          label="Дата следующего ТО"
          rules={[{ required: true }]}
          className="[&_.ant-form-item-label_label]:!text-gray-300"
        >
          <DatePicker
            format="DD.MM.YYYY"
            className="!bg-white/5 !border-white/10 !text-white w-full"
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
            Добавить авто
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCarModal;
