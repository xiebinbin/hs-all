"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { BookingData } from "@/types/booking";
import { useState } from "react";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface TimeSession {
  period: 'morning' | 'afternoon';
  periodName: string;
  timeSlots: TimeSlot[];
}

interface DaySchedule {
  date: string;
  dayOfWeek: string;
  shortDate: string;
  isToday: boolean;
  sessions: TimeSession[];
}

interface DoctorScheduleProps {
  bookingData: BookingData;
  onNext: (data: Partial<BookingData>) => void;
  onPrevious?: () => void;
}

export function DoctorSchedule({ bookingData, onNext }: DoctorScheduleProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  // 生成医生排班数据
  const generateDoctorSchedule = (): DaySchedule[] => {
    const schedule: DaySchedule[] = [];
    const today = new Date();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    
    // 专家医生通常排班较少，外院专家更少
    const scheduleDays = bookingData.clinicType === 'external' ? 3 : 5;
    
    const morningSlots: TimeSlot[] = [
      { id: '11:00-12:00', time: '11:00-12:00', available: true },
      { id: '14:00-15:00', time: '14:00-15:00', available: false },
      { id: '15:00-16:00', time: '15:00-16:00', available: true }
    ];
    
    const afternoonSlots: TimeSlot[] = [
      { id: '11:00-12:00-pm', time: '11:00-12:00', available: true },
      { id: '14:00-15:00-pm', time: '14:00-15:00', available: false },
      { id: '15:00-16:00-pm', time: '15:00-16:00', available: true }
    ];
    
    for (let i = 0; i < scheduleDays; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i + (bookingData.clinicType === 'external' ? 2 : 0));
      
      schedule.push({
        date: date.toISOString().split('T')[0],
        dayOfWeek: weekdays[date.getDay()],
        shortDate: `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
        isToday: i === 0 && bookingData.clinicType !== 'external',
        sessions: [
          {
            period: 'morning',
            periodName: '上午',
            timeSlots: morningSlots.map(slot => ({
              ...slot,
              available: slot.available && Math.random() > 0.3
            }))
          },
          {
            period: 'afternoon',
            periodName: '下午',
            timeSlots: afternoonSlots.map(slot => ({
              ...slot,
              available: slot.available && Math.random() > 0.3
            }))
          }
        ]
      });
    }
    
    return schedule;
  };

  const schedule = generateDoctorSchedule();
  const currentDay = selectedDate ? schedule.find(day => day.date === selectedDate) : schedule[0];

  const handleTimeSlotSelect = (date: string, timeSlot: TimeSlot) => {
    if (!timeSlot.available) return;
    
    onNext({
      appointmentDate: date,
      appointmentTime: timeSlot.time
    });
  };



  return (
    <div className="px-4 py-6">
      {/* 医生信息卡片 */}
      <Card className="bg-white shadow-sm mb-6">
        <CardContent className="p-4">
          <div className="flex items-start">
            <Avatar className="w-16 h-16 mr-4">
              <AvatarImage src={`/avatars/${bookingData.doctorId}.jpg`} alt={bookingData.doctorName} />
              <AvatarFallback>{bookingData.doctorName?.slice(0, 1)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-medium text-gray-900 mr-2">{bookingData.doctorName}</h3>
                {bookingData.clinicType === 'external' && (
                  <Award className="w-5 h-5 text-purple-600" />
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{bookingData.doctorTitle}</p>
              

              
              <div className="flex items-center justify-between">
                <Badge 
                  className={`text-xs ${
                    bookingData.clinicType === 'external'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {bookingData.clinicType === 'external' ? '外院专家' : '专家门诊'}
                </Badge>
                
                <div className="text-right">
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">选择就诊时间</h2>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{bookingData.doctorName} - 出诊时间</span>
        </div>
      </div>

      {/* 横向日期选择器 */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <ChevronLeft className="w-5 h-5 text-gray-400" />
          <div className="flex-1 overflow-x-auto">
            <div className="flex space-x-2 px-2">
              {schedule.map((day) => (
                <button
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  className={`flex-shrink-0 flex flex-col items-center p-3 rounded-lg border ${
                    selectedDate === day.date || (!selectedDate && day.isToday)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <span className="text-xs text-gray-500 mb-1">{day.dayOfWeek}</span>
                  <span className={`text-sm font-medium ${
                    selectedDate === day.date || (!selectedDate && day.isToday)
                      ? 'text-blue-600'
                      : 'text-gray-900'
                  }`}>
                    {day.shortDate}
                  </span>
                  {day.isToday && (
                    <span className="text-xs text-blue-600 mt-1">今天</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* 时间段选择 */}
      {currentDay && (
        <div className="space-y-6">
          {currentDay.sessions.map((session) => (
            <div key={session.period}>
              <h3 className="text-lg font-medium text-gray-900 mb-4">{session.periodName}</h3>
              <div className="grid grid-cols-1 gap-3">
                {session.timeSlots.map((timeSlot) => (
                  <button
                    key={timeSlot.id}
                    disabled={!timeSlot.available}
                    onClick={() => handleTimeSlotSelect(currentDay.date, timeSlot)}
                    className={`flex items-center justify-between p-4 rounded-lg border text-left ${
                      timeSlot.available
                        ? 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-3 text-gray-400" />
                      <span className={`font-medium ${
                        timeSlot.available ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {timeSlot.time}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm ${
                         timeSlot.available ? 'text-blue-600' : 'text-gray-400'
                       }`}>
                         {timeSlot.available ? '去预约' : '不可预约'}
                       </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <div className={`rounded-lg p-4 ${
          bookingData.clinicType === 'external' 
            ? 'bg-purple-50' 
            : 'bg-blue-50'
        }`}>
          <h4 className={`text-sm font-medium mb-2 ${
            bookingData.clinicType === 'external'
              ? 'text-purple-900'
              : 'text-blue-900'
          }`}>
            {bookingData.clinicType === 'external' ? '外院专家预约须知' : '专家门诊预约须知'}
          </h4>
          <ul className={`text-xs space-y-1 ${
            bookingData.clinicType === 'external'
              ? 'text-purple-700'
              : 'text-blue-700'
          }`}>
            <li>• 请提前30分钟到达医院，完成挂号和候诊</li>
            <li>• 专家门诊时间宝贵，请准备好相关病历和检查资料</li>
            <li>• 如需取消预约，请提前24小时联系医院</li>
            {bookingData.clinicType === 'external' && (
              <li>• 外院专家号源珍贵，请按时就诊</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}