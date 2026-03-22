import React, { useState } from "react";
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

// Mock data for trips
const initialTrips = [
  {
    id: "1",
    date: "2025-03-20",
    startLocation: "Москва, ул. Тверская 15",
    endLocation: "Москва, МКАД 65 км",
    startMileage: 11800,
    endMileage: 12150,
    distance: 350,
    duration: 45,
    fuelConsumption: 42.8,
    fuelCost: 2225,
    avgSpeed: 46.7,
    routeType: "город",
    weather: "солнечно",
    rating: 5,
    notes: "Отличная поездка, без пробок",
    carId: "1",
    carName: "Tesla Model 3",
    carPlate: "A123BC",
  },
  {
    id: "2",
    date: "2025-03-15",
    startLocation: "Москва, ТЦ Авиапарк",
    endLocation: "Москва, Шереметьево",
    startMileage: 11500,
    endMileage: 11800,
    distance: 300,
    duration: 55,
    fuelConsumption: 38.5,
    fuelCost: 2002,
    avgSpeed: 32.7,
    routeType: "город",
    weather: "облачно",
    rating: 4,
    notes: "Небольшие пробки на Ленинградке",
    carId: "1",
    carName: "Tesla Model 3",
    carPlate: "A123BC",
  },
  {
    id: "3",
    date: "2025-03-25",
    startLocation: "Санкт-Петербург, Невский пр.",
    endLocation: "Москва, Ленинградское ш.",
    startMileage: 86500,
    endMileage: 87320,
    distance: 820,
    duration: 540,
    fuelConsumption: 65.1,
    fuelCost: 3906,
    avgSpeed: 91.1,
    routeType: "трасса",
    weather: "дождь",
    rating: 5,
    notes: "Долгая поездка, но комфортная",
    carId: "2",
    carName: "BMW X5",
    carPlate: "B456DE",
  },
  {
    id: "4",
    date: "2025-03-18",
    startLocation: "Москва, Рублевка",
    endLocation: "Москва, Кремль",
    startMileage: 86100,
    endMileage: 86250,
    distance: 150,
    duration: 35,
    fuelConsumption: 16.2,
    fuelCost: 972,
    avgSpeed: 25.7,
    routeType: "город",
    weather: "солнечно",
    rating: 3,
    notes: "Сильные пробки в центре",
    carId: "2",
    carName: "BMW X5",
    carPlate: "B456DE",
  },
  {
    id: "5",
    date: "2025-03-22",
    startLocation: "Москва, ВДНХ",
    endLocation: "Москва, Аэропорт Домодедово",
    startMileage: 12250,
    endMileage: 12450,
    distance: 200,
    duration: 65,
    fuelConsumption: 44.5,
    fuelCost: 2314,
    avgSpeed: 18.5,
    routeType: "город",
    weather: "снег",
    rating: 2,
    notes: "Плохая погода, большие пробки",
    carId: "1",
    carName: "Tesla Model 3",
    carPlate: "A123BC",
  },
];

const Trips = () => {
  const [trips, setTrips] = useState(initialTrips);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [addTripModal, setAddTripModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [selectedCarFilter, setSelectedCarFilter] = useState("all");
  const [routeTypeFilter, setRouteTypeFilter] = useState("all");
  const [form] = Form.useForm();

  // Get unique cars for filter
  const cars = [
    ...new Map(
      trips.map((trip) => [
        trip.carId,
        { id: trip.carId, name: trip.carName, plate: trip.carPlate },
      ])
    ).values(),
  ];

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
    (sum, trip) => sum + trip.distance,
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
      (sum, trip) => sum + (trip.fuelConsumption / trip.distance) * 100,
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
              {record.startLocation}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <FlagOutlined className="text-red-400" />
            <span className="text-gray-300 truncate max-w-[150px]">
              {record.endLocation}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Расстояние",
      dataIndex: "distance",
      key: "distance",
      render: (dist) => `${dist} км`,
      sorter: (a, b) => a.distance - b.distance,
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
      dataIndex: "fuelConsumption",
      key: "fuelConsumption",
      render: (fuel, record) =>
        `${((fuel / record.distance) * 100).toFixed(1)} л/100км`,
      sorter: (a, b) =>
        a.fuelConsumption / a.distance - b.fuelConsumption / b.distance,
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
              <Card className="!bg-white/5 !border-white/10 !rounded-2xl !backdrop-blur-sm">
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
              <Card className="!bg-white/5 !border-white/10 !rounded-2xl !backdrop-blur-sm">
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
              <Card className="!bg-white/5 !border-white/10 !rounded-2xl !backdrop-blur-sm">
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
              <Card className="!bg-white/5 !border-white/10 !rounded-2xl !backdrop-blur-sm">
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
              <Card className="!bg-white/5 !border-white/10 !rounded-2xl !backdrop-blur-sm">
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

      {/* Add Trip Modal */}
      <Modal
        title={
          <span>
            <PlusOutlined className="mr-2 text-blue-400" /> Новая поездка
          </span>
        }
        open={addTripModal}
        onCancel={() => setAddTripModal(false)}
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
            <Select placeholder="Выберите автомобиль" className="!bg-white/5">
              {cars.map((car) => (
                <Select.Option key={car.id} value={car.id}>
                  {car.name} ({car.plate})
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
              name="startLocation"
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
              name="endLocation"
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
              name="startMileage"
              label="Пробег начала (км)"
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
              name="endMileage"
              label="Пробег конца (км)"
              rules={[{ required: true, type: "number" }]}
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
              rules={[{ required: true, type: "number" }]}
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
              name="fuelConsumption"
              label="Израсходовано топлива (л)"
              rules={[{ required: true, type: "number" }]}
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
              rules={[{ required: true, type: "number" }]}
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
                <Select.Option value="город">Городской</Select.Option>
                <Select.Option value="трасса">Трасса</Select.Option>
                <Select.Option value="смешанный">Смешанный</Select.Option>
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
                <Select.Option value="солнечно">☀️ Солнечно</Select.Option>
                <Select.Option value="облачно">☁️ Облачно</Select.Option>
                <Select.Option value="дождь">🌧️ Дождь</Select.Option>
                <Select.Option value="снег">❄️ Снег</Select.Option>
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
            name="notes"
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

      {/* View Trip Modal */}
      <Modal
        title={
          <span>
            <EyeOutlined className="mr-2 text-blue-400" /> Детали поездки
          </span>
        }
        open={viewModal}
        onCancel={() => setViewModal(false)}
        footer={null}
        width={700}
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
        {selectedTrip && (
          <div className="space-y-6">
            {/* Header with car info */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <Avatar
                  icon={<CarOutlined />}
                  style={{ backgroundColor: "#3b82f6" }}
                />
                <div>
                  <div className="font-semibold text-white">
                    {selectedTrip.carName}
                  </div>
                  <div className="text-xs text-gray-400">
                    {selectedTrip.carPlate}
                  </div>
                </div>
              </div>
              <Tag
                color={getRouteTypeColor(selectedTrip.routeType)}
                className="rounded-full px-3 py-1"
              >
                {selectedTrip.routeType}
              </Tag>
            </div>

            {/* Route info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <EnvironmentOutlined className="text-green-400 mt-1" />
                <div className="flex-1">
                  <div className="text-xs text-gray-400">Откуда</div>
                  <div className="text-white font-medium">
                    {selectedTrip.startLocation}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FlagOutlined className="text-red-400 mt-1" />
                <div className="flex-1">
                  <div className="text-xs text-gray-400">Куда</div>
                  <div className="text-white font-medium">
                    {selectedTrip.endLocation}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Расстояние</div>
                <div className="text-xl font-semibold text-white">
                  {selectedTrip.distance}{" "}
                  <span className="text-sm text-gray-400">км</span>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Длительность</div>
                <div className="text-xl font-semibold text-white">
                  {Math.floor(selectedTrip.duration / 60) > 0
                    ? `${Math.floor(selectedTrip.duration / 60)} ч ${
                        selectedTrip.duration % 60
                      } мин`
                    : `${selectedTrip.duration} мин`}
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">
                  Средняя скорость
                </div>
                <div className="text-xl font-semibold text-white">
                  {selectedTrip.avgSpeed.toFixed(1)}{" "}
                  <span className="text-sm text-gray-400">км/ч</span>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Расход топлива</div>
                <div className="text-xl font-semibold text-white">
                  {(
                    (selectedTrip.fuelConsumption / selectedTrip.distance) *
                    100
                  ).toFixed(1)}{" "}
                  <span className="text-sm text-gray-400">л/100км</span>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Затраты</div>
                <div className="text-xl font-semibold text-white">
                  {selectedTrip.fuelCost.toLocaleString()}{" "}
                  <span className="text-sm text-gray-400">₽</span>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Погода</div>
                <div className="text-xl font-semibold text-white">
                  {getWeatherIcon(selectedTrip.weather)} {selectedTrip.weather}
                </div>
              </div>
            </div>

            {/* Rating and notes */}
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs text-gray-400">Рейтинг поездки</div>
                <div className="text-yellow-400 text-lg">
                  {getRatingStars(selectedTrip.rating)}
                </div>
              </div>
              {selectedTrip.notes && (
                <>
                  <Divider className="!border-white/10 !my-3" />
                  <div>
                    <div className="text-xs text-gray-400 mb-2">Заметки</div>
                    <div className="text-gray-300 text-sm">
                      {selectedTrip.notes}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Date */}
            <div className="text-center text-xs text-gray-500">
              <CalendarOutlined className="mr-1" />
              {dayjs(selectedTrip.date).format("DD MMMM YYYY")}
            </div>
          </div>
        )}
      </Modal>

      {/* Filter Modal */}
      <Modal
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
                  {car.name} ({car.plate})
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
              <Select.Option value="город">Городской</Select.Option>
              <Select.Option value="трасса">Трасса</Select.Option>
              <Select.Option value="смешанный">Смешанный</Select.Option>
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
