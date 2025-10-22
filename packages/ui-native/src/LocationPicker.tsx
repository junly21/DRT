import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

interface LocationPickerProps {
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
  onLocationChange: (location: {
    latitude: number;
    longitude: number;
    address?: string;
  }) => void;
  zoom?: number;
}

export function LocationPicker({
  initialLocation = { latitude: 37.5665, longitude: 126.978 }, // 서울 시청 기본값
  onLocationChange,
  zoom = 16,
}: LocationPickerProps) {
  const webViewRef = useRef<WebView>(null);
  const [currentLocation, setCurrentLocation] = useState(initialLocation);

  // 카카오 API 키
  const KAKAO_API_KEY =
    process.env.EXPO_PUBLIC_KAKAO_MAP_API_KEY || "YOUR_KAKAO_API_KEY";

  // 카카오 지도 HTML 템플릿 (드래그 가능한 마커)
  const kakaoMapHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Location Picker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&libraries=services"></script>
        <style>
            body { margin: 0; padding: 0; }
            #map { width: 100%; height: 100vh; }
            .center-marker {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 32px;
                height: 32px;
                margin-left: -16px;
                margin-top: -32px;
                background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png') no-repeat;
                background-size: contain;
                pointer-events: none;
                z-index: 1000;
            }
            .crosshair {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 20px;
                height: 20px;
                margin-left: -10px;
                margin-top: -10px;
                pointer-events: none;
                z-index: 999;
            }
            .crosshair::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                width: 100%;
                height: 2px;
                background: #ff5722;
                margin-top: -1px;
            }
            .crosshair::after {
                content: '';
                position: absolute;
                left: 50%;
                top: 0;
                width: 2px;
                height: 100%;
                background: #ff5722;
                margin-left: -1px;
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <div class="center-marker"></div>
        
        <script>
            let map;
            let geocoder;
            let currentPosition = { lat: ${initialLocation.latitude}, lng: ${initialLocation.longitude} };

            // 지도 초기화
            function initMap() {
                const container = document.getElementById('map');
                const options = {
                    center: new kakao.maps.LatLng(currentPosition.lat, currentPosition.lng),
                    level: ${zoom}
                };
                
                map = new kakao.maps.Map(container, options);
                geocoder = new kakao.maps.services.Geocoder();

                // 지도 중심 변경 이벤트
                kakao.maps.event.addListener(map, 'center_changed', function() {
                    const center = map.getCenter();
                    currentPosition = { lat: center.getLat(), lng: center.getLng() };
                    
                    // 주소 검색
                    geocoder.coord2Address(center.getLng(), center.getLat(), function(result, status) {
                        let address = '';
                        if (status === kakao.maps.services.Status.OK) {
                            if (result[0].road_address) {
                                address = result[0].road_address.address_name;
                            } else if (result[0].address) {
                                address = result[0].address.address_name;
                            }
                        }
                        
                        // React Native로 위치 정보 전송
                        sendMessage({
                            type: 'locationChange',
                            latitude: currentPosition.lat,
                            longitude: currentPosition.lng,
                            address: address
                        });
                    });
                });

                // 지도 클릭 이벤트
                kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
                    const latlng = mouseEvent.latLng;
                    map.setCenter(latlng);
                });

                // 초기 위치 주소 검색
                geocoder.coord2Address(currentPosition.lng, currentPosition.lat, function(result, status) {
                    let address = '';
                    if (status === kakao.maps.services.Status.OK) {
                        if (result[0].road_address) {
                            address = result[0].road_address.address_name;
                        } else if (result[0].address) {
                            address = result[0].address.address_name;
                        }
                    }
                    
                    sendMessage({
                        type: 'locationChange',
                        latitude: currentPosition.lat,
                        longitude: currentPosition.lng,
                        address: address
                    });
                });

                sendMessage({ type: 'mapReady' });
            }

            // React Native로 메시지 전송
            function sendMessage(data) {
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify(data));
                }
            }

            // React Native에서 메시지 수신
            window.addEventListener('message', function(event) {
                const data = JSON.parse(event.data);
                
                switch(data.type) {
                    case 'setLocation':
                        const newCenter = new kakao.maps.LatLng(data.latitude, data.longitude);
                        map.setCenter(newCenter);
                        currentPosition = { lat: data.latitude, lng: data.longitude };
                        break;
                    case 'setZoom':
                        map.setLevel(data.level);
                        break;
                }
            });

            // 지도 로드 완료 후 초기화
            window.onload = function() {
                if (typeof kakao !== 'undefined') {
                    kakao.maps.load(function() {
                        initMap();
                    });
                } else {
                    console.error('Kakao Maps API not loaded');
                    sendMessage({ type: 'mapError', error: 'API not loaded' });
                }
            };
        </script>
    </body>
    </html>
  `;

  // 위치 변경 시 React Native로 전달
  useEffect(() => {
    if (webViewRef.current) {
      const message = JSON.stringify({
        type: "setLocation",
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });

      webViewRef.current.postMessage(message);
    }
  }, [currentLocation]);

  // WebView에서 메시지 수신
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      switch (data.type) {
        case "mapReady":
          console.log("Location Picker Map is ready");
          break;
        case "locationChange":
          const newLocation = {
            latitude: data.latitude,
            longitude: data.longitude,
            address: data.address,
          };
          setCurrentLocation({
            latitude: data.latitude,
            longitude: data.longitude,
          });
          onLocationChange(newLocation);
          break;
        case "mapError":
          console.error("Map error:", data.error);
          break;
        default:
          console.log("Unknown message type:", data.type);
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: kakaoMapHTML }}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

