'use strict';

/**
 * Consultation booking rules.
 * All times are Mecca time (Asia/Riyadh = UTC+3, no daylight saving).
 */
module.exports = {
  TZ: 'Asia/Riyadh',
  UTC_OFFSET: '+03:00',
  OPEN_HOUR: 10,          // first session starts at 10:00
  CLOSE_HOUR: 15,         // last session ends at 15:00
  SLOT_MINUTES: 30,       // length of one consultation
  DAYS_AHEAD: 14,         // how far ahead customers can book
  MIN_NOTICE_HOURS: 4,    // earliest bookable time from "now"
  WORK_DAYS: [0, 1, 2, 3, 4], // 0 = Sunday ... 6 = Saturday (Sunday to Thursday)
  COMPANY_AR: 'شركة مسار للمشاريع والتطوير السعودية',
  COMPANY_EN: 'Masar Saudi Projects and Development Company',
};
