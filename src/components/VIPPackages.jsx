import React, { useState } from 'react';
import './VIPPackages.css';

export default function VIPPackages({ user, onNavigate }) {
  const [selectedPlan, setSelectedPlan] = useState('basic');

  const plans = [
    {
      id: 'free',
      name: 'Miễn phí',
      price: 0,
      period: '',
      features: [
        'Tối đa 50 thành viên',
        '1 cây gia phả',
        'Xuất Excel cơ bản',
        'Hỗ trợ email',
        'Lưu trữ 1GB'
      ],
      limitations: [
        'Không có hỗ trợ 24/7',
        'Không có backup tự động',
        'Không có tính năng chia sẻ'
      ],
      popular: false
    },
    {
      id: 'basic',
      name: 'VIP Basic',
      price: 99000,
      period: '/tháng',
      features: [
        'Không giới hạn thành viên',
        'Tối đa 5 cây gia phả',
        'Xuất Excel nâng cao',
        'Hỗ trợ email ưu tiên',
        'Lưu trữ 10GB',
        'Backup tự động',
        'Chia sẻ với gia đình'
      ],
      limitations: [],
      popular: true
    },
    {
      id: 'premium',
      name: 'VIP Premium',
      price: 199000,
      period: '/tháng',
      features: [
        'Không giới hạn thành viên',
        'Không giới hạn cây gia phả',
        'Xuất PDF, Excel nâng cao',
        'Hỗ trợ 24/7',
        'Lưu trữ không giới hạn',
        'Backup tự động',
        'Chia sẻ với gia đình',
        'Tính năng phân tích',
        'API tích hợp',
        'Tùy chỉnh giao diện'
      ],
      limitations: [],
      popular: false
    }
  ];

  const handleUpgrade = (planId) => {
    if (planId === 'free') {
      alert('Bạn đang sử dụng gói miễn phí!');
      return;
    }
    
    if (user?.vipStatus === planId) {
      alert('Bạn đã sử dụng gói này!');
      return;
    }

    // Simulate payment process
    const plan = plans.find(p => p.id === planId);
    if (window.confirm(`Bạn có muốn nâng cấp lên gói ${plan.name} với giá ${plan.price.toLocaleString('vi-VN')}₫${plan.period}?`)) {
      // In a real app, you would integrate with payment gateway
      alert('Nâng cấp thành công! Cảm ơn bạn đã tin tưởng sử dụng dịch vụ!');
      
      // Update user VIP status
      const updatedUser = { ...user, vipStatus: planId };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      onNavigate('dashboard');
    }
  };

  const currentPlan = plans.find(p => p.id === (user?.vipStatus || 'free'));

  return (
    <div className="vip-packages">
      <div className="vip-header">
        <h1>Gói dịch vụ VIP</h1>
        <p>Nâng cấp để trải nghiệm đầy đủ các tính năng cao cấp</p>
        <div className="current-plan">
          <span>Gói hiện tại: </span>
          <strong>{currentPlan?.name}</strong>
        </div>
      </div>

      <div className="plans-grid">
        {plans.map(plan => (
          <div 
            key={plan.id} 
            className={`plan-card ${plan.popular ? 'popular' : ''} ${currentPlan?.id === plan.id ? 'current' : ''}`}
          >
            {plan.popular && <div className="popular-badge">Phổ biến nhất</div>}
            {currentPlan?.id === plan.id && <div className="current-badge">Gói hiện tại</div>}
            
            <div className="plan-header">
              <h3>{plan.name}</h3>
              <div className="plan-price">
                <span className="price">{plan.price.toLocaleString('vi-VN')}₫</span>
                <span className="period">{plan.period}</span>
              </div>
            </div>

            <div className="plan-features">
              <h4>Tính năng bao gồm:</h4>
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <span className="check-icon">✅</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              {plan.limitations.length > 0 && (
                <>
                  <h4>Hạn chế:</h4>
                  <ul>
                    {plan.limitations.map((limitation, index) => (
                      <li key={index} className="limitation-item">
                        <span className="cross-icon">❌</span>
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="plan-actions">
              {currentPlan?.id === plan.id ? (
                <button className="btn-current" disabled>
                  Gói hiện tại
                </button>
              ) : (
                <button 
                  className={`btn-upgrade ${plan.popular ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {plan.id === 'free' ? 'Miễn phí' : 'Nâng cấp ngay'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>Câu hỏi thường gặp</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>Làm thế nào để thanh toán?</h3>
            <p>Chúng tôi hỗ trợ thanh toán qua thẻ ngân hàng, ví điện tử và chuyển khoản. Quá trình thanh toán được bảo mật tuyệt đối.</p>
          </div>
          
          <div className="faq-item">
            <h3>Có thể hủy gói bất cứ lúc nào không?</h3>
            <p>Có, bạn có thể hủy gói VIP bất cứ lúc nào. Dữ liệu của bạn sẽ được giữ lại trong 30 ngày sau khi hủy.</p>
          </div>
          
          <div className="faq-item">
            <h3>Dữ liệu có được bảo mật không?</h3>
            <p>Dữ liệu của bạn được mã hóa và lưu trữ an toàn. Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn.</p>
          </div>
          
          <div className="faq-item">
            <h3>Có hỗ trợ khách hàng không?</h3>
            <p>Gói Basic có hỗ trợ email ưu tiên, gói Premium có hỗ trợ 24/7 qua nhiều kênh liên lạc.</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <h2>Bạn cần hỗ trợ?</h2>
        <p>Liên hệ với chúng tôi để được tư vấn về gói dịch vụ phù hợp</p>
        <div className="contact-methods">
          <div className="contact-method">
            <div className="contact-icon">📧</div>
            <h3>Email</h3>
            <p>support@giaphaviet.com</p>
          </div>
          <div className="contact-method">
            <div className="contact-icon">📞</div>
            <h3>Hotline</h3>
            <p>1900 1234</p>
          </div>
          <div className="contact-method">
            <div className="contact-icon">💬</div>
            <h3>Chat trực tuyến</h3>
            <p>24/7 cho gói Premium</p>
          </div>
        </div>
      </div>
    </div>
  );
}

