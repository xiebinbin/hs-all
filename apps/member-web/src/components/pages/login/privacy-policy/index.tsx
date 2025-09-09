'use client'
import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="space-y-4 text-sm text-gray-700 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">隐私政策</h2>
      
      <section>
        <h3 className="font-medium text-gray-800 mb-2">1. 信息收集</h3>
        <p className="mb-2">
          我们收集您主动提供的信息，包括但不限于：
        </p>
        <ul className="list-disc list-inside mb-2 space-y-1">
          <li>注册信息：姓名、手机号码、邮箱地址等</li>
          <li>医疗信息：病史、症状描述、就诊记录等</li>
          <li>身份信息：身份证号、医保卡号等（如需要）</li>
          <li>设备信息：IP地址、设备类型、操作系统等</li>
        </ul>
      </section>

      <section>
        <h3 className="font-medium text-gray-800 mb-2">2. 信息使用</h3>
        <p className="mb-2">
          我们使用收集的信息用于以下目的：
        </p>
        <ul className="list-disc list-inside mb-2 space-y-1">
          <li>提供医疗咨询和预约服务</li>
          <li>验证用户身份和账户安全</li>
          <li>改善服务质量和用户体验</li>
          <li>发送重要通知和服务更新</li>
          <li>遵守法律法规要求</li>
        </ul>
      </section>

      <section>
        <h3 className="font-medium text-gray-800 mb-2">3. 信息共享</h3>
        <p className="mb-2">
          我们不会出售、交易或转让您的个人信息给第三方，除非：
        </p>
        <ul className="list-disc list-inside mb-2 space-y-1">
          <li>获得您的明确同意</li>
          <li>为提供服务所必需（如与医生共享医疗信息）</li>
          <li>法律法规要求或政府部门要求</li>
          <li>保护我们的权利、财产或安全</li>
        </ul>
      </section>

      <section>
        <h3 className="font-medium text-gray-800 mb-2">4. 信息安全</h3>
        <p className="mb-2">
          我们采取多种安全措施保护您的个人信息：
        </p>
        <ul className="list-disc list-inside mb-2 space-y-1">
          <li>数据加密传输和存储</li>
          <li>访问控制和权限管理</li>
          <li>定期安全审计和漏洞扫描</li>
          <li>员工隐私培训和保密协议</li>
        </ul>
      </section>

      <section>
        <h3 className="font-medium text-gray-800 mb-2">5. Cookie使用</h3>
        <p className="mb-2">
          我们使用Cookie和类似技术来：
        </p>
        <ul className="list-disc list-inside mb-2 space-y-1">
          <li>记住您的登录状态和偏好设置</li>
          <li>分析网站使用情况和性能</li>
          <li>提供个性化内容和广告</li>
        </ul>
        <p className="mb-2">
          您可以通过浏览器设置管理Cookie偏好。
        </p>
      </section>

      <section>
        <h3 className="font-medium text-gray-800 mb-2">6. 您的权利</h3>
        <p className="mb-2">
          根据相关法律法规，您享有以下权利：
        </p>
        <ul className="list-disc list-inside mb-2 space-y-1">
          <li>查询、更正或删除您的个人信息</li>
          <li>撤回同意或限制信息处理</li>
          <li>数据可携带权</li>
          <li>投诉和举报权</li>
        </ul>
      </section>

      <section>
        <h3 className="font-medium text-gray-800 mb-2">7. 未成年人保护</h3>
        <p className="mb-2">
          我们特别重视未成年人的隐私保护。如果您是未成年人，请在监护人同意下使用我们的服务。
        </p>
        <p className="mb-2">
          我们不会故意收集未成年人的个人信息，如发现会立即删除。
        </p>
      </section>

      <section>
        <h3 className="font-medium text-gray-800 mb-2">8. 政策更新</h3>
        <p className="mb-2">
          我们可能会不时更新本隐私政策。重大变更时，我们会通过网站公告或其他方式通知您。
        </p>
        <p className="mb-2">
          继续使用我们的服务即表示您接受更新后的隐私政策。
        </p>
      </section>

      <section>
        <h3 className="font-medium text-gray-800 mb-2">9. 联系我们</h3>
        <p className="mb-2">
          如果您对本隐私政策有任何疑问或需要行使您的权利，请联系我们：
        </p>
        <p className="mb-2">
          邮箱：privacy@hospital.com<br />
          电话：400-123-4567<br />
          地址：北京市朝阳区医疗大厦10层
        </p>
      </section>

      <div className="text-xs text-gray-500 mt-6">
        最后更新时间：2024年1月1日
      </div>
    </div>
  );
};

export default PrivacyPolicy;