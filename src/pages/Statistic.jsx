import React, { useState } from "react";
import {
  Card,
  Select,
  Button,
  Statistic,
  Tag,
  Progress,
  Tabs,
  Tooltip,
  Divider,
  Radio,
  Table,
  Badge,
  Modal,
  Timeline,
  List,
  DatePicker,
} from "antd";
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  CarOutlined,
  DollarOutlined,
  CalendarOutlined,
  ThunderboltOutlined,
  RiseOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { Line, Column, Pie, Area } from "@ant-design/plots";
import Header from "../components/Header";

// Mock data for statistics
const mockCars = [
  {
    id: "1",
    name: "Tesla Model 3",
    plate: "A123BC",
    color: "#3b82f6",
    currentMileage: 12450,
    avgConsumption: 16.2,
  },
  {
    id: "2",
    name: "BMW X5",
    plate: "B456DE",
    color: "#10b981",
    currentMileage: 87320,
    avgConsumption: 11.8,
  },
  {
    id: "3",
    name: "Mercedes E-Class",
    plate: "C789FG",
    color: "#f59e0b",
    currentMileage: 45200,
    avgConsumption: 9.5,
  },
];

// Generate mock data for charts
const generateChartData = () => {
  const months = [
    "Окт 2024",
    "Ноя 2024",
    "Дек 2024",
    "Янв 2025",
    "Фев 2025",
    "Мар 2025",
  ];

  const mileageData = [];
  const fuelCostData = [];
  const consumptionData = [];

  months.forEach((month, idx) => {
    mileageData.push(
      { month, car: "Tesla Model 3", value: 10000 + idx * 450 },
      { month, car: "BMW X5", value: 82000 + idx * 280 },
      { month, car: "Mercedes E-Class", value: 43000 + idx * 380 }
    );

    fuelCostData.push(
      { month, car: "Tesla Model 3", value: 1800 + Math.random() * 400 },
      { month, car: "BMW X5", value: 2800 + Math.random() * 600 },
      { month, car: "Mercedes E-Class", value: 2200 + Math.random() * 500 }
    );

    consumptionData.push(
      { month, car: "Tesla Model 3", value: 15.5 + Math.sin(idx) * 1.2 },
      { month, car: "BMW X5", value: 11.2 + Math.cos(idx) * 0.8 },
      { month, car: "Mercedes E-Class", value: 9.0 + Math.sin(idx * 0.5) * 0.6 }
    );
  });

  return { mileageData, fuelCostData, consumptionData };
};

const Statistics = () => {
  const [selectedCar, setSelectedCar] = useState("all");
  const [timeRange, setTimeRange] = useState("6months");
  const [activeTab, setActiveTab] = useState("overview");
  const [chartData] = useState(generateChartData());

  const totalCars = mockCars.length;
  const totalMileage = mockCars.reduce(
    (sum, car) => sum + car.currentMileage,
    0
  );
  const avgConsumption = (
    mockCars.reduce((sum, car) => sum + car.avgConsumption, 0) / totalCars
  ).toFixed(1);

  // Filter data based on selected car
  const getFilteredData = (data) => {
    if (selectedCar === "all") return data;
    return data.filter((item) => item.car === selectedCar);
  };

  // Line chart config
  const lineConfig = {
    data: getFilteredData(chartData.mileageData),
    xField: "month",
    yField: "value",
    seriesField: selectedCar === "all" ? "car" : undefined,
    smooth: true,
    animation: {
      appear: {
        animation: "wave-in",
        duration: 1000,
      },
    },
    color:
      selectedCar === "all" ? ["#3b82f6", "#10b981", "#f59e0b"] : ["#3b82f6"],
    point: {
      size: 4,
      shape: "circle",
      style: {
        fill: "white",
        stroke: "#3b82f6",
        lineWidth: 2,
      },
    },
    yAxis: {
      title: { text: "Пробег (км)", style: { fill: "#9ca3af" } },
      grid: { line: { style: { stroke: "#1f2937" } } },
      label: { style: { fill: "#9ca3af" } },
    },
    xAxis: {
      title: { text: "Месяц", style: { fill: "#9ca3af" } },
      label: { style: { fill: "#9ca3af", rotate: 0 } },
    },
    legend:
      selectedCar === "all"
        ? {
            position: "top",
            itemName: { style: { fill: "#e5e7eb" } },
          }
        : false,
  };

  // Column chart config for fuel cost
  const columnConfig = {
    data: getFilteredData(chartData.fuelCostData),
    xField: "month",
    yField: "value",
    seriesField: selectedCar === "all" ? "car" : undefined,
    isGroup: true,
    color:
      selectedCar === "all" ? ["#3b82f6", "#10b981", "#f59e0b"] : ["#3b82f6"],
    animation: {
      appear: {
        animation: "scale-in-y",
        duration: 800,
      },
    },
    yAxis: {
      title: { text: "Затраты (₽)", style: { fill: "#9ca3af" } },
      grid: { line: { style: { stroke: "#1f2937" } } },
      label: { style: { fill: "#9ca3af" } },
    },
    xAxis: {
      title: { text: "Месяц", style: { fill: "#9ca3af" } },
      label: { style: { fill: "#9ca3af" } },
    },
    legend:
      selectedCar === "all"
        ? {
            position: "top",
            itemName: { style: { fill: "#e5e7eb" } },
          }
        : false,
  };

  // Consumption line chart
  const consumptionConfig = {
    data: getFilteredData(chartData.consumptionData),
    xField: "month",
    yField: "value",
    seriesField: selectedCar === "all" ? "car" : undefined,
    smooth: true,
    color:
      selectedCar === "all" ? ["#3b82f6", "#10b981", "#f59e0b"] : ["#3b82f6"],
    point: {
      size: 4,
      shape: "circle",
    },
    yAxis: {
      title: { text: "Расход (л/100км)", style: { fill: "#9ca3af" } },
      grid: { line: { style: { stroke: "#1f2937" } } },
      label: { style: { fill: "#9ca3af" } },
    },
    xAxis: {
      title: { text: "Месяц", style: { fill: "#9ca3af" } },
      label: { style: { fill: "#9ca3af" } },
    },
    legend:
      selectedCar === "all"
        ? {
            position: "top",
            itemName: { style: { fill: "#e5e7eb" } },
          }
        : false,
  };

  // Pie chart data
  const pieData = mockCars.map((car) => ({
    type: car.name,
    value: car.currentMileage,
  }));

  const pieConfig = {
    data: pieData,
    angleField: "value",
    colorField: "type",
    color: ["#3b82f6", "#10b981", "#f59e0b"],
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: "spider",
      content: "{name}\n{percentage}",
      style: { fill: "#e5e7eb", fontSize: 12 },
    },
    legend: {
      position: "right",
      itemName: { style: { fill: "#e5e7eb" } },
    },
    statistic: {
      title: {
        style: { color: "#9ca3af" },
        content: "Общий пробег",
      },
      content: {
        style: { color: "#fff", fontSize: "24px", fontWeight: "bold" },
        content: `${(totalMileage / 1000).toFixed(1)}k км`,
      },
    },
  };

  // Top performing cars
  const topCarsTable = [
    {
      rank: 1,
      name: "Mercedes E-Class",
      consumption: 9.5,
      efficiency: 88,
      cost: 18500,
      rating: 4.8,
    },
    {
      rank: 2,
      name: "Tesla Model 3",
      consumption: 16.2,
      efficiency: 82,
      cost: 22400,
      rating: 4.7,
    },
    {
      rank: 3,
      name: "BMW X5",
      consumption: 11.8,
      efficiency: 78,
      cost: 31200,
      rating: 4.5,
    },
  ];

  // Monthly insights
  const monthlyInsights = [
    {
      month: "Март 2025",
      totalDistance: 1850,
      totalCost: 12450,
      avgConsumption: 13.2,
      trips: 12,
      trend: "up",
    },
    {
      month: "Февраль 2025",
      totalDistance: 1620,
      totalCost: 10850,
      avgConsumption: 12.8,
      trips: 10,
      trend: "down",
    },
    {
      month: "Январь 2025",
      totalDistance: 1480,
      totalCost: 9950,
      avgConsumption: 13.5,
      trips: 9,
      trend: "up",
    },
  ];

  const getEfficiencyRating = (consumption) => {
    if (consumption <= 8) return { text: "Отлично", color: "green" };
    if (consumption <= 11) return { text: "Хорошо", color: "blue" };
    if (consumption <= 14) return { text: "Средне", color: "orange" };
    return { text: "Высокий расход", color: "red" };
  };

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

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Background accents */}
          <div className="fixed top-0 left-0 right-0 h-[300px] bg-gradient-radial from-purple-500/5 via-transparent to-transparent pointer-events-none" />

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
                  className="text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent tracking-tight mb-2 flex items-center gap-3"
                >
                  <BarChartOutlined className="text-purple-400" />
                  Статистика и аналитика
                </motion.h1>
                <p className="text-gray-500 text-sm">
                  Анализируйте эффективность, отслеживайте тренды и
                  оптимизируйте расходы
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  icon={<DownloadOutlined />}
                  className="!bg-white/5 !border-white/10 !text-gray-300 hover:!text-white !rounded-full !h-11"
                >
                  Экспорт
                </Button>
                <Button
                  icon={<ShareAltOutlined />}
                  className="!bg-white/5 !border-white/10 !text-gray-300 hover:!text-white !rounded-full !h-11"
                >
                  Поделиться
                </Button>
              </div>
            </motion.div>

            {/* Filters */}
            <motion.div
              variants={itemVariants}
              className="flex gap-4 flex-wrap mb-8"
            >
              <div className="min-w-[200px]">
                <Select
                  value={selectedCar}
                  onChange={setSelectedCar}
                  className="w-full !bg-white/5"
                  dropdownClassName="!bg-[#1a1a24]"
                  suffixIcon={<CarOutlined className="text-gray-400" />}
                >
                  <Select.Option value="all">Все автомобили</Select.Option>
                  {mockCars.map((car) => (
                    <Select.Option key={car.id} value={car.name}>
                      {car.name} ({car.plate})
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div>
                <Radio.Group
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="!bg-white/5 !border-white/10 rounded-lg p-1"
                >
                  <Radio.Button
                    value="3months"
                    className="!bg-transparent !text-gray-400"
                  >
                    3 мес
                  </Radio.Button>
                  <Radio.Button
                    value="6months"
                    className="!bg-transparent !text-gray-400"
                  >
                    6 мес
                  </Radio.Button>
                  <Radio.Button
                    value="year"
                    className="!bg-transparent !text-gray-400"
                  >
                    Год
                  </Radio.Button>
                </Radio.Group>
              </div>
              <div className="min-w-[250px]">
                <DatePicker.RangePicker
                  className="!bg-white/5 !border-white/10 !text-white w-full"
                  placeholder={["Начало", "Конец"]}
                  suffixIcon={<CalendarOutlined className="text-gray-400" />}
                />
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
            >
              <Card className="!bg-gradient-to-br !from-white/5 !to-white/5 !backdrop-blur-sm !border-white/10 !rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                      Общий пробег
                    </p>
                    <p className="text-white text-3xl font-semibold">
                      {(totalMileage / 1000).toFixed(1)}k
                    </p>
                    <p className="text-gray-500 text-xs mt-2">км</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <CarOutlined className="text-blue-400 text-2xl" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-green-400">
                  <LineChartOutlined /> +12.5% к прошлому периоду
                </div>
              </Card>

              <Card className="!bg-gradient-to-br !from-white/5 !to-white/5 !backdrop-blur-sm !border-white/10 !rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                      Средний расход
                    </p>
                    <p className="text-white text-3xl font-semibold">
                      {avgConsumption}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">л/100км</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center"></div>
                </div>
                <div className="mt-3 text-xs text-red-400">
                  -2.1% к прошлому периоду
                </div>
              </Card>

              <Card className="!bg-gradient-to-br !from-white/5 !to-white/5 !backdrop-blur-sm !border-white/10 !rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                      Затраты на топливо
                    </p>
                    <p className="text-white text-3xl font-semibold">68,500</p>
                    <p className="text-gray-500 text-xs mt-2">₽ всего</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <DollarOutlined className="text-green-400 text-2xl" />
                  </div>
                </div>
                <div className="mt-3 text-xs text-yellow-400">
                  <RiseOutlined /> +8.3% к прошлому периоду
                </div>
              </Card>

              <Card className="!bg-gradient-to-br !from-white/5 !to-white/5 !backdrop-blur-sm !border-white/10 !rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                      Средняя эффективность
                    </p>
                    <p className="text-white text-3xl font-semibold">83%</p>
                    <p className="text-gray-500 text-xs mt-2">+5% к цели</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <ThunderboltOutlined className="text-purple-400 text-2xl" />
                  </div>
                </div>
                <Progress
                  percent={83}
                  showInfo={false}
                  strokeColor="#8b5cf6"
                  trailColor="rgba(255,255,255,0.1)"
                  className="mt-3"
                />
              </Card>
            </motion.div>

            {/* Tabs */}
            <motion.div variants={itemVariants} className="mb-8">
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                className="[&_.ant-tabs-tab]:!text-gray-400 [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-white [&_.ant-tabs-ink-bar]:!bg-purple-500"
                items={[
                  {
                    key: "overview",
                    label: "Обзор",
                    icon: <DashboardOutlined />,
                  },
                  {
                    key: "trends",
                    label: "Тренды",
                    icon: <LineChartOutlined />,
                  },
                  {
                    key: "efficiency",
                    label: "Эффективность",
                    icon: <ThunderboltOutlined />,
                  },
                  {
                    key: "comparison",
                    label: "Сравнение",
                    icon: <BarChartOutlined />,
                  },
                ]}
              />
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card
                      title="Динамика пробега"
                      className="!bg-white/5 !border-white/10 !rounded-2xl"
                      styles={{
                        body: {
                          maxWidth: 500,
                        },
                        header: {
                          borderBottom: "1px solid rgba(255,255,255,0.1)",
                          color: "#e5e7eb",
                        },
                      }}
                    >
                      <Line {...lineConfig} height={350} />
                    </Card>
                    <Card
                      title="Затраты на топливо"
                      className="!bg-white/5 !border-white/10 !rounded-2xl"
                      styles={{
                        header: {
                          borderBottom: "1px solid rgba(255,255,255,0.1)",
                          color: "#e5e7eb",
                        },
                        body: {
                          width: 600,
                        },
                      }}
                    >
                      <Column {...columnConfig} height={350} />
                    </Card>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card
                      title="Распределение пробега"
                      className="!bg-white/5 !border-white/10 !rounded-2xl"
                      headStyle={{
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                        color: "#e5e7eb",
                      }}
                    >
                      <Pie {...pieConfig} height={350} />
                    </Card>
                    <Card
                      title="Рейтинг эффективности"
                      className="!bg-white/5 !border-white/10 !rounded-2xl"
                      headStyle={{
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                        color: "#e5e7eb",
                      }}
                    >
                      <div className="space-y-4">
                        {topCarsTable.map((car) => (
                          <div
                            key={car.rank}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Badge
                                count={car.rank}
                                style={{
                                  backgroundColor:
                                    car.rank === 1
                                      ? "#f59e0b"
                                      : car.rank === 2
                                      ? "#6b7280"
                                      : "#8b5cf6",
                                }}
                              />
                              <div>
                                <div className="font-semibold text-white">
                                  {car.name}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {car.consumption} л/100км
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-yellow-400 text-sm">
                                {"★".repeat(Math.floor(car.rating))}
                                {"☆".repeat(5 - Math.floor(car.rating))}
                              </div>
                              <div className="text-xs text-gray-400">
                                {car.efficiency}% эффективность
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </motion.div>
              )}

              {activeTab === "trends" && (
                <motion.div
                  key="trends"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <Card
                    title="Динамика расхода топлива"
                    className="!bg-white/5 !border-white/10 !rounded-2xl"
                    styles={{
                      header: {
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                        color: "#e5e7eb",
                      },
                    }}
                  >
                    <Line {...consumptionConfig} height={400} />
                  </Card>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card
                      title="Месячные инсайты"
                      className="!bg-white/5 !border-white/10 !rounded-2xl"
                      styles={{
                        header: {
                          borderBottom: "1px solid rgba(255,255,255,0.1)",
                          color: "#e5e7eb",
                        },
                      }}
                    >
                      <Timeline
                        items={monthlyInsights.map((insight) => ({
                          color: insight.trend === "up" ? "green" : "red",
                          dot:
                            insight.trend === "up" ? (
                              <ArrowUpOutlined />
                            ) : (
                              <ArrowDownOutlined />
                            ),
                          children: (
                            <div className="text-white">
                              <div className="font-semibold">
                                {insight.month}
                              </div>
                              <div className="text-sm text-gray-400">
                                {insight.trips} поездок •{" "}
                                {insight.totalDistance} км •{" "}
                                {insight.totalCost.toLocaleString()} ₽
                              </div>
                              <div className="text-xs text-blue-400 mt-1">
                                Средний расход: {insight.avgConsumption} л/100км
                              </div>
                            </div>
                          ),
                        }))}
                        className="[&_.ant-timeline-item]:!text-gray-300"
                      />
                    </Card>
                    <Card
                      title="Прогноз на следующий месяц"
                      className="!bg-gradient-to-br !from-purple-500/10 !to-blue-500/10 !border-white/10 !rounded-2xl"
                      styles={{
                        header: {
                          borderBottom: "1px solid rgba(255,255,255,0.1)",
                          color: "#e5e7eb",
                        },
                      }}
                    >
                      <div className="text-center py-8">
                        <div className="text-4xl font-bold text-white mb-4">
                          ~1,920 км
                        </div>
                        <div className="text-gray-400 mb-6">
                          Ожидаемый пробег в апреле
                        </div>
                        <div className="flex justify-center gap-8">
                          <div className="text-center">
                            <div className="text-green-400 text-xl">
                              ₽ 13,200
                            </div>
                            <div className="text-xs text-gray-500">
                              Прогноз затрат
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-blue-400 text-xl">12.8 л</div>
                            <div className="text-xs text-gray-500">
                              Средний расход
                            </div>
                          </div>
                        </div>
                        <Progress
                          percent={68}
                          strokeColor="#8b5cf6"
                          trailColor="rgba(255,255,255,0.1)"
                          className="mt-6"
                        />
                        <div className="text-xs text-gray-500 mt-2">
                          +15% к текущему месяцу
                        </div>
                      </div>
                    </Card>
                  </div>
                </motion.div>
              )}

              {activeTab === "efficiency" && (
                <motion.div
                  key="efficiency"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <Card
                    title="Рекомендации по оптимизации"
                    className="!bg-white/5 !border-white/10 !rounded-2xl"
                    headStyle={{
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      color: "#e5e7eb",
                    }}
                  >
                    <List
                      dataSource={[
                        {
                          icon: (
                            <CheckCircleOutlined className="text-green-400" />
                          ),
                          text: "Снижайте скорость на трассе до 110 км/ч",
                          saving: "Экономия до 15%",
                        },
                        {
                          icon: (
                            <CheckCircleOutlined className="text-green-400" />
                          ),
                          text: "Проверяйте давление в шинах еженедельно",
                          saving: "Экономия до 5%",
                        },
                        {
                          icon: (
                            <CheckCircleOutlined className="text-green-400" />
                          ),
                          text: "Избегайте резких ускорений и торможений",
                          saving: "Экономия до 10%",
                        },
                        {
                          icon: (
                            <CheckCircleOutlined className="text-green-400" />
                          ),
                          text: "Планируйте маршруты для снижения пробок",
                          saving: "Экономия до 8%",
                        },
                        {
                          icon: <WarningOutlined className="text-yellow-400" />,
                          text: "Своевременное ТО снижает расход топлива",
                          saving: "Экономия до 12%",
                        },
                      ]}
                      renderItem={(item) => (
                        <List.Item className="!border-white/10">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              {item.icon}
                              <span className="text-gray-300">{item.text}</span>
                            </div>
                            <Tag color="green" className="rounded-full">
                              {item.saving}
                            </Tag>
                          </div>
                        </List.Item>
                      )}
                      className="[&_.ant-list-item]:!text-gray-300"
                    />
                  </Card>
                  <Card
                    title="Сравнение с нормативами"
                    className="!bg-white/5 !border-white/10 !rounded-2xl"
                    headStyle={{
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      color: "#e5e7eb",
                    }}
                  >
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-300">Ваш расход</span>
                          <span className="text-white">13.2 л/100км</span>
                        </div>
                        <Progress
                          percent={75}
                          strokeColor="#ef4444"
                          trailColor="rgba(255,255,255,0.1)"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-300">
                            Средний по региону
                          </span>
                          <span className="text-white">11.8 л/100км</span>
                        </div>
                        <Progress
                          percent={68}
                          strokeColor="#f59e0b"
                          trailColor="rgba(255,255,255,0.1)"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-300">
                            Оптимальный показатель
                          </span>
                          <span className="text-white">9.5 л/100км</span>
                        </div>
                        <Progress
                          percent={55}
                          strokeColor="#10b981"
                          trailColor="rgba(255,255,255,0.1)"
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === "comparison" && (
                <motion.div
                  key="comparison"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {mockCars.map((car) => {
                      const rating = getEfficiencyRating(car.avgConsumption);
                      return (
                        <Card
                          key={car.id}
                          className="!bg-white/5 !border-white/10 !rounded-2xl hover:!border-white/20 transition-all"
                        >
                          <div className="text-center">
                            <div
                              className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                              style={{ background: `${car.color}20` }}
                            >
                              <CarOutlined
                                style={{ fontSize: 32, color: car.color }}
                              />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-1">
                              {car.name}
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">
                              {car.plate}
                            </p>
                            <div className="space-y-3 text-left">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Пробег</span>
                                <span className="text-white">
                                  {car.currentMileage.toLocaleString()} км
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Расход</span>
                                <span className="text-white">
                                  {car.avgConsumption} л/100км
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">
                                  Эффективность
                                </span>
                                <Tag
                                  color={rating.color}
                                  className="rounded-full"
                                >
                                  {rating.text}
                                </Tag>
                              </div>
                              <div className="mt-3 pt-3 border-t border-white/10">
                                <Progress
                                  percent={
                                    100 - (car.avgConsumption / 20) * 100
                                  }
                                  strokeColor={car.color}
                                  trailColor="rgba(255,255,255,0.1)"
                                />
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                  <Card
                    title="Детальное сравнение"
                    className="!bg-white/5 !border-white/10 !rounded-2xl"
                    headStyle={{
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      color: "#e5e7eb",
                    }}
                  >
                    <Table
                      dataSource={mockCars.map((car, idx) => ({
                        key: car.id,
                        rank: idx + 1,
                        name: car.name,
                        plate: car.plate,
                        mileage: car.currentMileage,
                        consumption: car.avgConsumption,
                        efficiency: getEfficiencyRating(car.avgConsumption)
                          .text,
                        costPerKm: ((car.avgConsumption * 48) / 100).toFixed(2),
                      }))}
                      columns={[
                        {
                          title: "#",
                          dataIndex: "rank",
                          key: "rank",
                          width: 50,
                        },
                        { title: "Автомобиль", dataIndex: "name", key: "name" },
                        { title: "Госномер", dataIndex: "plate", key: "plate" },
                        {
                          title: "Пробег (км)",
                          dataIndex: "mileage",
                          key: "mileage",
                          render: (val) => val.toLocaleString(),
                        },
                        {
                          title: "Расход (л/100км)",
                          dataIndex: "consumption",
                          key: "consumption",
                        },
                        {
                          title: "Эффективность",
                          dataIndex: "efficiency",
                          key: "efficiency",
                          render: (val) => <Tag>{val}</Tag>,
                        },
                        {
                          title: "Стоимость/км (₽)",
                          dataIndex: "costPerKm",
                          key: "costPerKm",
                        },
                      ]}
                      pagination={false}
                      className="[&_.ant-table]:!bg-transparent [&_.ant-table-thead_.ant-table-cell]:!bg-transparent [&_.ant-table-thead_.ant-table-cell]:!text-gray-400 [&_.ant-table-tbody_.ant-table-cell]:!text-gray-300 [&_.ant-table-tbody_.ant-table-row:hover_.ant-table-cell]:!bg-white/5 [&_.ant-table-cell]:!border-white/10"
                    />
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Info */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex justify-between flex-wrap gap-4 text-xs text-gray-500 border-t border-white/10 pt-6"
            >
              <div>
                <ThunderboltOutlined className="mr-1" /> Данные обновляются в
                реальном времени
              </div>
              <div>
                <BarChartOutlined className="mr-1" /> Аналитика за последние 6
                месяцев
              </div>
              <div>
                <ShareAltOutlined className="mr-1" /> Экспортируйте отчеты в
                PDF/Excel
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(
            circle at 20% 30%,
            rgba(139, 92, 246, 0.03),
            transparent
          );
        }
      `}</style>
    </div>
  );
};

export default Statistics;
