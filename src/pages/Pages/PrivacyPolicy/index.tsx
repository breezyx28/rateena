import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

const PrivacyPolicy = () => {
  document.title = "Privacy Policy | Rateena - E-Shop Vendor Panel";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Privacy Policy" pageTitle="Pages" />
          <Row className="justify-content-center">
            <Col lg={10}>
              <Card>
                <CardBody className="p-4">
                  <div
                    className="w-3/4 mx-auto my-10"
                    style={{ direction: "rtl" }}
                  >
                    <h2>سياسة رتينة / الشروط والأحكام :</h2>
                    <p>
                      تتيح لك منصة "رتينة" إمكانية البحث عن مجموعة واسعة من
                      المتاجر، بما في ذلك المطاعم والبقالات، والاطلاع على قوائم
                      منتجاتها. كما يمكنك تتبع حالة طلباتك ودفع قيمتها بسهولة،
                      إما نقدًا أو عبر بطاقات الائتمان. نؤكد لك أننا لا نقوم
                      بتصنيع أو بيع أي من المنتجات المعروضة، بل نقدم منصة
                      تسويقية شاملة لصاحب المتجر وخدمة توصيل للعميل.
                    </p>
                    <h3>مسؤوليتنا:</h3>
                    <ul>
                      <li>
                        جودة المنتجات: لسنا مسؤولين عن جودة المنتجات أو سلامتها،
                        أو أي مشاكل صحية قد تنجم عن استخدامها.
                      </li>
                      <li>
                        التوصيل: نسعى جاهدين لتوصيل طلباتك في الوقت المحدد،
                        ولكننا لسنا مسؤولين عن أي تأخير ناتج عن ظروف خارجة عن
                        إرادتنا، مثل تأخر التاجر أو الازدحام المروري أو سوء
                        الأحوال الجوية.
                      </li>
                      <li>
                        المطاعم والبقالات: يتحمل أصحاب المطاعم والبقالات مسؤولية
                        إعداد وتعبئة المنتجات. لسنا مسؤولين عن أي أخطاء في الطلب
                        أو أي مشاكل أخرى تتعلق بالمنتج أو المتجر.
                      </li>
                      <li>
                        توصيل البقالات: يتم توصيل طلبات البقالات خلال يومي عمل،
                        وفي حال زيادة المدة، يحق لك إلغاء الطلب واسترداد المبلغ
                        كاملاً. وفي حالة وجود أمطار أو كوارث طبيعية، قد يتم
                        تأجيل أو إلغاء الطلب.
                      </li>
                    </ul>
                    <h3>الدفع:</h3>
                    <p>
                      يمكنك الدفع عن طريق البطاقات الائتمانية أو المحافظ
                      الإلكترونية المتاحة على منصتنا. يجب عليك التأكد من صحة
                      معلومات الدفع الخاصة بك. للطلبات التي تتجاوز قيمتها 70
                      درهمًا من المطاعم، يجب الدفع إلكترونيًا مسبقًا.
                    </p>
                    <h3>الخصوصية:</h3>
                    <p>
                      نحن ملتزمون بحماية معلوماتك الشخصية. يرجى الاطلاع على
                      سياسة الخصوصية الخاصة بنا لمعرفة المزيد.
                    </p>
                    <h3>الملكية الفكرية:</h3>
                    <p>
                      جميع الحقوق المتعلقة بـ "رتينة" ومنصتها، بما في ذلك
                      العلامات التجارية والشعارات، هي ملك لنا.
                    </p>
                    <h3>الإلغاء والتعديل:</h3>
                    <p>نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت.</p>
                    <h3>القانون الحاكم:</h3>
                    <p>
                      تحكم هذه الشروط والأحكام وتفسر وفقًا لقوانين دولة الإمارات
                      العربية المتحدة.
                    </p>
                    <h3>الاتصال بنا:</h3>
                    <p>
                      لأي استفسارات أو شكاوى، يمكنك التواصل معنا عبر البريد
                      الإلكتروني Ahmed-rateena@app.com أو الهاتف 0526247144.
                    </p>
                  </div>
                  <hr className="bg-black h-0.5 my-10" />
                  <div className="w-3/4 mx-auto my-10">
                    <h2>Rateena Poicy / Terms and conditions:</h2>
                    <p>
                      "Rateena" provides a platform that allows you to search
                      for a wide range of stores, including restaurants and
                      grocery stores, and view their product lists. You can also
                      track your order status and pay easily, either by cash or
                      credit card. We do not manufacture or sell any of the
                      products listed on our platform, but rather provide a
                      comprehensive marketing platform for store owners and a
                      delivery service for customers.
                    </p>
                    <h3>Our Responsibility:</h3>
                    <ul>
                      <li>
                        Product Quality: We are not responsible for the quality
                        or safety of the products, or any health problems that
                        may result from their use.
                      </li>
                      <li>
                        Delivery: We strive to deliver your orders on time, but
                        we are not responsible for any delays caused by
                        circumstances beyond our control, such as supplier
                        delays, traffic congestion, or bad weather.
                      </li>
                      <li>
                        Restaurants and Grocery Stores: Restaurant and grocery
                        store owners are responsible for preparing and packaging
                        products. We are not responsible for any errors in the
                        order or any other problems related to the product or
                        store.
                      </li>
                      <li>
                        Grocery Delivery: Grocery orders are delivered within
                        two business days. If the delivery time exceeds this
                        period, you have the right to cancel the order and get a
                        full refund. In case of rain or natural disasters, the
                        order may be delayed or canceled.
                      </li>
                    </ul>
                    <h3>Payment:</h3>
                    <p>
                      You can pay using the credit cards or electronic wallets
                      available on our platform. You are responsible for
                      ensuring the accuracy of your payment information. For
                      orders exceeding 70 AED from restaurants, prepayment must
                      be made electronically using a credit card.
                    </p>
                    <h3>Privacy:</h3>
                    <p>
                      We are committed to protecting your privacy. Please refer
                      to our privacy policy for more information.
                    </p>
                    <h3>Intellectual Property:</h3>
                    <p>
                      All rights related to "Rateena" and its platform,
                      including trademarks and logos, are our property.
                    </p>
                    <h3>Termination and Modification:</h3>
                    <p>
                      We reserve the right to modify these terms and conditions
                      at any time.
                    </p>
                    <h3>Governing Law:</h3>
                    <p>
                      These terms and conditions shall be governed by and
                      construed in accordance with the laws of the United Arab
                      Emirates.
                    </p>
                    <h3>Contact Us:</h3>
                    <p>
                      For any inquiries or complaints, you can contact us via
                      email at Ahmed-rateena@app.com or phone at 0526247144.
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default PrivacyPolicy;
