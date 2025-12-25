// // File: hooks/use-room-presence.ts
// "use client";

// import { useEffect } from "react";

// export const useRoomPresence = (roomId: string) => {
//   useEffect(() => {
//     const leaveRoom = () => {
//       if (navigator.sendBeacon) {
//         const blob = new Blob([JSON.stringify({})], { type: 'application/json' });
//         navigator.sendBeacon(`/api/rooms/${roomId}/leave`, blob);
//       } else {
//         fetch(`/api/rooms/${roomId}/leave`, {
//           method: "POST",
//           keepalive: true,
//         }).catch((err) => console.error("Failed to leave room:", err));
//       }
//     };

//     // Xử lý khi đóng tab / refresh / tắt trình duyệt
//     const handleBeforeUnload = () => {
//       leaveRoom();
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);

//     // Xử lý khi chuyển trang (Unmount component)
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//       leaveRoom();
//     };
//   }, [roomId]);
// };

// File: hooks/use-room-presence.ts
"use client";

import { useEffect, useRef } from "react";

export const useRoomPresence = (roomId: string) => {
  // Sử dụng useRef để lưu memberId mà không gây re-render
  const memberIdRef = useRef<string | null>(null);

  useEffect(() => {
    // 1. Hàm Join: Gọi ngay khi mount component
    const joinRoom = async () => {
      try {
        const res = await fetch(`/api/rooms/${roomId}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: "" }), // Nếu phòng có pass, bạn cần truyền thêm vào hook này
        });
        
        const data = await res.json();
        if (data.success && data.member) {
          console.log("Joined room with Member ID:", data.member.id);
          memberIdRef.current = data.member.id; // LƯU QUAN TRỌNG: ID của phiên này
        }
      } catch (err) {
        console.error("Failed to auto-join room:", err);
      }
    };

    joinRoom();

    // 2. Hàm Leave: Chỉ xóa đúng Member ID của phiên này
    const leaveRoom = () => {
      // Nếu chưa có memberId (chưa join xong) thì không cần gọi leave
      if (!memberIdRef.current) return;

      const body = JSON.stringify({ memberId: memberIdRef.current });
      const url = `/api/rooms/${roomId}/leave`;

      // Ưu tiên dùng sendBeacon để đảm bảo request được gửi ngay cả khi đóng tab
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
      } else {
        fetch(url, {
          method: "POST",
          body: body,
          keepalive: true, // Quan trọng: giữ kết nối sống
        }).catch((err) => console.error("Failed to leave room:", err));
      }
    };

    // Xử lý khi F5 hoặc đóng tab
    const handleBeforeUnload = () => {
      leaveRoom();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Xử lý khi chuyển trang (Unmount)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      leaveRoom();
    };
  }, [roomId]);
};