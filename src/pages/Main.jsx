import React, { useEffect, useState } from "react";
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
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import Header from "../components/Header";
import { getCars } from "../api/entities/cars";

import AddFuelRecordModal from "../UI/widgets/AddFuelRecordModal";
import { removeFuelExpence } from "../api/entities/fuelExpence";
import AddCarModal from "../UI/widgets/AddCarModal";

const Main = () => {
  const [cars, setCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState(cars[0]?.id || "");
  const [addRecordModal, setAddRecordModal] = useState(false);
  const [addCarModal, setAddCarModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const [carForm] = Form.useForm();

  const selectedCar = cars.find((c) => c.id === selectedCarId) || cars[0];
  const fuelExpencess = selectedCar?.fuelExpencess || [];

  // Stats calculations
  const lastRecord = fuelExpencess[fuelExpencess.length - 1];
  const prevRecord = fuelExpencess[fuelExpencess.length - 2];
  const lastMileage = lastRecord?.mileage || selectedCar?.millage || 0;
  const mileageDiff = prevRecord ? lastMileage - prevRecord.currentMillage : 0;
  const lastConsumption =
    lastRecord?.liters && prevRecord?.mileage
      ? (
          (lastRecord.liters / (lastRecord.mileage - prevRecord.mileage)) *
          100
        ).toFixed(1)
      : selectedCar?.consumption.toFixed(1) || "0";

  const totalFuelCost = fuelExpencess.reduce((sum, r) => sum + r.cost, 0);

  const totalLiters = fuelExpencess.reduce((sum, r) => sum + r.liters, 0);
  const avgConsumptionOverall =
    fuelExpencess.length && prevRecord
      ? (
          (totalLiters / (lastMileage - (fuelExpencess[0]?.mileage || 0))) *
          100
        ).toFixed(1)
      : selectedCar?.consumption.toFixed(1) || "0";

  // Service days left
  const nextServiceDate = dayjs(selectedCar?.nextMaintance);
  const daysToService = nextServiceDate.diff(dayjs(), "day");
  const serviceStatus =
    daysToService <= 0 ? "overdue" : daysToService <= 14 ? "warning" : "good";

  const fetchCars = () => {
    setLoading(true);

    getCars()
      .then((res) => {
        console.log(res);

        setCars(res);
      })
      .catch((e) => {
        message.error("Ошибка получения автомобилей");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDeleteRecord = (recordId) => {
    console.log("recordId", recordId);

    const updatedCars = cars.map((car) => {
      const filtered = car.fuelExpencess.filter((r) => r.id !== recordId);
      return { ...car, fuelExpencess: filtered };
    });

    setCars(updatedCars);

    removeFuelExpence({ id: recordId })
      .then((res) => {
        message.success("Запись удалена");
      })
      .catch((e) => {
        message.error("Не удалось удалить запись");
      });
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
      dataIndex: "currentMillage",
      key: "currentMillage",
      render: (val) => val,
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
      render: (val) => `${val} ₽`,
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
      render: (_, record) => {
        console.log("record =>>", record);

        return (
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRecord(record.id)}
          />
        );
      },
    },
  ];

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
                loading={loading}
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
                        {selectedCar?.fuelExpencess?.reduce(
                          (sum, c) => sum + c.liters,
                          0
                        ) / selectedCar?.fuelExpencess?.length || 0}
                        л/100км
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
              <Card
                loading={loading}
                className="!bg-white/5 !border-white/10 !rounded-2xl !backdrop-blur-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                      Текущий пробег
                    </p>
                    <p className="text-white text-3xl font-semibold">
                      {selectedCar?.millage?.toLocaleString()}
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

              <Card
                loading={loading}
                className="!bg-white/5 !border-white/10 !rounded-2xl !backdrop-blur-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                      Средний расход
                    </p>
                    <p className="text-white text-3xl font-semibold">
                      {(selectedCar?.fuelExpencess?.reduce(
                        (sum, c) => sum + c.liters,
                        0
                      ) / selectedCar?.fuelExpencess?.length) || 0}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">л/100км</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center"></div>
                </div>
                <Progress
                  percent={
                    (parseFloat(lastConsumption) /
                      (selectedCar?.consumption || 10)) *
                    30
                  }
                  showInfo={false}
                  strokeColor="#10b981"
                  trailColor="rgba(255,255,255,0.1)"
                  className="mt-3"
                />
              </Card>

              <Card
                loading={loading}
                className="!bg-white/5 !border-white/10 !rounded-2xl !backdrop-blur-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                      Затраты на топливо
                    </p>
                    <p className="text-white text-3xl font-semibold">
                      {totalFuelCost}
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

              <Card
                loading={loading}
                className="!bg-white/5 !border-white/10 !rounded-2xl !backdrop-blur-sm"
              >
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
                      {dayjs(selectedCar?.nextMaintance).format("DD.MM.YYYY")}
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
                      count={fuelExpencess.length}
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
                  {fuelExpencess.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16 text-gray-400"
                    >
                      <p>Нет данных о заправках. Добавьте первую запись!</p>
                    </motion.div>
                  ) : (
                    <Table
                      loading={loading}
                      columns={tableColumns}
                      dataSource={[...fuelExpencess].sort(
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

      <AddFuelRecordModal
        open={addRecordModal}
        onClose={() => setAddRecordModal(false)}
        selectedCar={selectedCar}
        fetchCars={fetchCars}
      />

      <AddCarModal
        open={addCarModal}
        onClose={() => setAddCarModal(false)}
        fetchCars={fetchCars}
      />

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
