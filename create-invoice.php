<?php
/* create-invoice.php
   ينشئ فاتورة لدى ميسر ويعيد رابط صفحة الفاتورة المستضافة. لا يخزّن أي بيانات ولا يسجّلها.
   اضبط القيم عبر متغيرات البيئة في استضافتك، أو ضعها مباشرة في الأسطر الثلاثة التالية.
   ملف PHP لا يظهر محتواه للزوار طالما أن PHP مفعّل على الاستضافة. لا تنسخ المفتاح السري إلى أي ملف عام آخر.
*/
$SITE_URL = rtrim(getenv('SITE_URL') ?: '', '/');                // مثال: https://example.com
$SECRET   = getenv('MOYASAR_SECRET_KEY') ?: '';                  // sk_test_... للتجربة ثم sk_live_...
$VAT      = (float)(getenv('VAT_PERCENT') ?: 0);                 // يجب أن تطابق assets/config.js
$EXPIRY_H = (int)(getenv('INVOICE_EXPIRY_HOURS') ?: 0);

$STAGES = json_decode(<<<'JSON'
{
  "s1": {
    "track": "المشاريع الناشئة",
    "name": "التسجيل وتقييم المشروع والاستشارة التوعوية",
    "fee": 1000,
    "altFee": 2000
  },
  "s2": {
    "track": "المشاريع الناشئة",
    "name": "اختيار المشروع والتخطيط والدراسة لتحديد المسار",
    "fee": 4000,
    "altFee": null
  },
  "s3": {
    "track": "المشاريع الناشئة",
    "name": "الإشراف والمتابعة على تنفيذ المشروع",
    "fee": null,
    "altFee": null
  },
  "d1": {
    "track": "تطوير المشاريع",
    "name": "التقييم والمراجعة والتحليل وتحديد فرص التطوير",
    "fee": 3000,
    "altFee": null
  },
  "d2": {
    "track": "تطوير المشاريع",
    "name": "مسار التطوير وتصور أولي لخطة التطوير والتنفيذ",
    "fee": null,
    "altFee": null
  },
  "d3": {
    "track": "تطوير المشاريع",
    "name": "تحديد مسار المشروع والتنفيذ",
    "fee": null,
    "altFee": null
  },
  "t1": {
    "track": "المشاريع المتعثرة",
    "name": "دراسة المشروع واستنتاج المشكلة",
    "fee": 5000,
    "altFee": null
  },
  "t2": {
    "track": "المشاريع المتعثرة",
    "name": "الحلول ومعالجة التعثر وحجم المشكلة",
    "fee": null,
    "altFee": null
  },
  "t3": {
    "track": "المشاريع المتعثرة",
    "name": "تحديد مسار المشروع والتنفيذ",
    "fee": null,
    "altFee": null
  },
  "r1": {
    "track": "التطوير العقاري",
    "name": "الاستشارة التمهيدية قبل البناء",
    "fee": 2000,
    "altFee": null
  },
  "r2": {
    "track": "التطوير العقاري",
    "name": "التصميم والتخطيط وإصدار المخططات",
    "fee": 3000,
    "altFee": null
  },
  "r3": {
    "track": "التطوير العقاري",
    "name": "التراخيص والإجراءات النظامية",
    "fee": 2000,
    "altFee": null
  },
  "r4": {
    "track": "التطوير العقاري",
    "name": "التنفيذ والإشراف والمتابعة",
    "fee": null,
    "altFee": null
  }
}
JSON
, true);
$COMPANY = 'شركة مسار للمشاريع والتطوير السعودية';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
if ($SITE_URL) { header('Access-Control-Allow-Origin: ' . $SITE_URL); header('Vary: Origin'); }
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

function out($code, $arr) { http_response_code($code); echo json_encode($arr, JSON_UNESCAPED_UNICODE); exit; }
function clean($s, $n) { $s = preg_replace('/[\x00-\x1F\x7F<>]/u', ' ', (string)$s); $s = trim(preg_replace('/\s+/u', ' ', $s)); return mb_substr($s, 0, $n); }
function latin($s) { return strtr($s, ['٠'=>'0','١'=>'1','٢'=>'2','٣'=>'3','٤'=>'4','٥'=>'5','٦'=>'6','٧'=>'7','٨'=>'8','٩'=>'9']); }

$method = $_SERVER['REQUEST_METHOD'] ?? '';
if ($method === 'OPTIONS') { http_response_code(204); exit; }
if ($method !== 'POST') out(405, ['message' => 'طريقة الطلب غير مسموحة.']);
if (!$SECRET || !$SITE_URL) out(500, ['message' => 'خدمة الدفع غير مهيأة بعد.']);

$b = json_decode(file_get_contents('php://input'), true);
if (!is_array($b)) $b = [];
if (!empty($b['website'])) out(400, ['message' => 'طلب غير صالح.']);                 // فخ للروبوتات

$stageId = isset($b['stage']) ? (string)$b['stage'] : '';
if (!isset($STAGES[$stageId]) || $STAGES[$stageId]['fee'] === null) out(400, ['message' => 'المرحلة غير صالحة.']);
$st = $STAGES[$stageId];

$name = clean($b['name'] ?? '', 80);
$phone = preg_replace('/[\s\-()]/', '', latin(clean($b['phone'] ?? '', 20)));
$email = clean($b['email'] ?? '', 100);
$city = clean($b['city'] ?? '', 60);
$capital = clean($b['capital'] ?? '', 60);
$note = clean($b['summary'] ?? '', 300);
if (mb_strlen($name) < 3) out(400, ['message' => 'الاسم غير صالح.']);
if (!preg_match('/^(?:\+?966|00966|0)?5\d{8}$/', $phone)) out(400, ['message' => 'رقم الجوال غير صالح.']);
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) out(400, ['message' => 'البريد الإلكتروني غير صالح.']);

// المبلغ يُحدَّد هنا من الخادم وليس من المتصفح
$useAlt = !empty($b['alt']) && $st['altFee'] !== null;
$base = $useAlt ? $st['altFee'] : $st['fee'];
$amount = (int)round($base * (1 + $VAT / 100) * 100);                              // بالهللة
$ref = 'MSR-' . strtoupper(base_convert((string)round(microtime(true) * 1000), 10, 36)) . strtoupper(substr(bin2hex(random_bytes(2)), 0, 3));

$description = "$COMPANY - {$st['track']} - {$st['name']}" . ($useAlt ? ' (فكرة من المنصة)' : '') . " - العميل: $name - الجوال: $phone - رقم الطلب: $ref";
$metadata = ['ref' => $ref, 'track' => $st['track'], 'stage' => $st['name'], 'customer_name' => $name, 'customer_phone' => $phone];
if ($email !== '') $metadata['customer_email'] = $email;
if ($city !== '') $metadata['city'] = $city;
if ($capital !== '') $metadata['capital'] = $capital;
if ($note !== '') $metadata['note'] = $note;

$payload = [
  'amount' => $amount, 'currency' => 'SAR', 'description' => $description, 'metadata' => $metadata,
  'success_url' => "$SITE_URL/thanks.html?ref=$ref",
  'back_url' => "$SITE_URL/index.html#start",
];
if ($EXPIRY_H > 0) $payload['expired_at'] = gmdate('Y-m-d\TH:i:s\Z', time() + $EXPIRY_H * 3600);

$ch = curl_init('https://api.moyasar.com/v1/invoices');
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_TIMEOUT => 20,
  CURLOPT_USERPWD => $SECRET . ':',
  CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
  CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
]);
$resp = curl_exec($ch);
$code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
$j = json_decode((string)$resp, true);
if ($code < 200 || $code >= 300 || !is_array($j) || empty($j['url'])) {
  error_log('moyasar invoice failed, status ' . $code);                              // لا نسجّل بيانات العميل
  out(502, ['message' => 'تعذّر إنشاء الفاتورة لدى ميسر.']);
}
out(200, ['url' => str_replace('lang=en', 'lang=ar', $j['url'])]);
