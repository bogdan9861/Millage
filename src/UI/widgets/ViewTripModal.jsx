import { Tag, Modal, Avatar, Divider } from "antd";
import {
  CarOutlined,
  EnvironmentOutlined,
  FlagOutlined,
  EyeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";

const ViewTripModal = ({
  open,
  onClose,
  selectedTrip,
  getRouteTypeColor,
  getWeatherIcon,
  getRatingStars,
}) => {
  return (
    <Modal
      title={
        <span>
          <EyeOutlined className="mr-2 text-blue-400" /> Детали поездки
        </span>
      }
      open={open}
      onCancel={onClose}
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
                  {selectedTrip.car.name}
                </div>
                <div className="text-xs text-gray-400">
                  {selectedTrip.car.number}
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
                  {selectedTrip.startPoint}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <FlagOutlined className="text-red-400 mt-1" />
              <div className="flex-1">
                <div className="text-xs text-gray-400">Куда</div>
                <div className="text-white font-medium">
                  {selectedTrip.endPoint}
                </div>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Расстояние</div>
              <div className="text-xl font-semibold text-white">
                {selectedTrip.endMillage - selectedTrip.startMillage}{" "}
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
              <div className="text-xs text-gray-400 mb-1">Средняя скорость</div>
              <div className="text-xl font-semibold text-white">
                {(selectedTrip.endMillage - selectedTrip.startMillage) /
                  (selectedTrip.duration / 60)?.toFixed(1)}{" "}
                <span className="text-sm text-gray-400">км/ч</span>
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Расход топлива</div>
              <div className="text-xl font-semibold text-white">
                {(
                  (selectedTrip.fuelWaste /
                    (selectedTrip.endMillage - selectedTrip.startMillage)) *
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
  );
};

export default ViewTripModal;
