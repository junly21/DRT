import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface Driver {
  name: string;
  phone: string;
}

interface VehicleInfo {
  licensePlate: string;
  type: string;
}

interface VehicleInfoCardProps {
  vehicleInfo: VehicleInfo;
  driver?: Driver;
  onCallDriver: (phoneNumber: string) => void;
}

export function VehicleInfoCard({
  vehicleInfo,
  driver,
  onCallDriver,
}: VehicleInfoCardProps) {
  return (
    <View
      style={{
        backgroundColor: "#dcffed",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.16,
        shadowRadius: 3,
        elevation: 3,
      }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}>
        <View
          style={{
            width: 48,
            height: 48,
            backgroundColor: "#bbf7d0",
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}>
          <Text style={{ fontSize: 24 }}>🚌</Text>
        </View>
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#166534",
            }}>
            차량 정보
          </Text>
          <Text style={{ fontSize: 14, color: "#15803d" }}>배정된 차량</Text>
        </View>
      </View>
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 14, color: "#166534" }}>
          • 차량 번호: {vehicleInfo.licensePlate}
        </Text>
        <Text style={{ fontSize: 14, color: "#166534" }}>
          • 차량 종류: {vehicleInfo.type}
        </Text>
        {driver && (
          <>
            <Text style={{ fontSize: 14, color: "#166534" }}>
              • 기사님: {driver.name}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 14, color: "#166534" }}>
                • 연락처: {driver.phone}
              </Text>
              <TouchableOpacity
                style={{
                  marginLeft: 8,
                  width: 32,
                  height: 32,
                  backgroundColor: "#16a34a",
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => onCallDriver(driver.phone)}>
                <Text style={{ color: "white", fontSize: 14 }}>📞</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
