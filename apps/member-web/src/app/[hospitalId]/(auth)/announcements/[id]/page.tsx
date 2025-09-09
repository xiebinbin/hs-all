import { TopNavigation } from "@/components/top-navigation";

export default async function AnnouncementDetail({ 
  params 
}: { 
  params: { hospitalId: string; id: string } 
}) {
  const { hospitalId, id } = await params;

  // 模拟公告详情数据
  const announcement = {
    id: id,
    title: "【康德医问】失眠精神康复疗愈，探亮三林康德品牌",
    publishDate: "2023年1月1日",
    content: "三林康德社区卫生服务中心身处三林大型居住区内。从高处看，会发现其屋顶有一个\"空中花园\"，步入花园更是别有洞天：原来，这是一个专业的身心疗愈花园，配合专业治疗和智能康复设备，能让失眠的人在此疗愈身心...",
    image: "/api/placeholder/400/300"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <TopNavigation 
         title="公告详情" 
         backUrl={`/${hospitalId}/announcements`}
         showMoreButton={false}
       />

      {/* 公告内容 */}
      <div className="bg-white">
        <div className="px-4 py-6">
          {/* 标题 */}
          <h2 className="text-lg font-medium text-gray-900 leading-6 mb-4">
            {announcement.title}
          </h2>
          
          {/* 发布时间 */}
          <p className="text-sm text-gray-500 mb-6">
            {announcement.publishDate}
          </p>
          
          {/* 公告图片 */}
          <div className="mb-6">
            <img
              src={announcement.image}
              alt="公告图片"
              className="w-full rounded-lg"
            />
          </div>
          
          {/* 公告内容 */}
          <div className="text-gray-700 text-sm leading-6 space-y-4">
            <p>{announcement.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}