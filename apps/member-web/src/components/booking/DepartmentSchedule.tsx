"use client";

import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { BookingData } from "@/types/booking";
import { useState } from "react";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  remainingSlots: number;
  maxSlots: number;
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

interface DepartmentScheduleProps {
  bookingData: BookingData;
  onNext: (data: Partial<BookingData>) => void;
  onPrevious?: () => void;
}

export function DepartmentSchedule({ bookingData, onNext }: DepartmentScheduleProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  // 生成未来7天的排班数据
  const generateSchedule = (): DaySchedule[] => {
    const schedule: DaySchedule[] = [];
    const today = new Date();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const morningSlots: TimeSlot[] = [
        { id: '11:00-12:00', time: '11:00-12:00', available: true, remainingSlots: 19, maxSlots: 20 },
        { id: '14:00-15:00', time: '14:00-15:00', available: false, remainingSlots: 0, maxSlots: 20 },
        { id: '15:00-16:00', time: '15:00-16:00', available: true, remainingSlots: 20, maxSlots: 20 }
      ];
      
      const afternoonSlots: TimeSlot[] = [
        { id: '11:00-12:00-pm', time: '11:00-12:00', available: true, remainingSlots: 19, maxSlots: 20 },
        { id: '14:00-15:00-pm', time: '14:00-15:00', available: false, remainingSlots: 0, maxSlots: 20 },
        { id: '15:00-16:00-pm', time: '15:00-16:00', available: true, remainingSlots: 20, maxSlots: 20 }
      ];
      
      schedule.push({
        date: date.toISOString().split('T')[0],
        dayOfWeek: weekdays[date.getDay()],
        shortDate: `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
        isToday: i === 0,
        sessions: [
          {
            period: 'morning',
            periodName: '上午',
            timeSlots: morningSlots.map(slot => ({
              ...slot,
              available: Math.random() > 0.3,
              remainingSlots: Math.floor(Math.random() * 20)
            }))
          },
          {
            period: 'afternoon',
            periodName: '下午',
            timeSlots: afternoonSlots.map(slot => ({
              ...slot,
              available: Math.random() > 0.3,
              remainingSlots: Math.floor(Math.random() * 20)
            }))
          }
        ]
      });
    }
    
    return schedule;
  };

  const schedule = generateSchedule();
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
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">选择就诊时间</h2>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{bookingData.departmentName} - 排班表</span>
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
                      <div className={`text-xs mt-1 ${
                        timeSlot.available ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        剩余{timeSlot.remainingSlots}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-green-900 mb-2">预约须知</h4>
          <ul className="text-xs text-green-700 space-y-1">
            <li>• 请选择合适的就诊时间，建议提前15分钟到达</li>
            <li>• 如需取消或改期，请提前2小时联系医院</li>
            <li>• 就诊当天请携带身份证和相关病历资料</li>
            <li>• 科室排班可能因特殊情况调整，以实际为准</li>
          </ul>
        </div>
      </div>
    </div>
  );
}