'use client'

export const UserAgreement = () => {
  return (
    <div className="space-y-4 text-sm text-gray-700 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">用户协议</h2>
      
      <section>
        <h3 className="font-medium text-gray-800 mb-2">1. 服务条款</h3>
        <p className="mb-2">
          欢迎使用我们的医疗服务平台。通过注册和使用本服务，您同意遵守以下条款和条件。
        </p>
        <p className="mb-2">
          本协议构成您与我们之间的法律协议，请仔细阅读。如果您不同意这些条款，请不要使用我们的服务。
        </p>
      </section>

      <section>
        <h3 className="font-medium text-gray-800 mb-2">2. 用户责任</h3>
        <p className="mb-2">
          您承诺提供真实、准确、完整的个人信息，并及时更新这些信息以保持其准确性。
        </p>
        <p className="mb-2">
          您有责任保护您的账户安全，包括但不限于保护您的登录凭据不被他人获取。
        </p>
        <p className="mb-2">
          您不得使用我们的服务进行任何非法、有害或违反道德的活动。
        </p>
      </section>

      <section>
        <h3 className="font-medium text-gray-800 mb-2">3. 医疗服务声明</h3>
        <p className="mb-2">
          本平台提供的医疗信息仅供参考，不能替代专业医疗建议、诊断或治疗。
        </p>
        <p className="mb-2">
          在做出任何医疗决定之前，请务必咨询合格的医疗专业人员。
        </p>
        <p className="mb-2">
          我们不对因使用本平台信息而导致的任何后果承担责任。
        </p>
      </section>

      <section>
        <h3 className="font-medium text-gray-800 mb-2">4. 隐私保护</h3>
        <p className="mb-2">
          我们重视您的隐私，并承诺按照我们的隐私政策保护您的个人信息。
        </p>
        <p className="mb-2">
          您的医疗信息将严格按照相关法律法规进行保护和处理。
        </p>
      </section>

      <section>
        <h3 className="font-medium text-gray-800 mb-2">5. 服务变更</h3>
        <p className="mb-2">
          我们保留随时修改、暂停或终止服务的权利，恕不另行通知。
        </p>
        <p className="mb-2">
          我们可能会不时更新这些条款，更新后的条款将在发布后生效。
        </p>
      </section>

      <section>
        <h3 className="font-medium text-gray-800 mb-2">6. 免责声明</h3>
        <p className="mb-2">
          在法律允许的最大范围内，我们对因使用或无法使用本服务而导致的任何直接、间接、偶然、特殊或后果性损害不承担责任。
        </p>
      </section>

      <section>
        <h3 className="font-medium text-gray-800 mb-2">7. 联系我们</h3>
        <p className="mb-2">
          如果您对本协议有任何疑问，请通过以下方式联系我们：
        </p>
        <p className="mb-2">
          邮箱：support@hospital.com<br />
          电话：400-123-4567
        </p>
      </section>

      <div className="text-xs text-gray-500 mt-6">
        最后更新时间：2024年1月1日
      </div>
    </div>
  );
};

export default UserAgreement;