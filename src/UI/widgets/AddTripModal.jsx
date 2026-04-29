import {
  Button,
  Input,
  Modal,
  Form,
  DatePicker,
  Select,
  message,
  Rate,
} from "antd";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { getCars } from "../../api/entities/cars";
import {
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FlagOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { createTrip } from "../../api/entities/trips";

const AddTripModal = ({ open, onClose, setTrips, cars, carsLoading }) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const handleAddTrip = (values) => {
    setLoading(true);

    createTrip(values)
      .then((res) => {
        setTrips((prev) => [res, ...prev]);
        onClose();
        form.resetFields();
        message.success("Поездка добавлена");
      })
      .catch((e) => {
        message.error("Не удалось добавить поездку");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      title={
        <span>
          <PlusOutlined className="mr-2 text-blue-400" /> Новая поездка
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
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
      <Form form={form} layout="vertical" onFinish={handleAddTrip}>
        <Form.Item
          name="carId"
          label="Автомобиль"
          rules={[{ required: true }]}
          className="[&_.ant-form-item-label_label]:!text-gray-300"
        >
          <Select
            loading={carsLoading}
            placeholder="Выберите автомобиль"
            className="!bg-white/5"
            onChange={(value) => {
              console.log(cars.find((c) => c.id === value).millage);

              form.setFieldValue(
                "startMillage",
                cars.find((c) => c.id === value).millage
              );
            }}
          >
            {cars?.map((car) => (
              <Select.Option key={car.id} value={car.id}>
                {car.name} ({car.number})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
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
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="startPoint"
            label="Начало маршрута"
            rules={[{ required: true }]}
            className="[&_.ant-form-item-label_label]:!text-gray-300"
          >
            <Input
              placeholder="Адрес или точка"
              prefix={<EnvironmentOutlined />}
              className="!bg-white/5 !border-white/10 !text-white"
            />
          </Form.Item>
          <Form.Item
            name="endPoint"
            label="Конец маршрута"
            rules={[{ required: true }]}
            className="[&_.ant-form-item-label_label]:!text-gray-300"
          >
            <Input
              placeholder="Адрес или точка"
              prefix={<FlagOutlined />}
              className="!bg-white/5 !border-white/10 !text-white"
            />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="startMillage"
            label="Пробег начала (км)"
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
            name="endMillage"
            label="Пробег конца (км)"
            rules={[{ required: true }]}
            className="[&_.ant-form-item-label_label]:!text-gray-300"
          >
            <Input
              type="number"
              placeholder="0"
              className="!bg-white/5 !border-white/10 !text-white"
            />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="duration"
            label="Длительность (мин)"
            rules={[{ required: true }]}
            className="[&_.ant-form-item-label_label]:!text-gray-300"
          >
            <Input
              type="number"
              placeholder="60"
              prefix={<ClockCircleOutlined />}
              className="!bg-white/5 !border-white/10 !text-white"
            />
          </Form.Item>
          <Form.Item
            name="fuelWaste"
            label="Израсходовано топлива (л)"
            rules={[{ required: true }]}
            className="[&_.ant-form-item-label_label]:!text-gray-300"
          >
            <Input
              type="number"
              step="0.1"
              placeholder="0"
              className="!bg-white/5 !border-white/10 !text-white"
            />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="fuelCost"
            label="Стоимость топлива (₽)"
            rules={[{ required: true }]}
            className="[&_.ant-form-item-label_label]:!text-gray-300"
          >
            <Input
              type="number"
              placeholder="0"
              prefix={<DollarOutlined />}
              className="!bg-white/5 !border-white/10 !text-white"
            />
          </Form.Item>
          <Form.Item
            name="routeType"
            label="Тип маршрута"
            rules={[{ required: true }]}
            className="[&_.ant-form-item-label_label]:!text-gray-300"
          >
            <Select placeholder="Выберите тип" className="!bg-white/5">
              <Select.Option value="CITY">Городской</Select.Option>
              <Select.Option value="MOTORWAY">Трасса</Select.Option>
              <Select.Option value="MIXED">Смешанный</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="weather"
            label="Погода"
            className="[&_.ant-form-item-label_label]:!text-gray-300"
          >
            <Select placeholder="Выберите погоду" className="!bg-white/5">
              <Select.Option value="SUNNY">☀️ Солнечно</Select.Option>
              <Select.Option value="CLOUDY">☁️ Облачно</Select.Option>
              <Select.Option value="RAINY">🌧️ Дождь</Select.Option>
              <Select.Option value="SNOWY">❄️ Снег</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="rating"
            label="Рейтинг поездки"
            rules={[{ required: true }]}
            className="[&_.ant-form-item-label_label]:!text-gray-300"
          >
            <Rate />
          </Form.Item>
        </div>
        <Form.Item
          name="message"
          label="Заметки"
          className="[&_.ant-form-item-label_label]:!text-gray-300"
        >
          <Input.TextArea
            rows={3}
            placeholder="Дополнительные заметки..."
            className="!bg-white/5 !border-white/10 !text-white"
          />
        </Form.Item>
        <Form.Item>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            block
            className="!bg-gradient-to-r !from-blue-500 !to-purple-600 !border-none !rounded-full !h-11"
          >
            Сохранить поездку
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTripModal;
