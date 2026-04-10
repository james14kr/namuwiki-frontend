import { useGetAllDevices } from "@/queries/device/useGetAllDevices";
import type { DeviceItem } from "@/types/deviceType";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu } from "lucide-react";

const AdminDeviceList = () => {
  const { data: devices } = useGetAllDevices();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b bg-green-50 dark:bg-green-950/20">
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Cpu className="h-5 w-5" />
            전체 기기 현황
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <table className="w-full text-sm text-center">
            <thead>
              <tr className="border-b bg-green-50">
                <th className="py-2">기기 ID</th>
                <th>연결 농작물</th>
                <th>농장명</th>
                <th>농장주</th>
                <th>상태</th>
                <th>등록일</th>
              </tr>
            </thead>
            <tbody>
              {(devices ?? []).map((device: DeviceItem) => (
                <tr key={device.deviceId} className="border-b">
                  <td className="py-2">{device.deviceId}</td>
                  <td>{device.cropName ?? "-"}</td>
                  <td>{device.farmName ?? "-"}</td>
                  <td>{device.farmerEmail ?? "-"}</td>
                  <td>
                    {/* 연결 상태에 따라 색상 다르게 표시 */}
                    <span className={
                      device.isActive === 1
                        ? "text-green-600 font-semibold"
                        : "text-gray-400"
                    }>
                      {device.isActive === 1 ? "연결됨" : "미연결"}
                    </span>
                  </td>
                  <td>{device.registeredAt ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDeviceList;
