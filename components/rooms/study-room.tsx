// "use client";

// import { useEffect, useState } from "react";
// import { 
//   useStreamVideoClient, 
//   StreamCall, 
//   Call,
//   useCallStateHooks,
// } from "@stream-io/video-react-sdk";
// import "@stream-io/video-react-sdk/dist/css/styles.css";
// import Loader from "./loader";
// import { VideoParticipant } from "./video-participant";
// import { Button } from "../ui/button";
// import { 
//   Mic, MicOff, Video, VideoOff, Phone, 
//   BookOpen 
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { cn } from "@/lib/utils";

// const StudyControls = ({ onLeave }: { onLeave: () => void }) => {
//   const { useMicrophoneState, useCameraState } = useCallStateHooks();
  
//   const { microphone, optimisticIsMute: isMicMuted } = useMicrophoneState();
//   const { camera, optimisticIsMute: isCamMuted } = useCameraState();

//   return (
//     <div className="flex items-center gap-4 px-8 py-4 bg-[#1e1e24]/60 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl transition-all hover:bg-[#1e1e24]/80">
//       {/* MIC */}
//       <button
//         onClick={() => microphone.toggle()}
//         className={cn(
//           "flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 border-2 shadow-lg group",
//           isMicMuted 
//             ? "bg-red-600 border-red-500 text-white hover:bg-red-700 hover:scale-105" // OFF: ĐỎ
//             : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-105" // ON: KÍNH
//         )}
//       >
//         {isMicMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
//       </button>

//       {/* CAM */}
//       <button
//         onClick={() => camera.toggle()}
//         className={cn(
//           "flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 border-2 shadow-lg group",
//           isCamMuted
//             ? "bg-red-600 border-red-500 text-white hover:bg-red-700 hover:scale-105" // OFF: ĐỎ
//             : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-105" // ON: KÍNH
//         )}
//       >
//         {isCamMuted ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
//       </button>

//       <div className="w-px h-10 bg-white/10 mx-2" />

//       <button 
//         onClick={onLeave} 
//         className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg border border-red-500/50 active:scale-95"
//       >
//         <Phone className="w-5 h-5 fill-current" />
//         <span className="hidden sm:inline text-lg">Rời lớp</span>
//       </button>
//     </div>
//   );
// };

// const StudyGrid = () => {
//   const { useParticipants } = useCallStateHooks();
//   const participants = useParticipants();
//   const uniqueParticipants = Array.from(new Map(participants.map(p => [p.userId, p])).values());

//   if (uniqueParticipants.length === 0) return <div className="flex flex-col items-center justify-center h-full text-indigo-200/40 animate-pulse"><BookOpen className="w-16 h-16 opacity-30 mb-4"/><p className="text-lg font-medium">Đang đợi học viên...</p></div>;

//   return (
//     // Grid căn giữa
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto h-full p-4 overflow-y-auto place-content-center">
//       {uniqueParticipants.map((p) => (
//         <div key={p.userId} className="aspect-video w-full transition-transform duration-500 ease-out hover:scale-[1.02]">
//           <VideoParticipant participant={p} showScore={false} />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default function StudyRoom({ roomId }: { roomId: string }) {
//   const client = useStreamVideoClient();
//   const [call, setCall] = useState<Call | null>(null);
//   const router = useRouter();
//   const [roomName, setRoomName] = useState<string>("Đang kết nối...");

//   useEffect(() => {
//     if (!client) return;
//     const myCall = client.call("default", roomId);
//     myCall.join({ create: true }).then(async () => {
//         const data = await myCall.get();
//         setRoomName(data.call.custom?.title || `Phòng học #${roomId}`);
//         setCall(myCall);
//     }).catch(console.error);
//     return () => {};
//   }, [client, roomId]);

//   const handleLeave = async () => {
//     await call?.leave();
//     router.push('/rooms');
//   };

//   if (!call) return <Loader />;

//   return (
//     <StreamCall call={call}>
//       <div className="flex h-screen w-full bg-[#050510] overflow-hidden relative font-sans text-gray-100 selection:bg-indigo-500/30">
//          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050510] to-[#050510] pointer-events-none" />

//          <div className="w-20 h-full flex flex-col items-center py-8 gap-8 z-10 border-r border-white/5 bg-white/5 backdrop-blur-2xl">
//            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-400/20 shadow-lg">
//              <BookOpen className="text-indigo-400 w-7 h-7" />
//            </div>
//          </div>

//          <div className="flex-1 flex flex-col p-6 z-10 relative overflow-hidden">
//             <div className="h-20 flex items-center justify-between px-8 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] mb-6 shadow-2xl shrink-0">
//               <div>
//                 <h1 className="text-white font-bold text-xl tracking-wide">{roomName}</h1>
//                 <p className="text-xs text-indigo-300 mt-1 uppercase tracking-widest font-semibold ml-1">Focus Mode</p>
//               </div>
//             </div>

//             <div className="flex-1 rounded-[2.5rem] border border-white/5 bg-white/5 backdrop-blur-md overflow-hidden relative shadow-inner flex flex-col justify-center">
//                <StudyGrid />
//                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 fade-in duration-700">
//                   <StudyControls onLeave={handleLeave} />
//                </div>
//             </div>
//          </div>
//       </div>
//     </StreamCall>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { 
  useStreamVideoClient, 
  StreamCall, 
  Call,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import Loader from "./loader";
import { VideoParticipant } from "./video-participant";
import { Button } from "../ui/button";
import { 
  Mic, MicOff, Video, VideoOff, Phone, 
  BookOpen 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const StudyControls = ({ onLeave }: { onLeave: () => void }) => {
  const { useMicrophoneState, useCameraState } = useCallStateHooks();
  
  const { microphone, optimisticIsMute: isMicMuted } = useMicrophoneState();
  const { camera, optimisticIsMute: isCamMuted } = useCameraState();

  return (
    <div className="flex items-center gap-4 px-8 py-4 bg-[#1e1e24]/60 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl transition-all hover:bg-[#1e1e24]/80">
      {/* MIC */}
      <button
        onClick={() => microphone.toggle()}
        className={cn(
          "flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 border-2 shadow-lg group",
          isMicMuted 
            ? "bg-red-600 border-red-500 text-white hover:bg-red-700 hover:scale-105" // OFF: ĐỎ
            : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-105" // ON: KÍNH
        )}
      >
        {isMicMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </button>

      {/* CAM */}
      <button
        onClick={() => camera.toggle()}
        className={cn(
          "flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 border-2 shadow-lg group",
          isCamMuted
            ? "bg-red-600 border-red-500 text-white hover:bg-red-700 hover:scale-105" // OFF: ĐỎ
            : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-105" // ON: KÍNH
        )}
      >
        {isCamMuted ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
      </button>

      <div className="w-px h-10 bg-white/10 mx-2" />

      <button 
        onClick={onLeave} 
        className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg border border-red-500/50 active:scale-95"
      >
        <Phone className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline text-lg">Rời lớp</span>
      </button>
    </div>
  );
};

const StudyGrid = () => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const uniqueParticipants = Array.from(new Map(participants.map(p => [p.userId, p])).values());

  if (uniqueParticipants.length === 0) return <div className="flex flex-col items-center justify-center h-full text-indigo-200/40 animate-pulse"><BookOpen className="w-16 h-16 opacity-30 mb-4"/><p className="text-lg font-medium">Đang đợi học viên...</p></div>;

  return (
    // Grid căn giữa
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto h-full p-4 overflow-y-auto place-content-center">
      {uniqueParticipants.map((p) => (
        <div key={p.userId} className="aspect-video w-full transition-transform duration-500 ease-out hover:scale-[1.02]">
          <VideoParticipant participant={p} showScore={false} />
        </div>
      ))}
    </div>
  );
};

export default function StudyRoom({ roomId }: { roomId: string }) {
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call | null>(null);
  const router = useRouter();
  const [roomName, setRoomName] = useState<string>("Đang kết nối...");

  useEffect(() => {
    if (!client) return;
    const myCall = client.call("default", roomId);
    myCall.join({ create: true }).then(async () => {
        const data = await myCall.get();
        // --- SỬA LỖI TẠI ĐÂY ---
        // Thay vì `Phòng học #${roomId}`, ta dùng trực tiếp `roomId`
        // Nếu call có custom title thì ưu tiên hiển thị, nếu không thì hiển thị roomId (newtest)
        setRoomName(data.call.custom?.title || roomId); 
        setCall(myCall);
    }).catch(console.error);
    return () => {};
  }, [client, roomId]);

  const handleLeave = async () => {
    await call?.leave();
    router.push('/rooms');
  };

  if (!call) return <Loader />;

  return (
    <StreamCall call={call}>
      <div className="flex h-screen w-full bg-[#050510] overflow-hidden relative font-sans text-gray-100 selection:bg-indigo-500/30">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050510] to-[#050510] pointer-events-none" />

         <div className="w-20 h-full flex flex-col items-center py-8 gap-8 z-10 border-r border-white/5 bg-white/5 backdrop-blur-2xl">
           <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-400/20 shadow-lg">
             <BookOpen className="text-indigo-400 w-7 h-7" />
           </div>
         </div>

         <div className="flex-1 flex flex-col p-6 z-10 relative overflow-hidden">
            <div className="h-20 flex items-center justify-between px-8 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] mb-6 shadow-2xl shrink-0">
              <div>
                {/* <h1 className="text-white font-bold text-xl tracking-wide">{roomName}</h1> */}
                <h1 className="text-xs text-indigo-300 mt-1 uppercase tracking-widest font-semibold ml-1">Phòng học</h1>
              </div>
            </div>

            <div className="flex-1 rounded-[2.5rem] border border-white/5 bg-white/5 backdrop-blur-md overflow-hidden relative shadow-inner flex flex-col justify-center">
               <StudyGrid />
               <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 fade-in duration-700">
                  <StudyControls onLeave={handleLeave} />
               </div>
            </div>
         </div>
      </div>
    </StreamCall>
  );
}