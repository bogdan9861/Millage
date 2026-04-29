import React, { useEffect, useState } from "react";
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
  message,
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
import { getCars } from "../api/entities/cars";
import { getStatistic } from "../api/entities/statistic";

const Statistics = () => {
  const [selectedCar, setSelectedCar] = useState("all");
  const [timeRange, setTimeRange] = useState("6months");
  const [activeTab, setActiveTab] = useState("overview");
  const [cars, setCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    setCarsLoading(true);

    getCars()
      .then((res) => {
        console.log("res =======>", res);

        setCars(res);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setCarsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [selectedCar, timeRange]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const res = await getStatistic({
        carId: selectedCar,
        range: timeRange,
      });

      setStatistics(res);
    } catch (e) {
      message.error("Ошибка получения статистики");
    } finally {
      setLoading(false);
    }
  };

  const mileageData = statistics?.charts?.mileageData || [];
  const fuelCostData = statistics?.charts?.fuelCostData || [];
  const consumptionData = statistics?.charts?.consumptionData || [];
  const pieData = statistics?.charts?.pieData || [];

  const totalCars = cars.length;

  const totalMileage = statistics?.cards?.totalMileage || 0;
  const avgConsumption = statistics?.cards?.avgConsumption || 0;
  const totalFuelCost = statistics?.cards?.totalFuelCost || 0;
  const efficiency = statistics?.cards?.efficiency || 0;

  const monthlyInsights = statistics?.trends?.monthlyInsights || [];

  const getFilteredData = (data) => {
    if (selectedCar === "all") return data;
    return data.filter((item) => item.car === selectedCar);
  };
  const lineConfig = {
    data: getFilteredData(mileageData),
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
    data: getFilteredData(fuelCostData),
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
    data: getFilteredData(consumptionData),
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
      title: {
        text: "Расход (л/100км)",
        style: { fill: "#ffffff" },
      },
      grid: {
        line: { style: { stroke: "#1f2937" } },
      },
      label: {
        style: { fill: "#ffffff" },
      },
    },

    xAxis: {
      title: {
        text: "Месяц",
        style: { fill: "#ffffff" },
      },
      label: {
        style: { fill: "#ffffff" },
      },
    },

    legend:
      selectedCar === "all"
        ? {
            position: "top",
            itemName: {
              style: { fill: "#ffffff" },
            },
          }
        : false,

    tooltip: {
      domStyles: {
        "g2-tooltip": {
          backgroundColor: "#1f2937",
          color: "#ffffff",
        },
      },
    },
  };

  const pieConfig = {
    data: pieData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    innerRadius: 0,
    legend: {
      position: "right",
    },
    statistic: {
      title: {
        content: "Общий пробег",
      },
      content: {
        content: `${((totalMileage || 0) / 1000).toFixed(1)}k км`,
      },
    },
  };
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
            </motion.div>

            {/* Filters */}
            <motion.div
              variants={itemVariants}
              className="flex gap-4 flex-wrap mb-8"
            >
              <div className="min-w-[200px]">
                <Select
                  loading={carsLoading}
                  value={selectedCar}
                  onChange={setSelectedCar}
                  className="w-full !bg-white/5"
                  dropdownClassName="!bg-[#1a1a24]"
                  suffixIcon={<CarOutlined className="text-gray-400" />}
                >
                  <Select.Option value="all">Все автомобили</Select.Option>
                  {cars.map((car) => (
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
              <Card
                className="!bg-gradient-to-br !from-white/5 !to-white/5 !backdrop-blur-sm !border-white/10 !rounded-2xl"
                loading={loading}
              >
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

              <Card
                className="!bg-gradient-to-br !from-white/5 !to-white/5 !backdrop-blur-sm !border-white/10 !rounded-2xl"
                loading={loading}
              >
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

              <Card
                className="!bg-gradient-to-br !from-white/5 !to-white/5 !backdrop-blur-sm !border-white/10 !rounded-2xl"
                loading={loading}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                      Затраты на топливо
                    </p>
                    <p className="text-white text-3xl font-semibold">
                      {totalFuelCost}
                    </p>
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

              <Card
                className="!bg-gradient-to-br !from-white/5 !to-white/5 !backdrop-blur-sm !border-white/10 !rounded-2xl"
                loading={loading}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                      Средняя эффективность
                    </p>
                    <p className="text-white text-3xl font-semibold">
                      {efficiency}
                    </p>
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
                      loading={loading}
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
                      loading={loading}
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
                      loading={loading}
                      title="Распределение пробега"
                      className="!bg-white/5 !border-white/10 !rounded-2xl"
                      headStyle={{
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                        color: "#e5e7eb",
                      }}
                    >
                      <Pie {...pieConfig} height={350} />
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
                    loading={loading}
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
                      loading={loading}
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
                        items={monthlyInsights?.map((insight) => ({
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
                      loading={loading}
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
                          ~{statistics?.trends?.forecast?.distance} км
                        </div>
                        <div className="text-gray-400 mb-6">
                          Ожидаемый пробег в апреле
                        </div>
                        <div className="flex justify-center gap-8">
                          <div className="text-center">
                            <div className="text-green-400 text-xl">
                              ₽ {statistics?.trends?.forecast?.cost}
                            </div>
                            <div className="text-xs text-gray-500">
                              Прогноз затрат
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-blue-400 text-xl">
                              {statistics?.trends?.forecast?.consumption} л
                            </div>
                            <div className="text-xs text-gray-500">
                              Средний расход
                            </div>
                          </div>
                        </div>
                        <Progress
                          percent={statistics?.trends?.forecast?.percent}
                          strokeColor="#8b5cf6"
                          trailColor="rgba(255,255,255,0.1)"
                          className="mt-6"
                        />
                        <div className="text-xs text-gray-500 mt-2">
                          +${statistics?.trends?.forecast?.trend}% к текущему
                          месяцу
                        </div>
                      </div>
                    </Card>
                  </div>
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
                    {cars.map((car) => {
                      const rating = getEfficiencyRating(
                        car?.fuelExpencess?.reduce(
                          (sum, c) => sum + c.liters,
                          0
                        ) / car?.fuelExpencess?.length
                      );
                      return (
                        <Card
                          loading={loading}
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
                                  {car.millage.toLocaleString()} км
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Расход</span>
                                <span className="text-white">
                                  {car?.fuelExpencess?.reduce(
                                    (sum, c) => sum + c.liters,
                                    0
                                  ) / car?.fuelExpencess?.length}{" "}
                                  л/100км
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
                                    (car?.fuelExpencess?.reduce(
                                      (sum, c) => sum + c.liters,
                                      0
                                    ) /
                                      car?.fuelExpencess?.length /
                                      20) *
                                    100
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
                    loading={loading}
                    title="Детальное сравнение"
                    className="!bg-white/5 !border-white/10 !rounded-2xl"
                    headStyle={{
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      color: "#e5e7eb",
                    }}
                  >
                    <Table
                      dataSource={cars.map((car, idx) => ({
                        key: car.id,
                        rank: idx + 1,
                        name: car.name,
                        plate: car.plate,
                        mileage: car.millage,
                        consumption:
                          car?.fuelExpencess?.reduce(
                            (sum, c) => sum + c.liters,
                            0
                          ) / car?.fuelExpencess?.length,
                        efficiency: getEfficiencyRating(
                          car?.fuelExpencess?.reduce(
                            (sum, c) => sum + c.liters,
                            0
                          ) / car?.fuelExpencess?.length
                        ).text,
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
