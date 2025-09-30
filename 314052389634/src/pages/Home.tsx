import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSourceRef = useRef<HTMLSourceElement>(null);
  
  // 生成带随机参数的视频URL，防止缓存
  const getVideoUrl = () => {
    const baseUrl = 'https://api.lolimi.cn/API/xjj/xjj.php';
    // 添加随机参数防止缓存
    return `${baseUrl}?t=${Date.now()}`;
  };
  
  // 加载视频
  const loadVideo = () => {
    if (!videoRef.current || !videoSourceRef.current) return;
    
    setLoading(true);
    setError(null);
    
    // 更新视频源URL
    videoSourceRef.current.src = getVideoUrl();
    
    // 加载并播放视频
    videoRef.current.load();
    
    // 尝试自动播放
     videoRef.current.play()
      .catch(err => {
        console.log('自动播放需要用户交互，等待用户点击播放按钮');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  // 处理视频错误
  const handleVideoError = (e: Event) => {
    console.error('视频错误:', e);
    setLoading(false);
    setError('无法加载视频，可能是网络问题或视频链接已失效');
    toast.error('视频加载失败，请稍后重试');
  };
  
  // 初始加载视频
  useEffect(() => {
    loadVideo();
    
    // 清理函数
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);
  
  // 加载下一个视频
  const handleNextVideo = () => {
    loadVideo();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">视频播放器</h1>
        
        {/* 视频容器 */}
         <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl mb-8 aspect-[9/16] max-w-md mx-auto">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="text-white text-xl flex items-center gap-2">
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <span>加载中...</span>
              </div>
            </div>
          )}
          
          <video 
            ref={videoRef}
            className="w-full h-full object-contain"
            controls
            poster="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Video%20player%20placeholder%20image&sign=d7d86b987b9780d7540f246f8d5dfba1"
            onError={handleVideoError}
            onLoadedData={() => setLoading(false)}
          >
             <source ref={videoSourceRef} type="video/mp4" />
            您的浏览器不支持HTML5视频播放。
          </video>
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
              <div className="text-white text-xl text-center p-4">
                <i className="fa-solid fa-exclamation-circle text-red-500 text-3xl mb-2"></i>
                <p>{error}</p>
                <button 
                  onClick={loadVideo}
                  className="mt-4 text-blue-400 hover:text-blue-300"
                >
                  重试
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* 下一个按钮 */}
        <div className="flex justify-center">
          <button
            onClick={handleNextVideo}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <i className="fa-solid fa-forward"></i>
            <span>下一个视频</span>
          </button>
        </div>
        
        {/* CORS提示信息 */}
        <div className="mt-4 text-center text-gray-400 text-sm">
          <p>如果视频无法播放，可能是由于浏览器安全限制。建议尝试：</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>1. 点击视频播放器中的播放按钮</li>
            <li>2. 刷新页面后重试</li>
            <li>3. 使用不同的浏览器</li>
          </ul>
        </div>
      </div>
    </div>
  );
}