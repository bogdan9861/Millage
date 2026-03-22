import React, { useState } from "react";
import {
  Card,
  Button,
  Table,
  Tag,
  Progress,
  Input,
  Modal,
  Form,
  DatePicker,
  message,
  Tooltip,
  Badge,
  Avatar,
  Select,
} from "antd";
import {
  CarOutlined,
  PlusOutlined,
  DashboardOutlined,
  HistoryOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  ArrowUpOutlined,
  LineChartOutlined,
  CalendarOutlined,
  DeleteOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
  HomeOutlined,
  BarChartOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import Header from "../components/Header";

// Mock data
const initialCars = [
  {
    id: "1",
    name: "Tesla Model 3",
    plate: "A123BC",
    currentMileage: 12450,
    avgConsumption: 16.2,
    lastService: "2025-01-15",
    nextService: "2025-07-15",
    color: "#3b82f6",
    fuelRecords: [
      {
        id: "f1",
        date: "2025-03-01",
        mileage: 11800,
        liters: 45.2,
        cost: 2350,
        fullTank: true,
      },
      {
        id: "f2",
        date: "2025-03-10",
        mileage: 12150,
        liters: 42.8,
        cost: 2225,
        fullTank: true,
      },
      {
        id: "f3",
        date: "2025-03-20",
        mileage: 12450,
        liters: 44.5,
        cost: 2314,
        fullTank: true,
      },
    ],
  },
  {
    id: "2",
    name: "BMW X5",
    plate: "B456DE",
    currentMileage: 87320,
    avgConsumption: 11.8,
    lastService: "2024-12-10",
    nextService: "2025-06-10",
    color: "#10b981",
    fuelRecords: [
      {
        id: "f4",
        date: "2025-02-28",
        mileage: 86500,
        liters: 68.3,
        cost: 4100,
        fullTank: true,
      },
      {
        id: "f5",
        date: "2025-03-12",
        mileage: 87100,
        liters: 65.1,
        cost: 3906,
        fullTank: true,
      },
      {
        id: "f6",
        date: "2025-03-25",
        mileage: 87320,
        liters: 22.5,
        cost: 1350,
        fullTank: false,
      },
    ],
  },
  {
    id: "3",
    name: "Mercedes E-Class",
    plate: "C789FG",
    currentMileage: 45200,
    avgConsumption: 9.5,
    lastService: "2025-02-20",
    nextService: "2025-08-20",
    color: "#f59e0b",
    fuelRecords: [],
  },
];

const Main = () => {
  const [cars, setCars] = useState(initialCars);
  const [selectedCarId, setSelectedCarId] = useState(cars[0]?.id || "");
  const [addRecordModal, setAddRecordModal] = useState(false);
  const [addCarModal, setAddCarModal] = useState(false);

  const [form] = Form.useForm();
  const [carForm] = Form.useForm();

  const selectedCar = cars.find((c) => c.id === selectedCarId) || cars[0];
  const fuelRecords = selectedCar?.fuelRecords || [];

  // Stats calculations
  const lastRecord = fuelRecords[fuelRecords.length - 1];
  const prevRecord = fuelRecords[fuelRecords.length - 2];
  const lastMileage = lastRecord?.mileage || selectedCar?.currentMileage || 0;
  const mileageDiff = prevRecord ? lastMileage - prevRecord.mileage : 0;
  const lastConsumption =
    lastRecord?.liters && prevRecord?.mileage
      ? (
          (lastRecord.liters / (lastRecord.mileage - prevRecord.mileage)) *
          100
        ).toFixed(1)
      : selectedCar?.avgConsumption.toFixed(1) || "0";

  const totalFuelCost = fuelRecords.reduce((sum, r) => sum + r.cost, 0);
  const totalLiters = fuelRecords.reduce((sum, r) => sum + r.liters, 0);
  const avgConsumptionOverall =
    fuelRecords.length && prevRecord
      ? (
          (totalLiters / (lastMileage - (fuelRecords[0]?.mileage || 0))) *
          100
        ).toFixed(1)
      : selectedCar?.avgConsumption.toFixed(1) || "0";

  // Service days left
  const nextServiceDate = dayjs(selectedCar?.nextService);
  const daysToService = nextServiceDate.diff(dayjs(), "day");
  const serviceStatus =
    daysToService <= 0 ? "overdue" : daysToService <= 14 ? "warning" : "good";

  // Handlers
  const handleAddRecord = (values) => {
    const newRecord = {
      id: Date.now().toString(),
      date: values.date.format("YYYY-MM-DD"),
      mileage: values.mileage,
      liters: values.liters,
      cost: values.cost,
      fullTank: values.fullTank || true,
    };

    const updatedCars = cars.map((car) => {
      if (car.id === selectedCarId) {
        const updatedRecords = [...car.fuelRecords, newRecord].sort(
          (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix()
        );
        const newMileage = newRecord.mileage;
        const newAvg =
          updatedRecords.length > 1
            ? updatedRecords.reduce((sum, r, idx) => {
                if (idx === 0) return 0;
                const prev = updatedRecords[idx - 1];
                const consumption =
                  (r.liters / (r.mileage - prev.mileage)) * 100;
                return sum + consumption;
              }, 0) /
              (updatedRecords.length - 1)
            : car.avgConsumption;

        return {
          ...car,
          currentMileage: newMileage,
          avgConsumption: parseFloat(newAvg.toFixed(1)),
          fuelRecords: updatedRecords,
        };
      }
      return car;
    });

    setCars(updatedCars);
    setAddRecordModal(false);
    form.resetFields();
    message.success("Заправка добавлена");
  };

  const handleAddCar = (values) => {
    const newCar = {
      id: Date.now().toString(),
      name: values.name,
      plate: values.plate,
      currentMileage: values.currentMileage,
      avgConsumption: values.avgConsumption,
      lastService: values.lastService.format("YYYY-MM-DD"),
      nextService: values.nextService.format("YYYY-MM-DD"),
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      fuelRecords: [],
    };
    setCars([...cars, newCar]);
    setSelectedCarId(newCar.id);
    setAddCarModal(false);
    carForm.resetFields();
    message.success("Автомобиль добавлен");
  };

  const handleDeleteRecord = (recordId) => {
    const updatedCars = cars.map((car) => {
      if (car.id === selectedCarId) {
        const filtered = car.fuelRecords.filter((r) => r.id !== recordId);
        return { ...car, fuelRecords: filtered };
      }
      return car;
    });
    setCars(updatedCars);
    message.success("Запись удалена");
  };

  const tableColumns = [
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD.MM.YYYY"),
    },
    {
      title: "Пробег, км",
      dataIndex: "mileage",
      key: "mileage",
      render: (val) => val.toLocaleString(),
    },
    {
      title: "Литры",
      dataIndex: "liters",
      key: "liters",
      render: (val) => `${val} л`,
    },
    {
      title: "Стоимость, ₽",
      dataIndex: "cost",
      key: "cost",
      render: (val) => `${val.toLocaleString()} ₽`,
    },
    {
      title: "Полный бак",
      dataIndex: "fullTank",
      key: "fullTank",
      render: (val) => (val ? <Tag color="green">Да</Tag> : <Tag>Нет</Tag>),
    },
    {
      title: "Действия",
      key: "action",
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteRecord(record.id)}
        />
      ),
    },
  ];

  const navItems = [
    { key: "dashboard", label: "Дашборд", icon: <DashboardOutlined /> },
    { key: "trips", label: "Поездки", icon: <CarOutlined /> },
    { key: "statistics", label: "Статистика", icon: <BarChartOutlined /> },
    { key: "reports", label: "Отчеты", icon: <FileTextOutlined /> },
    { key: "settings", label: "Настройки", icon: <SettingOutlined /> },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Menu */}
      <Header />
      {/* Main Content with padding for fixed navbar */}
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Background accents */}
          <div className="fixed top-0 left-0 right-0 h-[300px] bg-gradient-radial from-white/5 via-transparent to-transparent pointer-events-none" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10"
          >
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className="flex justify-between items-end flex-wrap gap-4 mb-8"
            >
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight mb-2"
                >
                  Учет пробега
                </motion.h1>
                <p className="text-gray-500 text-sm">
                  Минимализм. Анимации. Контроль.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setAddRecordModal(true)}
                  className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/20 !rounded-full !h-11 !font-medium"
                >
                  Добавить заправку
                </Button>
                <Button
                  icon={<CarOutlined />}
                  onClick={() => setAddCarModal(true)}
                  className="!bg-black !border-white/20 !text-gray-300 hover:!text-white hover:!border-white/40 !rounded-full !h-11"
                >
                  Новый авто
                </Button>
              </div>
            </motion.div>

            {/* Car Selector */}
            <motion.div variants={itemVariants} className="mb-8">
              <Card
                className="!bg-white/5 !border-white/10 !backdrop-blur-sm !rounded-2xl"
                bodyStyle={{ padding: "16px 24px" }}
              >
                <div className="flex gap-4 flex-wrap items-center justify-between">
                  <div className="flex gap-3 flex-wrap">
                    {cars.map((car) => (
                      <motion.div
                        key={car.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedCarId(car.id)}
                        className={`
                          cursor-pointer px-5 py-2 rounded-full transition-all duration-200
                          flex items-center gap-2.5
                          ${
                            selectedCarId === car.id
                              ? "bg-white/15 border border-white/20"
                              : "bg-transparent border border-white/10 hover:border-white/20"
                          }
                        `}
                      >
                        <Avatar
                          icon={<CarOutlined />}
                          style={{
                            background: car.color,
                            width: 28,
                            height: 28,
                          }}
                        />
                        <span className="font-medium text-sm">{car.name}</span>
                        <span className="text-xs text-gray-400">
                          {car.plate}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Tooltip title="Средний расход">
                      <Tag
                        color="blue"
                        className="!bg-white/5 !border-white/10 !text-gray-300 !rounded-full !px-3 !py-1"
                      >
                        {selectedCar?.avgConsumption} л/100км
                      </Tag>
                    </Tooltip>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
            >
              <Card className="!bg-white/5 !border-white/10 !rounded-2xl !backdrop-blur-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                      Текущий пробег
                    </p>
                    <p className="text-white text-3xl font-semibold">
                      {selectedCar?.currentMileage?.toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">км</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <CarOutlined className="text-blue-400 text-xl" />
                  </div>
                </div>
                {mileageDiff > 0 && (
                  <div className="mt-3 text-xs text-green-400">
                    <ArrowUpOutlined /> +{mileageDiff} км за период
                  </div>
                )}
              </Card>

              <Card className="!bg-white/5 !border-white/10 !rounded-2xl !backdrop-blur-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                      Средний расход
                    </p>
                    <p className="text-white text-3xl font-semibold">
                      {lastConsumption}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">л/100км</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center"></div>
                </div>
                <Progress
                  percent={
                    (parseFloat(lastConsumption) /
                      (selectedCar?.avgConsumption || 10)) *
                    30
                  }
                  showInfo={false}
                  strokeColor="#10b981"
                  trailColor="rgba(255,255,255,0.1)"
                  className="mt-3"
                />
              </Card>

              <Card className="!bg-white/5 !border-white/10 !rounded-2xl !backdrop-blur-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                      Затраты на топливо
                    </p>
                    <p className="text-white text-3xl font-semibold">
                      {totalFuelCost.toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">₽ всего</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <LineChartOutlined className="text-orange-400 text-xl" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-400">
                  {totalLiters.toFixed(1)} литров
                </div>
              </Card>

              <Card className="!bg-white/5 !border-white/10 !rounded-2xl !backdrop-blur-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                      Следующее ТО
                    </p>
                    <p
                      className={`text-2xl font-semibold ${
                        serviceStatus === "overdue"
                          ? "text-red-400"
                          : serviceStatus === "warning"
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      {Math.abs(daysToService)} дн.
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      {dayjs(selectedCar?.nextService).format("DD.MM.YYYY")}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <CalendarOutlined className="text-purple-400 text-xl" />
                  </div>
                </div>
                {daysToService <= 0 && (
                  <div className="mt-3 text-xs text-red-400">Просрочено!</div>
                )}
              </Card>
            </motion.div>

            {/* History Table */}
            <motion.div variants={itemVariants}>
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <HistoryOutlined className="text-gray-400" />
                    <span className="font-medium text-white">
                      История заправок
                    </span>
                    <Badge
                      count={fuelRecords.length}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        color: "#9ca3af",
                      }}
                    />
                  </div>
                }
                className="!bg-white/5 !border-white/10 !rounded-2xl !backdrop-blur-sm"
                headStyle={{
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  padding: "16px 24px",
                }}
                bodyStyle={{ padding: 0 }}
              >
                <AnimatePresence mode="wait">
                  {fuelRecords.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16 text-gray-400"
                    >
                      <p>Нет данных о заправках. Добавьте первую запись!</p>
                    </motion.div>
                  ) : (
                    <Table
                      columns={tableColumns}
                      dataSource={[...fuelRecords].sort(
                        (a, b) => dayjs(b.date).unix() - dayjs(a.date).unix()
                      )}
                      rowKey="id"
                      pagination={{
                        pageSize: 5,
                        showSizeChanger: false,
                        style: { marginRight: 16 },
                      }}
                      locale={{ emptyText: "Нет записей" }}
                      className="[&_.ant-table]:!bg-transparent [&_.ant-table-thead_.ant-table-cell]:!bg-transparent [&_.ant-table-thead_.ant-table-cell]:!text-gray-400 [&_.ant-table-tbody_.ant-table-cell]:!text-gray-300 [&_.ant-table-tbody_.ant-table-row:hover_.ant-table-cell]:!bg-white/5 [&_.ant-table-cell]:!border-white/10"
                    />
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>

            {/* Footer Info */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex justify-between flex-wrap gap-4 text-xs text-gray-500 border-t border-white/10 pt-6"
            >
              <div>
                <ThunderboltOutlined className="mr-1" /> Экономия до 15% при
                регулярном учете
              </div>
              <div>
                <DashboardOutlined className="mr-1" /> Все данные в реальном
                времени
              </div>
              <div>
                <SettingOutlined className="mr-1" /> Минималистичный дизайн
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Add Record Modal */}
      <Modal
        title={<span></span>}
        open={addRecordModal}
        onCancel={() => setAddRecordModal(false)}
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
            name="mileage"
            label="Пробег (км)"
            rules={[
              {
                required: true,
                type: "number",
                min: selectedCar?.currentMileage || 0,
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
            rules={[{ required: true, type: "number", min: 0.1 }]}
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
            rules={[{ required: true, type: "number", min: 1 }]}
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

      {/* Add Car Modal */}
      <Modal
        title={
          <span>
            <CarOutlined className="mr-2" /> Добавить автомобиль
          </span>
        }
        open={addCarModal}
        onCancel={() => setAddCarModal(false)}
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
            name="plate"
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
            name="currentMileage"
            label="Начальный пробег (км)"
            rules={[{ required: true, type: "number" }]}
            className="[&_.ant-form-item-label_label]:!text-gray-300"
          >
            <Input
              type="number"
              placeholder="0"
              className="!bg-white/5 !border-white/10 !text-white"
            />
          </Form.Item>
          <Form.Item
            name="avgConsumption"
            label="Средний расход (л/100км)"
            rules={[{ required: true, type: "number" }]}
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
            name="lastService"
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
            name="nextService"
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

      {/* Add custom gradient background */}
      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(
            circle at 20% 30%,
            rgba(255, 255, 255, 0.03),
            transparent
          );
        }
      `}</style>
    </div>
  );
};

export default Main;
