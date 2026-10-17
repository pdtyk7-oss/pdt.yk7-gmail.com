# موقع شركة مسار للمشاريع والتطوير السعودية

موقع ثابت (HTML/CSS/JS) بالعربية والإنجليزية، مع ثلاث دوال خادم على Vercel للدفع عبر ميسر وحجز الاستشارة عبر Google Meet. لا توجد قاعدة بيانات.

## كيف يعمل الدفع والحجز
1. العميل يختار المرحلة (من صفحة **المسارات والرسوم** أو من نموذج الطلب) ويدخل بياناته.
2. `api/create-invoice.js` يحدد المبلغ من جدول الأسعار في الخادم وينشئ فاتورة لدى ميسر، فينتقل العميل إلى صفحة ميسر ويدفع هناك.
3. بعد الدفع يعود إلى `booking.html?ref=...`. **الحجز مغلق** حتى يسأل الخادم ميسر ويجد الفاتورة مدفوعة (`api/slots.js`).
4. يختار يوماً ووقتاً: من 10 صباحاً حتى 3 مساءً بتوقيت مكة المكرمة. `api/book.js` ينشئ حدثاً في تقويم Google فيه رابط **Google Meet**، حجز واحد لكل دفعة.
5. يظهر للعميل رابط الاجتماع وزر واتساب برسالة جاهزة تحوي الرابط والموعد، وتصله دعوة على بريده إن أدخله.

المراحل «حسب الاتفاق» لا تمر بالدفع، بل تُرسل عبر واتساب.

## الملفات
| المسار | الغرض |
|---|---|
| `index.html`, `tracks.html`, `about.html`, `policy.html`, `privacy.html`, `security.html`, `booking.html` | الصفحات العربية |
| `en/` | النسخة الإنجليزية بنفس الصفحات |
| `assets/config.js` | **إعداداتك**: واتساب، البريد، السجل التجاري، الضريبة |
| `assets/data.js`, `assets/data.en.js` | المسارات والمراحل والرسوم |
| `assets/lang.ar.js`, `assets/lang.en.js` | نصوص الواجهة |
| `assets/app.js`, `assets/booking.js` | نموذج الطلب وصفحة الحجز |
| `api/create-invoice.js`, `api/slots.js`, `api/book.js` | دوال الخادم |
| `api/_lib/` | وحدات الخادم: `config.js` (قواعد المواعيد)، `moyasar.js`، `calendar.js`، `schedule.js`، `event.js`، `validate.js`، `http.js`، `stages.js` (مولَّد) |
| `tools/` | مولّد الصفحات: `python3 tools/build.py` |
| `scripts/` | `check.js` (فحوص)، `build-stages.js`، `google-auth.js` (يُستعمل مرة واحدة) |
| `tests/` | اختبارات الدفع والحجز |

## متغيرات البيئة على Vercel
| المتغير | الاستعمال |
|---|---|
| `MOYASAR_SECRET_KEY` | المفتاح السري من ميسر (`sk_test_...` للتجربة ثم `sk_live_...`) |
| `SITE_URL` | `https://www.masarpdt-sa.com` بدون شرطة أخيرة |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` | الوصول إلى تقويم Google (الخطوات أدناه) |
| `GOOGLE_CALENDAR_ID` | اختياري، الافتراضي `primary` (تقويمك الرئيسي، وما فيه من أحداث يحجب المواعيد) |
| `WHATSAPP_NUMBER` | اختياري، مثل `966559178666`، يظهر في دعوة الاجتماع |
| `VAT_PERCENT`, `INVOICE_EXPIRY_HOURS` | اختياريان. `VAT_PERCENT` يجب أن يطابق `assets/config.js` |

## إعداد Google Meet (مرة واحدة)
1. في console.cloud.google.com أنشئ مشروعاً وفعّل **Google Calendar API**.
2. **OAuth consent screen**: النوع External، وأضف بريدك مستخدماً تجريبياً.
3. اضغط **Publish app** لتصبح الحالة **In production**. إن بقيت **Testing** ينتهي الرمز بعد 7 أيام فيتوقف الحجز.
4. **Credentials ← Create credentials ← OAuth client ID**، النوع **Desktop app**، وانسخ المعرّف والسر.
5. على جهازك: `GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... node scripts/google-auth.js`، افتح الرابط ووافق (يظهر تحذير «التطبيق غير موثّق»: Advanced ثم Continue)، وانسخ `GOOGLE_REFRESH_TOKEN` الذي يطبعه.
6. **أنشئ الرمز بعد النشر (الخطوة 3)**، لأن الرموز التي صدرت أثناء Testing تبقى بصلاحية 7 أيام.
7. أضف المتغيرات الثلاثة في Vercel وأعد النشر.

## قواعد المواعيد
في `api/_lib/config.js`: ساعات الجلسات (10 إلى 15)، ومدة الجلسة (30 دقيقة)، وأيام العمل (الأحد إلى الخميس)، وعدد الأيام المتاحة (14)، وأقل مهلة قبل الموعد (4 ساعات). غيّرها هناك فقط.

## الفحص والاختبار
```
node scripts/check.js          # صياغة، صفحات، أسرار، تطابق الأسعار والترجمة
node --test tests/*.test.js    # الدفع والحجز مع ميسر وGoogle بديلين
python3 tools/build.py         # إعادة توليد الصفحات بعد تعديل النصوص أو الرسوم
```
يعمل الفحصان تلقائياً في GitHub Actions عند كل push.

## قبل الإطلاق
- أضف في `assets/config.js` رقم واتساب والبريد والسجل التجاري والرقم الضريبي.
- راجع `policy.html` (الإلغاء والاسترجاع) واعرض صفحات السياسة والخصوصية على مختص نظامي.
- جرّب الدفع والحجز كاملاً بمفتاح الاختبار قبل التحويل إلى `sk_live_`.
- لا تضع أي مفتاح سري في ملف داخل المستودع.
