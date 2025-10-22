import React, { useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  type: "bus" | "ferry";
}

interface KakaoMapProps {
  stops?: Stop[];
  selectedStopId?: string | null;
  onStopSelect?: (stop: Stop) => void;
  userLocation?: {
    latitude: number;
    longitude: number;
  } | null;
  center?: {
    latitude: number;
    longitude: number;
  };
  zoom?: number;
}

export function KakaoMap({
  stops = [],
  selectedStopId,
  onStopSelect,
  userLocation,
  center = { latitude: 37.5665, longitude: 126.978 }, // 서울 시청 기본값
  zoom = 15,
}: KakaoMapProps) {
  const webViewRef = useRef<WebView>(null);

  // 카카오 API 키 (환경변수 우선 사용)
  const KAKAO_API_KEY =
    process.env.EXPO_PUBLIC_KAKAO_MAP_API_KEY || "YOUR_KAKAO_API_KEY";

  // 카카오 지도 HTML 템플릿
  const kakaoMapHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Kakao Map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}"></script>
        <style>
            body { margin: 0; padding: 0; }
            #map { width: 100%; height: 100vh; }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            let map;
            let markers = [];
            let userMarker = null;

            // 지도 초기화
            function initMap() {
                const container = document.getElementById('map');
                const options = {
                    center: new kakao.maps.LatLng(${center.latitude}, ${center.longitude}),
                    level: ${zoom}
                };
                
                map = new kakao.maps.Map(container, options);
                
                // 지도 클릭 이벤트
                kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
                    const latlng = mouseEvent.latLng;
                    sendMessage({
                        type: 'mapClick',
                        latitude: latlng.getLat(),
                        longitude: latlng.getLng()
                    });
                });
            }

            // React Native로 메시지 전송
            function sendMessage(data) {
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify(data));
                }
            }

            // 마커 추가
            function addMarker(stop, isSelected = false) {
                const position = new kakao.maps.LatLng(stop.latitude, stop.longitude);
                
                const imageSrc = isSelected 
                    ? 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png'
                    : 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
                const imageSize = new kakao.maps.Size(24, 35);
                const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

                const marker = new kakao.maps.Marker({
                    position: position,
                    image: markerImage
                });

                marker.setMap(map);

                // 마커 클릭 이벤트
                kakao.maps.event.addListener(marker, 'click', function() {
                    sendMessage({
                        type: 'stopClick',
                        stop: stop
                    });
                });

                // 인포윈도우
                const infowindow = new kakao.maps.InfoWindow({
                    content: \`<div style="padding:5px;font-size:12px;width:150px;text-align:center;">\${stop.name}</div>\`
                });

                kakao.maps.event.addListener(marker, 'mouseover', function() {
                    infowindow.open(map, marker);
                });

                kakao.maps.event.addListener(marker, 'mouseout', function() {
                    infowindow.close();
                });

                return marker;
            }

            // 사용자 위치 마커 추가
            function addUserLocationMarker(location) {
                if (userMarker) {
                    userMarker.setMap(null);
                }

                const position = new kakao.maps.LatLng(location.latitude, location.longitude);
                const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_blue.png';
                const imageSize = new kakao.maps.Size(24, 35);
                const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

                userMarker = new kakao.maps.Marker({
                    position: position,
                    image: markerImage
                });

                userMarker.setMap(map);
            }

            // 모든 마커 제거
            function clearMarkers() {
                markers.forEach(marker => marker.setMap(null));
                markers = [];
            }

            // 정류장 마커들 업데이트
            function updateStops(stops, selectedStopId) {
                clearMarkers();
                
                stops.forEach(stop => {
                    const isSelected = stop.id === selectedStopId;
                    const marker = addMarker(stop, isSelected);
                    markers.push(marker);
                });
            }

            // React Native에서 메시지 수신
            window.addEventListener('message', function(event) {
                const data = JSON.parse(event.data);
                
                switch(data.type) {
                    case 'updateStops':
                        updateStops(data.stops, data.selectedStopId);
                        break;
                    case 'updateUserLocation':
                        addUserLocationMarker(data.location);
                        break;
                    case 'setCenter':
                        map.setCenter(new kakao.maps.LatLng(data.latitude, data.longitude));
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
                        sendMessage({ type: 'mapReady' });
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

  // 지도에 정류장 데이터 전송
  useEffect(() => {
    if (webViewRef.current && stops.length > 0) {
      const message = JSON.stringify({
        type: "updateStops",
        stops: stops,
        selectedStopId: selectedStopId,
      });

      webViewRef.current.postMessage(message);
    }
  }, [stops, selectedStopId]);

  // 사용자 위치 전송
  useEffect(() => {
    if (webViewRef.current && userLocation) {
      const message = JSON.stringify({
        type: "updateUserLocation",
        location: userLocation,
      });

      webViewRef.current.postMessage(message);
    }
  }, [userLocation]);

  // WebView에서 메시지 수신
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      switch (data.type) {
        case "mapReady":
          console.log("Kakao Map is ready");
          break;
        case "stopClick":
          if (onStopSelect && data.stop) {
            onStopSelect(data.stop);
          }
          break;
        case "mapClick":
          console.log("Map clicked:", data.latitude, data.longitude);
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
