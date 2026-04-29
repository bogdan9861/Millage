import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Table,
  Tag,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Tooltip,
  Progress,
  Avatar,
  Badge,
  Statistic,
  Rate,
  Timeline,
  Divider,
} from "antd";
import {
  CarOutlined,
  PlusOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FlagOutlined,
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
  FireOutlined,
  SafetyOutlined,
  StarOutlined,
  ShareAltOutlined,
  FilterOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import Header from "../components/Header";
import { getTrips } from "../api/entities/trips";
import AddTripModal from "../UI/widgets/AddTripModal";
import { getCars } from "../api/entities/cars";
import ViewTripModal from "../UI/widgets/ViewTripModal";

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [addTripModal, setAddTripModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [selectedCarFilter, setSelectedCarFilter] = useState("all");
  const [routeTypeFilter, setRouteTypeFilter] = useState("all");
  const [form] = Form.useForm();
  const [tripsLoading, setTripsLoading] = useState(false);
  const [carsLoading, setCarsLoading] = useState(false);

  const [cars, setCars] = useState([]);

  useEffect(() => {
    setCarsLoading(true);

    getCars()
      .then((res) => {
        setCars(res);
      })
      .catch((e) => {
        message.error(e?.message);
      })
      .finally(() => {
        setCarsLoading(false);
      });
  }, []);

  useEffect(() => {
    setTripsLoading(true);

    getTrips()
      .then((res) => {
        setTrips(res);
      })
      .catch((e) => {
        message.error(e?.message);
      })
      .finally(() => {
        setTripsLoading(false);
      });
  }, []);

  // Filtered trips
  const filteredTrips = trips.filter((trip) => {
    if (selectedCarFilter !== "all" && trip.carId !== selectedCarFilter)
      return false;
    if (routeTypeFilter !== "all" && trip.routeType !== routeTypeFilter)
      return false;
    return true;
  });

  // Statistics
  const totalTrips = filteredTrips.length;
  const totalDistance = filteredTrips.reduce(
    (sum, trip) => sum + (trip?.endMillage - trip.startMillage),
    0
  );
  const totalFuelCost = filteredTrips.reduce(
    (sum, trip) => sum + trip.fuelCost,
    0
  );
  const totalDuration = filteredTrips.reduce(
    (sum, trip) => sum + trip.duration,
    0
  );
  const avgConsumption = (
    filteredTrips.reduce(
      (sum, trip) =>
        sum + (trip.fuelWaste / (trip?.endMillage - trip.startMillage)) * 100,
      0
    ) / totalTrips
  ).toFixed(1);
  const avgRating = (
    filteredTrips.reduce((sum, trip) => sum + trip.rating, 0) / totalTrips
  ).toFixed(1);

  const handleAddTrip = (values) => {
    const newTrip = {
      id: Date.now().toString(),
      date: values.date.format("YYYY-MM-DD"),
      startLocation: values.startLocation,
      endLocation: values.endLocation,
      startMileage: values.startMileage,
      endMileage: values.endMileage,
      distance: values.endMileage - values.startMileage,
      duration: values.duration,
      fuelConsumption: values.fuelConsumption,
      fuelCost: values.fuelCost,
      avgSpeed:
        (values.endMileage - values.startMileage) / (values.duration / 60),
      routeType: values.routeType,
      weather: values.weather,
      rating: values.rating,
      notes: values.notes,
      carId: values.carId,
      carName: cars.find((c) => c.id === values.carId)?.name || "Неизвестно",
      carPlate: cars.find((c) => c.id === values.carId)?.plate || "",
    };

    setTrips([newTrip, ...trips]);
    setAddTripModal(false);
    form.resetFields();
    message.success("Поездка добавлена");
  };

  const handleDeleteTrip = (tripId) => {
    Modal.confirm({
      title: "Удалить поездку?",
      content: "Это действие нельзя отменить",
      onOk: () => {
        setTrips(trips.filter((trip) => trip.id !== tripId));
        message.success("Поездка удалена");
      },
      okButtonProps: { danger: true },
      okText: "Удалить",
      cancelText: "Отмена",
    });
  };

  const handleViewTrip = (trip) => {
    setSelectedTrip(trip);
    setViewModal(true);
  };

  const getRouteTypeColor = (type) => {
    switch (type) {
      case "город":
        return "blue";
      case "трасса":
        return "green";
      case "смешанный":
        return "orange";
      default:
        return "default";
    }
  };

  const getWeatherIcon = (weather) => {
    switch (weather) {
      case "солнечно":
        return "☀️";
      case "облачно":
        return "☁️";
      case "дождь":
        return "🌧️";
      case "снег":
        return "❄️";
      default:
        return "🌤️";
    }
  };

  const getRatingStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const tableColumns = [
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD.MM.YYYY"),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      defaultSortOrder: "descend",
    },
    {
      title: "Маршрут",
      key: "route",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-xs">
            <EnvironmentOutlined className="text-green-400" />
            <span className="text-gray-300 truncate max-w-[150px]">
              {record.startPoint}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <FlagOutlined className="text-red-400" />
            <span className="text-gray-300 truncate max-w-[150px]">
              {record.endPoint}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Расстояние",
      render: (record) => `${record?.endMillage - record.startMillage} км`,
    },
    {
      title: "Длительность",
      dataIndex: "duration",
      key: "duration",
      render: (min) => {
        const hours = Math.floor(min / 60);
        const minutes = min % 60;
        return hours > 0 ? `${hours} ч ${minutes} мин` : `${minutes} мин`;
      },
      sorter: (a, b) => a.duration - b.duration,
    },
    {
      title: "Расход",
      dataIndex: "fuelWaste",
      key: "fuelWaste",
      render: (fuel, record) => {
        console.log(fuel, record);

        return `${(
          (fuel / (record?.endMillage - record.startMillage)) *
          100
        ).toFixed(1)} л/100км`;
      },
    },
    {
      title: "Тип",
      dataIndex: "routeType",
      key: "routeType",
      render: (type) => (
        <Tag color={getRouteTypeColor(type)} className="rounded-full">
          {type}
        </Tag>
      ),
    },
    {
      title: "Рейтинг",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">{getRatingStars(rating)}</span>
          <span className="text-gray-400 text-xs ml-1">{rating}/5</span>
        </div>
      ),
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Действия",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title="Просмотр">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewTrip(record)}
              className="text-blue-400 hover:!text-blue-300"
            />
          </Tooltip>
          <Tooltip title="Удалить">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteTrip(record.id)}
            />
          </Tooltip>
        </div>
      ),
    },
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
      <Header />

      {/* Main Content */}
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Background accents */}
          <div className="fixed top-0 left-0 right-0 h-[300px] bg-gradient-radial from-blue-500/5 via-transparent to-transparent pointer-events-none" />

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
                  className="text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent tracking-tight mb-2 flex items-center gap-3"
                >
                  Поездки
                </motion.h1>
                <p className="text-gray-500 text-sm">
                  Анализируйте каждую поездку, отслеживайте расход и
                  эффективность
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  icon={<FilterOutlined />}
                  onClick={() => setFilterModal(true)}
                  className="!bg-white/5 !border-white/10 !text-gray-300 hover:!text-white hover:!border-white/20 !rounded-full !h-11"
                >
                  Фильтры
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setAddTripModal(true)}
                  className="!bg-gradient-to-r !from-blue-500 !to-purple-600 !border-none !text-white !rounded-full !h-11 !font-medium shadow-lg shadow-blue-500/20"
                >
                  Новая поездка
                </Button>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
            >
              <Card
                className="!bg-white/5 !border-white/10 !rounded-2xl !backdrop-blur-sm"
                loading={tripsLoading}
              >
                <Statistic
                  title={
                    <span className="text-gray-400 text-xs">Всего поездок</span>
                  }
                  value={totalTrips}
                  valueStyle={{
                    color: "#fff",
                    fontSize: "28px",
                    fontWeight: 600,
                  }}
                  prefix={
                    <CarOutlined className="text-blue-400 text-xl mr-2" />
                  }
                />
              </Card>
              <Card
                className="!bg-white/5 !border-white/10 !rounded-2xl !backdrop-blur-sm"
                loading={tripsLoading}
              >
                <Statistic
                  title={
                    <span className="text-gray-400 text-xs">Общий пробег</span>
                  }
                  value={totalDistance}
                  valueStyle={{
                    color: "#fff",
                    fontSize: "28px",
                    fontWeight: 600,
                  }}
                  suffix="км"
                />
              </Card>
              <Card
                className="!bg-white/5 !border-white/10 !rounded-2xl !backdrop-blur-sm"
                loading={tripsLoading}
              >
                <Statistic
                  title={
                    <span className="text-gray-400 text-xs">
                      Затраты на топливо
                    </span>
                  }
                  value={totalFuelCost}
                  valueStyle={{
                    color: "#fff",
                    fontSize: "28px",
                    fontWeight: 600,
                  }}
                  prefix={
                    <DollarOutlined className="text-yellow-400 text-xl mr-2" />
                  }
                  suffix="₽"
                />
              </Card>
              <Card
                className="!bg-white/5 !border-white/10 !rounded-2xl !backdrop-blur-sm"
                loading={tripsLoading}
              >
                <Statistic
                  title={
                    <span className="text-gray-400 text-xs">
                      Средний расход
                    </span>
                  }
                  value={avgConsumption}
                  precision={1}
                  valueStyle={{
                    color: "#fff",
                    fontSize: "28px",
                    fontWeight: 600,
                  }}
                  suffix="л/100км"
                  prefix={
                    <FireOutlined className="text-orange-400 text-xl mr-2" />
                  }
                />
              </Card>
              <Card
                className="!bg-white/5 !border-white/10 !rounded-2xl !backdrop-blur-sm"
                loading={tripsLoading}
              >
                <Statistic
                  title={
                    <span className="text-gray-400 text-xs">
                      Средний рейтинг
                    </span>
                  }
                  value={avgRating}
                  precision={1}
                  valueStyle={{
                    color: "#fff",
                    fontSize: "28px",
                    fontWeight: 600,
                  }}
                  prefix={
                    <StarOutlined className="text-yellow-400 text-xl mr-2" />
                  }
                />
              </Card>
            </motion.div>

            {/* Active Filters */}
            {(selectedCarFilter !== "all" || routeTypeFilter !== "all") && (
              <motion.div
                variants={itemVariants}
                className="mb-4 flex gap-2 flex-wrap"
              >
                <span className="text-gray-400 text-sm">Активные фильтры:</span>
                {selectedCarFilter !== "all" && (
                  <Tag
                    closable
                    onClose={() => setSelectedCarFilter("all")}
                    className="!bg-blue-500/20 !border-blue-500/30 !text-blue-300"
                  >
                    Авто: {cars.find((c) => c.id === selectedCarFilter)?.name}
                  </Tag>
                )}
                {routeTypeFilter !== "all" && (
                  <Tag
                    closable
                    onClose={() => setRouteTypeFilter("all")}
                    className="!bg-purple-500/20 !border-purple-500/30 !text-purple-300"
                  >
                    Тип: {routeTypeFilter}
                  </Tag>
                )}
              </motion.div>
            )}

            {/* Trips Table */}
            <motion.div variants={itemVariants}>
              <Card
                loading={tripsLoading}
                title={
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">
                      История поездок
                    </span>
                    <Badge
                      count={filteredTrips.length}
                      style={{
                        backgroundColor: "rgba(59,130,246,0.2)",
                        color: "#60a5fa",
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
                  {filteredTrips.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16 text-gray-400"
                    >
                      <CarOutlined className="text-5xl mb-4 opacity-40" />
                      <p>Нет данных о поездках. Добавьте первую поездку!</p>
                    </motion.div>
                  ) : (
                    <Table
                      loading={tripsLoading}
                      columns={tableColumns}
                      dataSource={filteredTrips}
                      rowKey="id"
                      pagination={{
                        pageSize: 8,
                        showSizeChanger: true,
                        showTotal: (total) => `Всего ${total} поездок`,
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
                <ThunderboltOutlined className="mr-1" /> Оптимизируйте маршруты
                для экономии топлива
              </div>
              <div>
                <SafetyOutlined className="mr-1" /> Анализируйте стиль вождения
              </div>
              <div>
                <ShareAltOutlined className="mr-1" /> Делитесь отчетами о
                поездках
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <ViewTripModal
        open={viewModal}
        onClose={() => setViewModal(false)}
        selectedTrip={selectedTrip}
        getRouteTypeColor={getRouteTypeColor}
        getWeatherIcon={getWeatherIcon}
        getRatingStars={getRatingStars}
      />

      {/* Add Trip Modal */}
      <AddTripModal
        open={addTripModal}
        onClose={() => setAddTripModal(false)}
        setTrips={setTrips}
        cars={cars}
      />

      {/* View Trip Modal */}

      {/* Filter Modal */}
      <Modal
        loading={carsLoading}
        title={
          <span>
            <FilterOutlined className="mr-2" /> Фильтры поездок
          </span>
        }
        open={filterModal}
        onCancel={() => setFilterModal(false)}
        footer={[
          <Button
            key="reset"
            onClick={() => {
              setSelectedCarFilter("all");
              setRouteTypeFilter("all");
              setFilterModal(false);
              message.info("Фильтры сброшены");
            }}
            className="!bg-white/5 !border-white/10 !text-gray-300"
          >
            Сбросить
          </Button>,
          <Button
            key="apply"
            type="primary"
            onClick={() => setFilterModal(false)}
            className="!bg-blue-500 !border-none"
          >
            Применить
          </Button>,
        ]}
        className="[&_.ant-modal-content]:!bg-[#0a0a0f] [&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-white/10 [&_.ant-modal-header]:!bg-transparent [&_.ant-modal-header]:!border-b-white/10 [&_.ant-modal-title]:!text-white"
      >
        <div className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm block mb-2">
              Автомобиль
            </label>
            <Select
              value={selectedCarFilter}
              onChange={setSelectedCarFilter}
              className="w-full !bg-white/5"
              dropdownClassName="!bg-[#1a1a24]"
            >
              <Select.Option value="all">Все автомобили</Select.Option>
              {cars.map((car) => (
                <Select.Option key={car.id} value={car.id}>
                  {car.name} ({car.number})
                </Select.Option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-gray-300 text-sm block mb-2">
              Тип маршрута
            </label>
            <Select
              value={routeTypeFilter}
              onChange={setRouteTypeFilter}
              className="w-full !bg-white/5"
            >
              <Select.Option value="all">Все типы</Select.Option>
              <Select.Option value="CITY">Городской</Select.Option>
              <Select.Option value="MOTORWAY">Трасса</Select.Option>
              <Select.Option value="MIXED">Смешанный</Select.Option>
            </Select>
          </div>
        </div>
      </Modal>

      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(
            circle at 20% 30%,
            rgba(59, 130, 246, 0.03),
            transparent
          );
        }
      `}</style>
    </div>
  );
};

export default Trips;
